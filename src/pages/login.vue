<template>
  <div class="loginbox">
    <div class="login_content">
      <div class="login_title">在线客服</div>
      <div>
          <el-input v-model="username" placeholder="请输入用户名" class="ipt_s" ></el-input>
      </div>
      <div >
          <el-input v-model="password" placeholder="请输入密码" class="ipt_s" show-password></el-input>
      </div>
      <div>
        <el-button type="primary" class="login_button" @click="chat_login()">登录</el-button>
      </div>
 
    </div>
  </div>
</template>

<script>
import { login } from "@/api/login";
export default {
  data() {
    return {
        username:'',
        password:''
    };
  },
  created() {

  },
  mounted() {},
  methods: {
    // 登录 或者注册
    chat_login() {
        // 判断是登录还是注册事件
      login(this).then(res => {
          if(res.data.success == true) {
                this.$router.push({
                  name: 'current',
              });
          }
      })
    },
  },
};
</script>

<style scoped>
.loginbox {
  width: 100%;
  height: 100vh;
  background-color: darkcyan;
  color: #fff;
  text-align: center;
 position: relative;
}
.login_content {
    position: absolute;
    left: 42%;
    top: 28%;
}
.login_title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 30px;
}

.ipt_s {
    width: 320px;
    height: 48px;
    margin-top: 16px;
}
.login_button {
    width: 220px;
    height: 42px;
    margin-top: 32px;
}
.register {
    font-size: 12px;
    margin-left: 252px;
}
</style>