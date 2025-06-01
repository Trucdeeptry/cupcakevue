<template>
    <base-table v-if="events.length"    :isAdmin="isAdminTemp" :propData="events"></base-table>
</template>

<script>
import baseTable from '../base/baseTable.vue';
export default {
    components: {baseTable},
    props: ['isAdminTemp'],
    computed: {
        events(){
            return this.$store.getters['events/events']
        },

    }
}
</script>