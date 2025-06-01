import { getToastInstance } from '../plugins/toast';
export default {
  namespaced: true,
  state() {
    return {
      events: [],
      navItems: ['Cupcakes', 'Events', 'FAQs', 'ContactUs'],
    };
  },
  getters: {
    events(state) {
      return state.events;
    },
    navItems(state) {
      return state.navItems;
    },
  },
  mutations: {
    getEvents(state, payload) {
      state.events = payload;
    },
    showToast(_, payload){
      const toast = getToastInstance();
      const isSuccess = payload.type == 1 ? true : false 
      toast.add({
        severity: isSuccess ? 'success' : 'error',
        summary: isSuccess ? 'Thành công' : 'Thất bại',
        detail: `${payload.crud} danh mục ${isSuccess ? 'thành công' : 'Thất bại'}`,
        life: 3000,
      });
    }
  },
  actions: {
    async getEvents(context) {
      await context.dispatch('setLoading', true, { root: true });
      try {
        const reponse = await fetch(
          'https://apimongodb-4jh8.onrender.com/api/danhmuc'
        );
        var events = await reponse.json();
        context.commit('getEvents', events);
      } catch (error) {
        console.log('Lỗi:', error);
      }
      await context.dispatch('setLoading', false, { root: true });
    },
    async addItem(context, payload) {
      const toast = getToastInstance();
      await fetch(`https://apimongodb-4jh8.onrender.com/api/danhmuc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Events Added:', data);
          context.dispatch('getEvents');
          toast.add({
            severity: 'success',
            summary: 'Thành công!',
            detail: 'Thêm danh mục thành công!',
            life: 3000,
          });
        })
        .catch((error) => {
          console.log('Lỗi khi add Events:', error);
            toast.add({
              severity: 'error',
              summary: 'Thất bại!',
              detail: 'Thêm danh mục thất bại!',
              life: 3000,
            });
        });
    },
    async deleteItem(context, payload) {
      await fetch(
        `https://apimongodb-4jh8.onrender.com/api/danhmuc/${payload}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('Events Deleted:', data);
          context.dispatch('getEvents');
        })
        .catch((error) => {
          console.log('Lỗi khi delete Events:', error);
        });
    },
    async updateItem(context, payload) {
      await fetch(
        `https://apimongodb-4jh8.onrender.com/api/danhmuc/${payload._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('Events Updated:', data);
          context.dispatch('getEvents');
          context.commit('showToast', {
            type: 1,
            crud: 'Cập nhật'
          }) 
        })
        .catch((error) => {
          console.log('Lỗi khi update Events:', error);
          context.commit('showToast', {
            type: 2,
            crud: 'Cập nhật'
          }) 
        });
    },
  },
};
