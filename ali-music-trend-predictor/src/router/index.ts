import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Predictions from '../views/Predictions.vue'
import Analysis from '../views/Analysis.vue'
import Settings from '../views/Settings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/predictions',
      name: 'predictions',
      component: Predictions
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: Analysis
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
})

export default router 