<template>
  <div
  class="bg-gradient-to-br fixed from-gray-800 to-gray-900 m-4 -translate-x-80  inset-0 my-4 ml-4 h-[calc(100vh-32px)] w-72 z-10 rounded-xl transition-transform duration-300 xl:translate-x-0 block"
  >
    <div class="relative  border-b border-white/20">
      <a class="flex items-center gap-4 py-6 px-8" href="#/">
        <h6
          class="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white"
        >
          Quản lý cửa hàng bánh ngọt
        </h6>
      </a>
      <button
        class="middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-white/10 active:bg-white/30 absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
        type="button"
      >
        <span
          class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
            aria-hidden="true"
            class="h-5 w-5 text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </span>
      </button>
    </div>
    <div class="m-4">
      <ul class="mb-4 flex flex-col gap-1">
        <li v-for="item in button" :key="item.route">
          <router-link :to="'/admin/' + item.route">
            <button
              class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize"
              type="button"
              :class="{
                'rounded-lg bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]':
                  $route.path.includes(item.route),
              }"
            >
              <img :src="item.link" class="w-5 h-5" alt="" />
              <p
                class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize"
              >
                Quản lý {{ item.display }}
              </p>
            </button>
          </router-link>
        </li>
      </ul>
      <ul class="mb-4 flex flex-col gap-1">
        <li class="mx-3.5 mt-4 mb-2">
          <p
            class="block antialiased font-sans text-sm leading-normal text-white font-black uppercase opacity-75"
          >
            auth pages
          </p>
        </li>
        <li>
          <a>
            <button
              class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize"
              @click="signOut"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                class="w-5 h-5 text-inherit"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <p
                class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize"
              >
                Sign out
              </p>
            </button>
          </a>
        </li>
        <li>
          <a>
            <button
              class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize"
              @click="$router.push('/login');"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                class="w-5 h-5 text-inherit"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <p
                class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize"
              >
                Home
              </p>
            </button>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    signOut() {
      this.$store.dispatch('login/signOut');
      this.$router.push('/login');
    },
  },
  data() {
    return {
      button: [
        {
          route: 'dashboard',
          link: '/img/home.png',
          display: 'dashboard',
        },
        {
          route: 'khachhang',
          link: '/img/accountAdmin.png',
          display: 'khách hàng',
        },
        {
          route: 'sanpham',
          link: '/img/box.png',
          display: 'sản phẩm',
        },
        {
          route: 'danhmuc',
          link: '/img/tag.png',
          display: 'danh mục',
        },
        {
          route: 'nhacungcap',
          link: '/img/production.png',
          display: 'nhà cung cấp',
        },
        {
          route: 'nhanvien',
          link: '/img/team.png',
          display: 'nhân viên',
        },
        {
          route: 'donhang',
          link: '/img/order.png',
          display: 'dơn hàng',
        },
      ],
    };
  },
};
</script>
