import { createStore } from 'vuex';
import cart from './cart';
import products from './products';
import events from './event';
import login from './login';
import order from './order';
import account from './account';
import employee from './employee';
import suplier from './suplier';
import admin from './admin';
import roles from './role';
const store = createStore({
  modules: {
    cart: cart,
    products: products,
    events: events,
    login: login,
    order: order,
    account: account,
    employee: employee,
    suplier: suplier,
    admin: admin,
    roles: roles,
  },
  state() {
    return {
      isModal: false,
      isLoading: false,
      isTransitionActive: true,
      loadingTimeout: null,
    };
  },
  mutations: {
    setModal(state, payload) {
      state.isModal = payload;
    },
    setLoading(state, payload) {
      // if(!payload){
      //   state.loadingTimeout = setTimeout(() => {
      //     state.isLoading = payload
      //   }, 3000);
      // }else{
      //   if(state.loadingTimeout){
      //     clearTimeout(state.loadingTimeout)
      //   }
      //   state.isLoading = payload;
      // }
    },
    setTransition(state, payload) {
      state.isTransitionActive = payload;
    },
  },
  actions: {
    setModal(context, payload) {
      context.commit('setModal', payload);
    },
    setLoading(context, payload) {
      if (payload == true) {
        context.dispatch('setTransition', false);
      }
      context.commit('setLoading', payload);
      if (payload == false) {
        context.dispatch('setTransition', true);
      }
    },
    setTransition(context, payload) {
      context.commit('setTransition', payload);
    },
  },
  getters: {
    isModal(state) {
      return state.isModal;
    },
    isLoading(state) {
      return state.isLoading;
    },
    isTransitionActive(state) {
      return state.isTransitionActive;
    },
  },
});

export default store;
