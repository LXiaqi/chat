<template>
  <div class="chat_content_pc">
    <div class="chat_list">
      <div class="lable">
        <div>当前会话</div>
      </div>
      <div class="chat_input_pcbox">
        <el-input v-model="search_user" placeholder="搜索聊天用户"></el-input>
      </div>
      <!-- 聊天侧边栏 -->
      <div class="chats_content_box">
        <div
          @click="viewDetails(item, index)"
          v-for="(item, index) in chat_list"
          :key="item.Id"
          class="chat_on_box"
          :id="chat_state == index ? 'chat_select' : ''"
        >
          <img
            class="chat_img"
            src="./../../assets/img/waiters/avatar_group.png"
            alt=""
          />
          <span class="chat_name">{{ item.CustomerName }}</span>
          <div class="chat_time">{{ item.Time }}</div>
          <div class="chat_userinfo">{{ item.Message }}</div>
        </div>
      </div>
    </div>
    <!-- 聊天内容聊天详情 -->
    <div :class="quickType == 0 ? 'chat_details' : 'chat_details2' " v-show="right_type == 1">
      <el-container>
        <!-- 头部信息 -->
        <el-header class="chat_details_head">
          <img
            class="active_img"
            src="./../../assets/img/waiters/avatar_group.png"
            alt=""
          />
          <span> {{ customer_name }}</span>
          <el-button class="head_btn" @click="user_information()"
            >...</el-button
          >
          <el-button
            class="el-icon-chat-round head_btn"
            @click="Fastreply()"
          ></el-button>
        </el-header>
        <!-- 聊天内容 -->
        <el-main style="padding: 0">
          <div class="chat_details_content" ref="content_view">
            <span
              class="tips"
              @click="more()"
              v-loading="more_type"
              v-show="more_show"
              >加载更多</span
            >
            <div
              v-for="item in conversationList"
              :key="item.Id"
              :class="item.img == false ? 'chat_my_left' : 'chat_my_left2'"
            >
              <div v-show="item.Types == 1">
                <div class="chat_details_info_box">
                  <img
                    src="./../../assets/img/waiters/avatar_group.png"
                    alt=""
                  />
                  <div class="chat_details_active_time">
                    <div>{{ item.CustomerName }}</div>
                    <span>{{ item.CreateTime }}</span>
                  </div>
                </div>
                <div class="chat_details_sentence">
                  <span v-show="!item.img"> {{ item.Message }}</span>
                  <el-image
                    class="img_chat"
                    v-if="item.img"
                    :src="item.Message"
                    :preview-src-list="[item.Message]"
                    alt=""
                  ></el-image>
                </div>
              </div>
              <div v-show="item.Types == 0" class="chat_my_right">
                <div class="chat_details_info_box">
                  <img
                    src="./../../assets/img/waiters/avatar_group.png"
                    alt=""
                  />
                  <div class="chat_details_active_time">
                    <div style="text-align: left">{{ item.UserName }}</div>
                    <span>{{ item.CreateTime }}</span>
                  </div>
                </div>
                <div class="chat_my_right_msgbox">
                  <span class="chat_details_sentence_s" v-show="!item.img">
                    {{ item.Message }}
                  </span>
                  <el-image
                    class="img_chat"
                    v-if="item.img"
                    :src="item.Message"
                    :preview-src-list="[item.Message]"
                    alt=""
                  ></el-image>
                </div>
              </div>
            </div>
          </div>
          <!-- 消息发送框 -->
          <div class="chat_sendout_box">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="chat_sendout"
              class="chat_sendout_ipt"
              @keydown.enter.native="keyDown"
            ></el-input>
            <el-button type="primary" @click="sendOut()">发送</el-button>
            <el-upload
              class="avatar-uploader"
              action="/Communication/UploadFiles"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
            >
              <i class="el-icon-circle-plus-outline"></i>
            </el-upload>
              <el-button type="success" @click="end()">结束</el-button>
          </div>
        </el-main>
      </el-container>
    </div>
    <!-- 快捷回复 -->
    <div class="quick" v-show="quickType == 1">
      <div class="quickTitle">
        <span>快捷回复</span>
        <el-button class="el-icon-close" type="mini" @click="ShutDown()"></el-button>
      </div>
      <el-table :data="quickData" height="880"  style="width: 100%">
        <el-table-column prop="Contents" label="内容" width="300">
        </el-table-column>
        <el-table-column  label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="sendQuick(scope.row.Contents)">发送</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 个人信息的模态框 -->
    <el-drawer title="用户资料" :visible.sync="drawer">
      <div class="user_customer">客户名称：{{ customerData.CustomerName }}</div>
      <div class="user_customer">
        客户类型：{{ customerData.Types == 1 ? "个人" : "企业" }}
      </div>
      <div class="user_customer">会员信息：{{ customerData.Vip }}</div>
      <div class="user_customer">会员年限：{{ customerData.VipYears }}</div>
      <div class="user_customer">客户地址：{{ customerData.Location }}</div>
      <div class="user_customer">联系方式：{{ customerData.Phone }}</div>
    </el-drawer>
  </div>
