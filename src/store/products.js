import i18n from '../plugins/i18n';
import { getToastInstance } from '../plugins/toast';
export default {
  namespaced: true,
  state() {
    return {
      products: [],
      numberOfProducts: 4,
      activeCate: 'All',
      translateValueDF: -80,
    };
  },
  getters: {
    products(state, _, __, rootGetters) {
      var products = [];
      products = state.products.map((item) => ({
        id: item._id,
        ma_sp: item.ma_sp,
        name: item.ten_sp,
        price: item.gia,
        img: item.img,
        stock: item.so_luong,
        quantity: item.quantity,
        des: item.mo_ta,
        categoryDes: rootGetters['events/events'].find(
          (x) => x._id == item.ma_dm
        ).mo_ta,
        category: rootGetters['events/events'].find(
          (x) => x._id == item.ma_dm
        ).ten_dm,
      }));
      return products;
    },
    productsRaw(state) {
      return state.products;
    },
    numberOfProducts(state) {
      return state.numberOfProducts;
    },
    activeCate(state) {
      if (i18n.global.locale === 'vi' && state.activeCate == 'All')
        return 'Tất cả';
      if (i18n.global.locale === 'en' && state.activeCate == 'Tất cả')
        return 'All';
      return state.activeCate;
    },
    translateValueDF(state) {
      return state.translateValueDF;
    },
    getProduct: (_, getters) => (id) => {
      return getters.products.find((x) => x.id == id);
    },
    getQuantityInCate: (_, getters) => (cate) => {
      const productsCate = getters.products.filter((x) => x.category == cate);
      return productsCate.length;
    },
  },
  mutations: {
    increaseProduct(state, payload) {
      const product = state.products.find((x) => x._id == payload);
      product.quantity++;
    },
    decreaseProduct(state, payload) {
      if (!(state.products.find((x) => x._id == payload).quantity - 1 < 1)) {
        state.products.find((x) => x._id == payload).quantity--;
      }
    },
    changeNumberProducts(state, payload) {
      state.numberOfProducts = payload;
    },
    chooseCate(state, cate) {
      state.activeCate = cate;
    },
    changeValueTranslate(state, payload) {
      state.translateValueDF = payload;
    },
    getProducts(state, payload) {
      state.products = payload;
    },
    showToast(_, payload) {
      const toast = getToastInstance();
      const isSuccess = payload.type == 1 ? true : false;
      toast.add({
        severity: isSuccess ? 'success' : 'error',
        summary: isSuccess ? 'Thành công' : 'Thất bại',
        detail: `${payload.crud} sản phẩm ${
          isSuccess ? 'thành công' : 'Thất bại'
        }`,
        life: 3000,
      });
    },
  },
  actions: {
    increaseProduct(context, payload) {
      context.commit('increaseProduct', payload);
    },
    decreaseProduct(context, payload) {
      context.commit('decreaseProduct', payload);
    },
    changeNumberProducts(context, payload) {
      context.commit('changeNumberProducts', payload);
    },
    chooseCate(context, payload) {
      context.commit('chooseCate', payload);
    },
    changeValueTranslate(context, payload) {
      context.commit('changeValueTranslate', payload);
    },

    async getProducts(context) {
      await context.dispatch('setLoading', true, { root: true });
      await context.dispatch('events/getEvents', null, { root: true });
      try {
        const reponse = await fetch(
          `${VITE_API_URL}/api/sanpham`
        );
        var products = [];

        products = await reponse.json();
        products = products.map((x) => ({
          ...x,
          quantity: 1,
        }));
      } catch (error) {
        console.error('Lỗi:' + error);
      }
      await context.dispatch('setLoading', false, { root: true });

      context.commit('getProducts', products);
    },
    async addItem(context, payload) {
      await fetch(`${VITE_API_URL}/api/sanpham`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Product Added:', data);
          context.dispatch('getProducts');
          context.commit('showToast', {
            type: 1,
            crud: 'Thêm',
          });
        })
        .catch((error) => {
          console.log('Lỗi khi add product:', error);
          context.commit('showToast', {
            type: 2,
            crud: 'Thêm',
          });
        });
    },
    async deleteItem(context, payload) {
      await fetch(
        `${VITE_API_URL}/api/sanpham/${payload}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('Product Deleted:', data);
          context.dispatch('getProducts');
          context.commit('showToast', {
            type: 1,
            crud: 'Xóa',
          });
        })
        .catch((error) => {
          console.log('Lỗi khi delete product:', error);
          context.commit('showToast', {
            type: 2,
            crud: 'Xóa',
          });
        });
    },
    async updateItem(context, payload) {
      await fetch(
        `${VITE_API_URL}/api/sanpham/${payload._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('Product Updated:', data);
          context.dispatch('getProducts');
          context.commit('showToast', {
            type: 1,
            crud: 'Cập nhật',
          });
        })
        .catch((error) => {
          console.log('Lỗi khi update product:', error);
          context.commit('showToast', {
            type: 2,
            crud: 'Cập nhật',
          });
        });
    },
  },
};
