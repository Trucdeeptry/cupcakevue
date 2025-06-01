<template>
  <div class="bg-black text-white p-20">
    <div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <div class="m-auto">
          <div>
            <img
              src="../../../public/img/transparent-TO-logo 2.png"   
            />
            <p class="font-bold text-xl my-9 ">
              {{ $t('landingDes') }}
            </p>
          </div>
        </div>
        <div class="m-auto">
          <ul class="text-xl font-semibold ">
            <li class="mb-7 hover:underline" v-for="item,index in navItems" :key="item">
              <a
            :href="index == 0 ? '#menu' : index == 1 ? '#event' : '#'"
            class="font-semibold text-white text-xl"
            >{{ $t(item) }}</a>
            </li>
            
          </ul>
        </div>
        <div class="m-auto">
          <ul>
            <li class="mb-7">
              <a
                href="https://www.facebook.com/trucdeeptry"
                target="_blank"
              >
                <img
                  src="../../../public/img/Logo footer (2).png"
                  alt=""
                />
              </a>
            </li>
            <li class="mb-7">
              <a
                href="https://www.instagram.com/truc.deeptry/"
                target="_blank"
              >
                <img
                  src="../../../public/img/Logo footer (1).png"
                  alt=""
                />
              </a>
            </li>
            <li class="mb-7">
              <a href="#" >
                <img
                  src="../../../public/img/Logo footer (3).png"
                  alt=""
                />
              </a>
            </li>
            <li class="mb-7">
              <a href="#" >
                <img
                  src="../../../public/img/Logo footer (4).png"
                  alt=""
                />
              </a>
            </li>
          </ul>
        </div>
        <div class="m-auto">
          <div>
            <p class="font-bold text-2xl">{{ $t('ContactUs') }}</p>
            <p class="font-bold text-lg my-5">
              {{ $t('Nort') }}
              <a href="#" class="font-light underline"> +1-877-334-9468</a>
            </p>
            <p class="font-bold text-lg my-5">
              {{ $t('South') }}:
              <a href="#" class="font-light underline"> +001-647-478-9464</a>
            </p>
            <p class="font-bold text-lg my-5">
              {{ $t('Middle') }}
              <a href="#" class="font-light underline"> 647-478-9464</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed:{
    navItems(){
      return this.$store.getters['events/navItems']
    }
  }
}
</script>
