<template>
  <div class="chat">
    <van-nav-bar
      class="nav_bar_chat"
      safe-area-inset-top
      title="客服留言"
      left-text=""
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="chat_content">
        <div class="frombox">
            <div class="group">
                <label for="">内容</label>
                <van-field v-model="msg"  placeholder="请输入内容" />   
            </div>
            <div class="group">
                <label for="">联系方式</label>
                <van-field v-model="phone" type="tel" placeholder="请输入手机号" />   
            </div>
            <div class="area_box">
                <label for="">详情描述</label>
                <van-field class="testarea_s" v-model="details" rows="8" type="textarea"  placeholder="请输入内容" />   
            </div>
            <van-button class="btn" type="default" round @click="submitMsg()">确定</van-button>
        </div>
    </div>
  </div>
</template>

<script>
import { sendMessage } from "@/api/leaveMessage";
export default {
  data() {
    return {
        msg:'', // 内容
        phone:'', // 手机号
        details:'', //详情
        id:'',
    }
  },
  created() {
      this.id = this.$route.query.id;
  },
  mounted() {
  },
  methods: {
    // 返回
    onClickLeft() {

    },
    // 确定
    submitMsg() {
        sendMessage(this).then(res => {
            console.log(res);
            this.details = '';
            this.phone = '';
            this.msg = '';
        })
    }
  },
};
</script>

<style scoped>
.nav_bar_chat {
  position: fixed;
  width: 100vw;
  height: 6.3vh;
  line-height: 6.3vh;
}
.chat_content {
  width: 100%;
  height: 93.7vh;
  background-color: #fff;
  overflow: hidden;
  overflow-y: scroll;
  padding-top: 6.3vh;
}
.frombox {
    margin: 20px;
}
.group {
    border-bottom: 1px solid #ccc;
    margin-top: 15px;
}
.area_box{
    margin-top: 15px;
}
.label {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #000000;
    opacity: 0.9;
}
.testarea_s {
    background: #F3F3F3;
    border-radius: 6px;
    margin-top: 15px;
}
.btn {
    width: 100%;
    background: linear-gradient(-5deg, #006EDC 0%, #2698EF 100%);
    color: #fff;
    margin-top: 50px;
}
</style>