import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 暂时注释掉这个导入，这可能是问题源
// import 'echarts/theme/macarons.js'
import App from './App.vue'
import './style.css'

// 增加更多调试信息
console.log('=== 应用启动中... ===')

// 路由配置 - 导入所有视图
import Dashboard from './views/Dashboard.vue'

// 定义路由
const routes = [
  { path: '/', component: Dashboard },
  { 
    path: '/predictions', 
    component: () => import('./views/Predictions.vue') 
  },
  { 
    path: '/artists', 
    component: () => import('./views/Artists.vue') 
  },
  { 
    path: '/songs', 
    component: () => import('./views/Songs.vue') 
  },
  { 
    path: '/genres', 
    component: () => import('./views/Genres.vue') 
  },
  { 
    path: '/settings', 
    component: () => import('./views/Settings.vue') 
  }
]

console.log('创建路由...', routes)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 创建并挂载应用
const app = createApp(App)
console.log('应用创建成功')

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

try {
  console.log('开始挂载应用到#app元素')
  app.mount('#app')
  console.log('应用挂载完成')
} catch (error) {
  console.error('应用挂载失败:', error)
}
