<template>
  <div>
    <input type="text" placeholder="用户名" v-model="userName" />
    <input type="text" placeholder="密码" v-model="userPwd" />
    <input type="text" placeholder="验证码" v-model="validateCode" />
    <img style="height: 20px" :src="imgUrl" alt="验证图片" />
    <button @click="login">登录</button>
  </div>
</template>

<script>
import { BASE_URL } from './http';
export default {
  data() {
    return {
      userName: '',
      userPwd: '',
      validateCode: '',
      imgUrl: ''
    };
  },
  methods: {
    login() {
      this.$http.post('/ajaxLogin', {
        account: this.userName,
        pwd: this.userPwd,
        code: this.validateCode
      });
    }
  },

  created() {
    this.imgUrl = `${BASE_URL}/validateCode?date=${+new Date()}`;
  }
};
</script>

<style></style>
