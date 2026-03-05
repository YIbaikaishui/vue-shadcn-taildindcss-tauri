import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const DefaultView = () => import('@layouts/DefaultView.vue')

const Home = () => import('@pages/Home.vue')
const About = () => import('@pages/About.vue')

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/home' },

  { path: '/about', component: About, meta: { title: 'About' } },
  {
    path: '/',
    component: DefaultView,
    children: [{ path: 'home', component: Home, meta: { title: 'Home' } }],
  },

  { path: '/:pathMatch(.*)*', redirect: '/home' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
