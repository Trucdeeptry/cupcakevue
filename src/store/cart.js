import router from '../route';
import i18n from '../plugins/i18n';
import { getToastInstance } from '../plugins/toast';

let timeOutId;
export default {
  namespaced: true,
  state() {
    return {
      cartItem: [
        // {
        //   id: 1,
        //   name: 'Chocolate Peanut Butter cupcake',
        //   price: 11.25,
        //   img: '/img/Cupcake (1).png',
        //   quantity: 1,
        //   category: 'Party',
        // },
      ],
      isCash: true,
      note: '',
    };
  },
  getters: {
    getNote(state) {
      return state.note;
    },
    cartItem(state) {
      return state.cartItem;
    },
    isCash(state) {
      return state.isCash;
    },
    totalAmount(_, getters) {
      let total = getters.cartItem.reduce((total, item) => {
        return (total += item.price * item.quantity);
      }, 0);
      return total;
    },
    Discount() {
      return 5000;
    },
    ShipFee() {
      return 20000;
    },
    grandTotal(_, getters) {
      let total = getters.totalAmount + getters.ShipFee - getters.Discount;
      if (getters.totalAmount > 0) return total;
      return 0;
    },
    getDate() {
      const today = new Date();

      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, cần cộng thêm 1
      const day = String(today.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    },
  },
  mutations: {
    increaseProduct(state, payload) {
      const product = state.cartItem.find((x) => x.id == payload);
      product.quantity++;
    },
    decreaseProduct(state, payload) {
      const product = state.cartItem.find((x) => x.id == payload);
      if (!(product.quantity - 1 < 1)) {
        product.quantity--;
      }
    },
    clearCart(state) {
      state.cartItem = [];
    },
    addProduct(state, payload) {
      const newItem = {
        id: payload.id,
        name: payload.name,
        price: payload.price,
        quantity: payload.quantity,
        img: payload.img,
        category: payload.category,
        categoryDes: payload.categoryDes,
      };
      state.cartItem.push(newItem);
    },
    getCart(state, payload) {
      state.cartItem = payload;
    },
    toggleCash(state, payload) {
      state.isCash = payload;
    },
    addNote(state, payload) {
      state.note = payload;
    },
  },
  actions: {
    addNote(context, payload) {
      context.commit('addNote', payload);
    },
    toggleCash(context, payload) {
      context.commit('toggleCash', payload);
    },
    increaseProduct(context, payload) {
      context.commit('increaseProduct', payload);
      const userId = context.rootGetters['login/userInfo'].userId;
      if (timeOutId) {
        clearTimeout(timeOutId);
      }
      timeOutId = setTimeout(() => {
        const cartItem = context.getters.cartItem;
        let product = cartItem.find((x) => x.id == payload);
        product = {
          id: product.id,
          ma_kh: userId,
          ma_sp: product.ma_sp,
          so_luong: product.quantity,
        };
        context.dispatch('updateCart', product);
      }, 800);
    },
    decreaseProduct(context, payload) {
      context.commit('decreaseProduct', payload);
      const userId = context.rootGetters['login/userInfo'].userId;
      if (timeOutId) {
        clearTimeout(timeOutId);
      }
      timeOutId = setTimeout(() => {
        const cartItem = context.getters.cartItem;
        let product = cartItem.find((x) => x.id == payload);
        product = {
          id: product.id,
          ma_kh: userId,
          ma_sp: product.ma_sp,
          so_luong: product.quantity,
        };
        context.dispatch('updateCart', product);
      }, 1000);
    },
    async addProduct(context, payload) {
      const toast = getToastInstance();
      const userId = context.rootGetters['login/userInfo'].userId;
      if (!userId) {
        router.push('/login');
        return;
      }
      var cartItem = context.getters.cartItem;
      if (!cartItem.length) {
        await context.dispatch('getCart');
        cartItem = context.getters.cartItem;
      }
      let cartData = {
        ma_kh: userId,
        ma_sp: payload.id,
        so_luong: payload.quantity,
      };
      const productVuex = cartItem.find((x) => {
        return x.ma_sp == cartData.ma_sp;
      });
      if (productVuex) {
        cartData = {
          ...cartData,
          id: productVuex.id,
          so_luong: productVuex.quantity + 1,
        };
        context.dispatch('updateCart', cartData);
        return;
      }
      await fetch(`${VITE_API_URL}/api/giohang`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Cart Added:', data);
          toast.add({
            severity: 'success',
            summary: 'Thành công!',
            detail: 'Thêm sản phẩm thành công',
            life: 3000,
          });
        })
        .catch((error) => {
          console.log('Lỗi khi add Cart:', error);
        });
    },
    async deleteProduct(context, { id, disableToast }) {
      const toast = getToastInstance();
      await fetch(`${VITE_API_URL}/api/giohang/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Cart Deleted:', data);
          context.dispatch('getCart');
          if (!disableToast) {
            toast.add({
              severity: 'success',
              summary: 'Thành công!',
              detail: 'Xóa sản phẩm thành công',
              life: 3000,
            });
          }
        })
        .catch((error) => {
          console.log('Lỗi khi delete Cart:', error);
        });
    },
    async getCart(context) {
      await context.dispatch('setLoading', true, { root: true });
      const getProduct = context.rootGetters['products/getProduct'];
      const userId = context.rootGetters['login/userInfo'].userId;
      try {
        const reponse = await fetch(
          `${VITE_API_URL}/api/giohang/${userId}`
        );
        var products = await reponse.json();

        const product = products.map((item) => {
          const productAdd = {
            ...getProduct(item.ma_sp),
            quantity: item.so_luong,
            id: item._id,
            ma_sp: item.ma_sp,
          };
          delete productAdd.so_luong;

          return productAdd;
        });
        context.commit('getCart', product);
      } catch (error) {
        console.log('Lỗi:', error);
      }
      await context.dispatch('setLoading', false, { root: true });
    },
    async updateCart(context, payload) {
      const toast = getToastInstance();
      await fetch(
        `${VITE_API_URL}/api/giohang/${payload.id}`,
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
          console.log('Cart Updated:', data);
          context.dispatch('getCart');
          toast.add({
            severity: 'success',
            summary: 'Thành công!',
            detail: 'Cập nhật sản phẩm thành công',
            life: 3000,
          });
        })
        .catch((error) => {
          console.log('Lỗi khi update Cart:', error);
        });
    },
    async placeOrder(context) {
      context.dispatch('setLoading', true, { root: true });
      // create order
      const toast = getToastInstance();
      const cartItem = context.getters.cartItem;
      if (cartItem.length == 0) {
        toast.add({
          severity: 'error',
          summary: 'Thất bại!',
          detail: i18n.global.t('addCartAlert'),
          life: 3000,
        });
        return;
      }
      const account = context.rootGetters['account/account'];
      const authInfo = context.rootGetters['login/userInfo'];
      const userInfo = account.find((x) => x.email == authInfo.email);
      if (!userInfo) {
        const userRole = context.rootGetters['roles/roles'].find(
          (x) => x.ten_role == 'Khách hàng'
        );
        const accountInfo = {
          ten_kh: authInfo.name,
          dia_chi: authInfo.address,
          email: authInfo.email,
          so_dien_thoai: authInfo.phoneNumber,
          ma_kh: userRole,
        };
        await context.dispatch(
          'account/addItem',
          { info: accountInfo, disableToast: true },
          { root: true }
        );
      }
      const isCash = context.getters.isCash ? 'COD' : 'Bank';

      const order = {
        ngay_dat_hang: context.getters.getDate,
        tong_tien: context.getters.grandTotal,
        trang_thai: 'Chưa thanh toán',
        ghi_chu: context.getters.getNote,
        thanh_toan: isCash,
        ma_kh: userInfo._id,
      };
      var orderId;
      await context
        .dispatch(
          'order/addItem',
          { info: order, disableToast: true },
          { root: true }
        )
        .then((data) => {
          orderId = data.result.insertedId;
        });

      // Create order details
      cartItem.map((x) => {
        context.dispatch(
          'order/addDetailItem',
          {
            info: {
              ma_dh: orderId,
              ma_sp: x.ma_sp,
              so_luong: x.quantity,
              don_gia: x.price,
              chiet_khau: 0,
              thanh_tien: x.quantity * x.price,
            },
            disableToast: true,
          },
          { root: true }
        );
      });
      // Clear cart
      cartItem.map((x) => {
        context.dispatch('deleteProduct', { id: x.id, disableToast: true });
      });
      context.commit('clearCart');
      if (isCash == 'Bank') {
        const postBody = {
          amount: order.tong_tien,
          orderId: orderId,
        };
 
        await fetch('https://apimomo.onrender.com/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postBody),
        })
          .then((response) => response.json())
          .then((data) => window.open(data.shortLink, '_blank'))
          .catch((error) =>
            toast.add({
              severity: 'error',
              summary: 'Thất bại!',
              detail: `Lỗi khi gọi cổng thanh toán momo:${error}`,
              life: 3000,
            })
          );
      }
      // Toast order successs
      toast.add({
        severity: 'success',
        summary: 'Thành công!',
        detail: 'Đặt hàng thành công!',
        life: 3000,
      });
      context.dispatch('setLoading', false, { root: true });
    },
    
  },
};
