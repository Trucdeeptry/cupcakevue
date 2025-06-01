<template>
  <div>
    <base-nav></base-nav>
    <base-direction></base-direction>
    <div class="flex align-middle justify-between">
      <div class="w-1/2">
        <div
          class="bg-white p-16 rounded-2xl h-[500px] flex align-middle justify-center"
        >
          <img :src="product.img" alt="cakeimg" class="object-contain" />
        </div>
        <div class="flex justify-between mt-5">
          <div>
            <p>
              {{ $t('Type') }}:
              <span class="text-[#AB5300] font-bold">{{
                $i18n.locale === 'vi'
                  ? product.categoryDes
                  : product.categoryDes
              }}</span>
            </p>
            <p>
              MFG: <span class="text-[#AB5300] font-bold">Jun 4, 2022</span>
            </p>
          </div>
          <div class="whitespace-nowrap">
            <p>SKU: <span class="text-[#AB5300] font-bold">FWM15VKT</span></p>
            <p>
              {{ $t('Stocks') }}:
              <span class="text-[#AB5300] font-bold">{{ product.stock }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-col justify-between mx-8 w-1/2 h-[500px]">
        <div
          class="text-[#F74B81] bg-[#FDE0E9] p-2 font-bold w-max text-sm rounded-lg text-center"
        >
          {{ $t('SaleOff') }}
        </div>
        <p class="text-2xl text-[#AB5300] font-extrabold">
          {{ product.name }}
        </p>
        <div class="flex">
          <img
            v-for="item in quantityStar"
            :key="item"
            src="../../public/img/StarProduct.png"
            alt=""
          />
        </div>
        <div class="flex items-center">
          <span class="text-5xl text-[#FF96CF] font-bold"
            >{{ product.price / 1000 }}k</span
          >
          <div class="mx-4">
            <p class="text-[#FDC040] text-sm">
              {{
                Math.floor(
                  (1 - product.price / (product.price + discount)) * 100
                )
              }}% Off
            </p>
            <p class="text-[#B6B6B6] font-bold text-xl line-through">
              {{ (product.price + discount) / 1000 }}k
            </p>
          </div>
        </div>
        <p class="text-lg text-[#7E7E7E]">
          {{ product.des }}
        </p>
        <div class="flex items-center">
          <span>{{ $t('Size') }}</span>
          <div class="ml-3">
            <button
              v-for="item in size"
              :key="item"
              @click="selectSize(item)"
              class="mx-1 bg-white p-2 rounded-lg"
              :class="{ '!bg-[#FF96CF] text-white': activeSize == item }"
            >
              {{ item }}cm
            </button>
          </div>
        </div>
        <div class="flex items-center">
          <input
            type="number"
            min="0"
            @keydown="preventNegative"
            class="w-24 h-12 rounded-lg border-[#FF96CF] border-2 text-xl text-center"
            v-model="quantity"
          />
          <base-button class="ml-4 bg-[#FF96CF] px-5 py-0 rounded-lg h-12">
            <div class="flex items-center">
              <img src="../../public/img/cart.png" class="mr-3" alt="" />
              <span class="text-lg" @click="addProduct(product.id)">{{
                $t('AddCart')
              }}</span>
            </div>
          </base-button>
        </div>
      </div>
      <div class="border rounded-xl p-7 border-[#AB5300] w-1/3">
        <p class="font-bold border-b-2 border-[#AB5300] py-4 text-3xl">
          {{ $t('Events') }}
        </p>
        <div
          class="border border-[#FF96CF] p-4 my-4 rounded-xl"
          v-for="item in categoryList"
          :key="item"
        >
          <div
            class="flex justify-between items-center cursor-pointer"
            @click="chooseEnvent(item.ten_dm)"
          >
            <span>{{ $i18n.locale === 'vi' ? item.mo_ta : item.ten_dm }}</span>
            <div
              class="rounded-full p-4 bg-[#AB5300] text-white w-5 h-5 flex items-center justify-center"
            >
              <p>{{ getQuantityInCate(item.ten_dm) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rounded-xl border p-12 my-10">
      <button
        v-for="item in des"
        @click="changeActiveDes(item)"
        :key="item"
        class="rounded-3xl mx-2 p-3 px-10 text-center bg-white text-[#7E7E7E] font-bold"
        :class="{ '!text-[#AB5300] shadow-md': activeDes == item }"
      >
        {{ $t(item) }}
      </button>

      <transition-group tag="div" name="route" class="text-[#7E7E7E] py-10">
        <div v-if="activeDes == 'Description'">
          <p>
            {{ $t('CupDes1') }}
          </p>
          <ul class="list-disc ml-4 border-b pb-5 my-8">
            <li>{{ $t('li1') }}</li>
            <li>{{ $t('li2') }}</li>
            <li>{{ $t('li3') }}</li>
          </ul>
          <p>
            {{ $t('CupDes3') }}
          </p>
        </div>
        <div v-if="activeDes == 'Additionalinfo'">
          <div>
            <p class="font-bold text-2xl border-b text-black pb-2 my-7">
              {{ $t('Pakaging') }}
            </p>
            <p>
              {{ $t('LessLion') }}
            </p>
            <p>
              {{ $t('LessLion2') }}
            </p>
          </div>
          <div>
            <p class="font-bold text-2xl border-b text-black pb-2 my-7">
              {{ $t('Suggest') }}
            </p>
            <p>
              {{ $t('Suggest1') }}<br />
              {{ $t('Suggest2') }}
            </p>
          </div>
          <div>
            <p class="font-bold text-2xl border-b text-black pb-2 my-7">
              {{ $t('Ingredient') }}
            </p>
            <p>{{ $t('Ingredient1') }}</p>
            <p>
              {{ $t('Ingredient2') }}
            </p>
            <p>
              {{ $t('Ingredient3') }}
            </p>
          </div>
          <div>
            <p class="font-bold text-2xl border-b text-black pb-2 my-7">
              {{ $t('Warnings') }}
            </p>
            <p>{{ $t('Warnings1') }}</p>
          </div>
        </div>
        <div v-if="activeDes == 'Reviews'">
          <h1 class="text-center text-black font-bold text-5xl">
            {{ $t('haveReview') }}
          </h1>
        </div>
      </transition-group>
    </div>
    <div>
      <p
        class="text-2xl font-bold border-b-4 inline-block border-[#AB5300] rounded-lg"
      >
        {{ $t('Related') }}
      </p>
      <div class="flex items-center justify-between">
        <img
          src="../../public/img/arrow.png"
          class="rotate-180 cursor-pointer"
          alt=""
          @click="translate('left')"
        />
        <div class="mt-8 mx-5 flex overflow-hidden">
          <div class="flex flex-shrink-0 overflow-hidden items-center">
            <div
              :style="translateCSS"
              v-for="product in products"
              :key="product.id"
              ref="product"
              class="bg-white rounded-2xl mx-4 p-6 relative cursor-pointer [transition:transform_ease_0.5s]"
              @click="redirect(product.id)"
            >
              <img
                :src="product.img"
                class="object-contain w-[200px] h-[170px]"
              />
              <div
                class="absolute top-0 left-0 text-white p-2 text-sm px-7 text-center rounded-tl-3xl rounded-br-3xl"
                :class="randomBgColor()"
              >
                <span>Hot</span>
              </div>
              <p class="font-bold mt-5">{{ product.name }}</p>
              <div class="flex my-3">
                <img
                  v-for="item in 5"
                  :key="item"
                  class="w-5"
                  src="../../public/img/StarProduct.png"
                  alt=""
                />
              </div>
              <div class="flex items-center">
                <p class="font-bold text-xl text-[#AB5300] mr-2">
                  {{ product.price / 1000 }}k
                </p>
                <p class="text-[#ADADAD] line-through">
                  {{ (product.price + discount) / 1000 }}k
                </p>
              </div>
            </div>
          </div>
        </div>
        <img
          src="../../public/img/arrow.png"
          @click="translate('right')"
          class="cursor-pointer"
          alt=""
        />
      </div>
    </div>
    <!-- combo -->
    <div
      class="bg-[linear-gradient(to_right,_#FF96CF_0%,_#FFEBCF_100%)] relative flex flex-col mt-[117px] z-0"
    >
      <div class="text-left p-[3.7rem]">
        <h1 class="text-[3.5rem] m-0 w-1/2 leading-[5rem]">
          {{ $t('DozenTitle') }}
        </h1>
        <div class="wrapper__sale">
          <p
            class="text-white text-[2rem] font-bold absolute font-['Sriracha',_sans-serif] -rotate-[30.59deg] top-[60px] right-[466px] inline-block"
          >
            {{ $t('Save') }} 15%
          </p>
          <img
            src="../../public/img/Arrow around.svg"
            alt=""
            class="absolute top-[110px] right-[425px]"
          />
          <img
            src="../../public/img/Combo cupake.png"
            id="CupcakeImg9"
            alt=""
            class="absolute bottom-[63px] right-[103px]"
          />
          <img
            src="../../public/img/2 Star.svg"
            alt=""
            class="absolute right-[28px] top-[31px]"
          />
        </div>
        <div class="wrapper__info">
          <p class="text-[1.3rem] w-1/2 font-bold my-5">
            {{ $t('DozenDes') }}
          </p>
          <p class="text-[1.5rem] font-extrabold m-0">300k/doz</p>

          <base-button class="mt-[31px] !bg-[white] px-[38px] py-[14px] group"
            ><span
              class="text-[#EB6FB2] group-hover:text-white text-3xl"
              @click="addProduct('dozen')"
              >{{ $t('AddCart') }}</span
            ></base-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from '../base/baseButton.vue';
import baseDirection from '../base/baseDirection.vue';
import BaseNav from '../base/Content/baseNav.vue';

export default {
  components: { baseDirection, BaseNav, BaseButton },
  data() {
    return {
      quantityStar: 0,
      size: [5, 6, 7],
      activeSize: 5,
      quantity: 1,
      des: ['Description', 'Additionalinfo', 'Reviews'],
      activeDes: 'Description',
      translateValue: 0,
      discount: 50000,
    };
  },
  computed: {
    productID() {
      return this.$route.params.productId;
    },
    product() {
      const getters = this.$store.getters['products/getProduct'];
      return getters(this.productID);
    },
    categoryList() {
      return this.$store.getters['events/events'];
    },
    getQuantityInCate() {
      return this.$store.getters['products/getQuantityInCate'];
    },
    products() {
      return this.$store.getters['products/products'];
    },
    translateCSS() {
      return {
        transform: `translateX(${this.translateValue}px)`,
      };
    },
  },
  methods: {
    selectSize(size) {
      this.activeSize = size;
    },
    preventNegative(event) {
      if (
        (event.key == 'ArrowDown' && event.target.value - 1 < 1) ||
        event.key == '-'
      ) {
        event.preventDefault();
      }
    },
    chooseEnvent(cate) {
      this.$store.dispatch('products/chooseCate', cate);
      this.$router.push('/products');
    },
    translate(direction) {
      const widthElement = this.$refs.product[0].offsetWidth + 32;
      const listLength = this.$refs.product.length;
      if (direction == 'right') {
        if (
          !(
            this.translateValue - widthElement <
            -widthElement * (listLength - 4)
          )
        ) {
          this.translateValue -= widthElement;
        }
      } else {
        if (!(this.translateValue + widthElement > 0)) {
          this.translateValue += widthElement;
        }
      }
    },
    addProduct(id) {
      let product = {};
      if (id == 'dozen') {
        product = {
          id: 'dozen',
          name: 'One Dozen at One click',
          price: 50.25,
          img: '/img/Combo cupake.png',
          quantity: 1,
          category: 'Christmas Day',
        };
      } else {
        product = this.products.find((x) => x.id == id);
      }
      this.$store.dispatch('cart/addProduct', product);
    },
    changeActiveDes(item) {
      this.activeDes = item;
    },
    randomBgColor() {
      const bgColor = ['bg-[#F74B81]', 'bg-[#AB5300]', 'bg-[#FF4B4B]'];
      return bgColor[Math.floor(Math.random() * bgColor.length)];
    },
    redirect(id) {
      window.scrollTo({
        top: 350,
        behavior: 'smooth',
      });
      this.$router.push(`/products/${id}`);
    },
  },
  mounted() {
    this.quantityStar = Math.floor(Math.random() * 5) + 3;
  },
  created() {
    if (!this.$store.getters['events/events'].length)
      this.$store.dispatch('events/getEvents');
    if (!this.$store.getters['products/products'].length)
      this.$store.dispatch('products/getProducts');
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
