<template>
  <div class="main">
    <div class="container">
      <div class="header">
        <img src="../../public/img/Vector.png" alt="" class="header_logo" />
        <div class="ml-10">
          <img
            class="w-10 cursor-pointer"
            @click="$i18n.locale = 'en'"
            src="/img/vietnam.png"
            v-if="$i18n.locale === 'vi'"
          />
          <img
            class="w-10 cursor-pointer"
            @click="$i18n.locale = 'vi'"
            src="/img/united-kingdom.png"
            v-else
          />
        </div>
      </div>
      <div class="content">
        <div class="content_main">
          <div class="content_main-wrapper">
            <p class="content_title font-bold !text-3xl uppercase">
              {{ isLoginPage ? $t('Login') : $t('Signup') }}
            </p>
            <div class="content_sign-in">
              <div href="" class="sign-in-wrapper">
                <div ref="ggButton" id="google-button"></div>
              </div>
            </div>
            <p class="content-or">- {{ $t('OR') }} -</p>
            <form @submit.prevent="currentMethod" ref="form">
              <ul class="content_info">
                <li class="info_list" v-if="!isLoginPage">
                  <input type="text" class="info_name" required />
                  <p class="info_placeholder">{{ $t('Name') }}</p>
                </li>
                <li class="info_list">
                  <input
                    type="text"
                    class="info_name"
                    v-model="email"
                    id="email"
                    required
                  />
                  <p class="info_placeholder">{{ $t('Email') }}</p>
                </li>
                <li class="info_list">
                  <input
                    :type="isShowPassword ? 'text' : 'password'"
                    id="password"
                    class="info_name"
                    v-model="password"
                    required
                  />
                  <p class="info_placeholder">
                    {{ $t('Password') }}
                    <span
                      v-if="password.length < 6 && password.length != 0"
                      class="text-red-500"
                      >{{ $t('Than6') }}</span
                    >
                  </p>
                  <img
                    src="../../public/img/blindsvg.svg"
                    alt=""
                    class="password-blind"
                    @click="isShowPassword = !isShowPassword"
                    :class="{
                      'opacity-30': isShowPassword,
                      'opacity-100': !isShowPassword,
                    }"
                  />
                </li>
              </ul>
              <span href="" class="create-wrapper">
                <button
                  type="submit"
                  class="content_action-create uppercase"
                  v-if="isLoginPage"
                >
                  {{ $t('Login') }}
                </button>
                <button
                  type="submit"
                  class="content_action-create uppercase"
                  v-else
                >
                  {{ $t('Signup') }}
                </button>
              </span>
            </form>
            <p class="content_have-account">
              {{ $t('Allready') }}
              <span
                style="color: #8acbce; cursor: pointer"
                href="#"
                id="login"
                class="uppercase"
                @click="isLoginPage = true"
                v-if="!isLoginPage"
                >{{ $t('Login') }}</span
              >
              <span
                style="color: #8acbce; cursor: pointer"
                href="#"
                id="login"
                class="uppercase"
                @click="isLoginPage = false"
                v-if="isLoginPage"
                >{{ $t('Signup') }}</span
              >
            </p>
          </div>
        </div>
        <div class="content_sup">
          <div class="content_sup-info">
            <h2 class="content_sub-text text-3xl !font-bold">
              The website was built by Phan Tan Truc. Hope you enjoy it
            </h2>
          </div>
          <img
            src="../../public/img/Abstraction.png"
            alt=""
            class="relative left-32 z-[-1] 2xl:z-0"
          />
        </div>
      </div>
    </div>
    <base-modal width="500px" :title="title">
      <div>
        <p class="text-center p-6">{{ err }}</p>
      </div>
    </base-modal>
  </div>
</template>

