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
      <div class="more" v-show="more_type">
        <span v-show="more_show" @click="more()">加载更多</span>
        <van-loading v-show="!more_show" color="#1989fa" size="18" />
      </div>
      <div v-for="(item,index) in chatList" :key="index" class="chat_mob">
        <div v-if="(item.Types == 0 || item.Types == 2) && item.State != 2" class="chat_mob_left">
            <div class="chat_details_info_box">
                <img class="chat_active_img"  src="./../../assets/img/waiters/avatar_group.png" alt="">
                <span class="chat_details_sentence" v-show="item.State == 0"> {{item.Message}}</span>
                 <img class="chatimg_s" :src="item.Message" alt="" v-if="item.State == 1" @click="amplification(item.Message)">
            </div>
        </div>
        <div v-if="(item.Types == 0 || item.Types == 2) && item.State == 2" class="evaluate">
          <van-radio-group v-model="item.Satisfaction" direction="horizontal" @change="groupchange($event)" :disabled="item.btntype">
            <van-radio name=0>非常满意</van-radio>
            <van-radio name=1>满意</van-radio>
            <van-radio name=2>一般</van-radio>
            <van-radio name=3>差</van-radio>
          </van-radio-group>
          <div>
            <van-field
                @input="textchange($event)"
                v-model="item.Message"
                rows="3"
                autosize
                type="textarea"
                maxlength="50"
                placeholder="请输入补充内容"
                show-word-limit
              />
          </div>
          <div class="evaluate_btn">
            <van-button :disabled="item.btntype" class="submit_btn_s" type="primary" size="small" @click="submit()">{{item.btntype ?'已评价' :'评价'}}</van-button>
          </div>
        </div>
        <div v-if="item.Types == 1" class="chat_mob_right">
            <div class="chat_details_info_box">
               <span class="chat_details_sentence_s" v-show="item.State == 0">
                    {{item.Message}}
                </span>
                <img class="chatimg_s" :src="item.Message" alt="" v-if="item.State == 1" @click="amplification(item.Message)">
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
import { GetUserData,distribution,chatHistoryMob } from "@/api/waiters";
import { AddEvalua, } from "@/api/leaveMessage";

