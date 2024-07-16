import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/index/index.vue'
import Chat from '@/views/chat/index.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      redirect: '/chat',
      children: [
        {
          path: '/chat',
          name: 'chat',
          component: Chat
        },
        {
          path: '/translate',
          name: 'translate',
          component: () => import('@/views/translate/index.vue')
        },
        {
          path: '/word',
          name: 'word',
          component: () => import('@/views/word/index.vue')
        }
      ]
    }
  ]
})

export default router
