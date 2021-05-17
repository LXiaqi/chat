<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
  </div>
</template>

<script>

export default {
 
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
    };
  },
  mounted() {
    this.info();
  },
  created() {},
  methods: {
    info() {

      var connection = $.hubConnection("");
      console.log(connection)
      //如果前后端为同一个端口，可不填参数。如果前后端分离，这里参数为服务器端的URL
      // var demoChatHubProxy = connection.createHubProxy("chatHub");
      // demoChatHub为后端定义，使用驼峰式命名，后端首字母必须大写
      // addMessageToList 为后端demoChatHub方法
      // demoChatHubProxy.on("addMessageToList", function (userName, message) {
      //   console.log(userName + " " + message);
      // });
      connection
        .start()
        .done(function () {
          console.log('链接成功');
        })
        .fail(function () {
          console.log("链接失败");
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
