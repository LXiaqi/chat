<template>
  <div class="chat">
    <!-- <van-nav-bar
      class="nav_bar_chat"
      safe-area-inset-top
      title="在线客服"
      left-text=""
      left-arrow
      @click-left="onClickLeft"
    /> -->
    <div
      :class="bottom_type == false ? 'chat_content' : 'chat_content2'"
      ref="content_view_m"
    >
      <div class="more" v-show="more_type">
        <span v-show="more_show" @click="more()">加载更多</span>
        <van-loading v-show="!more_show" color="#1989fa" size="18" />
      </div>
      <div class="systemTips" v-if="nametips != ''">
        客服{{ nametips }}为您服务
      </div>
      <div v-for="item in chatList" :key="item.index" class="chat_mob">
        <div
          v-if="(item.Types == 0 || item.Types == 2) && item.State != 2"
          class="chat_mob_left"
        >
          <div class="chat_details_info_box">
            <img
              class="chat_active_img"
              :src="'https://images.weserv.nl/?url=' + item.UserHeadImage"
              alt=""
            />
            <span
              class="chat_details_sentence"
              v-show="item.State == 0"
              v-html="item.Message"
            >
            </span>
            <img
              class="chatimg_s"
              :src="'https://images.weserv.nl/?url=' + item.Message"
              alt=""
              v-if="item.State == 1"
              @click="amplification(item.Message)"
            />
          </div>
        </div>

        <div v-if="item.Types == 1 && item.State != 2" class="chat_mob_right">
          <div class="chat_details_info_box">
            <span
              class="chat_details_sentence_s"
              v-show="item.State == 0"
              v-html="item.Message"
            ></span>
            <img
              class="chatimg_s"
              :src="'https://images.weserv.nl/?url=' + item.Message"
              alt=""
              v-if="item.State == 1"
              @click="amplification(item.Message)"
            />
            <img
              class="chatimg_"
              :src="'https://images.weserv.nl/?url=' + item.CustomerHeadImage"
              alt=""
            />
          </div>
        </div>
      </div>
      <!-- 未接入人工时候的智能对话 -->
      <div v-for="(item, index) in guessList" :key="index">
        <!-- 猜你喜欢部分 -->
        <div class="guessYouLike" v-show="item.type == 'system'">
          <div class="guesstitle">
            <van-icon name="question" color="red" />
            猜你想问
          </div>
          <div class="guessContent">
            <div
              class="oneItembox"
              v-for="item_two in item.msg"
              :key="item_two.Id"
              @click="Towanswer(item_two.Id, item_two.Reply)"
            >
              <span>{{ item_two.Reply }}</span>
              <van-icon class="icon_right" name="arrow" />
            </div>
          </div>
        </div>
        <!-- 点击猜你想问 （消息上屏）-->
        <div class="chat_mob_right" v-if="item.type == 'myissue'">
          <div class="chat_details_info_box">
            <span
              class="chat_details_sentence_s"
              v-show="item.State == 0"
              v-html="item.msg"
            ></span>
            <img
              class="chatimg_s"
              :src="'https://images.weserv.nl/?url=' + item.msg"
              alt=""
              v-if="item.State == 1"
              @click="amplification(item.msg)"
            />
            <img class="chatimg_" :src="myinfo.Image" alt="" />
          </div>
        </div>

        <div class="chat_mob_left" v-if="item.type == 'smart'">
          <div class="chat_details_info_box">
            <img
              class="chat_active_img"
              src="https://images.weserv.nl/?url=https://files.365lawhelp.com/2021-06-03/179f306a-8c34-465d-82bf-cb1d56f8cee9.png?image/auto-orient,1/quality,q_60"
              alt=""
            />
            <span
              class="chat_details_sentence"
              v-show="item.State == 0"
              v-html="item.msg"
            >
            </span>
            <img
              class="chatimg_s"
              :src="'https://images.weserv.nl/?url=' + item.msg"
              alt=""
              v-if="item.State == 1"
              @click="amplification(item.msg)"
            />
          </div>
        </div>
      </div>
      <div class="evaluate" v-show="evaluationType">
        <van-radio-group
          v-model="data_item.Satisfaction"
          direction="horizontal"
          @change="groupchange($event)"
        >
          <van-radio name="0">非常满意</van-radio>
          <van-radio name="1">满意</van-radio>
          <van-radio name="2">一般</van-radio>
          <van-radio name="3">差</van-radio>
        </van-radio-group>
        <div>
          <van-field
            @input="textchange($event)"
            v-model="data_item.Message"
            rows="3"
            autosize
            type="textarea"
            maxlength="50"
            placeholder="请输入补充内容"
            show-word-limit
          />
        </div>
        <div class="evaluate_btn">
          <van-button
            class="submit_btn_s"
            type="primary"
            size="small"
            @click="submit()"
            >评价</van-button
          >
        </div>
      </div>
    </div>
    <div class="chat_input_box">
      <!-- <van-field class="chat_ipt" v-model="value"  placeholder=""  /> -->
      <div class="bottom_btnbox">
        <van-button
          class="tips_btn"
          size="mini"
          type="default"
          @click="cutJonin()"
          >人工客服</van-button
        >
        <van-button
          class="tips_btn"
          size="mini"
          type="default"
          @click="leaveMessage()"
          >留言</van-button
        >
      </div>
      <div
        contenteditable
        :class="sendBtnType ? 'chat_ipt2' : 'chat_ipt'"
        ref="msgInputContainer"
        @input="changeval()"
      >
        <img
          v-for="(item, index) in emojiList"
          :key="index"
          :src="item"
          alt=""
          style="vertical-align: bottom; width: 20px; height: 20px"
        />
      </div>
      <span @click="emoji_click()"
        ><emoji-icon
          @select="selectIcon"
          :iconConfig="iconConfig"
          :class="sendBtnType ? 'emoji_box2' : 'emoji_box'"
        ></emoji-icon
      ></span>
      <img
        class="chat_add_icon"
        src="./../../assets/img/chatmob/add.png"
        alt=""
        srcset=""
        v-show="!sendBtnType"
        @click="add_img()"
      />
      <van-button
        v-show="sendBtnType"
        class="chat_add_send"
        type="primary"
        @click="send()"
        >发送</van-button
      >
    </div>
    <div class="img_box" v-show="bottom_type" safe-area-inset-bottom>
      <!-- <el-upload
          class="avatar-uploader"
          action="/BasicData/UploadFiles"
          :show-file-list="false"
          :on-success="handleAvatarSuccess">
          
      </el-upload> -->
      <van-uploader
        class="avatar-uploader"
        multiple
        :max-count="1"
        :before-read="handleAvatarSuccess"
      >
        <img src="../../assets/img/chatmob/img_file.png" alt="" />
      </van-uploader>
    </div>
    <van-popup class="showtypebox" v-model="showType"
      >参数有误 请返回重试</van-popup
    >
  </div>
