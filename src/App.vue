<template>
  <div :class="languageClass" id="main">
    <the-header v-if="currentRoute != '/login' && !currentRoute.includes('admin')"></the-header>
    <loading-screen v-show="isLoading"></loading-screen>
    <div :class="{
      'bg-[#FFF4FC] px-20 pb-24':
        currentRoute != '/login' && !currentRoute.includes('admin'),
    }">
      <router-view v-slot="slotProps">
        <transition name="route" mode="out-in" :css="isTransitionActive">
          <component :is="slotProps.Component"></component>
        </transition>
      </router-view>
    </div>
    <base-footer v-if="currentRoute != '/login' && !currentRoute.includes('admin')"></base-footer>
    <Toast></Toast>
  </div>
</template>

<script>
import BaseFooter from './base/Content/baseFooter.vue';
import theHeader from './UI/Theheader.vue';
import loadingScreen from './UI/loadingScreen.vue';
import Toast from 'primevue/toast';
export default {
  components: { theHeader, BaseFooter, loadingScreen, Toast },
  computed: {
    currentRoute() {
      return this.$route.path;
    },
    isLoading() {
      return this.$store.getters['isLoading'];
    },
    isTransitionActive() {
      return this.$store.getters['isTransitionActive'];
    },
    languageClass() {
      return this.$i18n.locale === 'vi'
        ? 'font-vietnamse-sub font-vietnamese-heading'
        : '';
    },
  },
  created() {
    this.$store.dispatch('login/autoLogin');
  },
};
</script>
<style>
@font-face {
  font-family: 'Stangith';
  src: url('./assets/fonts/stangith.eot');
  src: url('./assets/fonts/stangith.eot?#iefix') format('embedded-opentype'),
    url('./assets/fonts/stangith.woff2') format('woff2'),
    url('./assets/fonts/stangith.woff') format('woff'),
    url('./assets/fonts/stangith.ttf') format('truetype'),
    url('./assets/fonts/stangith.svg#stangith') format('svg');
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Sofia Pro';
  src: url('./assets/fonts/SofiaProLight.eot');
  src: url('./assets/fonts/SofiaProLight.eot?#iefix') format('embedded-opentype'),
    url('./assets/fonts/SofiaProLight.woff2') format('woff2'),
    url('./assets/fonts/SofiaProLight.woff') format('woff'),
    url('./assets/fonts/SofiaProLight.ttf') format('truetype'),
    url('./assets/fonts/SofiaProLight.svg#SofiaProLight') format('svg');
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Sriracha';
  src: url('./assets/fonts/Sriracha-Regular.eot');
  src: url('./assets/fonts/Sriracha-Regular.eot?#iefix') format('embedded-opentype'),
    url('./assets/fonts/Sriracha-Regular.woff2') format('woff2'),
    url('./assets/fonts/Sriracha-Regular.woff') format('woff'),
    url('./assets/fonts/Sriracha-Regular.ttf') format('truetype'),
    url('./assets/fonts/Sriracha-Regular.svg#Sriracha-Regular') format('svg');
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Carlo';
  src: url('./assets/fonts/Carlo.ttf');
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Noto';
  src: url('./assets/fonts/NotoSans.ttf');
}

html {
  font-family: 'Sofia Pro', sans-serif;
  scroll-behavior: smooth;
  color: black;
}

select,
input {
  background-color: transparent;
}

h1,
h2,
h3 {
  font-family: 'Stangith', sans-serif;
  font-weight: 300;
}

.font-vietnamese-heading h1,
.font-vietnamese-heading h2,
.font-vietnamese-heading h3 {
  font-family: 'Carlo', sans-serif;
  font-weight: 300;
}

.font-vietnamse-sub {
  font-family: 'Noto', sans-serif;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.route-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.route-leave-active,
.route-enter-active {
  transition: all 0.3s ease;
}
</style>
