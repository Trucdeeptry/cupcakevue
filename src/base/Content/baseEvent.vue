<template>
  <div
  id="event"
    class="border-b-2 border-black text-center flex items-center px-[0] pb-[50px] justify-around w-full"
  >
    <div class="event_wrapper">
      <h2 class="text-[60px] font-light my-10">
        {{ $t('SpecialEvent') }}
      </h2>
      <div class="mx-8 my-[0] flex">
        <div
          class="sm:flex -ml-[12px] -mr-[12px] justify-between [flex-wrap:initial!important] overflow-hidden"
        >
          <div
            ref="product"
            class="pl-[12px] pr-[12px] sm:w-1/4 w-full flex-shrink-0 p-[20px] [transition:ease_0.5s] cursor-pointer"
            :style="translateCSS"
            v-for="(event, index) in events"
            :key="event"
            @click="chooseEnvent(event.ten_dm)"
          >
            <div class="inline">
              <div
                class="relative bg-[white] p-[5px] animate-[Down_0.5s] hover:-top-[20px] hover:animate-[Up_0.5s]"
              >
                <img
                  :src="`/img/event-img (${index + 1}).png`"
                  class="w-full"
                />
                <p class="text-[17px] font-black uppercase my-5 h-[2rem]">
                  {{ $i18n.locale === 'vi' ? event.mo_ta : event.ten_dm }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isDisplayRightArrow" class="flex items-center">
          <a class="inline" @click="translate">
            <img
              src="../../../public/img/arrow.png"
              alt=""
              class="ml-[69px] cursor-pointer"
            />
          </a>
        </div>
        <div v-else class="flex items-center">
          <a class="inline" @click="translate">
            <img
              src="../../../public/img/arrow.png"
              alt=""
              class="cursor-pointer [transform:rotateY(180deg)] ml-[69px]"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDisplayRightArrow: true,
      currentProduct: 4,
      translateValue: 0,
    };
  },
  computed: {
    translateCSS() {
      return {
        transform: `translateX(${this.translateValue}px)`,
      };
    },
    events(){
      return this.$store.getters['events/events']
    }
  },
  methods: {
    translate() {
      if (this.isDisplayRightArrow) {
        this.translateValue -= this.$refs.product[0].offsetWidth;
        this.currentProduct++;
      } else {
        this.currentProduct--;
        this.translateValue += this.$refs.product[0].offsetWidth;
      }
      if (this.currentProduct == this.events.length) {
        this.isDisplayRightArrow = false;
      }
      if (this.currentProduct == 4) {
        this.isDisplayRightArrow = true;
      }
    },
    chooseEnvent(cate){
      this.$store.dispatch('products/chooseCate', cate)
      this.$router.push('/products')
    }
  },
};
</script>

<style>
@keyframes Down {
  from {
    top: -20px;
  }

  to {
    top: 0px;
  }
}
@keyframes Up {
  from {
    top: 0;
  }

  to {
    top: -20px;
  }
}
</style>