</template>

<script>
import { GetUserData, distribution, chatHistoryMob } from '@/api/waiters'
import { AddEvalua, imgup } from '@/api/leaveMessage'
import { getOneNav, getONav, getContents } from '@/api/guess'
import { ImagePreview } from 'vant'
export default {
  data() {
    return {
      imgList: [],
      nametips: '',
      value: '', //输入框内容
      bottom_type: false, //底部状态
      chatList: [], //聊天内容列表
      sendBtnType: false, // 发送按钮的隐藏显示
      demoChatHubProxy: {},
      page: 1, //当前页
      pagenum: 10, // 每页条数
      total: 0, //总页数
      more_type: false, // 加载更多整个盒子的显示隐藏(小于10条不显示)
      more_show: true, // 加载更多的动画和字的切换
      data_item: {
        Message: '', // 评价留言
        Satisfaction: '', // 评价满意度
      },
      iconConfig: {
        placement: 'bottom',
      }, // 表情显示位置
      emojiList: [], // 表情图片,

      showType: false, // 参数获取失败的弹框
      guessList: [], //猜你喜欢的数据
      artificialType: false, // 是否接入人工客服的状态
      // 用户信息
      myinfo: {},
      // 客服信息
      kfinfo: {},
      // 问候语的状态
      greetingsType: true,
      //连接id
      hearId: '',
      // 评价框的展示
      evaluationType: false,
      chatid: '', //用于评价的聊天id
      searchid: '',
    }
  },
  created() {
    console.log('客户端地址栏传的ID：' + this.$route.query.id)
    this.searchid = this.$route.query.id
    // this.cutIn()
  },
  watch: {
    value: function (newV, oldV) {
      if (newV == '') {
        this.sendBtnType = false
      } else {
        this.sendBtnType = true
      }
    },
  },
  mounted() {
    if (/Android/gi.test(navigator.userAgent)) {
      window.addEventListener('resize', function () {
        if (
          document.activeElement.tagName == 'INPUT' ||
          document.activeElement.tagName == 'BODY'
        ) {
          window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded()
          }, 0)
        }
      })
    }
    this.info()
    this.cutIn()
  },
  methods: {
    // 获取输入框的值
    changeval() {
      this.value = this.$refs.msgInputContainer.innerHTML
    },
    // 点击表情显示
    emoji_click() {
      if (document.querySelectorAll('.emoji-bottom').length == 0) {
        this.bottom_type = false
      } else {
        this.bottom_type = true
      }
    },
    //表情选中
    selectIcon(val) {
      let emoji = '.' + val.match(/src=.(\S*).png/)[1] + '.png'
      this.emojiList.push(emoji)
      this.$nextTick(() => {
        this.value = this.$refs.msgInputContainer.innerHTML
      })
      this.bottom_type = false
    },
    // 单选按钮的change
    groupchange($event) {
      this.data_item.Satisfaction = $event
    },
    // 评价文本域的change
    textchange($event) {
      this.data_item.Message = $event
    },
    // 评价提交
    submit() {
      // let varmsg = this.data_item.Satisfaction + '##' + this.data_item.Message

      AddEvalua(this).then((res) => {
        // this.sendMsg(this.receid, this.send_id, this.receive_id, varmsg, 1, 2)
        this.sendMsg(
          this.myinfo.sendId,
          this.kfinfo.UserId,
          this.kfinfo.Id,
          1,
          '用户已评价'
        )
        this.evaluationType = false
        this.data_item.Message = ''
        this.data_item.Satisfaction = ''
      })
    },
    // 分配客服id
    distributionId() {
      const _this = this
      distribution(_this).then((res) => {
        _this.$nextTick(() => {
          _this.$refs.content_view_m.scrollTop =
            _this.$refs.content_view_m.scrollHeight
        })
        if (res.data.result != 9) {
          this.kfinfo = res.data.data
          this.addcount()
        } else {
          _this.$dialog
            .confirm({
              title: '提示',
              message: res.data.msg,
            })
            .then(() => {
              _this.leave()
            })
            .catch(() => {
              // on cancel
            })
        }
        // _this.$toast('连接成功');
      })
    },
    leaveMessage() {
      this.$router.push({
        name: 'leaveMessage',
        query: {
          id: this.myinfo.sendId,
        },
      })
    },
    // 客服均不在线的时候留言操作
    leave() {
      this.$router.push({
        name: 'leaveMessage',
        query: {
          id: this.myinfo.sendId,
        },
      })
    },
    // 发送私聊消息的展示
    sendShow(sendId, toId, receid, type, msg) {
      let data = {
        type: 'myissue',
        msg: msg,
        State: 0,
      }
      this.guessList.push(data)
      this.$refs.msgInputContainer.innerHTML = ''
      this.$nextTick(() => {
        this.$refs.content_view_m.scrollTop =
          this.$refs.content_view_m.scrollHeight
      })
    },
    // 发送图片消息的展示 上屏
    sendImgShow(sendId, toId, receid, type, msg) {
      let data = {
        type: 'myissue',
        msg: msg,
        State: 1,
      }
      this.guessList.push(data)
      this.$refs.msgInputContainer.innerHTML = ''
      this.$nextTick(() => {
        this.$refs.content_view_m.scrollTop =
          this.$refs.content_view_m.scrollHeight
      })
    },
    // 接收私聊消息的展示上屏
    receiveShow(sendId, toId, receid, type, msg) {
      if (msg != '结束会话!') {
        let data = {
          type: 'smart',
          msg: msg,
          State: 0,
        }
        this.guessList.push(data)
        this.$nextTick(() => {
          this.$refs.content_view_m.scrollTop =
            this.$refs.content_view_m.scrollHeight
        })
        // if (state == 2) {
        //   this.allotType = true
        // }
      } else {
        this.artificialType = false
      }
    },
    // 接收图片消息的展示上屏
    receiveImgShow(sendId, toId, receid, type, msg) {
      let data = {
        type: 'smart',
        msg: msg,
        State: 1,
      }
      this.guessList.push(data)
      this.$nextTick(() => {
        this.$refs.content_view_m.scrollTop =
          this.$refs.content_view_m.scrollHeight
      })
    },
    // 接收评价消息上屏
    evaluationShow(sendId, toId, msg, chatid) {
      let data = {
        type: 'smart',
        msg: msg,
        State: 0,
      }
      this.guessList.push(data)
      this.$nextTick(() => {
        this.$refs.content_view_m.scrollTop =
          this.$refs.content_view_m.scrollHeight
      })
      this.chatid = chatid
      this.evaluationType = true
    },
    // 发送消息 方法
    sendMsg(sendId, toId, receid, type, msg) {
      console.log(
        '发送消息--接待id：' +
          receid +
          ',发送方id：' +
          sendId +
          ',接收方id：' +
          toId +
          ',发送内容：' +
          msg +
          ',消息状态：' +
          type
      )

      this.$nextTick(() => {
        this.$refs.content_view_m.scrollTop =
          this.$refs.content_view_m.scrollHeight
      })
      // 第一个参数 : 发送方id, 第二个参数 接收方id, 第三个参数 内容, 第四个参数:发送类型,第五个参数,是否是图片
      this.demoChatHubProxy.invoke('SendMsg', sendId, toId, receid, type, msg)
    },
    // 发送图片消息
    sendImgMsg(sendId, toId, receid, type, msg) {
      console.log(
        '发送消息--接待id：' +
          receid +
          ',发送方id：' +
          sendId +
          ',接收方id：' +
          toId +
          ',发送内容：' +
          msg +
          ',消息状态：' +
          type
      )

      this.$nextTick(() => {
        this.$refs.content_view_m.scrollTop =
          this.$refs.content_view_m.scrollHeight
      })
      // 第一个参数 : 发送方id, 第二个参数 接收方id, 第三个参数 内容, 第四个参数:发送类型,第五个参数,是否是图片
      this.demoChatHubProxy.invoke(
        'SendImgMsg',
        sendId,
        toId,
        receid,
        type,
        msg
      )
    },
    // 返回
    onClickLeft() {},
    info() {
      if (this.searchid != '' && this.searchid != null) {
        GetUserData(this).then((res) => {
          if (res.data.sendName == '') {
            this.showType = true
            return
          }
          this.myinfo = res.data
          const that = this
          chatHistoryMob(that).then((data) => {
            if (data.data.recordsTotal > 10) {
              that.more_type = true
            } else {
              that.more_type = false
            }
            that.total = Math.ceil(data.data.recordsTotal / 10)
            // for (let i = 0; i < data.data.data.length; i++) {
            //   if (
            //     (data.data.data[i].Satisfaction == null ||
            //       data.data.data[i].Satisfaction == '') &&
            //     data.data.data[i].State == 2
            //   ) {
            //     // 评价的时候， 如果Satisfaction没值的时候是btnytype是false，可以正常提交， Satisfaction有值的时候btntype 是true ， 按钮禁用
            //     data.data.data[i].btntype = false
            //   } else {
            //     data.data.data[i].btntype = true
            //   }
            // }
            that.chatList = data.data.data
            that.$nextTick(() => {
              that.$refs.content_view_m.scrollTop =
                that.$refs.content_view_m.scrollHeight
            })
          })
        })
        getOneNav(this).then((res) => {
          this.guessList.push({
            type: 'system',
            msg: res.data.data,
          })
          this.$nextTick(() => {
            this.$refs.content_view_m.scrollTop =
              this.$refs.content_view_m.scrollHeight
          })
        })
      } else {
        this.$toast.fail('登录失效')
      }
    },
    // 加载更多
    more() {
      this.page++
      if (this.page <= this.total) {
        this.more_show = false
        chatHistoryMob(this).then((res) => {
          for (let i = 0; i < res.data.data.length; i++) {
            if (
              (res.data.data[i].Satisfaction == null ||
                res.data.data[i].Satisfaction == '') &&
              res.data.data[i].State == 2
            ) {
              // 评价的时候， 如果Satisfaction没值的时候是btnytype是false，可以正常提交， Satisfaction有值的时候btntype 是true ， 按钮禁用
              res.data.data[i].btntype = false
            } else {
              res.data.data[i].btntype = true
            }
            this.chatList.unshift(res.data.data[i])
          }
          this.more_show = true
        })
      } else {
        this.more_type = false
        this.more_show = true
      }
    },
    //发送按钮
    send() {
      const that = this
      if (!this.artificialType) {
        this.guessList.push({
          type: 'myissue',
          msg: this.$refs.msgInputContainer.innerHTML,
          State: 0,
        })

        this.$nextTick(() => {
          this.$refs.content_view_m.scrollTop =
            this.$refs.content_view_m.scrollHeight
        })
        getContents(this, this.$refs.msgInputContainer.innerHTML).then(
          (res) => {
            that.guessList.push({
              type: 'smart',
              msg: res.data.data,
              State: 0,
            })
            that.$nextTick(() => {
              that.$refs.content_view_m.scrollTop =
                that.$refs.content_view_m.scrollHeight
            })
            that.$refs.msgInputContainer.innerHTML = ''
          }
        )
      } else {
        this.sendMsg(
          this.myinfo.sendId,
          this.kfinfo.UserId,
          this.kfinfo.Id,
          1,
          this.$refs.msgInputContainer.innerHTML
        )
        this.sendBtnType = false
      }
      // const that = this
      // if (this.allotType == true) {
      //   DeleteCon(this).then((res) => {
      //     console.log('删除会话')
      //     that.distributionId(true, 0, '')
      //   })
      // } else {
      //   this.sendMsg(
      //     this.receid,
      //     this.send_id,
      //     this.receive_id,
      //     this.value,
      //     1,
      //     0
      //   )
      //   this.$refs.msgInputContainer.innerHTML = ''
      //   this.value = ''
      // }
    },
    //底栏状态切换
    add_img() {
      if (document.querySelectorAll('.emoji-bottom').length != 0) {
        let mooji_bottom = document.getElementsByClassName('emoji-bottom')
        console.log(mooji_bottom[0])
        mooji_bottom[0].style.display = 'none'
      }
      if (this.bottom_type == false) {
        this.bottom_type = true
      } else {
        this.bottom_type = false
      }
    },
    // 图片上传
    handleAvatarSuccess(res, file) {
      console.log(res)
      let imgUrl = ''
      this.sendBtnType = true
      const that = this
      if (res.length > 0) {
        let myFormdata = new FormData()
        myFormdata.set('file', res[0])
        this.imgList = myFormdata
        imgup(this).then((res) => {
          imgUrl = 'https://files.365lawhelp.com/' + res.data.data
          this.sendImgMsg(
            this.myinfo.sendId,
            this.kfinfo.UserId,
            this.kfinfo.Id,
            1,
            imgUrl
          )
          this.bottom_type = false
          this.sendBtnType = false
        })
      } else {
        let oneFormdata = new FormData()
        oneFormdata.set('file', res)
        this.imgList = oneFormdata
        imgup(this).then((res) => {
          imgUrl = 'https://files.365lawhelp.com/' + res.data.data
          this.sendImgMsg(
            this.myinfo.sendId,
            this.kfinfo.UserId,
            this.kfinfo.Id,
            1,
            imgUrl
          )
          this.bottom_type = false
          this.sendBtnType = false
        })
      }

      // let imgUrl ='https://files.365lawhelp.com/'+res.data;
      // this.sendBtnType = true;
      //  const that = this;
      // if(this.allotType == true) {
      //     DeleteCon(this).then(res => {
      //       console.log('删除会话');
      //        that.distributionId(true,1,imgUrl);
      //     })
      //   }else {
      //     this.sendMsg(this.receid,this.send_id,this.receive_id,imgUrl,1,1)
      //   }

      //   this.bottom_type = false;
      //   this.sendBtnType = false;
    },
    // 图片放大
    amplification(img) {
      ImagePreview(['https://images.weserv.nl/?url=' + img])
    },
    // 获取二级答案
    Towanswer(id, title) {
      this.guessList.push({
        type: 'myissue',
        msg: title,
        State: 0,
      })
      this.$nextTick(() => {
        this.$refs.content_view_m.scrollTop =
          this.$refs.content_view_m.scrollHeight
      })
      getONav(this, id).then((res) => {
        if (res.data.data.type == 1) {
          //问题
          this.guessList.push({
            type: 'system',
            msg: res.data.data.answers,
            State: 0,
          })
          this.$nextTick(() => {
            this.$refs.content_view_m.scrollTop =
              this.$refs.content_view_m.scrollHeight
          })
        }
        if (res.data.data.type == 2) {
          // 答案
          this.guessList.push({
            type: 'smart',
            msg: res.data.data.answers[0].Reply,
            State: 0,
          })
          this.$nextTick(() => {
            this.$refs.content_view_m.scrollTop =
              this.$refs.content_view_m.scrollHeight
          })
        }
      })
    },
    // 用户加入会话
    cutJonin() {
      this.artificialType = true
      this.distributionId()
    },
    // 接入人工客服
    cutIn() {
      const _this = this
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
      })
      var connection = $.hubConnection('')
      _this.demoChatHubProxy = connection.createHubProxy('chatHub')
      console.log(connection)
      connection
        .start()
        .done(function () {
          _this.sendHeartbeat()
        })
        .fail(function () {
          _this.$toast.fail('连接失败')
          _this.$toast.loading({
            message: '加载中...',
            forbidClick: false,
          })
        })
      // 接收问候语
      _this.demoChatHubProxy.on('greetingsMessageToPage', function (msg) {
        this.send(msg)
      })
      // 接收心跳包
      _this.demoChatHubProxy.on('recieveHeartBeat', function (heartbeat) {
        _this.hearId = heartbeat
        console.log('接收心跳:' + heartbeat)
      })
      //接收私聊消息
      _this.demoChatHubProxy.on(
        'remindMsg',
        function (sendId, toId, receid, type, msg) {
          console.log(
            '接收私聊消息remindMsg--发送发id：' +
              sendId +
              ',接收方id：' +
              toId +
              '，消息内容：' +
              msg +
              ',消息发送者状态:' +
              type +
              '，接待id：' +
              receid
          )
          // _this.assessId = assessId
          _this.receiveShow(sendId, toId, receid, type, msg)
        }
      )
      // 接收图片消息
      _this.demoChatHubProxy.on(
        'remindImgMsg',
        function (sendId, toId, receid, type, msg) {
          console.log(
            '接收图片消息remindMsg--发送发id：' +
              sendId +
              ',接收方id：' +
              toId +
              '，消息内容：' +
              msg +
              ',消息发送者状态:' +
              type +
              '，接待id：' +
              receid
          )
          // _this.assessId = assessId
          _this.receiveImgShow(sendId, toId, receid, type, msg)
        }
      )
      // 接收评价消息
      _this.demoChatHubProxy.on(
        'remindAppraiseMsg',
        function (sendId, toId, receid, msg) {
          console.log(
            '接收评价消息remindAppraiseMsg--发送发id：' +
              sendId +
              ',接收方id：' +
              toId +
              '，消息内容：' +
              msg +
              '，接待id：' +
              receid
          )
          // _this.assessId = assessId
          _this.evaluationShow(sendId, toId, receid, msg)
        }
      )
      //显示发送的私聊消息
      _this.demoChatHubProxy.on(
        'showMsgToPages',
        function (sendId, toId, receid, type, msg) {
          console.log(
            '发送私聊消息--发送发id：' +
              sendId +
              ',接收方id：' +
              toId +
              '，消息内容：' +
              msg +
              ',状态types:' +
              type +
              ',接待id：' +
              receid
          )
          _this.sendShow(sendId, toId, receid, type, msg)
        }
      )
      //显示发送的图片消息
      _this.demoChatHubProxy.on(
        'showImgMsgToPages',
        function (sendId, toId, receid, type, msg) {
          console.log(
            '发送图片消息--发送发id：' +
              sendId +
              ',接收方id：' +
              toId +
              '，消息内容：' +
              msg +
              ',状态types:' +
              type +
              ',接待id：' +
              receid
          )
          _this.sendImgShow(sendId, toId, receid, type, msg)
        }
      )
      //显示新用户加入消息
      _this.demoChatHubProxy.on(
        'showJoinMessage',
        function (id, myid, userName, type) {
          console.log(
            '新用户加入消息showJoinMessage--链接id：' +
              id +
              ',我的ID:' +
              myid +
              '，名字：' +
              userName +
              ',账号类型：' +
              type
          )
        }
      )
    },
    // 发送心跳
    sendHeartbeat() {
      this.demoChatHubProxy.invoke('RecieveHeartBeat', this.hearId)
    },
    // 加入会话
    addcount() {
      const _this = this
      _this.demoChatHubProxy
        .invoke('addConUser', _this.myinfo.sendId, _this.myinfo.sendName, 1)
        .then(() => {
          console.log(
            '分配客服之后建立会话连接addConUser--客户（我）id：' +
              _this.myinfo.sendId +
              ',客户（我）的名字：' +
              _this.myinfo.sendName +
              ',分配的客服id：' +
              _this.kfinfo.UserId +
              ',客服名字：' +
              _this.kfinfo.UserName
          )
          _this.$toast.loading({
            message: '加载中...',
            forbidClick: false,
          })
          _this.addList()
        })

      // if (typ == true) {
      //   if (state == 0) {
      //     _this.sendMsg(
      //       _this.receid,
      //       _this.send_id,
      //       _this.receive_id,
      //       _this.value,
      //       1,
      //       0
      //     )
      //     _this.value = ''
      //     _this.$refs.msgInputContainer.innerHTML = ''
      //   }
      //   if (state == 1) {
      //     _this.sendMsg(
      //       _this.receid,
      //       _this.send_id,
      //       _this.receive_id,
      //       img,
      //       1,
      //       1
      //     )
      //   }
      // }
      // if (_this.allotType == true) {
      //   _this.allotType = false
      // }
    },
    addList() {
      console.log('joinlist')
      this.demoChatHubProxy.invoke(
        'joinlist',
        this.kfinfo.UserId,
        this.kfinfo.Id,
        this.myinfo.sendId,
        this.myinfo.sendName,
        this.myinfo.Image
      )
    },
  },
}
</script>

