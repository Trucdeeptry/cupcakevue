<template>
  <div class="flex pt-6 justify-between items-center">
    <img
      src="../../../public/img/transparent-TO-logo 1.png"
      @click="$router.push({ name: 'home' })"
    />

    <div>
      <ul class="flex justify-between">
        <li
          @mouseleave="isOpenEvents = false"
          @mouseover="isOpenEvents = handleHover(index)"
          :class="{ relative: index == 1 }"
          class="mr-14"
          v-for="(item, index) in navItems"
          :key="item"
        >
          <a
            :href="index == 0 ? '#menu' : index == 1 ? '#event' : '#'"
            class="font-semibold text-black text-xl hover:bg-gradient-to-l from-[#F9D6A6] to-[#F387C1] bg-clip-text hover:text-transparent"
            >{{ $t(item) }}</a
          >
          <ul
            v-if="isOpenEvents && index == 1"
            class="absolute shadow-lg left-0 bg-white rounded-lg z-10"
          >
            <li
              @mouseover="isOpenEvents = true"
              class="last:pb-3 last:rounded-b-lg first:rounded-t-lg first:pt-3 cursor-pointer py-2 px-4 w-60 font-bold text-lg hover:bg-[linear-gradient(to_left,_#F9D6A6_0%,_#F387C1_100%)] hover:text-white"
              v-for="event in $store.getters['events/events']"
              :key="event"
              @click="chooseEnvent(event.ten_dm)"
            >
              {{ $i18n.locale === 'vi' ? event.mo_ta : event.ten_dm }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="flex justify-center items-center">
      <router-link to="/cart" class="navbar_user-link">
        <img src="/img/Bag.svg" alt="" class="navbar_user-bag" />
      </router-link>
      <router-link
        class="w-8 ml-14"
        to="/login"
        v-if="!$store.getters['login/isLogin']"
      >
        <img src="/img/Profile.png" alt="" class="navbar_user-profile" />
      </router-link>
      <div
        v-else
        class="relative"
        @mouseleave="isOpenSignout = false"
        @mouseover="isOpenSignout = true"
      >
        <img
          :src="userInfo.img"
          alt=""
          id="user-avt"
          class="cursor-pointer ml-10 object-contain"
          style="height: 50px; border-radius: 30px; width: 50px"
        />
        <ul
          class="absolute left-0 shadow-lg bg-white rounded-lg"
          v-if="isOpenSignout"
        >
          <li
            @click="$store.dispatch('login/signOut'); $router.push('/login')"
            class="last:pb-3 last:rounded-b-lg first:rounded-t-lg first:pt-3 cursor-pointer py-2 px-4 w-40 font-bold text-lg hover:bg-[linear-gradient(to_left,_#F9D6A6_0%,_#F387C1_100%)] hover:text-white"
          >
            {{ $t('Signout') }}
          </li>
          <li
            @click="$router.push('/order')"
            class="last:pb-3 last:rounded-b-lg first:rounded-t-lg first:pt-3 cursor-pointer py-2 px-4 w-40 font-bold text-lg hover:bg-[linear-gradient(to_left,_#F9D6A6_0%,_#F387C1_100%)] hover:text-white"
          >
            Đơn hàng
          </li>
          <li
            v-if="userInfo.email == 'admin@gmail.com'"
            @click="$router.push('/admin')"
            class="last:pb-3 last:rounded-b-lg first:rounded-t-lg first:pt-3 cursor-pointer py-2 px-4 w-40 font-bold text-lg hover:bg-[linear-gradient(to_left,_#F9D6A6_0%,_#F387C1_100%)] hover:text-white"
          >
            Admin
          </li>
        </ul>
      </div>
      <div class="ml-10">
        <img
          class="w-10 cursor-pointer"
          @click="$i18n.locale = 'en'"
          src="/img/vietnam.png"
          v-if="$i18n.locale === 'vi'"
        />
        <img
          class="w-10 cursor-pointer"
          @click="$i18n.locale = 'vi'"
          src="/img/united-kingdom.png"
          v-else
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpenEvents: false,
      isOpenSignout: false,
    };
  },
  computed: {
    navItems() {
      return this.$store.getters['events/navItems'];
    },
    userInfo() {
      return this.$store.getters['login/userInfo'];
    },
    isModal() {
      return this.$store.getters['isModal'];
    },
  },
  methods: {
    handleHover(index) {
      if (index == 1) return true;
      return false;
    },
    isuserInfo() {
      if (this.userInfo) {
        return true;
      }
      return false;
    },
    chooseEnvent(cate) {
      this.$store.dispatch('products/chooseCate', cate);
      this.$router.push('/products');
    },
  },
};
</script>
