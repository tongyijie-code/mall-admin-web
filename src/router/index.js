import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect: '/login',
  },
    {
      path: '/login',
      component: () => import('@/components/login/Login')
    },
    {
      path: '/home',
      component: () => import('@/views/home/Home'),

      children: [
        { path: '/', redirect: '/welcome'},
        {path: '/welcome', component: () => import('@/views/home/children/Welcome')},
        {path: '/users', component: () => import('@/components/user/UserList')},
        {path: '/roles', component: () => import('@/components/roles/Roles')},
        {path: '/rights', component: () => import('@/components/rights/Rights')},
        {path: '/categories', component: () => import('@/components/goods/Cate')},
      ]
    },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  //如果要跳转的是登录界面，就直接放行 return出去
  if (to.path === '/login') return next()

  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')

  next()
})

export default router
