<template>
  <div class="min-h-screen bg-white">
    <nav-admin></nav-admin>
    <div class="xl:ml-[20rem] w-[75rem]">
      <router-view v-slot="slotProps">
        <transition name="route" mode="out-in">
          <component :is="slotProps.Component" :isAdminTemp="true"></component>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script>
import navAdmin from '../admin/navAdmin.vue';
export default {
  components: { navAdmin },
  async created() {
    await this.$store.dispatch('setTransition', false);
    if (!this.$store.getters['order/order'].length)
      await this.$store.dispatch('order/getOrder');
    if (!this.$store.getters['products/products'].length)
      await this.$store.dispatch('products/getProducts');
    if (!this.$store.getters['account/account'].length) {
      await this.$store.dispatch('account/getAccount');
    }
    if (!this.$store.getters['employee/employee'].length) {
      await this.$store.dispatch('employee/getEmployee');
    }
    if (!this.$store.getters['suplier/suplier'].length) {
      await this.$store.dispatch('suplier/getSuplier');
    }
    if (!this.$store.getters['events/events'].length) {
      await this.$store.dispatch('events/getEvents');
    }
    if (!this.$store.getters['roles/roles'].length) {
      await this.$store.dispatch('roles/getRoles');
    }
    if (!this.$store.getters['employee/employee'].length) {
      await this.$store.dispatch('employee/getEmployee');
    }
    await this.$store.dispatch('setTransition', true);
  },
};
</script>
