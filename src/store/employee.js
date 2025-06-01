import { getToastInstance } from '../plugins/toast';

export default {
  namespaced: true,
  state() {
    return {
      employee: [],
    };
  },
  getters: {
    employee(state) {
      return state.employee;
    },
  },
  actions: {
    async getEmployee(context) {
      context.dispatch('setLoading', true, { root: true });
      try {
        const response = await fetch(
          `${VITE_API_URL}/api/nhanvien`
        );
        const employee = await response.json();
        context.commit('getEmployee', employee);
      } catch (error) {
        console.log('Lỗi:' + error);
      } finally {
        context.dispatch('setLoading', false, { root: true });
      }
    },
    async addItem(context, payload) {
      const toast = getToastInstance();

      await fetch(`${VITE_API_URL}/api/nhanvien`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Account Added:', data);
          context.dispatch('getEmployee');
          toast.add({
            severity: 'success',
            summary: 'Thành công!',
            detail: 'Thêm nhân viên thành công!',
            life: 3000,
          });
        })
        .catch((error) => {
          console.log('Lỗi khi add NhanVien:', error);
          toast.add({
            severity: 'error',
            summary: 'Thất bại!',
            detail: 'Thêm nhân viên thất bại!',
            life: 3000,
          });
        });
    },
    async deleteItem(context, payload) {
      const toast = getToastInstance();
      await fetch(
        `${VITE_API_URL}/api/nhanvien/${payload}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('NhanVien Deleted:', data);
          context.dispatch('getEmployee');
          toast.add({
            severity: 'success',
            summary: 'Thành công!',
            detail: 'Xóa nhân viên thành công!',
            life: 3000,
          });
        })
        .catch((error) => {
          console.log('Lỗi khi delete NhanVien:', error);
          toast.add({
            severity: 'error',
            summary: 'Thất bại!',
            detail: 'Xóa nhân viên thất bại!',
            life: 3000,
          });
        });
    },
    async updateItem(context, payload) {
      const toast = getToastInstance();
      await fetch(
        `${VITE_API_URL}/api/nhanvien/${payload._id}`,
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
          console.log('NhanVien Updated:', data);
          context.dispatch('getEmployee');
          toast.add({
            severity: 'error',
            summary: 'Thành công!',
            detail: 'Cập nhật nhân viên thành công!',
            life: 3000,
          });
        })
        .catch((error) => {
          console.log('Lỗi khi update Account:', error);
          toast.add({
            severity: 'error',
            summary: 'Thất bại!',
            detail: 'Cập nhật nhân viên thất bại!',
            life: 3000,
          });
        });
    },
  },
  mutations: {
    getEmployee(state, payload) {
      state.employee = payload;
    },
  },
};
