<template>
  <button
    :class="{'px-12': length == 'short', 'px-16': length == 'long'}"
    class="btn p-4 px-12 text-white bg-black border-none text-xl cursor-pointer font-bold hover:text-black hover:bg-gradient-to-l from-[#F9D6A6] to-[#F387C1]"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
    props:{length}
}
</script>
