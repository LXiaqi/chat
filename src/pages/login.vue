<template>
  <div class="loginbox">
    <div class="login_content">
      <div class="login_title">{{types == 1 ? '法务登录' : '注册账号'}}</div>
      <div>
          <el-input v-model="username" placeholder="请输入用户名" class="ipt_s" ></el-input>
      </div>
      <div >
          <el-input v-model="password" placeholder="请输入密码" class="ipt_s" show-password></el-input>
      </div>
      <div v-show="types == 2">
        <el-radio v-model="gender" label="1">男</el-radio>
        <el-radio v-model="gender" label="0">女</el-radio>
      </div>
      <div class="register" @click="register()">{{types == 1 ? '注册账号' : '账号登录'}}</div>
      <div>
        <el-button type="primary" class="login_button" @click="chat_login()">{{types == 1 ? '登录' : '注册'}}</el-button>
      </div>
 
    </div>
  </div>
</template>

<script>
import { login,userRegister } from "@/api/login";
export default {
  data() {
    return {
        gender:'0',// 性别 1男 0女
        types:1,// 1是登录，2是注册
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
        if(this.types == 1) {
            login(this).then(res => {
                if(res.data.success == true) {
                     this.$router.push({
                        name: 'current',
                        query:{id: res.data.data.Id,name:res.data.data.UserName}
                    });
                }
            
            })
        }else {
            userRegister(this).then(res => {
                console.log(res);
                this.types = 1;
            })
        }
        
    },
    // 注册样式的切换
    register() {
        this.password = '';
        this.username = '';
        if(this.types == 1) {
            this.types = 2; // 更改状态
        }else {
             this.types = 1; // 更改状态
        }
        
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