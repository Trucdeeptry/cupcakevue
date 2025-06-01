<template>
  <base-table
    v-if="products.length"
    :isAdmin="isAdminTemp"
    :propData="products"
  ></base-table>
</template>

<script>
import baseTable from '../base/baseTable.vue';
export default {
  components: { baseTable },
  props: ['isAdminTemp'],

  computed: {
    products() {
      return this.$store.getters['products/productsRaw'];
    },
  },
};
</script>
