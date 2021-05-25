<template>
  <div class="service">
    <el-container>
    <el-aside width="120px">
         <div class="service_left">
      <div class="el-icon-chat-line-round"></div>
      <div class="menu_list">
        <el-tooltip class="item" effect="light" :content="item.name" placement="right"  v-for="item in munuList" :key="item.id">
            <router-link :to="item.path">
                 <div :class="item.icon" @click="menu_to(item.id)" :id="type == item.id ? 'active' :'' " ></div>
            </router-link>
        </el-tooltip>
        <el-popover
          placement="right"
          width="120"
          trigger="click">
          <div @click="out_type(item.type)"  v-for="item in outList" :key="item.type" class="usertype">{{item.val}}</div>
          <div class="my_active_box " @click="setUserType()" slot="reference">
          <div class="user_active_">
             <el-tooltip  effect="light" :content="userinfos.sendName" placement="right"  >
               <img src="./../assets/img/waiters/avatar_group.png" alt="">
             </el-tooltip>
          </div>
           <div :class="userinfos.statuz == 1 ? 'green' : (userinfos.statuz == 2 ? 'red' : 'yellow') "></div>
        </div>
        </el-popover>
        
      </div>
    </div>
    <div class="user_out" v-show="mystate == 1 ">
 
    </div>
    </el-aside>
    <el-container>
    <el-main style="padding:0">
         <router-view></router-view>　　
    </el-main>
    </el-container>
</el-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { GetUserData } from "@/api/waiters";
import { changeStatus,logout} from "@/api/login";
export default {
  data() {
    return {
        userinfos:{}, //用户信息
        // 侧边栏列表
        munuList:[
            {
                id:1,
                icon:'el-icon-chat-round',
                name:'当前会话',
                path:'/'
            },
            {
                id:2,
                icon:'el-icon-time',
                name:'历史会话',
                path:'/history'
            },
        ],
        outList: [
          {
            type:1,
            val:'在线'
          },
          {
            type:2,
            val:'忙碌'
          },
          {
            type:3,
            val:'其它'
          },
          {
            type:4,
            val:'退出'
          },
        ],
        type:1,//侧边栏状态
       searchid:'',
       types_user:0,
       out_types:0, // 用户登录状态
       mystate:0, // 状态框的显示隐藏
    };
  },
computed: {
    ...mapState(['userinfo']),
},


  created() {
 
  },
  mounted() {
    this.info();
  },

  methods: {
      info() {
         GetUserData(this).then(res => {
           console.log(res);
           this.userinfos = res.data
         }) 
      },
      // 侧边栏的点击
      menu_to(id) {
          this.type = id;
      },
      //状态改变
      setUserType() {
        this.mystate = 1;
      },
      out_type(type) {
        this.out_types = type;
        if(type == 4) {
          logout(this).then(res => {
             this.$router.replace("/login");
          })
        }else {
            changeStatus(this).then(res => {
              this.mystate = 0;
              this.info();
            })
        }
      
      }
     
  },
  watch: {
    $route: {
       handler:function(route){
        if(route.name == 'current'){
          this.type = 1
        }
        if(route.name == 'history'){
          this.type = 2
        }
      },
      immediate:true
      },
    },
};
</script>

<style scoped>
.service_left {
  height: 100vh;
  border-right: 1px solid #EBEBEB;
  position: relative;
}
.el-icon-chat-line-round {
  font-size: 36px;
  color: #0a80ff;
  position: absolute;
  top: 20px;
  left: 36px;
}
.menu_list {
  position: absolute;
  top: 100px;
  left: 24px;
}
.el-icon-chat-round,
.el-icon-time,
.el-icon-pie-chart {
  display: block;
  font-size: 18px;
  width: 56px;
  height: 46px;
  line-height: 46px;
  border-radius: 8px;
  margin-bottom: 4px;
  text-align: center;
}
.el-icon-chat-round:hover,
.el-icon-time:hover,
.el-icon-pie-chart:hover {
 color: #6AACF4;
}
#active {
    background-color: #E6E6E6;
    color: #6AACF4;
  text-align: center;

}
.my_active_box {
      width: 60px;
    position: absolute;
    top: 760px;
    left: 12px;
}
.my_active_box img {
  width: 40px;
  height: 40px;
}
.green {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: green;
  border-radius: 50%;
  margin: 0 0 4px -10px;
}
.red {
   width: 10px;
  display: inline-block;
  height: 10px;
  background: red;
  border-radius: 50%;
  margin: 0 0 4px -10px;
}
.yellow {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: yellow;
  border-radius: 50%;
  margin: 0 0 4px -10px;
}
.user_active_ {
  display: inline-block;
}
/* 状态更改 */
.user_out {
      position: absolute;
    bottom: 70px;
    left: 100px;
    background: #F5F5F6;
    padding: 20px;
    line-height: 28px;
    border-radius: 8px;
}
.usertype {
  line-height: 28px;
  text-align: center;
}
</style>