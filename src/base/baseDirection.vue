<template>
    <div class="bg-white h-20 w-screen -mx-24 my-14 flex items-center">
        <div class="flex px-32 font-bold text-[#FF96CF] ">
            <img src="../../public/img/Link.png" class="w-5 h-5 mr-1" alt="">
            <router-link class="hover:underline cursor-pointer" to="/home">{{ $t('Home') }}</router-link>
            <span class="mx-3">></span>
            <router-link :to="'/'+firstRoute" class="cursor-pointer hover:underline capitalize">{{ $t(firstRoute) }}</router-link>
            <div v-if="productId" class="mx-3 cursor-pointer">
                <span>></span>
                <router-link :to="$route.path">
                    <span class="mx-3  hover:underline">Cupcake {{ getName }}</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        computed:{
            productId(){
                return this.$route.params.productId
            },
            firstRoute(){
                return this.$route.path.split('/').filter(Boolean)[0]
            },
            getName(){
                const productsName = this.$store.getters['products/getProduct']
                return productsName(this.productId).name
            }
        }
    }
</script>