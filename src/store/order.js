import { getToastInstance } from '../plugins/toast';
export default {
  namespaced: true,
  state() {
    return {
      order: [],
      detailsOrder: [],
    };
  },
  getters: {
    order(state) {
      return state.order;
    },
    combineOrder(state) {
      return state.order.map((x) => ({
        ...x,
        details: state.detailsOrder.filter((y) => y.ma_dh == x._id),
      }));
    },
    ordered(state, getters, __, rootGetters) {
      const userInfo = rootGetters['login/userInfo'];
      const order = getters.combineOrder;
      const ordered = order.filter((x) => x.ma_kh == userInfo.id);
      return ordered;
    },
    NotDelivery(_, getters) {
      const ordered = getters.ordered;
      return ordered.filter(
        (x) => x.trang_thai == 'Chưa giao' || x.trang_thai == 'Chưa thanh toán'
      );
    },
    Delivered(_, getters) {
      const ordered = getters.ordered;
      return ordered.filter((x) => x.trang_thai == 'Đã giao');
    },
  },
  mutations: {
    getOrder(state, payload) {
      state.order = payload;
    },
    getDetailsOrder(state, payload) {
      state.detailsOrder = payload;
    },
    addItem(state, payload) {
      state.order.push(payload);
    },
    showToast(_, payload) {
      const toast = getToastInstance();
      const isSuccess = payload.type == 1 ? true : false;
      toast.add({
        severity: isSuccess ? 'success' : 'error',
        summary: isSuccess ? 'Thành công' : 'Thất bại',
        detail: `${payload.crud} ${payload.table} ${
          isSuccess ? 'thành công' : 'thất bại'
        }`,
        life: 3000,
      });
    },
  },
  actions: {
    async addItem(context, { info, disableToast }) {
      try {
        context.dispatch('setLoading', true, { root: true });
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/donhang`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(info),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Error when adding order');
        }
        console.log('Order Added:', data);
        context.dispatch('getOrder');
        if (!disableToast) {
          context.commit('showToast', {
            type: 1,
            crud: 'Thêm',
            table: 'đơn hàng',
          });
        }
        return data;
      } catch (error) {
        console.log('Lỗi khi add Order:', error);
        context.commit('showToast', {
          type: 2,
          crud: 'Thêm',
          table: 'đơn hàng',
        });
        throw error;
      } finally {
        context.dispatch('setLoading', false, { root: true });
      }
    },
    async getOrder(context) {
      context.dispatch('setLoading', true, { root: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/donhang`
        );
        const order = await response.json();
        context.commit('getOrder', order);
        await context.dispatch('getDetailsOrder');
      } catch (error) {
        console.log('Lỗi:' + error);
      } finally {
        context.dispatch('setLoading', false, { root: true });
      }
    },
    async deleteItem(context, payload) {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/donhang/${payload}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('Order Deleted:', data);
          context.dispatch('getOrder');
          context.commit('showToast', {
            type: 1,
            crud: 'Xóa',
            table: 'đơn hàng',
          });
        })
        .catch((error) => {
          console.log('Lỗi khi delete Order:', error);
          context.commit('showToast', {
            type: 2,
            crud: 'Xóa',
            table: 'đơn hàng',
          });
        });
    },
    async updateItem(context, payload) {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/donhang/${payload._id}`,
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
          console.log('Order Updated:', data);
          context.dispatch('getOrder');
          context.commit('showToast', {
            type: 1,
            crud: 'Cập nhật',
            table: 'đơn hàng',
          });
        })
        .catch((error) => {
          console.log('Lỗi khi update Order:', error);
          context.commit('showToast', {
            type: 2,
            crud: 'Cập nhật',
            table: 'đơn hàng',
          });
        });
    },
    async getDetailsOrder(context) {
      context.dispatch('setLoading', true, { root: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/chitietdonhang'`
        );
        const detailsOrder = await response.json();
        context.commit('getDetailsOrder', detailsOrder);
      } catch (error) {
        console.log('Lỗi:' + error);
      } finally {
        context.dispatch('setLoading', false, { root: true });
      }
    },
    async updateDetailItem(context, payload) {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/chitietdonhang/${payload._id}`,
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
          console.log('Order Details Updated:', data);
          context.dispatch('getOrder');
          context.commit('showToast', {
            type: 1,
            crud: 'Cập nhật',
            table: 'chi tiết đơn hàng',
          });
        })
        .catch((error) => {
          console.log('Lỗi khi update Details Order:', error);
          context.commit('showToast', {
            type: 2,
            crud: 'Cập nhật',
            table: 'chi tiết đơn hàng',
          });
        });
    },
    async deleteDetailItem(context, payload) {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/chitietdonhang/${payload}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('Order Details Deleted:', data);
          context.dispatch('getOrder');
          context.commit('showToast', {
            type: 1,
            crud: 'Xóa',
            table: 'chi tiết đơn hàng',
          });
        })
        .catch((error) => {
          console.log('Lỗi khi delete Details Order:', error);
          context.commit('showToast', {
            type: 2,
            crud: 'Xóa',
            table: 'chi tiết đơn hàng',
          });
        });
    },
    async addDetailItem(context, { info, disableToast }) {
      context.dispatch('setLoading', true, { root: true });
      await fetch(`${import.meta.env.VITE_API_URL}/api/chitietdonhang`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Details Order Added:', data);
          context.dispatch('getDetailsOrder');
          if (!disableToast) {
            context.commit('showToast', {
              type: 1,
              crud: 'Thêm',
              table: 'chi tiết đơn hàng',
            });
          }
        })
        .catch((error) => {
          console.log('Lỗi khi add Details Order:', error);
          context.commit('showToast', {
            type: 2,
            crud: 'Thêm',
            table: 'chi tiết đơn hàng',
          });
        });
      context.dispatch('setLoading', false, { root: true });
    },
  },
};
