<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { useLocalStorage } from '@vueuse/core'
import SettingsList from '../components/SettingsList.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)

// 用户设置
const userSettings = reactive([
  {
    id: 'darkMode',
    name: '暗黑模式',
    description: '启用深色主题',
    type: 'toggle',
    value: isDark.value
  },
  {
    id: 'notifications',
    name: '通知',
    description: '启用应用通知',
    type: 'toggle',
    value: true
  },
  {
    id: 'autoRefresh',
    name: '自动刷新',
    description: '启用数据自动刷新',
    type: 'toggle',
    value: true
  },
  {
    id: 'refreshInterval',
    name: '刷新间隔',
    description: '自动刷新数据的时间间隔（秒）',
    type: 'range',
    min: 30,
    max: 300,
    step: 30,
    value: 60
  },
  {
    id: 'defaultView',
    name: '默认视图',
    description: '打开应用时显示的默认页面',
    type: 'select',
    value: 'dashboard',
    options: [
      { label: '仪表盘', value: 'dashboard' },
      { label: '预测', value: 'predictions' },
      { label: '分析', value: 'analysis' }
    ]
  },
  {
    id: 'language',
    name: '语言',
    description: '应用界面语言',
    type: 'select',
    value: 'zh',
    options: [
      { label: '中文', value: 'zh' },
      { label: '英文', value: 'en' }
    ]
  }
])

// 数据源设置
const dataSourcesSettings = reactive([
  {
    id: 'netease',
    name: '网易云音乐',
    description: '启用网易云音乐数据源',
    type: 'toggle',
    value: true
  },
  {
    id: 'qq',
    name: 'QQ音乐',
    description: '启用QQ音乐数据源',
    type: 'toggle',
    value: true
  },
  {
    id: 'kugou',
    name: '酷狗音乐',
    description: '启用酷狗音乐数据源',
    type: 'toggle',
    value: true
  },
  {
    id: 'kuwo',
    name: '酷我音乐',
    description: '启用酷我音乐数据源',
    type: 'toggle',
    value: false
  },
  {
    id: 'bilibili',
    name: 'Bilibili音乐区',
    description: '启用B站音乐区数据',
    type: 'toggle',
    value: true
  },
  {
    id: 'douyin',
    name: '抖音热门音乐',
    description: '启用抖音热门音乐数据',
    type: 'toggle',
    value: true
  }
])

// 缓存与性能设置
const cacheSettings = reactive([
  {
    id: 'enableCache',
    name: '启用缓存',
    description: '启用数据缓存以提高性能',
    type: 'toggle',
    value: true
  },
  {
    id: 'cacheTTL',
    name: '缓存时间',
    description: '数据缓存保留时间（分钟）',
    type: 'range',
    min: 5,
    max: 120,
    step: 5,
    value: 30
  },
  {
    id: 'maxCacheSize',
    name: '最大缓存大小',
    description: '最大缓存数据大小（MB）',
    type: 'range',
    min: 10,
    max: 200,
    step: 10,
    value: 50
  },
  {
    id: 'clearCache',
    name: '清除缓存',
    type: 'button',
    value: null,
    action: clearCache
  }
])

// 数据与隐私设置
const dataPrivacySettings = reactive([
  {
    id: 'dataCompression',
    name: '数据压缩',
    description: '压缩传输数据以节省流量',
    type: 'toggle',
    value: true
  },
  {
    id: 'analytics',
    name: '使用分析',
    description: '允许收集匿名使用数据以改进应用',
    type: 'toggle',
    value: false
  },
  {
    id: 'exportJson',
    name: '导出JSON',
    type: 'button',
    value: null,
    action: () => exportData('json')
  },
  {
    id: 'exportCsv',
    name: '导出CSV',
    type: 'button',
    value: null,
    action: () => exportData('csv')
  },
  {
    id: 'exportExcel',
    name: '导出Excel',
    type: 'button',
    value: null,
    action: () => exportData('excel')
  },
  {
    id: 'resetAll',
    name: '重置所有设置',
    type: 'button',
    value: null,
    action: resetAllSettings
  }
])

// 操作状态反馈
const isLoading = ref(false)
const statusMessage = ref('')
const statusType = ref('info') // 'info', 'success', 'error'

// 监听暗黑模式变化
const updateUserSetting = (newSettings: any[]) => {
  const darkModeSetting = newSettings.find(s => s.id === 'darkMode')
  if (darkModeSetting && darkModeSetting.value !== isDark.value) {
    toggleDark()
  }
  
  // 这里可以加入保存设置到本地存储的逻辑
  saveSettings()
}