import { ImagePreview } from 'vant';
export default {
  data() {
    return {
      receid:'', // 接待id
      types_user:'1', // 分辨和服还是客户
      searchid:'1601',
      value:'',//输入框内容
      send_name:'', //发送方名字
      send_id:'', //发送方id
      receive_id:'',// 对方的客服id
      bottom_type:false, //底部状态
      chatList:[],//聊天内容列表
      sendBtnType:false, // 发送按钮的隐藏显示
      demoChatHubProxy:{},
      page:1, //当前页
      pagenum:10, // 每页条数
      total:0, //总页数
      more_type:false, // 加载更多整个盒子的显示隐藏(小于10条不显示)
      more_show:true, // 加载更多的动画和字的切换
      data_item: {
        Message:'', // 评价留言
        Satisfaction:'', // 评价满意度
      }
      
    }
  },
  created() {
      
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
      const _this = this;
      this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
        });
        var connection = $.hubConnection("");
        _this.demoChatHubProxy = connection.createHubProxy("chatHub");  
          //接收私聊消息
         _this.demoChatHubProxy.on("remindMsg", function (sendId,sengName, message,types,state) {
            console.log('接收私聊消息发送方id：'+sendId+'接收方id:'+sengName+'消息内容：' + message);
            _this.receiveShow(sendId,sengName, message,types,state)
        });
             //显示发送的私聊消息
        _this.demoChatHubProxy.on('showMsgToPages',function(sendId, sengName, message,type,state){
           console.log('显示发送的私聊消息:'+sendId+ '发送方名字:'+sengName+'内容:'+message);
           _this.sendShow(sendId,sengName,message,type,state);
       },); 
      connection
        .start()
        .done(function () {
           _this.distributionId();
        })
        .fail(function () {
          _this.$toast.fail('连接失败');
          _this.$toast.loading({
              message: '加载中...',
              forbidClick: false,
            });
        });
  },
  methods: {
    // 单选按钮的change
    groupchange($event){
      this.data_item.Satisfaction = $event;
    },
    // 评价文本域的change
    textchange($event) {
      this.data_item.Message = $event;
    },
    // 评价提交
    submit() {
      AddEvalua(this).then(res => {
        console.log(res);
        this.info();
      })
    },

    // 分配客服id
    distributionId(){
      const _this = this;
      distribution(_this).then(res => {
            _this.receid = res.data.data.Id;
            _this.demoChatHubProxy.invoke("addOnlineUser", _this.send_id,_this.send_name,1);
            console.log('加入会话成功');
             _this.$toast.loading({
                  message: '加载中...',
                  forbidClick: false,
                });
              _this.$toast('连接成功');
            _this.leave(res);
          })
    },
    // 客服均不在线的时候留言操作
    leave(res){
       const _this = this;
       if(res.data.result == 9){
              console.log('不在线');
                _this.demoChatHubProxy.invoke("GetGeegtingData");
                _this.demoChatHubProxy.on("greetingsMessageToPage",function(content){
                  _this.sendMsg(_this.receid,'00000000-0000-0000-0000-000000000000',_this.send_id,content,'2',0);
                  _this.$dialog.alert({
                      title: '提示',
                      message: '客服均不在线.请前往留言',
                      theme: 'round-button',
                    }).then(() => {
                        _this.$router.push({
                          name: 'leaveMessage',
                          query: {
                              id: _this.send_id
                            }
                        });
                    });
                });
            }else {
              _this.receive_id = res.data.data.UserId;
            }
    },
    // 发送私聊消息的展示
    sendShow(sendId,sengName,message,type,state){
      let data = {
        UserId:sendId,
        UserName:sengName,
        Message:message,
        Types:type,
        State:state
      }
      this.chatList.push(data);
      this.$refs.content_view_m.scrollTop = this.$refs.content_view_m.scrollHeight
    },
    // 接收私聊消息的展示
    receiveShow(sendId,sengName, message,types,state){
      let data = {
          CustomerId:sendId,
          CustomerName:sengName,
          Message:message,
          Types:types,
          State:state
        }
      this.chatList.push(data)
      this.$refs.content_view_m.scrollTop = this.$refs.content_view_m.scrollHeight
    },
    // 发送消息 方法
    sendMsg(receid,send,receive,msg,type,state) {
        // 第一个参数 : 发送方id, 第二个参数 接收方id, 第三个参数 内容, 第四个参数:发送类型,第五个参数,是否是图片
        this.demoChatHubProxy.invoke('sendPrivateMsg',receid,send,receive,msg,type,state); 
    },
    // 返回
    onClickLeft() {

    },
    info() {
      GetUserData(this).then(res => {
        // console.log(res);
        this.send_name = res.data.sendName
        this.send_id = res.data.sendId;
        const that = this;
        chatHistoryMob(that).then(data => {
          if(data.data.recordsTotal > 10) {
            that.more_type = true;
          }else {
            that.more_type = false;
          }
          that.total = Math.ceil(data.data.recordsTotal / 10);
          for(let i = 0; i < data.data.data.length; i++){
            if((data.data.data[i].Satisfaction == null || data.data.data[i].Satisfaction == '') && data.data.data[i].State == 2){
                // 评价的时候， 如果Satisfaction没值的时候是btnytype是false，可以正常提交， Satisfaction有值的时候btntype 是true ， 按钮禁用
                data.data.data[i].btntype = false;
            }else {
                data.data.data[i].btntype = true;
            }
          }
           console.log( data.data.data);
          that.chatList = data.data.data;
        })
      })
    },
    // 加载更多
    more(){
      this.page++;
      if (this.page <= this.total) {
        this.more_show = false;
        chatHistoryMob(this).then((res) => {
          for (let i = 0; i < res.data.data.length; i++) {
             if((res.data.data[i].Satisfaction == null || res.data.data[i].Satisfaction == '') && res.data.data[i].State == 2){
                // 评价的时候， 如果Satisfaction没值的时候是btnytype是false，可以正常提交， Satisfaction有值的时候btntype 是true ， 按钮禁用
                res.data.data[i].btntype = false;
            }else {
                res.data.data[i].btntype = true;
            }
            this.chatList.unshift(res.data.data[i]);
          }
          this.more_show = true;
        });
      } else {
        this.more_type = false;
        this.more_show = true;
      }
    },
    //发送
    send() {
      console.log('发送id：'+this.send_id+',接收id：'+this.receive_id);
      this.sendMsg(this.receid,this.send_id,this.receive_id,this.value,1,0)
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
      let imgUrl ='https://files.365lawhelp.com/'+res.data;
      this.sendBtnType = true;
      this.sendMsg(this.receid,this.send_id,this.receive_id,imgUrl,1,1)
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
/* 加载更多  */
.more {
 text-align: center;
 color: #ccc;
 font-size: 12px;
}
/* 评价留言 */
.evaluate {
  width: 80%;
  margin: 20px 5%;
  background-color: #fff;
  border-radius: 6px;
  padding: 5%;
  font-size: 12px;
}
.evaluate_btn {
  text-align: center;
}
.submit_btn_s {
  width: 80px;
}
</style>