</template>

<script>
import {chatList,conversation,getCustomerInfo,GetUserData,quickList,endSession} from "@/api/waiters";
export default {
  data() {
    return {
      types_user: "0",
      searchid: "",
      id: "", //发送方id
      name: "",
      chat_list: [], // 当前会话列表
      search_user: "", // 搜索内容
      chatType: 0, // 聊天列表的状态 0是当前会话 1 是历史会话， 这里固定为0
      chat_state: 0, // 点击选中的状态
      customer_name: "", // 聊天详情中左上角客户名字
      page: 1, //当前页数
      pagenum: 10, // 每页条数
      user_id: "", // 当前客服id
      conversationList: [], // 当前选中会话的聊天内容， 数组
      chat_sendout: "", // 发送聊天文本域内容
      demoChatHubProxy: {},
      userInformationId: "", // 侧边栏的展开的个用户id
      drawer: false, // 用户信息资料模态框显示隐藏
      customerData: {}, //客户资料
      more_type: false, // 加载动画的显示隐藏
      more_show: false, // 加载的隐藏显示（当数据不足分页的时候隐藏加载提示）
      total: 0, // 总页数
      file: "", // 图片
      msg: "",
      quickData:[],
      quickType:0, // 侧边的快捷状态
      right_type:1, // 判断聊天列表没有数据的时候右边栏目隐藏, 1是有数据，0 是没有
    };
  },
  created() {
    const _this = this;
    var connection = $.hubConnection("");
    _this.demoChatHubProxy = connection.createHubProxy("chatHub");
    // 首问语
    _this.demoChatHubProxy.on("addContosoChatMessageToPage",
      function (message, type) {
        console.log("消息内容：" + message+'状态:' +type);
        _this.msg = message;
      }
    );

    //显示新用户加入消息
    _this.demoChatHubProxy.on("showJoinMessage", function (id, userName, type) {
      console.log(id+userName+type);
      if (type == 1) {
        console.log("你的名字" + userName + "你的id:" + id);
        let data = {
          CustomerName: userName,
          CustomerId: id,
          UserName: _this.name,
          UserId: _this.id,
          Time: new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 19)
            .replace("T", " "),
          Message: _this.msg,
        };
        _this.chat_list.unshift(data);
        _this.userInformationId = data.CustomerId;
        _this.demoChatHubProxy.invoke(
          "sendPrivateMsg",
          _this.id,
          _this.userInformationId,
          _this.msg,
          2,
          false
        );
      }
    });
    //接收私聊消息
    _this.demoChatHubProxy.on(
      "remindMsg",
      function (sendId, sengName, message, img) {
        console.log(
          "发送方id：" +
            sendId +
            "名字:" +
            sengName +
            "消息内容：" +
            message +
            img
        );
        let datas = {
          CustomerId: sendId,
          CustomerName: sengName,
          Message: message,
          Types: 1,
          CreateTime: new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 19)
            .replace("T", " "),
          img: img,
        };
        _this.conversationList.push(datas);
        // 滚动条到底
        _this.$nextTick(() => {
          _this.$refs.content_view.scrollTop =
            _this.$refs.content_view.scrollHeight + 60;
        });
        // 侧边栏的显示
        if (img) {
          _this.chat_list[_this.chat_state].Message = "图片";
          _this.chat_list[_this.chat_state].Time = new Date(
            +new Date() + 8 * 3600 * 1000
          )
            .toJSON()
            .substr(0, 19)
            .replace("T", " ");
        } else {
          // 侧边栏的显示
          _this.chat_list[_this.chat_state].Message = message;
          _this.chat_list[_this.chat_state].Time = new Date(
            +new Date() + 8 * 3600 * 1000
          )
            .toJSON()
            .substr(0, 19)
            .replace("T", " ");
        }
      }
    );
    //显示发送的私聊消息
    _this.demoChatHubProxy.on(
      "showMsgToPages",
      function (sendId, sengName, message, img) {
        console.log(sendId + sengName + message + img);

        let datas = {
          UserId: sendId,
          UserName: sengName,
          Message: message,
          Types: 0,
          CreateTime: new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 19)
            .replace("T", " "),
          img: img,
        };
        _this.conversationList.push(datas);
        // 滚动条到底
        _this.$nextTick(() => {
          _this.$refs.content_view.scrollTop =
            _this.$refs.content_view.scrollHeight + 60;
        });
        // 侧边栏的显示
        if (img) {
          _this.chat_list[_this.chat_state].Message = "图片";
          _this.chat_list[_this.chat_state].Time = new Date(
            +new Date() + 8 * 3600 * 1000
          )
            .toJSON()
            .substr(0, 19)
            .replace("T", " ");
        } else {
          _this.chat_list[_this.chat_state].Message = message;
          _this.chat_list[_this.chat_state].Time = new Date(
            +new Date() + 8 * 3600 * 1000
          )
            .toJSON()
            .substr(0, 19)
            .replace("T", " ");
        }
      }
    );
    connection
      .start()
      .done(function () {
        _this.$message({
          message: "连接成功",
          type: "success",
        });
        console.log(connection.id);
        _this.demoChatHubProxy.invoke("addOnlineUser", _this.id, _this.name, 0);
      })
      .fail(function () {
        _this.$message.error("连接失败");
      });
  },
  mounted() {
    this.info();
  },

  methods: {
    // 左侧聊天列表的渲染
    info() {
      chatList(this).then((res) => {
        if(res.data.data.length == 0) {
          this.chat_list = [];
          this.right_type = 0;
          this.userinfo();
        }else {
          this.right_type = 1;
          this.chat_list = res.data.data;
          this.customer_name = this.chat_list[0].CustomerName;
          this.user_id = this.chat_list[0].UserId;
          this.userInformationId = this.chat_list[0].CustomerId;
          this.userinfo();
        }
       
      });
      GetUserData(this).then((res) => {
        this.id = res.data.sendId;
        this.name = res.data.sendName;
      });
      if (
        this.$cookies.get("FBWTokenId") == "" ||
        this.$cookies.get("FBWTokenId") == null
      ) {
        this.$router.replace("/login");
      }
    },

    // 聊天详情的渲染
    userinfo() {
      conversation(this).then((res_data) => {
        if (res_data.data.recordsTotal <= 10) {
          this.more_show = false;
        } else {
          this.more_show = true;
        }
        this.total = Math.ceil(res_data.data.recordsTotal / 10);
        for (let i = 0; i < res_data.data.data.length; i++) {
          if (res_data.data.data[i].Message.indexOf("https://files.365lawhelp.com") == -1) {
            res_data.data.data[i].img = false;
          } else {
            res_data.data.data[i].img = true;
          }
        }
        this.conversationList = res_data.data.data;
        this.$nextTick(() => {
          this.$refs.content_view.scrollTop =
            this.$refs.content_view.scrollHeight + 60;
          console.log(this.$refs.content_view.scrollTop);
        });
      });
    },
    // 列表的点击
    viewDetails(data, index) {
      this.page = 1; //还原
      this.chat_state = index; // 选中下标改变状态来更改样式
      this.customer_name = data.CustomerName; // 选中聊天的对方名字
      this.user_id = data.UserId; // 当前会话客服id
      this.userInformationId = data.CustomerId; // 选中会话的对方id
      this.userinfo();
    },
    // 点击加载更多，渲染更多聊天内容
    more() {
      this.page++;
      console.log(this.total);
      if (this.page <= this.total) {
        this.more_type = true;
        conversation(this).then((res) => {
          for (let i = 0; i < res.data.data.length; i++) {
            if (
              res.data.data[i].Message.indexOf(
                "https://files.365lawhelp.com"
              ) == -1
            ) {
              res.data.data[i].img = false;
            } else {
              res.data.data[i].img = true;
            }
            this.conversationList.unshift(res.data.data[i]);
          }
          this.more_type = false;
        });
      } else {
        this.more_type = false;
        this.more_show = false;
      }

      console.log(this.page);
    },
    // 消息发送
    sendOut() {
      this.demoChatHubProxy.invoke(
        "sendPrivateMsg",
        this.id,
        this.userInformationId,
        this.chat_sendout,
        0,
        false
      );
      this.chat_sendout = "";
    },
    // 个人信息的展开
    user_information() {
      this.drawer = true;
      getCustomerInfo(this).then((res) => {
        this.customerData = res.data.data;
      });
    },
    // 选择图片
    handleAvatarSuccess(res, file) {
      this.file = "https://files.365lawhelp.com/" + res.data;
      this.sendBtnType = true;
      this.demoChatHubProxy.invoke(
        "sendPrivateMsg",
        this.id,
        this.userInformationId,
        this.file,
        0,
        true
      );
    },
    // 键盘事件
    keyDown(e) {
      if (e.ctrlKey && e.keyCode == 13) {
        //用户点击了ctrl+enter触发
        console.log(this.chat_sendout);
        this.demoChatHubProxy.invoke(
          "sendPrivateMsg",
          this.id,
          this.userInformationId,
          this.chat_sendout,
          0,
          false
        );
        this.chat_sendout = "";
      } else {
        //用户点击了enter触发
        // 执行一些逻辑方法
        if (e != undefined) {
          e.preventDefault(); // 阻止浏览器默认的敲击回车换行的方法
        }
      }
    },
    // 快捷回复
    Fastreply() {
      this.quickType = 1;
      quickList(this).then((res) => {
        console.log(res);
        this.quickData = res.data.data;
      });
    },
    // 快捷发送
    sendQuick(content) {
       this.demoChatHubProxy.invoke("sendPrivateMsg",this.id,this.userInformationId,content,0,false);
    },
    // 关闭快捷侧边栏
    ShutDown() {
      this.quickType = 0;
    },
    // 结束会话
    end() {
       this.demoChatHubProxy.invoke("sendPrivateMsg",this.id,this.userInformationId,'关闭会话',0,false);
      endSession(this).then(res => {
        this.info();
      })
    },
  },
};
</script>

