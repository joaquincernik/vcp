import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'

const routes = [
  /* {
    path: '/',
    name: 'home',
    component: HomeView
  }, */
  {
    path: '/',
    name: 'login',
    component: LoginView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
