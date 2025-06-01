<template>
  <div class="mt-20 border-b-[2px_solid_black] border-b-2 border-black pb-48">
    <div class="inline-block text-8xl mt-36">
      <h1 class=" inline-block">
        Toronto
        <p
          class="bg-[linear-gradient(to_left,_#F9D6A6_0%,_#F387C1_100%)] bg-clip-text text-transparent leading-[10rem] inline-block ml-[14px]"
        >
          Cupcake
      </p>
      </h1>
    </div>
    <img
      src="../../../public/img/right dev.png"
      alt=""
      class="w-[40%] float-right my-auto mx-0"
    />

    <div>
      <p class="text-2xl font-semibold my-9">
        {{ $t('landingDes') }}
      </p>

      <div class="mt-14 items-center flex">
        <a href="#menu">
          <base-button length="long">{{ $t('Ordernow') }}</base-button>
        </a>
        <div class="flex ml-[4.3rem] items-center">
          <img src="../../../public/img/Calling.svg" class="h-6" />
          <a href="" class="text-[1.5rem] text-[#EB6FB2] underline ml-[1.6rem]">647-478-9464</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import baseButton from '../baseButton.vue';
export default {
    components:{baseButton}
}
</script>