<script>
import baseModal from '../base/baseModal.vue';
export default {
  components: { baseModal },
  data() {
    return {
      isLoginPage: true,
      title: '',
      err: '',
      isShowPassword: false,
      email: '',
      password: '',
    };
  },
  computed: {
    currentMethod() {
      if (this.isLoginPage) {
        return this.signIn;
      }
      return this.signUp();
    },
  },
  methods: {
    decodeJwtResponse(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    },
    handleCredentialResponse(response) {
      const responsePayload = this.decodeJwtResponse(response.credential);

      if (responsePayload) {
        this.$store.dispatch('login/pushInfo', {
          token: responsePayload.jti,
          userId: responsePayload.sub,
          expires: responsePayload.exp,
          email: responsePayload.email,
          img: responsePayload.picture,
          name: responsePayload.name,
        });
        // localStorage.setItem('token', responsePayload.jti);
        // localStorage.setItem('userId', responsePayload.sub);
        // localStorage.setItem('email', responsePayload.email);
        // localStorage.setItem('name', responsePayload.name);
        // localStorage.setItem('img', responsePayload.picture);
        const expiresIn = +responsePayload.exp;
        const expirationDate = new Date().getTime() + expiresIn;        
        localStorage.setItem('expires', expirationDate);
        
        const redirectUrl = '/' + (this.$route.query.redirect || 'home');
        this.$router.replace(redirectUrl);
        
      }
    },
    async signIn() {
      try {
        await this.$store.dispatch('login/signIn', {
          email: this.email,
          password: this.password,
        });
        this.$toast.add({
          severity: 'success',
          summary: 'Thành công!',
          detail: 'Đăng nhập thành công!',
          life: 3000,
        });
        const redirectUrl = '/' + (this.$route.query.redirect || 'home');
        this.$router.replace(redirectUrl);
      } catch (error) {
        this.$store.dispatch('setModal', true);
        this.title = 'Đăng nhập thất bại';
        this.err = error.message || 'Vui lòng kiểm tra lại email và mật khẩu';
      }
    },
    async signUp() {
      try {
        await this.$store.dispatch('login/signUp', {
          email: this.email,
          password: this.password,
        });
        this.$toast.add({
          severity: 'success',
          summary: 'Thành công!',
          detail: 'Đăng ký thành công!',
          life: 3000,
        });
      } catch (error) {
        this.$store.dispatch('setModal', true);
        this.title = 'Đăng ký thất bại';
        this.err = error.message || 'Thất bại khi đăng kí';
      }
    },
  },
  mounted() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id:
          '343843909589-d7re2d6muq945af426ahrfla5p9bhdfe.apps.googleusercontent.com',
        callback: this.handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        this.$refs.ggButton,
        { theme: 'filled_blue', size: 'medium', width: '200' } // customization attributes
      );
      // window.google.accounts.id.prompt();
    };
    script.onerror = () => {
      console.log('Failed to load Google Identity Services library.');
    };
    document.head.appendChild(script);
  },
};
</script>

<style scoped>
input {
  background-color: transparent;
}

/* mobile */
/* @media (max-width: 739px) {
  .container {
    height: 570px;
  }
  .content_sup {
    display: block;
    height: 500px;
    width: 100vw;
    margin: auto;
    z-index: 0;
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center;
  }
  .content_img {
    margin-left: 0;
    width: 550px;
  }
  .content_title {
    text-align: center;
  }
  .header {
    align-items: center;
  }
  .header_language {
    color: white;
  }
  .content_main {
    margin-top: 550px;
    height: 100%;
    width: 100%;
    border-radius: 8px;
  }
  .content_img {
    margin: 0;
    display: inline-block;
  }
  .content_sub-text {
    margin: 0 25px;
  }
  .content_sign-in {
    display: block;
    width: calc(100vw - 50px);
  }
  .sign-in-wrapper {
    display: flex;
    justify-content: center;
    margin-right: 0px;
  }
  .content_main-wrapper {
    width: calc(100vw - 50px);
  }
  .sign-in-with {
    margin-bottom: 20px;
  }
  .content_main-wrapper {
    margin: 0 25px;
  }
  .content_action-create {
    width: calc(100vw - 50px);
  }
} */

/* tablet */
/* @media (min-width: 740px) and (max-width: 1023px) {
  .container {
    height: 1000px;
  }
  .content_sup {
    display: inline-block;
    height: 550px;
    width: 100vw;
    margin-left: 0;
    margin-top: 25px;
    text-align: center;
  }
  .content_sub-text {
    text-align: center;
  }
  .content_img {
    margin: 0;
    display: inline-block;
  }

  .header {
    align-items: center;
  }
  .header_language {
    margin-right: 25px;
    color: white;
  }
  .content_main {
    margin-top: 700px;
    height: 100%;
    width: 100%;
    border-radius: 8px;
  }
} */
/* FIX PC */
/* @media (min-width: 1024px) and (max-width: 1400px) {
  .container {
    height: 1000px;
  }
  .content_sup {
    display: block;
    height: 550px;
    width: 550px;
    margin: auto;
    margin-top: 50px;
  }
  .content_img {
    margin: 0;
  }

  .header {
    align-items: center;
  }
  .header_language {
    margin-right: 25px;
    color: white;
  }
  .content_main {
    margin-top: 700px;
    height: 100%;
    width: 100%;
    border-radius: 8px;
  }
} */

