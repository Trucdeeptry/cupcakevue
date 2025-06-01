import { getToastInstance } from '../plugins/toast';
export default {
    namespaced: true,
    state() {
      return {
        roles: [],
      };
    },
    getters: {
      roles(state) {
        return state.roles;
      },
    },
    mutations: {
      getRoles(state, payload) {
        state.roles = payload;
      },
      showToast(_, payload){
        const toast = getToastInstance();
        const isSuccess = payload.type ? true : false 
        toast.add({
          severity: isSuccess ? 'success' : 'error',
          summary: isSuccess ? 'Thành công' : 'Thất bại',
          detail: `${payload.crud} 'vai trò' ${isSuccess ? 'thành công' : 'Thất bại'}`,
          life: 3000,
        });
      }
    },
    actions: {
      async getRoles(context) {
        await context.dispatch('setLoading', true, { root: true });
        try {
          const reponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/role`
          );
          var roles = await reponse.json();
          context.commit('getRoles', roles);
        } catch (error) {
          console.log('Lỗi:', error);
        }
        await context.dispatch('setLoading', false, { root: true });
      },
      
    },
  };
  