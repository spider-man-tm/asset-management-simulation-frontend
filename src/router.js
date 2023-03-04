import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/HomePage.vue'
import PrivacyPolicyPage from './components/PrivacyPolicyPage.vue'
import NotFoundPage from './components/NotFoundPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: {'title': 'home'}
  },
  {
    path: '/policy',
    name: 'recommend',
    component: PrivacyPolicyPage,
    meta: {'title': 'policy'}
  },
  {
    path: '/:catchAll(.*)',
    name: 'notfound',
    component: NotFoundPage,
    meta: {'title': 'notfound'}
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
