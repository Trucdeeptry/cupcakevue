<template>
    <base-table v-if="account.length"     :isAdmin="isAdminTemp" :propData="account"></base-table>
</template>

<script>
import baseTable from '../base/baseTable.vue';
export default {
    components: {baseTable},
    props: ['isAdminTemp'],

    computed: {
        account(){
            return this.$store.getters['account/account']
        }
    }
}
</script>