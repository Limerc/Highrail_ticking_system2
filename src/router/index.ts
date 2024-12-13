import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Main from '@/views/Main.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      name: 'main',
      redirect: '/main/home',
      component: Main,
      children: [
        {
          path: '/main/home',
          name: 'home',
          component: Home,
        },
        {
          path: '/main/trains',
          name: 'trains',
          component: () => import('@/views/Trains.vue'),
        },
        {
          path: '/main/my',
          name: 'my',
          redirect: '/main/my/info',
          component: () => import('@/views/My.vue'),
          children: [
            {
              path: '/main/my/info',
              name: 'info',
              component: () => import('@/views/MyInfo.vue'),
            },
            {
              path: '/main/my/tickets',
              name: 'myTickets',
              component: () => import('@/views/MyTickets.vue'),
            },
            {
              path: '/main/my/repwd',
              name: 'repwd',
              component: () => import('@/views/MyRepwd.vue'),
            },
          ]
        }
      ]
    }
  ],
})

export default router
