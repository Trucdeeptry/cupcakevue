<template>
    <base-table v-if="suplier.length"    :isAdmin="isAdminTemp" :propData="suplier"></base-table>
</template>

<script>
import baseTable from '../base/baseTable.vue';
export default {
    components: {baseTable},
    props: ['isAdminTemp'],

    computed: {
        suplier(){
            return this.$store.getters['suplier/suplier']
        }
    }
}
</script>