<template>
    <base-table v-if="employee.length"   :isAdmin="isAdminTemp" :propData="employee"></base-table>
</template>

<script>
import baseTable from '../base/baseTable.vue';
export default {
    components: {baseTable},
    props: ['isAdminTemp'],

    computed: {
        employee(){
            return this.$store.getters['employee/employee']
        }
    }
}
</script>