// 保存设置
function saveSettings() {
  isLoading.value = true
  statusMessage.value = '正在保存设置...'
  statusType.value = 'info'
  
  // 模拟异步保存
  setTimeout(() => {
    // 保存所有设置到localStorage
    const allSettings = {
      user: userSettings,
      dataSources: dataSourcesSettings,
      cache: cacheSettings,
      dataPrivacy: dataPrivacySettings
    }
    
    localStorage.setItem('app-settings', JSON.stringify(allSettings))
    
    isLoading.value = false
    statusMessage.value = '设置已保存'
    statusType.value = 'success'
    
    // 3秒后清除状态消息
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
  }, 800)
}

// 导出数据
function exportData(format: string) {
  isLoading.value = true
  statusMessage.value = `正在准备${format.toUpperCase()}数据...`
  statusType.value = 'info'
  
  // 模拟异步导出
  setTimeout(() => {
    isLoading.value = false
    statusMessage.value = `数据已导出为${format.toUpperCase()}格式`
    statusType.value = 'success'
    
    // 模拟下载文件
    const link = document.createElement('a')
    link.href = '#'
    link.download = `music-trend-data.${format}`
    link.click()
    
    // 3秒后清除状态消息
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
  }, 1500)
}

// 清除缓存
function clearCache() {
  isLoading.value = true
  statusMessage.value = '正在清除缓存...'
  statusType.value = 'info'
  
  // 模拟异步清除
  setTimeout(() => {
    // 实际清除逻辑
    localStorage.removeItem('app-cache')
    
    isLoading.value = false
    statusMessage.value = '缓存已清除'
    statusType.value = 'success'
    
    // 3秒后清除状态消息
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
  }, 1000)
}

// 重置所有设置
function resetAllSettings() {
  if (confirm('确定要重置所有设置吗？这将恢复所有设置到默认值。')) {
    isLoading.value = true
    statusMessage.value = '正在重置所有设置...'
    statusType.value = 'info'
    
    // 模拟异步重置
    setTimeout(() => {
      // 实际重置逻辑
      localStorage.removeItem('app-settings')
      
      // 重置内存中的设置
      // 此处应该有更完整的重置逻辑
      
      isLoading.value = false
      statusMessage.value = '所有设置已重置为默认值'
      statusType.value = 'success'
      
      // 3秒后清除状态消息
      setTimeout(() => {
        statusMessage.value = ''
        // 刷新页面以应用默认设置
        window.location.reload()
      }, 3000)
    }, 1500)
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">设置</h1>
    
    <!-- 加载状态 -->
    <div v-if="statusMessage" class="mb-6 p-4 rounded-lg" :class="{
      'bg-blue-100 text-blue-800': statusType === 'info',
      'bg-green-100 text-green-800': statusType === 'success',
      'bg-red-100 text-red-800': statusType === 'error'
    }">
      <div class="flex items-center">
        <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <i v-else-if="statusType === 'success'" class="fas fa-check-circle mr-2"></i>
        <i v-else-if="statusType === 'error'" class="fas fa-exclamation-circle mr-2"></i>
        <i v-else class="fas fa-info-circle mr-2"></i>
        <span>{{ statusMessage }}</span>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-6">
        <!-- 用户设置 -->
        <SettingsList 
          title="用户偏好" 
          icon="user-cog" 
          :settings="userSettings"
          @update:settings="updateUserSetting"
        />
        
        <!-- 数据源设置 -->
        <SettingsList 
          title="数据源管理" 
          icon="database" 
          :settings="dataSourcesSettings"
          @update:settings="dataSourcesSettings = $event"
        />
      </div>
      
      <div class="space-y-6">
        <!-- 缓存与性能设置 -->
        <SettingsList 
          title="性能与缓存" 
          icon="tachometer-alt" 
          :settings="cacheSettings"
          @update:settings="cacheSettings = $event"
        />
        
        <!-- 数据与隐私设置 -->
        <SettingsList 
          title="数据与隐私" 
          icon="shield-alt" 
          :settings="dataPrivacySettings"
          @update:settings="dataPrivacySettings = $event"
        />
        
        <!-- 关于 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div class="flex items-center mb-4">
            <i class="fas fa-info-circle text-blue-500 mr-3"></i>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">关于</h3>
          </div>
          
          <div class="space-y-2 text-gray-700 dark:text-gray-300">
            <p>音乐趋势预测系统</p>
            <p>版本: 1.0.0</p>
            <p>© 2023 Ali Music Group</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部保存按钮 -->
    <div class="mt-8 flex justify-end">
      <button 
        @click="saveSettings" 
        class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center"
        :disabled="isLoading"
      >
        <i class="fas fa-save mr-2"></i>
        保存所有设置
      </button>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style> 