import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'echarts/theme/macarons.js'
import App from './App.vue'
import './style.css'

// 路由配置
import Dashboard from './views/Dashboard.vue'
import Predictions from './views/Predictions.vue'
import Analysis from './views/Analysis.vue'
import DataManagement from './views/DataManagement.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/predictions', component: Predictions },
  { path: '/analysis', component: Analysis },
  { path: '/data', component: DataManagement },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 创建并挂载应用
const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
