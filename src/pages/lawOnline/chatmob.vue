<template>
  <div class="chat">
    <van-nav-bar
      class="nav_bar_chat"
      safe-area-inset-top
      title="在线客服"
      left-text=""
      left-arrow
      @click-left="onClickLeft"
    
    />
    
    <div :class="bottom_type == false ? 'chat_content' : 'chat_content2' " ref="content_view_m">
      <div v-for="(item,index) in chatList" :key="index" class="chat_mob">
        <div v-show="item.Types == 0" class="chat_mob_left">
            <div class="chat_details_info_box">
                <img class="chat_active_img"  src="./../../assets/img/waiters/avatar_group.png" alt="">
                <span class="chat_details_sentence" v-show="!item.img"> {{item.Message}}</span>
                 <img class="chatimg_s" :src="item.Message" alt="" v-if="item.img" @click="amplification(item.Message)">
            </div>
           
        </div>
        <div v-show="item.Types == 1" class="chat_mob_right">
            <div class="chat_details_info_box">
               <span class="chat_details_sentence_s" v-show="!item.img">
                    {{item.Message}}
                </span>
                <img class="chatimg_s" :src="item.Message" alt="" v-if="item.img" @click="amplification(item.Message)">
                <img class="chatimg_" src="./../../assets/img/waiters/avatar_group.png" alt="">
            </div>
        </div>
      </div>
    </div>
    <div class="chat_input_box">
       <van-field class="chat_ipt" v-model="value"  placeholder=""  />
       <img class="chat_add_icon" src="./../../assets/img/chatmob/add.png" alt="" srcset="" v-show="!sendBtnType" @click="add_img()">
       <van-button  v-show="sendBtnType" class="chat_add_send" type="primary" @click="send()">发送</van-button>
    </div>
    <div class="img_box" v-show="bottom_type" safe-area-inset-bottom>
      <el-upload
          class="avatar-uploader"
          action="/Communication/UploadFiles"
          :show-file-list="false"
          :on-success="handleAvatarSuccess">
          <img src="../../assets/img/chatmob/img_file.png" alt="" >
      </el-upload>
    </div>
  </div>
</template>

<script>
import { GetUserData,distribution, } from "@/api/waiters";
import { ImagePreview } from 'vant';
export default {
  data() {
    return {
      types_user:'1',
      searchid:'1601',
      value:'',//输入框内容
      send_name:'', //发送方名字
      send_id:'', //发送方id
      receive_id:'',// 对方的客服id
      bottom_type:false, //底部状态
      chatList:[],//聊天内容列表
      sendBtnType:false, // 发送按钮的隐藏显示
      file:'',
      demoChatHubProxy:{},

    }
  },
  created() {
        const _this = this;
        var connection = $.hubConnection("");
        _this.demoChatHubProxy = connection.createHubProxy("chatHub");  
          //接收私聊消息
         _this.demoChatHubProxy.on("remindMsg", function (sendId,sengName, message,img) {
           console.log('接收私聊消息');
            console.log('发送方id：'+sendId+'接收方id:'+sengName+'消息内容：' + message);
             let data = {
               CustomerId:sendId,
               CustomerName:sengName,
               Message:message,
               Types:0,
               img:img
           }
           _this.chatList.push(data)
            _this.$refs.content_view_m.scrollTop = _this.$refs.content_view_m.scrollHeight
        });
             //显示发送的私聊消息
        _this.demoChatHubProxy.on('showMsgToPages',function(sendId, sengName, message,img){
           console.log(sendId+sengName+message);
           console.log('显示发送的私聊消息');
          let data = {
               UserId:sendId,
               UserName:sengName,
               Message:message,
               Types:1,
               img:img
          }
              _this.chatList.push(data);
              _this.$refs.content_view_m.scrollTop = _this.$refs.content_view_m.scrollHeight
       },); 
      connection
        .start()
        .done(function () {
           _this.$toast.success('连接成功');
           distribution(_this).then(res => {
             _this.receive_id = res.data.data.UserId;
              _this.demoChatHubProxy.invoke("addOnlineUser", _this.send_id,_this.send_name,1);
              console.log('建立连接会话');
           })
          
       
        })
        .fail(function () {
          _this.$toast.fail('连接失败');
        });
  },
  watch:{
    value:function(newV,oldV){
        if(newV == '') {
          this.sendBtnType = false;
        }else {
          this.sendBtnType = true;
        }
       
    }
  },
  mounted() {
    this.info();
  },
  methods: {
    // 返回
    onClickLeft() {

    },
    info() {
      GetUserData(this).then(res => {
        console.log(res);
        this.send_name = res.data.sendName
        this.send_id = res.data.sendId;
        
      })
    },
    //发送
    send() {
      console.log('发送id：'+this.send_id+',接收id：'+this.receive_id);
       this.demoChatHubProxy.invoke('sendPrivateMsg',this.send_id,this.receive_id,this.value,1,false); 
        this.value = '';
     
     
    },
    //底栏状态切换
    add_img() {
      if(this.bottom_type == false) {
          this.bottom_type = true;
      }else {
          this.bottom_type = false;

      }
    },
   // 图片上传
    handleAvatarSuccess(res,file) {
      this.file ='https://files.365lawhelp.com/'+res.data;
      this.sendBtnType = true;
       this.demoChatHubProxy.invoke('sendPrivateMsg',this.send_id,this.receive_id,this.file,1,true); 
        this.bottom_type = false;
        this.sendBtnType = false;
    },
    // 图片放大
    amplification(img) {
       ImagePreview([img]);
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
  height: 85vh;
  background-color: #F2F2F2;
  overflow: hidden;
  overflow-y: scroll;
  padding-top: 6.3vh;
}
.chat_content2 {
   width: 100%;
  height: 70vh;
  background-color: #F2F2F2;
  overflow: hidden;
  overflow-y: scroll;
  padding-top: 6.3vh;
}
.chat_input_box {
  background-color: #F5F5F5;
  height: 8.6vh;
  position: relative;
  
}
.chat_ipt {
  width: 74vw;
  height: 33px;
  padding: 4px;
  margin-left: 16px;
  border-radius: 8px;
  top: 14px;
}
.chat_add_icon {
  width: 28px;
  height: 28px;
  position: absolute;
  right: 28px;
  top: 17.5px;
}
.chat_add_send {
   width: 58px;
  height: 28px;
  line-height: 28px;
  position: absolute;
  right: 16px;
  top: 17.5px;
  font-size: 12px;
  border-radius: 4px;
}
.img_box {
  background-color: #F5F5F5;
  height: 14.8vh;
  border-top: 1px solid #ccc;
}
.img_box img {
  padding: 18px 32.5px;
  width: 52.5px;
  height: 52.5px;
}

/* 聊天详情 */
/* 聊天细节 */
.chat_mob_right {
    text-align: end;
    margin-inline-end: 16px;
   
    padding: 12px 0;
}
.chat_mob_left {
    
    padding: 12px 12px;
}
.chatimg_{
  width: 40px;
  height: 40px;
  border-radius: 50%;
   vertical-align: top;
}
.chat_active_img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
   vertical-align: top;
}
.chatimg_s {
  width: 130px;
  vertical-align: top;
}
.chat_details_sentence_s {
  background: #0a80FF;
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px 0px 8px 8px;;
  display: inline-block;
  margin: 0 12px;
  max-width: 200px;
  word-wrap: break-word;
}
.chat_details_sentence {
  background: #fff;
  padding: 6px 10px;
  border-radius: 8px 0px 8px 8px;;
  display: inline-block;
  margin: 0 12px;
   max-width: 200px;
  word-wrap: break-word;
}
</style>