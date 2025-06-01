<template>
  <div>
    <base-table
      :childClass="childClassDH"
      :isAdmin="isAdminTemp"
      v-if="tableData.length"
      :propData="tableData"
      :hiddenColumn="hiddenColumn"
    ></base-table>
  </div>
</template>

<script>
import baseTable from '../base/baseTable.vue';
export default {
    props: ['hiddenColumn', 'tableData', 'isAdminTemp', 'childClassDH'],
    components: {baseTable},
    async created(){
        if (!this.$store.getters['products/products'].length)
        await this.$store.dispatch('products/getProducts');
    }
}
</script>
