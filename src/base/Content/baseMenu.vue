<template>
  <div id="menu" @keyup="handleModel">
    <div class="text-center">
      <h2 class="text-6xl" v-if="$route.name == 'home'">
        {{ $t('Flavours') }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" name="fade" mode="out-in">
        <div class="mt-11 flex flex-col items-center justify-center rounded-xl bg-white p-6 cursor-pointer"
          v-for="product in productsToShow" :key="product.id" @click="redirect(product.id)">
          <img :src="product.img" class="w-[200px] h-[190px] mt-[22px] object-contain" />
          <p class="font-bold text-xl h-10" id="Cupcake1">
            {{ product.name }}
          </p>
          <div class="flex justify-around items-center w-full my-10">
            <p class="text-3xl text-[#FF96CF] font-extrabold m-0" id="price1">
              {{ product.price / 1000 }}k
            </p>
            <div class="flex" @click.stop>
              <input type="button"
                class="border-r-[none] cursor-pointer w-[1.5rem] h-10 rounded-none bg-transparent border-[1px] border-[solid] border-[black] text-[1.3rem] outline-[none] text-center"
                @click="decreaseProduct(product.id)" value="-" />
              <input type="number"
                class="w-[3.6rem] text-center h-10 rounded-none bg-transparent border-[1px] border-[solid] border-[black] text-[1.3rem] outline-[none]"
                v-model="product.quantity" @keydown="preventNegativeInput" value="1" />
              <input type="button" @click="increaseProduct(product.id)"
                class="border-l-[none] cursor-pointer w-[1.5rem] h-10 rounded-none bg-transparent border-[1px] border-[solid] border-[black] text-[1.3rem] outline-[none] text-center"
                value="+" />
            </div>
          </div>
          <base-button @click.stop length="long" @click="addProduct(product.id)">{{ $t('AddCart') }}</base-button>
        </div>
      </div>

      <slot></slot>
      <div class="mt-12 flex justify-center items-center" v-if="$route.name == 'home'">
        <img src="../../../public/img/Star 5.png" class="filter invert" alt="" />
        <router-link to="/products">
          <h1 class="underline text-4xl font-bold cursor-pointer mx-7">
            {{ $t('SeeAll') }}
          </h1>
        </router-link>
        <img src="../../../public/img/Star 5.png" class="filter invert" alt="" />
      </div>
      <!-- Product -->
      <div class="bg-[linear-gradient(to_right,_#FF96CF_0%,_#FFEBCF_100%)] relative flex flex-col mt-[117px] z-0">
        <div class="text-left p-[3.7rem]">
          <h1 class="text-[3.5rem] m-0 w-1/2 leading-[5rem]">
            {{ $t('DozenTitle') }}
          </h1>
          <div class="wrapper__sale">
            <p
              class="text-white text-[2rem] font-bold hidden lg:inline-block absolute font-['Sriracha',_sans-serif] -rotate-[30.59deg] top-[60px] right-[466px] ">
              {{ $t('Save') }} 15%
            </p>
            <img src="../../../public/img/Arrow around.svg" alt=""
              class="absolute top-[110px] right-[425px] hidden lg:block" />
            <img src="../../../public/img/Combo cupake.png" id="CupcakeImg9" alt=""
              class="absolute bottom-[63px] right-[80px]" />
            <img src="../../../public/img/2 Star.svg" alt="" class="absolute right-[28px] top-[31px]" />
          </div>
          <div class="wrapper__info">
            <p class="text-[1.3rem] w-1/2 font-bold my-5">
              {{ $t('DozenDes') }}
            </p>
            <p class="text-[1.5rem] font-extrabold m-0">300k/doz</p>

            <base-button class="mt-[31px] !bg-[white] px-[38px] py-[14px] group"><span
                class="text-[#EB6FB2] group-hover:text-white text-3xl" @click="addProduct('dozen')">{{ $t('AddCart')
                }}</span></base-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import baseButton from '../baseButton.vue';
export default {
  components: { baseButton },
  props: {
    CategoryCake: {
      type: String,
    },
    sortMode: {
      type: String,
    },
    showStart: {
      type: Number,
    },
    showEnd: {
      type: Number,
    },
  },
  data() {
    return {};
  },
  computed: {
    products() {
      return this.$store.getters['products/products'];
    },
    productsCategory() {
      if (this.CategoryCake == this.$t('All')) {
        return this.products;
      }

      if (this.$i18n.locale === 'vi') {
        return this.products.filter((x) => x.categoryDes == this.CategoryCake);
      } else {
        return this.products.filter((x) => x.category == this.CategoryCake);
      }
    },
    sortedProducts() {
      const arrayTemp = [...this.productsCategory]
      const sortedProducts = arrayTemp.sort((a, b) => {
        return this.sortMode == 'asc' ? a.price - b.price : b.price - a.price;
      });
      this.$store.dispatch(
        'products/changeNumberProducts',
        sortedProducts.length
      );
      return sortedProducts;
    },
    productsToShow() {
      console.log('sort');
      const start = this.showStart;
      const end = this.showEnd;
      return this.sortedProducts.slice(start, end);
    },
  },

  methods: {
    increaseProduct(id) {
      this.$store.dispatch('products/increaseProduct', id);
    },
    decreaseProduct(id) {
      this.$store.dispatch('products/decreaseProduct', id);
    },
    addProduct(id) {
      let product = {};
      // cần sửa dozen
      if (id == 'dozen') {
        product = {
          id: 'dozen',
          quantity: 1,
        };
      } else {
        const temp = this.products.find((x) => x.id == id);
        console.log(id);

        product = {
          id: temp.id,
          quantity: temp.quantity,
        };
      }
      this.$store.dispatch('cart/addProduct', product);
      this.modalMessage = 'Add to cart successfully';
    },
    handleModel(event) {
      if (event.key == 'Enter') {
        this.$store.dispatch('setAlert', false);
      }
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
    redirect(id) {
      this.$router.push(`/products/${id}`);
    },
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
