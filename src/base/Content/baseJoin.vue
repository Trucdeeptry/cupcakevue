<template>
  <div class="text-center">
    <h2 class="text-[60px] font-light my-10">{{ $t('Join') }}</h2>

    <div>
      <input
        type="email"
        class=" text-[1.5rem] w-[551px] h-[64px] bg-transparent outline-[none] border-[2px] border-[solid] border-[black] mr-[1.6rem] [text-indent:20px]"
        :placeholder="$t('EnterEmail')"
      />
      <base-button ><span class="text-2xl">{{ $t('Subcribe') }}</span></base-button>
    </div>
  </div>
</template>

<script>
import baseButton from '../baseButton.vue';
export default {
  components: { baseButton },
};
</script>
