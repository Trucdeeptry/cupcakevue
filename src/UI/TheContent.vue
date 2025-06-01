<template>
  <div>
    <base-nav></base-nav>
    <base-landing></base-landing>
    <base-event></base-event>
    <base-menu
      :showStart="0"
      :showEnd="8"
      :CategoryCake="$i18n.locale === 'vi' ?  'Tất cả' : 'All'"
      class="mt-24"
      :sortMode="'asc'"
    ></base-menu>
    <base-client></base-client>
    <base-join></base-join>
  </div>
</template>

<script>
import baseNav from '../base/Content/baseNav.vue';
import baseLanding from '../base/Content/baseLanding.vue';
import baseEvent from '../base/Content/baseEvent.vue';
import baseMenu from '../base/Content/baseMenu.vue';
import baseClient from '../base/Content/baseClient.vue';
import BaseJoin from '../base/Content/baseJoin.vue';

export default {
  components: {
    baseNav,
    baseLanding,
    baseEvent,
    baseMenu,
    baseClient,
    BaseJoin,
  },
  mounted() {
    if (!this.$store.getters['events/events'].length) {
      this.$store.dispatch('events/getEvents');
    }
    if (!this.$store.getters['products/products'].length) {
      this.$store.dispatch('products/getProducts');
    }
  },
};
</script>
