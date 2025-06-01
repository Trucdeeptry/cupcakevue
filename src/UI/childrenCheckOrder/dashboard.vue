<template>
  <div class="rounded-xl bg-[#ffedf9] p-5 w-full shadow-2xl flex-row justify-center items-center">
    <div class="flex items-center">
      <p class="text-lg">Trang tổng quan</p>
    </div>
    <div class="flex justify-center items-center gap-7">
      <div
        @click="activeOrder(manage.name)"
        v-for="manage in manageList"
        :key="manage.name"
        class="p-5 cursor-pointer items-center justify-center text-black flex bg-white rounded-2xl my-5"
        :class="{ '!bg-[#fec5ce] !text-white': currentOrder == manage.name }"
      >
        <img
          :src="manage.iconLink"
          class="w-10 h-10 mr-5"
          :class="{ 'invert filter': currentOrder == manage.name }"
        />
        <div>
          <p class="font-bold text-base">{{ $t(manage.name) }}</p>
          <p class="font-bold text-lg">
            {{ countList(manage.name) }} {{ $t('order') }}
          </p>
        </div>
      </div>
    </div>
    <table-dh childClassDH="hidden-column2 hidden-column1" :isAdminTemp="false"  hiddenColumn="hidden-column2 hidden-column7" :tableData="getCurrentOrder"></table-dh>
  </div>
</template>

<script>
import tableDh from '../../admin/table/tableDH.vue';
export default {
  components: {
    tableDh
  },
  data() {
    return {
      manageList: [
        {
          name: 'Ordered',
          iconLink: '/img/order(1).png',
        },
        {
          name: 'NotDelivery',
          iconLink: '/img/order-history.png',
        },
        {
          name: 'Delivered',
          iconLink: '/img/shopping-bag.png',
        },
      ],
      currentOrder: 'Ordered',
    };
  },
  computed: {
    Ordered() {
      return this.$store.getters['order/ordered'];
    },
    NotDelivery() {
      return this.$store.getters['order/NotDelivery'];
    },
    Delivered() {
      return this.$store.getters['order/Delivered'];
    },
    getCurrentOrder() {
      return this[this.currentOrder];
    },
  },
  methods: {
    countList(name) {
      return this[name].length;
    },
    activeOrder(name) {
      this.currentOrder = name;
    },
  },
  async mounted() {
    if (!this.$store.getters['account/account'].length) {
      await this.$store.dispatch('account/getAccount');
    }
    if (!this.$store.getters['order/order'].length)
      await this.$store.dispatch('order/getOrder');
  },
};
</script>
