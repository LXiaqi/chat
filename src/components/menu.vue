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
      </div>
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
export default {
  data() {
    return {
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
            }
        ],
        type:1,//侧边栏状态
    };
  },
  created() {

  },
  mounted() {
    this.info();
  },

  methods: {
      info() {

      },
      // 侧边栏的点击
      menu_to(id) {
          this.type = id;
      },
     
  },
  watch: {
    $route: {
       handler:function(route){
        console.log(route);
        if(route.name == 'current'){
          this.type = 1
        }
        if(route.name == 'history'){
          this.type = 2
        }
      },
      immediate:true
      }
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
.el-icon-time {
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
.el-icon-time:hover {
 color: #6AACF4;
}
#active {
    background-color: #E6E6E6;
    color: #6AACF4;
  text-align: center;

}
</style>