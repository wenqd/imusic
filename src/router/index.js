import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../App.vue'
import HomePage from '../main/HomePage.vue'
import Lyric from '../page/desktopLyric.vue'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(localtion){
  return originalPush.call(this,localtion).catch(err=>err)
}
Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Main',
    component: HomePage,
  },
  {
    path: '/lyric',
    name: 'Lyric',
    component: Lyric,
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