<style scoped>
/* .nav_bar_chat {
  position: fixed;
  width: 100vw;
  height: 6.3vh;
  line-height: 6.3vh;
} */
.chat_content {
  width: 100%;
  height: 87vh;
  background-color: #f2f2f2;
  overflow: hidden;
  overflow-y: scroll;
  padding-top: 2.3vh;
}
.chat_content2 {
  width: 100%;
  height: 72vh;
  background-color: #f2f2f2;
  overflow: hidden;
  overflow-y: scroll;
  padding-top: 2.3vh;
}
.chat_input_box {
  background-color: #f5f5f5;
  height: 10.6vh;
  position: relative;
}
.chat_ipt {
  width: 70vw;
  height: 20px;
  padding: 4px;
  margin-left: 16px;
  border-radius: 8px;
  top: 34px;
  border: 1px solid #ccc;
  font-size: 14px;
  position: absolute;
  overflow: hidden;
  overflow-y: scroll;
}
.chat_ipt2 {
  width: 65vw;
  height: 20px;
  padding: 4px;
  margin-left: 16px;
  border-radius: 8px;
  top: 34px;
  border: 1px solid #ccc;
  font-size: 14px;
  position: absolute;
  overflow: hidden;
  overflow-y: scroll;
}
.chat_add_icon {
  width: 26px;
  height: 26px;
  position: absolute;
  right: 18px;
  top: 36px;
}
.chat_add_send {
  width: 56px;
  height: 28px;
  line-height: 28px;
  position: absolute;
  right: 10px;
  top: 34px;
  font-size: 12px;
  border-radius: 4px;
}
.img_box {
  background-color: #f5f5f5;
  height: 15vh;
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
.chatimg_ {
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
  height: 100px;
  vertical-align: top;
}
.chat_details_sentence_s {
  background: #0a80ff;
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px 0px 8px 8px;
  display: inline-block;
  margin: 0 12px;
  max-width: 200px;
  word-wrap: break-word;
}
.chat_details_sentence {
  background: #fff;
  padding: 6px 10px;
  border-radius: 8px 0px 8px 8px;
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
.systemTips {
  font-size: 12px;
  text-align: center;
  display: block;
  color: #ccc;
  padding: 10px 0;
}
/* 表情 */
.emoji_box {
  position: absolute !important;
  top: 34px;
  right: 52px;
}
.emoji_box >>> .emoji-wrap {
  position: absolute;
  top: 40px;
  /* right: -45px; */
  z-index: 20;
  width: 100vw;
  height: 15.4vh;
}
.emoji_box >>> .emoji-bottom {
  position: absolute;
  top: 40px !important;
  right: -52px;
  left: auto !important;
}
.emoji_box >>> .emoji {
  width: 99.4vw;
  height: 15.4vh;
  background: #fff;
  z-index: 10;
  box-shadow: 1px 5px 5px #ccc;
  display: -webkit-flex;
  display: flex;
  overflow: hidden;
  overflow-y: scroll;
}
.emoji_box2 {
  position: absolute !important;
  top: 34px;
  right: 72px;
}
.emoji_box2 >>> .emoji-wrap {
  position: absolute;
  top: 40px;
  /* right: -45px; */
  z-index: 20;
  width: 100vw;
  height: 15.4vh;
}
.emoji_box2 >>> .emoji-bottom {
  position: absolute;
  top: 40px !important;
  right: -72px;
  left: auto !important;
}
.emoji_box2 >>> .emoji {
  width: 99.4vw;
  height: 15.4vh;
  background: #fff;
  z-index: 10;
  box-shadow: 1px 5px 5px #ccc;
  display: -webkit-flex;
  display: flex;
  overflow: hidden;
  overflow-y: scroll;
}
[contenteditable]:focus {
  outline: none;
}
.showtypebox {
  width: 200px;
  height: 90px;
  border-radius: 8px;
  line-height: 90px;
  text-align: center;
}
.bottom_btnbox {
  padding: 4px 12px 0 12px;
}
.tips_btn {
  font-size: 12px;
  border-radius: 6px;
  height: 24px;
  line-height: 24px;
}
.guessYouLike {
  width: 75%;
  background-color: #fff;
  border-radius: 12px;
  margin: 6px 18px;
}
.guesstitle {
  color: red;
  padding: 12px;
  font-weight: 700;
}
.guessContent {
  font-size: 14px;
  max-height: 300px;
  overflow: hidden;
  overflow-x: scroll;
}
.oneItembox {
  margin: 6px;
  border-top: 1px solid #ccc;
  padding: 6px;
}
.icon_right {
  float: right;
}
</style>