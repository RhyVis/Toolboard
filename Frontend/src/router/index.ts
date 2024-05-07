import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import toolRouter from '@/router/modules/toolRouter'
import axios from 'axios'

import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    ...toolRouter,
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/auth/AuthView.vue')
    },
    {
      path: '/:pathMatch(.*)',
      name: '404',
      component: () => import('@/views/ErrorView.vue')
    }
  ]
})

router.beforeEach(async (to, _, next) => {
  const auth = useAuthStore()
  if (to.meta.requireToken) {
    const token = auth.token
    if (!token) {
      next('/auth')
    } else {
      const { res } = await (await axios.post('/api/auth', { token: token })).data
      if (res === true) {
        next()
      } else {
        next('/')
      }
    }
  } else {
    next()
  }
})

export default router
