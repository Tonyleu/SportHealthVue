import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
// 引入Login组件
import Login from '../components/Login.vue'
// 引入Home组件
import Home from '../components/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    // name: 'Login',
    component: Login
  },
  {
    path: '/home',
    // name: 'Home',
    component: Home
    // path: '/login',
    // name: 'Login',
    // component: Login
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问
  // from 从哪访问
  // next 接下来做什么 next(url) 重定向到url上 next() 继续访问 to 路径
  if (to.path == '/login') return next();
  // 获取user
  const userFlag = window.sessionStorage.getItem("user");// 获取当前用户
  if (!userFlag) return next('/login');// 无值，返回登录页面
  next();// 符合要求，放行
})

export default router