.container {
  width: 100vw;
  height: 100vh;
  display: block;
  background-color: #b0d8da;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 20px 25px;
  position: relative;
  background-color: transparent;
  z-index: 1;
}

.header_language {
  display: flex;
  color: #a1a1a1;
  cursor: pointer;
  position: relative;
}
.header_language:hover .language_choose {
  display: block;
}
.language_choose {
  width: 150px;
  position: absolute;
  min-height: 100px;
  background-color: #8acbce;
  top: 25px;
  right: 0;
  border-radius: 8px;
  text-align: center;
  align-items: center;
  display: none;
  z-index: 1;
}
.language_choose::before {
  display: block;
  content: '';
  width: 120px;
  height: 20px;
  position: absolute;
  top: -15px;
  right: 0;
}
.language-text {
  display: block;
  text-decoration: none;
  color: white;
  padding-bottom: 15px;
  font-size: 14px;
}
.language-text:first-child {
  margin-top: 15px;
}
.language-text:hover {
  color: #ccf7fa;
}
.header_language-text {
  font-size: 14px;
}
.header_language-menu {
  margin-left: 8px;
}
.content_main {
  top: 0;
  right: 0;
  width: 1000px;
  height: 100%;
  background-color: white;
  position: absolute;
  border-bottom-left-radius: 36px;
  border-top-left-radius: 36px;
}
.content_main-wrapper {
  margin: auto;
  width: 405px;
  margin-top: 104px;
}
.content_sup {
  margin-left: 25px;
  margin-top: 25px;
  width: 400px;
}
.content_sign-in {
  display: flex;
  justify-content: space-between;
}

.sign-in-with {
  width: 188px;
  height: 45px;
  border-radius: 8px;
  border: 2px solid #e6e6e6;
  display: flex;
  align-items: center;
}
.sign-in-with:hover {
  background-color: #8acbce;
  border-color: #2ca3aa;
}
.sign-in-with:hover .sign-in_text {
  color: white;
}
.sign-in-wrapper {
  text-decoration: none;
}
.sign_in-icon {
  margin: 12px;
}
.sign-in_text {
  font-size: 12px;
  color: #5a5a5a;
  font-weight: 200;
}
.content-or {
  display: flex;
  justify-content: center;
  margin-top: 29px;
  margin-bottom: 35px;
  font-size: 18px;
  color: #a3a3a3;
}
.info_list {
  list-style: none;
  position: relative;
}
.info_name {
  width: 100%;
  border: none;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 40px;
  outline: none;
}
.info_name:focus ~ .info_placeholder,
.info_name:valid ~ .info_placeholder {
  top: -25px;
}
.info_name:focus {
  border-bottom: 1px solid #8acbce;
}

.info_placeholder {
  position: absolute;
  top: -10px;
  font-size: 15px;
  transition: ease 0.5s;
}
.opacity_5 {
  opacity: 0.5;
}
.opacity_1 {
  opacity: 1;
}

.password-blind {
  position: absolute;
  top: -5px;
  right: 0;
  cursor: pointer;
  background-color: white;
}
.info_name::placeholder {
  color: #9d9d9d;
  font-size: 16px;
  font-weight: 100;
}
.content_title {
  font-size: 24px;
  margin-bottom: 29px;
}

.content_sub-text {
  color: white;
  font-weight: 300;
}
.content_img {
  margin-top: 35px;
  margin-left: 150px;
  z-index: 1;
}
.create-wrapper {
  text-decoration: none;
}
.content_action-create {
  margin-top: 16px;
  margin-bottom: 25px;
  width: 405px;
  height: 45px;
  border-radius: 8px;
  background-color: #8acbce;
  border: none;
  color: white;
  font-weight: 800;
  font-size: 16px;
  cursor: pointer;
}
.content_action-create:hover {
  background-color: #8acbce;
  opacity: 0.9;
}
.content_have-account {
  color: #9d9d9d;
}
.content_have-account a {
  text-decoration: none;
  color: #8acbce;
}
.content_have-account a:hover {
  text-decoration: underline;
}
</style>
