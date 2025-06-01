<template>
  <div>
    <base-nav></base-nav>
    <base-direction></base-direction>
    <div class="w-full bg-[#FDD8F3] rounded-xl">
      <div class="py-7"></div>
      <div class="w-full bg-white rounded-xl z-10 font-bold py-2 pb-14">
        <table class="w-full relative top-[-50px]" v-if="$store.getters['cart/cartItem'].length">
          <thead>

            <th>{{ $t('Product') }}</th>
            <th>{{ $t('Events') }}</th>
            <th>{{ $t('Quantity') }}</th>

            <th>{{ $t('Unitprice') }}</th>

            <th>{{ $t('Total') }}</th>





          </thead>
          <tbody>
            <tr class="h-10"></tr>
            <tr v-for="item in cartItem" :key="item.name" class="h-36">
              <td>
                <div class="flex justify-center items-center">
                  <img :src="item.img" alt="cupcake" class="w-[10rem] h-28 object-contain" />
                  <p class="text-[#EA1A72] hover:underline cursor-pointer w-20">
                    {{ item.name }}
                  </p>
                </div>
              </td>
              <td class="text-center">
                <span>{{
                  $i18n.locale === 'vi' ? item.categoryDes : item.category
                }}</span>
              </td>
              <td>
                <div class="flex items-center justify-center">
                  <div class="flex">
                    <input type="button"
                      class="border-r-[none] cursor-pointer w-[1.5rem] h-10 rounded-none bg-transparent border-[1px] border-[solid] border-[black] text-[1.3rem] outline-[none] text-center"
                      @click="decreaseProduct(item.id)" value="-" />
                    <input type="number"
                      class="w-[3.6rem] text-center h-10 rounded-none bg-transparent border-[1px] border-[solid] border-[black] text-[1.3rem] outline-[none]"
                      v-model="item.quantity" @keydown="preventNegativeInput" value="1" step="1" />
                    <input type="button" @click="increaseProduct(item.id)"
                      class="border-l-[none] cursor-pointer w-[1.5rem] h-10 rounded-none bg-transparent border-[1px] border-[solid] border-[black] text-[1.3rem] outline-[none] text-center"
                      value="+" />
                  </div>
                </div>
              </td>
              <td class="text-center">
                <span class="w-14 text-center">{{ item.price / 1000 }}k</span>
              </td>
              <td class="text-center">
                <span class="w-14 text-center text-[#EA1A72]">{{ (item.price * item.quantity) / 1000 }}k</span>
              </td>
              <td>
                <img class="cursor-pointer" src="../../public/img/trash-2.png" @click="deleteProduct(item.id)" />
              </td>
            </tr>
          </tbody>
        </table>
        <h1 class="text-6xl font-bold text-center my-9" v-else>
          {{ $t('Nothinghere') }}
        </h1>
        <div class="px-14">
          <div class="border-t border-black my-3">
            <div class="mt-9">
              <div class="flex items-center">
                <p class="text-xl mx-10 text-[#CD4F08]">{{ $t('Delivery') }}</p>
                <img class="w-8 h-8 cursor-pointer" @click="updateModal()" src="../../public/img/edit.png" alt="edit" />
              </div>
              <ul class="list-disc ml-20 my-5 text-xl">
                <li class="font-bold my-3">
                  <span :class="{ 'text-red-500': !info.name }">{{ $t('Recipient') }}:
                  </span>
                  <span class="font-normal">{{ info.name }}</span>
                </li>

                <li class="font-bold my-3">
                  <span :class="{ 'text-red-500': !info.phoneNumber }">{{ $t('Phone') }} (+84) :
                  </span>
                  <span class="font-normal">{{ info.phoneNumber }}</span>
                </li>

                <li class="font-bold my-3">
                  <span :class="{ 'text-red-500': !info.address }">{{ $t('Location') }}:
                  </span>
                  <span class="font-normal"> {{ info.address }}</span>
                </li>
                <li class="font-bold my-3">
                  <span :class="{ 'text-red-500': !noteGetters }">{{ $t('Note') }}:
                  </span>
                  <span class="font-normal"> {{ noteGetters }}</span>
                </li>
                <li class="font-bold my-3">
                  <span :class="{ 'text-red-500': !info.email }">{{ $t('Email') }}:
                  </span>
                  <span class="font-normal"> {{ info.email }}</span>
                </li>
              </ul>
            </div>
            <div class="mt-9">
              <div class="flex items-center">
                <p class="text-xl mx-10 text-[#CD4F08]">{{ $t('Payment') }}</p>
              </div>
              <div class="flex items-center/ ml-7 mt-7">
                <div class="rounded-2xl shadow-md cursor-pointer flex items-center justify-center border mx-8 p-4"
                  :class="{
                    'border-[#EA1A72] bg-[#FFE3F5] ': isCash,
                  }" @click="$store.dispatch('cart/toggleCash', true)">
                  <img src="../../public/img/Money--Streamline-Phosphor.png" class="w-12 h-10 mr-5" alt="" />
                  <p class="font-bold">{{ $t('Cash') }}</p>
                </div>
                <div class="rounded-2xl shadow-md cursor-pointer flex items-center justify-center border mx-8 p-4"
                  :class="{
                    ' border-[#EA1A72] bg-[#FFE3F5]': !isCash,
                  }" @click="$store.dispatch('cart/toggleCash', false)">
                  <img src="../../public/img/momoicon.png" class="w-12 h-10 mr-5" alt="" />
                  <p class="font-bold">{{ $t('Credit') }}</p>
                </div>
              </div>
            </div>
            <div class="border-t border-black mt-24 relative pl-10">
              <img src="../../public/img/transparent-TO-logo 1.png"
                class="absolute left-[43%] p-10 top-[-88px] bg-white" alt="" />
              <div class="border-b border-black w-1/2 mt-20">
                <ul>
                  <li class="my-4">
                    {{ $t('Amount') }}:
                    <span class="text-[#F854D1]">{{ totalAmount / 1000 }}k</span>
                  </li>
                  <li class="my-4">
                    {{ $t('Discount') }}:
                    <span class="text-[#F854D1]">{{ Discount / 1000 }}k</span>
                  </li>
                  <li class="my-4">
                    {{ $t('Ship') }}:
                    <span class="text-[#F854D1]">{{ ShipFee / 1000 }}k</span>
                  </li>
                </ul>
              </div>
              <div class="flex justify-between">
                <div class="text-xl mt-5">
                  <span>{{ $t('Grand') }}: </span>
                  <span class="text-[#F854D1]"> {{ grandTotal / 1000 }}k</span>
                </div>
                <base-button @click="submitOrder" mode="long">{{
                  $t('Place')
                }}</base-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <base-modal :title="$t('EnterInfo')">
      <div>
        <form class="p-4 md:p-5" @submit.prevent="submit">
          <div class="grid gap-4 mb-4 grid-cols-2">
            <div class="col-span-2">
              <label class="block mb-2 text-sm font-bold text-gray-900">{{
                $t('Name')
              }}</label>
              <input v-model="modalInfo.name" type="text" name="name"
                class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type your name" required />
            </div>
            <div class="col-span-2">
              <label class="block mb-2 text-sm font-bold text-gray-900">{{
                $t('Phone')
              }}</label>
              <input v-model="modalInfo.phoneNumber" type="number" name="name"
                class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type your phone number" required />
            </div>
            <div class="col-span-2">
              <label for="description" class="block mb-2 text-sm font-bold text-gray-900">{{ $t('Location') }}</label>
              <textarea v-model="modalInfo.address" required id="description" rows="4"
                class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type your address"></textarea>
            </div>
            <div class="col-span-2">
              <label class="block mb-2 text-sm text-gray-900 font-bold">{{
                $t('Note')
              }}</label>
              <input v-model="note" type="text" name="name"
                class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type your note" />
            </div>
            <div class="col-span-2">
              <label class="block mb-2 text-sm text-gray-900 font-bold">{{
                $t('Email')
              }}</label>
              <input v-model="modalInfo.email" type="text" disabled name="name"
                class="block w-full opacity-40 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type your Email" />
            </div>
          </div>

          <base-button type="submit" class="p-2">{{
            $t('Submit')
          }}</base-button>
        </form>
      </div>
    </base-modal>
  </div>
