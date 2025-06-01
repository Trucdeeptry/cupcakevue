<template>
  <section>
    <base-nav></base-nav>
    <base-direction></base-direction>
    <div class="flex">
      <div class="mr-7">
        <div class="bg-[#ffedf9] shadow-xl w-[25rem] rounded-2xl">
          <h1 class="text-4xl border-b-2 text-center p-6">
            {{ $t('Hello') }}, {{ userInfo.name }}
          </h1>
          <ul class="p-4">
            <li
              @click="activeNav = nav.text; $router.push(`/order/${nav.route}`)"
              class="flex items-center py-4 my-3 hover:bg-[#fec5ce] hover:text-white hover:cursor-pointer group rounded-xl"
              :class="{
                'text-white bg-[#fec5ce] cursor-pointer': activeNav == nav.text,
              }"
              v-for="nav in navList"
              :key="nav.text"
            >
              <img
                :src="nav.iconLink"
                class="mx-4 w-6 h-6 group-hover:filter group-hover:invert"
                :class="{ 'filter invert': activeNav == nav.text }"
                alt=""
              />
              <p class="font-bold">{{ $t(nav.text) }}</p>
            </li>
          </ul>
        </div>
      </div>
      <router-view v-slot="slotProps">
        <transition name="route" mode="out-in">
          <component :is="slotProps.Component"></component>
        </transition>
      </router-view>
    </div>
  </section>
</template>

<script>
import baseNav from '../base/Content/baseNav.vue';
import baseDirection from '../base/baseDirection.vue';
export default {
  components: { baseNav, baseDirection },
  data() {
    return {
      navList: [
        {
          text: 'Dashboard',
          iconLink: '/img/dashboard.png',
          route: 'dashboard',
        },
        {
          text: 'UserInfo',
          iconLink: '/img/user.png',
          route: 'user',
        },
        {
          text: 'OrderCheck',
          iconLink: '/img/order(1).png',
          route: 'order',
        },
        {
          text: 'Address',
          iconLink: '/img/map.png',
          route: 'address',
        },
        {
          text: 'TorontoNoti',
          iconLink: '/img/bell.png',
          route: 'notification',
        },
      ],
      activeNav: 'Dashboard',
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters['login/userInfo'];
    },
  },
};
</script>
