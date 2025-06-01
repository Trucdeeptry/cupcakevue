export default {
  namespaced: true,
  state() {
    return {
      projects: [
        {
          name: 'KPI bán hàng',
          budget: 50000000,
          current: 50000000,
          // complete: (this.current / this.budget) * 100,
        },
        {
          name: 'Ngân sách tuyển nhân viên',
          budget: 20000000,
          current: 10000000,
        },
        {
          name: 'Ngân sách nhập bánh',
          budget: 80000000,
          current: 30000000,
        },
      ],
    };
  },
  getters: {
    order(_, __, ___, rootGetters) {
      return rootGetters['order/order'];
    },
    projects(state) {
      return state.projects.map( x => ({
        ...x,
        complete: (x.current / x.budget) * 100
      }))
      
    },
  },
  actions: {
    changeComplete(context, payload){
        context.commit('changeComplete', payload)
    }
  },
};
