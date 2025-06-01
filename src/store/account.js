import { getToastInstance } from '../plugins/toast';
export default {
  namespaced: true,
  state() {
    return {
      account: [],
    };
  },
  getters: {
    account(state) {
      return state.account;
    },
    checkAccount: (state) => (info) => {
      const account = state.account.find(
        (x) => x.so_dien_thoai == info.phoneNumber
      );
      console.log(info);
      if (account.mat_khau == info.password) {
        return true;
      }
      return false;
    },
    getAccount: (state) => (phoneNumber) => {
      const account = state.account.find((x) => x.so_dien_thoai == phoneNumber);
      return account;
    },
  },
  mutations: {
    setAccount(state, payload) {
      state.account = payload;
    },
  },
  actions: {
    async getAccount(context) {
      context.dispatch('setLoading', true, { root: true });
      try {
        const reponse = await fetch(
          `${VITE_API_URL}/api/khachhang`
        );
        const account = await reponse.json();
        context.commit('setAccount', account);
      } catch (error) {
        console.log('Lỗi:' + error);
      }
      context.dispatch('setLoading', false, { root: true });
    },
    async addItem(context, {info, disableToast}) {
      const toast = getToastInstance();
      await fetch(`${VITE_API_URL}/api/khachhang`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Account Added:', data);
          context.dispatch('getAccount');
          if(!disableToast){
            toast.add({
              severity: 'success',
              summary: 'Thành công!',
              detail: 'Thêm khách hàng thành công!',
              life: 3000,
            });
          }
        })
        .catch((error) => {
          console.log('Lỗi khi add Account:', error);
          toast.add({
            severity: 'error',
            summary: 'Thất bại!',
            detail: 'Thêm khách hàng thất bại!',
            life: 3000,
          });
        });
    },
    async deleteItem(context, payload) {
      const toast = getToastInstance();
      await fetch(
        `${VITE_API_URL}/api/khachhang/${payload}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('Account Deleted:', data);
          context.dispatch('getAccount');
          toast.add({
            severity: 'success',
            summary: 'Thành công!',
            detail: 'Xóa khách hàng thành công!',
            life: 3000,
          });
        })
        .catch((error) => {
          toast.add({
            severity: 'error',
            summary: 'Thất bại!',
            detail: 'Xóa khách hàng thất bại!',
            life: 3000,
          });
          console.log('Lỗi khi delete Account:', error);
        });
    },
    async updateItem(context, payload) {
      const toast = getToastInstance();
      await fetch(
        `${VITE_API_URL}/api/khachhang/${payload._id}`,
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
          console.log('Account Updated:', data);
          context.dispatch('getAccount');
          toast.add({
            severity: 'success',
            summary: 'Thành công!',
            detail: 'Cập nhật khách hàng thành công!',
            life: 3000,
          });
        })
        .catch((error) => {
          console.log('Lỗi khi update Account:', error);
          toast.add({
            severity: 'error',
            summary: 'Thất bại!',
            detail: 'Cập nhật khách hàng thất bại!',
            life: 3000,
          });
        });
    },
  },
};
