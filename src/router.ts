import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // 在这里添加路由
  // { path: '/', component: () => import('@pages/YourPage.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router