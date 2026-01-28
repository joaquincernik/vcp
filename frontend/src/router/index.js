import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import MainView from '../views/MainView.vue'
import RegisterNameView from '../views/RegisterNameView.vue'

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
  },
  {
    path: '/registrar/nombre',
    name: 'registerName',
    component: RegisterNameView
  },
  {
    path: '/home',
    name: 'home',
    component: MainView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
