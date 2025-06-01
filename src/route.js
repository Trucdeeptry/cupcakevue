import { createRouter, createWebHistory } from 'vue-router';
import theLogin from './UI/theLogin.vue';
import NotFound from './UI/NotFound.vue';
import TheContent from './UI/TheContent.vue';
import theCart from './UI/theCart.vue';
import allProducts from './UI/allProducts.vue';
import theproduct from './UI/theproduct.vue';
import theAdmin from './UI/theAdmin.vue';
import dashboardAdmin from './admin/dashboardAdmin.vue';
import tableDH from './admin/table/tableDH.vue';
import tableDM from './admin/table/tableDM.vue';
import tableKH from './admin/table/tableKH.vue';
import tableNCC from './admin/table/tableNCC.vue';
import tableNV from './admin/table/tableNV.vue';
import tableSP from './admin/table/tableSP.vue';
import store from './store/mainStore';
import checkOrder from './UI/checkOrder.vue';
import dashboard from './UI/childrenCheckOrder/dashboard.vue';
import address from './UI/childrenCheckOrder/address.vue';
import noti from './UI/childrenCheckOrder/noti.vue';
import order from './UI/childrenCheckOrder/order.vue';
import userInfo from './UI/childrenCheckOrder/userInfo.vue';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', component: TheContent, name: 'home' },
    {
      path: '/cart',
      component: theCart,
      name: 'cart',
      meta: { requireAuth: true },
    },
    {
      path: '/login',
      component: theLogin,
      name: 'login',
      meta: { requireUnAuth: true },
    },
    { path: '/products', component: allProducts },
    { path: '/products/:productId', component: theproduct, props: true },
    {
      path: '/admin',
      name: 'admin',
      component: theAdmin,
      redirect: { name: 'dashboard' },
      children: [
        { path: '', name: 'dashboard', component: dashboardAdmin },
        { path: 'dashboard', name: 'dashboard', component: dashboardAdmin },
        { path: 'sanpham', component: tableSP },
        { path: 'khachhang', component: tableKH },
        { path: 'danhmuc', component: tableDM },
        { path: 'nhacungcap', component: tableNCC },
        { path: 'nhanvien', component: tableNV },
        {
          path: 'donhang',
          component: tableDH,
          name: 'adminOrder',
          async beforeEnter(to, from, next) {
            await store.dispatch('order/getOrder');
            console.log(store.getters['order/combineOrder']);
            next();
          },
          props: () => {
            // Truyền tableData từ Vuex vào component sau khi dữ liệu đã được tải xong
            const tableData = store.getters['order/combineOrder'];
            return { tableData }; // Truyền tableData vào component dưới dạng props
          },
        },
      ],
      meta: { requireAuth: true },
    },
    {
      path: '/order',
      component: checkOrder,
      redirect: { name: 'dashboardOrder' },
      children: [
        { path: '', name: 'dashboardOrder', component: dashboard },
        { path: 'dashboard', name: 'dashboardOrder', component: dashboard },
        { path: 'address', name: 'address', component: address },
        { path: 'notification', name: 'notification', component: noti },
        { path: 'order', name: 'order', component: order },
        { path: 'user', name: 'user', component: userInfo },
      ],
      meta: { requireAuth: true },
    },
    { path: '/:notfound(.*)', component: NotFound },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 150 };
    }
  },
});

router.beforeEach(function (to, _, next) {
  const path = to.path.substring(1);
  if (to.meta.requireAuth && !store.getters['login/isLogin']) {
    if (path.includes('admin')) {
      next('/login?redirect=home');
    } else {
      next(`/login?redirect=${path}`);
    }
  } else if (to.meta.requireUnAuth && store.getters['login/isLogin']) {
    next('/home');
  } else {
    next();
  }
});

export default router;
