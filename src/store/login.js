
let timer;
export default {
  namespaced: true,
  state() {
    return {
      isLogin: false,
      userInfo: {},
    };
  },
  mutations: {
    pushInfo(state, payload) {
      localStorage.setItem('token', payload.token);
      localStorage.setItem('userId', payload.userId);
      localStorage.setItem('email', payload.email);
      localStorage.setItem('name', payload.name);
      localStorage.setItem('img', payload.img);
      localStorage.setItem('id', payload.id);
      state.userInfo = {
        token: payload.token,
        userId: payload.userId,
        email: payload.email,
        name: payload.name,
        img: payload.img,
      };
    },
    signOut(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('name');
      localStorage.removeItem('img');
      localStorage.removeItem('expires');
      state.userInfo = {};
    },
    editUserInfo(state, payload) {
      state.userInfo = {
        ...state.userInfo,
        payload,
      };
    },
  },
  actions: {
    async editUserInfo(context, payload) {
      const account = context.rootGetters['account/account'];
      const KH = account.find((x) => x.email == payload.email);
      if (KH) {
        await context.dispatch(
          'account/updateItem',
          {
            ...payload,
            _id: KH._id,
          },
          { root: true }
        );
        context.commit('editUserInfo', payload);
      } else {
        const userRole = context.rootGetters['roles/roles'].find(
          (x) => x.ten_role == 'Khách hàng'
        )._id;
        const accountInfo = {
          ten_kh: payload.ten_kh,
          dia_chi: payload.dia_chi,
          email: payload.email,
          so_dien_thoai: payload.so_dien_thoai,
          ma_role: userRole,
        };

        await context.dispatch(
          'account/addItem',
          { info: accountInfo, disableToast: true },
          { root: true }
        );
      }
    },
    signOut(context) {

      clearTimeout(timer);
      context.commit('signOut');
    },
    async signUp(context, payload) {
      await context.dispatch('setLoading', true, { root: true });

      const response = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD46IzJB3rscXVT1JL-3sBi89ORgVsPE40',
        {
          method: 'POST',
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
            returnSecureToken: true,
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        const error = new Error(responseData.message || 'Thất bại khi đăng ký');
        await context.dispatch('setLoading', false, { root: true });
        throw error;
      }
      console.log(responseData);
      await context.dispatch('setLoading', false, { root: true });
      //toast
    },
    async signIn(context, payload) {
      await context.dispatch('setLoading', true, { root: true });
      const response = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD46IzJB3rscXVT1JL-3sBi89ORgVsPE40',
        {
          method: 'POST',
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
            returnSecureToken: true,
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        const error = new Error(
          responseData.message || 'Vui lòng kiểm tra lại email và mật khẩu'
        );
        await context.dispatch('setLoading', false, { root: true });

        throw error;
      }
      const expiresIn = +responseData.expiresIn * 1000;
      const expirationDate = new Date().getTime() + expiresIn;
      localStorage.setItem('expires', expirationDate);

      timer = setTimeout(() => {
        context.dispatch('signOut');
      }, expiresIn);
      if (context.rootGetters['account/account'].length == 0) {
        await context.dispatch('account/getAccount', null, { root: true });
      }
      const account = context.rootGetters['account/account'];
      let userAccount = account.find((x) => x.email == responseData.email);
      context.commit('pushInfo', {
        id: userAccount._id,
        token: responseData.idToken,
        userId: responseData.localId,
        email: responseData.email,
        name: userAccount.ten_kh,
        img: '/img/account.png',
      });
      await context.dispatch('setLoading', false, { root: true });
      //toast
    },
    autoLogin(context) {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const email = localStorage.getItem('email');
      const name = localStorage.getItem('name');
      const img = localStorage.getItem('img');
      const id = localStorage.getItem('id');

      const expires = localStorage.getItem('expires');
      const expiresIn = +expires - new Date().getTime();

      
      if (expiresIn < 30000) {        
        return;
      }
      
      console.log(expiresIn);
      
      timer = setTimeout(() => {
        console.log('het thoi gian');
        
        context.dispatch('signOut');
      }, expiresIn );
 
     
      
      if (token && userId) {
        context.commit('pushInfo', {
          token: token,
          userId: userId,
          email: email,
          name: name,
          img: img,
          id: id,
        });
      }
    },
    pushInfo(context, payload) {
      context.commit('pushInfo', payload);
    },
  },
  getters: {
    userInfo(state, _, __, rootGetters) {
      const account = rootGetters['account/account'];
      let userAccount = account.find((x) => x.email == state.userInfo.email);
      if (userAccount) {
        userAccount = {
          ...state.userInfo,
          name: userAccount.ten_kh,
          address: userAccount.dia_chi,
          email: userAccount.email,
          phoneNumber: userAccount.so_dien_thoai,
        };
      } else {
        userAccount = {
          ...state.userInfo,
        };
      }
      return userAccount;
    },
    isLogin(state) {
      const isUser = Object.keys(state.userInfo).length;
      if (isUser) {
        return true;
      }
      return false;
    },
  },
};
