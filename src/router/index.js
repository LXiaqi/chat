import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import menu from '@/components/menu'
import current from '@/pages/waiters/current'

Vue.use(Router)
const page = name => () => import('@/pages/' + name)
export default new Router({
  
  routes: [
    {
      path: '',
      component: menu,
      children: [
        {path: '/', name: 'current', component: current},  // 当前会话
        {path: '/history', name: 'history', component: page('waiters/history')},  // 当前会话

      ]
    },
    // pc 的登陆注册
    {
      path: '/login',
      name: 'login',
      component: page('login'),
    },
    // 移动端页面
    {
      path: '/lawOnline',
      name: 'lawOnline',
      component: page('lawOnline/chatmob'),
    },
   
     
  ]
})