</template>

<script>
import BaseButton from '../base/baseButton.vue';
import BaseDirection from '../base/baseDirection.vue';
import BaseModal from '../base/baseModal.vue';
import baseNav from '../base/Content/baseNav.vue';

export default {
  components: { baseNav, BaseDirection, BaseButton, BaseModal },
  computed: {
    cartItem() {
      return this.$store.getters['cart/cartItem'];
    },
    totalAmount() {
      return this.$store.getters['cart/totalAmount'];
    },
    Discount() {
      if (this.totalAmount) {
        return this.$store.getters['cart/Discount'];
      }
      return 0;
    },
    ShipFee() {
      if (this.totalAmount) {
        return this.$store.getters['cart/ShipFee'];
      }
      return 0;
    },
    grandTotal() {
      return this.$store.getters['cart/grandTotal'];
    },
    info() {
      return this.$store.getters['login/userInfo'];
    },
    noteGetters() {
      return this.$store.getters['cart/getNote'];
    },
    isCash() {
      return this.$store.getters['cart/isCash'];
    },
  },
  data() {
    return {
      modalInfo: {
        name: '',
        phoneNumber: '',
        address: '',
      },
      note: '',
    };
  },

  methods: {
    increaseProduct(id) {
      this.$store.dispatch('cart/increaseProduct', id);
    },
    decreaseProduct(id) {
      this.$store.dispatch('cart/decreaseProduct', id);
    },
    preventNegativeInput(event) {
      if (
        (event.key == 'ArrowDown' && event.target.value - 1 < 1) ||
        event.key == '-'
      ) {
        event.preventDefault();
      }
      event.target.value = Math.trunc(event.target.value);
    },
    deleteProduct(id) {
      this.$store.dispatch('cart/deleteProduct', {
        id: id,
        disableToast: false,
      });
    },
    updateModal() {
      this.modalInfo = { ...this.info };
      this.$store.dispatch('setModal', true);
    },
    submit() {
      const info = {
        ten_kh: this.modalInfo.name,
        dia_chi: this.modalInfo.address,
        so_dien_thoai: this.modalInfo.phoneNumber,
        email: this.$store.getters['login/userInfo'].email,
      };
      this.$store.dispatch('cart/addNote', this.note);
      this.$store.dispatch('login/editUserInfo', info);
      this.$store.dispatch('setModal', false);
    },
    submitOrder() {
      if (
        Object.values(this.info).every(
          (value) => value !== null && value !== undefined && value !== ''
        )
      ) {
        this.$store.dispatch('cart/placeOrder', this.info);
      } else {
        this.$toast.add({
          severity: 'error',
          summary: 'Thất bại!',
          detail: 'Vui lòng nhập đầy đủ thông tin!',
          life: 3000,
        });
      }
    },
  },
  async created() {
    if (!this.$store.getters['products/products'].length)
      await this.$store.dispatch('products/getProducts');
    if (!this.$store.getters['account/account'].length)
      await this.$store.dispatch('account/getAccount');
    if (!this.$store.getters['roles/roles'].length)
      await this.$store.dispatch('roles/getRoles');
    this.$store.dispatch('cart/getCart');
  },
};
</script>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
