<template>
  <div>
    <base-nav></base-nav>
    <base-direction class="mb-0"></base-direction>
    <img class="my-20" src="../../public/img/productsimg.png" alt="banner" />
    <div>
      <div class="flex items-center justify-between">
        <div
          class="flex items-center bg-[#FCC5E3] p-2 pl-8 cursor-pointer rounded-lg"
        >
          <img src="../../public/img/align-left.svg" class="mr-3" alt="" />
          <button
            class="font-bold text-xl flex items-center"
            @click="handleCategory"
          >
            <span>{{ $t('Events') }}</span>
            <img
              class="mx-3"
              :class="{ 'rotate-180': !category }"
              src="../../public/img/Vector.svg"
            />
          </button>
        </div>
        <div class="flex justify-between my-3">
          <div
            class="flex cursor-pointer items-center bg-white rounded-lg p-3 mr-5"
          >
            <img src="../../public/img/Icon.svg" class="mx-2" alt="" />
            <span>{{ $t('Show') }}:</span>
            <select id="show" v-model.number="productsPerPage" name="show">
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="12">12</option>
              <option value="16">16</option>
              <option value="20">20</option>
              <option value="32">32</option>
            </select>
          </div>
          <div class="flex cursor-pointer items-center bg-white rounded-lg p-3">
            <img src="../../public/img/sort.svg" class="mx-2" alt="" />
            <span>{{ $t('Sort') }}: </span>
            <select id="sort" name="sort" v-model="sortMode">
              <option value="des">{{ $t('Des') }}</option>
              <option value="asc" selected>{{ $t('Asc') }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="bg-[#FFB1E4]/10 shadow-2xl  px-14 py-10">
        <transition tag="div" name="translateY">
          <div class="flex items-center" v-show="category">
            <img
              src="../../public/img/arrow.svg"
              @click="translate('left')"
              class="cursor-pointer rotate-180"
              alt=""
            />

            <div class="flex mx-8 gap-10 overflow-hidden relative">
              <div
                :style="translateCSS"
                class="bg-black w-28 py-2 [transition:transform_ease_0.5s] ml-10 flex items-center justify-center flex-shrink-0 text-center rounded-full text-white"
                @click="chooseCate($t('All'))"
                :class="{
                  'border-[5px] border-[#FA5198]': activeCate == $t('All'),
                }"
              >
                <p>{{ $t('All') }}</p>
              </div>

              <div
                ref="category"
                :style="translateCSS"
                class="bg-black py-2 flex [transition:transform_ease_0.5s] items-center justify-center w-56 flex-shrink-0 px-3 text-center rounded-full text-white"
                @click="
                  chooseCate($i18n.locale === 'vi' ? event.mo_ta : event.ten_dm)
                "
                v-for="event in categoryList"
                :key="event"
                :class="{
                  'border-[5px] border-[#FA5198]': activeCate == ($i18n.locale === 'vi' ? event.mo_ta : event.ten_dm),
                }"
              >
                <p>
                  {{ $i18n.locale === 'vi' ? event.mo_ta : event.ten_dm }}
                </p>
              </div>
              <div
                class="absolute top-0 right-0 h-full w-44 pointer-events-none bg-gradient-to-l from-[#ffedf9] to-transparent"
              ></div>
              <div
                class="absolute top-0 left-0-0 h-full w-20 rotate-180 pointer-events-none bg-gradient-to-l from-[#ffedf9] to-transparent"
              ></div>
            </div>

            <img
              src="../../public/img/arrow.svg"
              @click="translate('right')"
              class="cursor-pointer"
              alt=""
            />
          </div>
        </transition>

        <base-menu
          class="mt-0"
          :showStart="start"
          :showEnd="end"
          :CategoryCake="activeCate"
          :sortMode="sortModeComputed"
        >
          <div class="items-center flex justify-center">
            <div v-for="page in totalPage" :key="page">
              <button
                class="p-3 px-7 bg-[#FFC5CE] rounded-2xl text-xl mx-4 mt-24"
                :class="{ 'border-2 border-[#EB6FB2]': currentPage == page }"
                @click="currentPage = page"
              >
                {{ page }}
              </button>
            </div>
          </div>
        </base-menu>
      </div>
    </div>
  </div>
</template>

<script>
import BaseDirection from '../base/baseDirection.vue';
import baseNav from '../base/Content/baseNav.vue';
import baseMenu from '../base/Content/baseMenu.vue';
export default {
  components: { baseNav, BaseDirection, baseMenu },
  data() {
    return {
      category: true,
      productsPerPage: 8,
      currentPage: 1,
      sortMode: 'des',
      translateValue: 0,
    };
  },
  computed: {
    sortModeComputed() {
      return this.sortMode;
    },
    categoryList() {
      return this.$store.getters['events/events'];
    },
    translateCSS() {
      return {
        transform: `translateX(${this.translateValue}px)`,
      };
    },
    numberOfProducts() {
      return this.$store.getters['products/numberOfProducts'];
    },
    totalPage() {
      return Math.ceil(this.numberOfProducts / this.productsPerPage);
    },
    start() {
      return (this.currentPage - 1) * this.productsPerPage;
    },
    end() {
      return this.start + this.productsPerPage;
    },
    activeCate() {
      return this.$store.getters['products/activeCate'];
    },
  },
  watch: {
    productsPerPage(newValue) {
      const newTotalPage = Math.ceil(this.numberOfProducts / newValue);
      if (this.currentPage > newTotalPage) {
        this.currentPage = 1;
      }
    },
    activeCate(newValue) {
      this.changeCategory(newValue);
    },
  },
  methods: {
    handleCategory() {
      this.category = !this.category;
    },
    chooseCate(cate) {
      this.$store.dispatch('products/chooseCate', cate);
    },
    translate(direction) {
      const widthElement = this.$refs.category[0].offsetWidth;
      const listLength = this.$refs.category.length;
      if (direction == 'right') {
        if (
          !(
            this.translateValue - widthElement <
            -widthElement * (listLength - 3)
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
    changeCategory(newValue) {
      const widthElement = this.$refs.category[0].offsetWidth;
      const index = this.categoryList.findIndex((x) => x == newValue);
      const lengthList = this.categoryList.length;

      if (newValue == this.categoryList[lengthList - 1]) {
        this.translateValue = widthElement * (length - 4);
      }
      if (index !== -1) {
        const maxTranslate = widthElement * (this.categoryList.length - 3);
        const translatePosition = -index * widthElement + widthElement;
        if (
          translatePosition < 0 &&
          Math.abs(translatePosition) <= maxTranslate
        ) {
          this.translateValue = translatePosition;
        } else if (translatePosition > 0) {
          this.translateValue = 0;
        }
      }
    },
  },
  mounted() {
    if (!this.$store.getters['events/events'].length) {
      this.$store.dispatch('events/getEvents');
    }

    if (!this.$store.getters['products/products'].length) {
      this.$store.dispatch('products/getProducts');
    }
  },
};
</script>
