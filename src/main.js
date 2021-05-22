// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant';
import 'vant/lib/index.css';
import 'signalr';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Axios from 'axios';
import VueCookies from 'vue-cookies'
import store from './store/index';
Vue.prototype.$http = Axios
Vue.http = Axios
Vue.config.productionTip = false
Vue.use(Vant);
Vue.use(ElementUI);
Vue.use(VueCookies);
/* eslint-disable no-new */
// 接口错误拦截
Axios.interceptors.response.use(res => {
  // console.log(res);
  if(res.data.result == 7) {
    router.replace("/login");
  }
  return res
})
// Vue.prototype.$http = Axios;
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