<style scoped>
.chat_content_pc {
  height: 100vh;
  display: flex;
}
.chat_list {
  width: 350px;
  height: 100vh;
  border-right: 1px solid #ebebeb;
}
.lable {
  margin-left: 32px;
  font-size: 20px;
  line-height: 60px;
  font-weight: bold;
}
/* 搜索框 */
.chat_input_pcbox {
  margin: 20px;
}
/* 聊天列表 */
#chat_select {
  background-color: #f5f5f5;
}
.chats_content_box {
  height: 820px;
  overflow: hidden;
  overflow-y: scroll;
}
.chat_on_box {
  position: relative;
  width: 340px;
  height: 80px;
}

.chat_img {
  width: 40px;
  height: 40px;
  border-right: 50%;
  position: absolute;
  left: 24px;
  top: 18px;
}
.chat_time {
  font-size: 12px;
  color: #ccc;
  position: absolute;
  right: 24px;
  top: 18px;
}
.chat_name {
  width: 100px;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  position: absolute;
  left: 80px;
  top: 16px;
}
.chat_userinfo {
  width: 100px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  position: absolute;
  left: 80px;
  top: 46px;
}
/* 聊天内容聊天详情 */
.chat_details {
  width: 1449px;
  height: 100vh;
}
.chat_details2 {
  width: 1049px;
  height: 100vh;
}
.chat_details_head {
  border-bottom: 1px solid #ebebeb;
}
.active_img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  vertical-align: middle;
}
.chat_details_head span {
  display: inline-block;
  padding-top: 18px;
}
.head_btn {
  float: right;
  margin-top: 12px;
  margin-right: 20px;
}
/* 聊天内容 */
.chat_details_content {
  height: 720px;
  padding: 20px;
  border-bottom: 1px solid #ebebeb;
  overflow: hidden;
  overflow-y: scroll;
}
.tips {
  text-align: center;
  color: #778899;
  font-size: 12px;
  display: block;
}
/* 聊天细节 */
.chat_details_info_box img {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.chat_details_active_time {
  display: inline-block;
  vertical-align: middle;
  margin-left: 18px;
}
.chat_details_active_time span {
  font-size: 12px;
  color: #cccc;
  font-style: oblique;
}
.chat_details_sentence {
  background: #ebebeb;
  padding: 10px;
  border-radius: 6px;
  width: max-content;
  margin: 0 0 36px 0;
  max-width: 1000px;
  word-wrap: break-word;
}
.chat_my_right {
  text-align: end;
  margin-inline-end: 20px;
}
.chat_my_left {
}
.chat_my_left2 {
}
.chat_my_right_msgbox {
  margin-top: 18px;
}
.chat_details_sentence_s {
  background: #0a80ff;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
  margin: 0 0 36px 0;
  max-width: 1000px;
  word-wrap: break-word;
  display: inline-block;
}
/* 聊天文本域部分 */
.chat_sendout_box {
  margin: 10px;
}
.chat_sendout_ipt {
  width: 1000px;
  margin: 0px 20px 0 0;
}
/* 用户信息 */
.user_customer {
  margin: 25px 15px;
}
.img_chat {
  width: 300px;
}
.avatar-uploader {
  display: inline-block;
  font-size: 24px;
  margin:0 30px;
}
/* 快捷回复 */
.quick {
  width: 399px;
  height: 100vh;
  border-left: 1px solid #ccc;
}
.quickTitle {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-top: 30px;
}
.el-icon-close {
  margin-left: 30px;
}
</style>