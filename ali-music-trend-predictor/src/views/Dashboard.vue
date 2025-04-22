<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import { useDark, useToggle } from '@vueuse/core'

// 黑暗模式切换
const isDarkMode = useDark()
const toggleDark = useToggle(isDarkMode)

// 自动刷新设置
const autoRefreshEnabled = ref(false)
const refreshInterval = ref(30) // 秒
let refreshTimer: number | null = null

// 时间范围选择
const timeRangeOptions = [
  { label: '今日', value: 'today' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '全年', value: 'year' }
]
const selectedTimeRange = ref('week')

// 加载状态
const isLoading = ref(false)

// 预测艺术家数据
const predictedArtists = ref([
  { name: '周杰伦', probability: 96, trend: '+12%', genre: '华语流行', prediction: '稳定领先' },
  { name: 'Taylor Swift', probability: 92, trend: '+8%', genre: '欧美流行', prediction: '持续上升' },
  { name: '林俊杰', probability: 88, trend: '+5%', genre: '华语流行', prediction: '稳步增长' },
  { name: '薛之谦', probability: 85, trend: '+3%', genre: '华语流行', prediction: '潜力股' },
  { name: 'BLACKPINK', probability: 83, trend: '+15%', genre: '韩流', prediction: '爆发力强' }
])

// 预测歌曲数据
const predictedSongs = ref([
  { name: '说好不哭', artist: '周杰伦', probability: 94, trend: '+9%', genre: '华语流行' },
  { name: 'Anti-Hero', artist: 'Taylor Swift', probability: 92, trend: '+12%', genre: '欧美流行' },
  { name: '修炼爱情', artist: '林俊杰', probability: 87, trend: '+4%', genre: '华语流行' },
  { name: '天外来物', artist: '薛之谦', probability: 85, trend: '+6%', genre: '华语流行' },
  { name: 'Pink Venom', artist: 'BLACKPINK', probability: 82, trend: '+18%', genre: '韩流' }
])

// 系统指标
const systemMetrics = ref({
  cpuLoad: 42,
  memoryUsage: 68,
  diskSpace: 73,
  networkBandwidth: 56
})

// 预测趋势数据
const predictionTrendData = reactive({
  categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  series: [
    {
      name: '华语流行',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: '欧美流行',
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: '嘻哈说唱',
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: '电子音乐',
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: '古风音乐',
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
})

// 图表实例
let predictionTrendChart: echarts.ECharts | null = null

// 切换自动刷新
function toggleAutoRefresh() {
  autoRefreshEnabled.value = !autoRefreshEnabled.value
  if (autoRefreshEnabled.value) {
    startRefreshTimer()
  } else {
    stopRefreshTimer()
  }
}

// 开始刷新计时器
function startRefreshTimer() {
  stopRefreshTimer() // 确保先停止之前的计时器
  refreshTimer = window.setInterval(() => {
    refreshData()
  }, refreshInterval.value * 1000)
}

// 停止刷新计时器
function stopRefreshTimer() {
  if (refreshTimer !== null) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// 手动刷新数据
function refreshData() {
  console.log('刷新数据...')
  isLoading.value = true
  
  // 模拟API请求延迟
  setTimeout(() => {
    fetchDataByTimeRange(selectedTimeRange.value)
    isLoading.value = false
  }, 800)
}

// 根据时间范围获取数据
function fetchDataByTimeRange(timeRange: string) {
  console.log(`获取${timeRange}时间范围的数据`)
  
  // 这里是模拟不同时间范围的数据变化
  // 实际应用中应该调用真实的API
  
  // 模拟数据变化
  systemMetrics.value = {
    cpuLoad: Math.floor(Math.random() * 30) + 30,
    memoryUsage: Math.floor(Math.random() * 20) + 60,
    diskSpace: Math.floor(Math.random() * 15) + 65,
    networkBandwidth: Math.floor(Math.random() * 40) + 40
  }
  
  // 更新图表数据
  const newData = predictionTrendData.series.map(series => ({
    ...series,
    data: series.data.map(() => Math.floor(Math.random() * 1000) + 100)
  }))
  
  predictionTrendData.series = newData
  
  // 更新图表
  nextTick(() => {
    updatePredictionTrendChart()
  })
}

// 初始化所有图表
function initCharts() {
  try {
    console.log('开始初始化图表')
    nextTick(() => {
      updatePredictionTrendChart()
    })
  } catch (error) {
    console.error('图表初始化失败:', error)
  }
}

// 更新预测趋势图表
function updatePredictionTrendChart() {
  try {
    const chartDom = document.getElementById('prediction-trend-chart')
    if (!chartDom) {
      console.error('找不到图表DOM元素: prediction-trend-chart')
      return
    }
    
    // 如果图表已存在，直接更新数据
    if (predictionTrendChart) {
      predictionTrendChart.setOption({
        series: predictionTrendData.series.map(item => ({
          name: item.name,
          data: item.data
        }))
      })
      return
    }
    
    // 初始化图表
    predictionTrendChart = echarts.init(chartDom, isDarkMode.value ? 'dark' : undefined)
    
    // 图表配置
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: predictionTrendData.series.map(item => item.name)
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: predictionTrendData.categories
      },
      yAxis: {
        type: 'value'
      },
      series: predictionTrendData.series.map(item => ({
        name: item.name,
        type: 'line',
        smooth: true,
        data: item.data
      }))
    }
    
    predictionTrendChart.setOption(option)
  } catch (error) {
    console.error('更新图表失败:', error)
  }
}

// 监听窗口大小变化，重绘图表
function handleResize() {
  if (predictionTrendChart) {
    predictionTrendChart.resize()
  }
}

// 监听主题变化，更新图表主题
watch(isDarkMode, (newValue) => {
  if (predictionTrendChart) {
    // 销毁旧图表
    predictionTrendChart.dispose()
    predictionTrendChart = null
    
    // 重新初始化图表
    nextTick(() => {
      updatePredictionTrendChart()
    })
  }
})

// 组件挂载时初始化
onMounted(() => {
  console.log('Dashboard组件已挂载')
  
  window.addEventListener('resize', handleResize)
  
  initCharts()
  
  // 首次加载数据
  refreshData()
})

// 组件卸载时清理
onUnmounted(() => {
  console.log('Dashboard组件已卸载')
  
  window.removeEventListener('resize', handleResize)
  stopRefreshTimer()
  
  // 销毁图表实例
  if (predictionTrendChart) {
    predictionTrendChart.dispose()
    predictionTrendChart = null
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- 顶部标题和描述区域 -->
    <div class="w-full bg-white dark:bg-gray-800 shadow-md p-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              阿里音乐趋势预测系统
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              基于人工智能的音乐趋势分析和预测平台，助力艺术家和唱片公司精准把握市场动向
            </p>
          </div>
          
          <div class="mt-4 md:mt-0 flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600 dark:text-gray-300">数据刷新</span>
              <div class="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  v-model="autoRefreshEnabled"
                  @change="toggleAutoRefresh"
                  class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label 
                  class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"
                ></label>
              </div>
            </div>
            
            <select 
              v-model="refreshInterval"
              class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-3 py-1 text-sm"
              :disabled="!autoRefreshEnabled"
            >
              <option :value="10">10秒</option>
              <option :value="30">30秒</option>
              <option :value="60">1分钟</option>
              <option :value="300">5分钟</option>
            </select>
            
            <button 
              @click="refreshData"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="mr-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <span v-else class="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </span>
              {{ isLoading ? '加载中...' : '刷新数据' }}
            </button>
            
            <button 
              @click="toggleDark()"
              class="bg-gray-200 dark:bg-gray-700 p-2 rounded-full"
            >
              <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 时间范围选择 -->
        <div class="mt-6 flex justify-start">
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <button 
              v-for="option in timeRangeOptions" 
              :key="option.value"
              type="button" 
              @click="selectedTimeRange = option.value; refreshData()"
              :class="[
                'px-4 py-2 text-sm font-medium',
                selectedTimeRange === option.value 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600',
                'border border-gray-200 dark:border-gray-600',
              ]"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <!-- 核心指标卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-blue-500 text-white rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-2">预测准确率</h2>
          <p class="text-3xl font-bold">92.7%</p>
        </div>
        
        <div class="bg-purple-500 text-white rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-2">已处理歌曲</h2>
          <p class="text-3xl font-bold">23,786</p>
        </div>
        
        <div class="bg-green-500 text-white rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-2">音乐流派</h2>
          <p class="text-3xl font-bold">42</p>
        </div>
      </div>
      
      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 左侧内容：预测趋势图表 -->
        <div class="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            流派热度预测趋势
          </h2>
          
          <div id="prediction-trend-chart" class="w-full h-80"></div>
        </div>
        
        <!-- 右侧边栏：统计数据 -->
        <div class="lg:col-span-1 space-y-6">
          <!-- 流派分布 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              流派分布
            </h2>
            
            <div class="space-y-3">
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">华语流行</span>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">45%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" style="width: 45%"></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">欧美流行</span>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">30%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div class="bg-purple-600 h-2 rounded-full" style="width: 30%"></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">嘻哈说唱</span>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">15%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div class="bg-yellow-500 h-2 rounded-full" style="width: 15%"></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">其他流派</span>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">10%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" style="width: 10%"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 系统状态 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              系统状态
            </h2>
            
            <div class="space-y-3">
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">CPU负载</span>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ systemMetrics.cpuLoad }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    class="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    :style="`width: ${systemMetrics.cpuLoad}%`"
                  ></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">内存使用</span>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ systemMetrics.memoryUsage }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    class="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                    :style="`width: ${systemMetrics.memoryUsage}%`"
                  ></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">磁盘空间</span>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ systemMetrics.diskSpace }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    class="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
                    :style="`width: ${systemMetrics.diskSpace}%`"
                  ></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">网络带宽</span>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ systemMetrics.networkBandwidth }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    class="bg-green-500 h-2 rounded-full transition-all duration-500" 
                    :style="`width: ${systemMetrics.networkBandwidth}%`"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 预测结果表格 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <!-- 艺术家热度预测 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            艺术家热度预测
          </h2>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    艺术家
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    流派
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    可能性
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    趋势
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(artist, index) in predictedArtists" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ artist.name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500 dark:text-gray-300">{{ artist.genre }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">{{ artist.probability }}%</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                      {{ artist.trend }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- 潜力歌曲预测 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            潜力歌曲预测
          </h2>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    歌曲
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    艺术家
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    可能性
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    趋势
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(song, index) in predictedSongs" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ song.name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500 dark:text-gray-300">{{ song.artist }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">{{ song.probability }}%</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                      {{ song.trend }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toggle-checkbox:checked {
  right: 0;
  border-color: #68D391;
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #68D391;
}
.toggle-checkbox {
  right: 0;
  transition: all 0.3s;
}
.toggle-label {
  transition: background-color 0.3s;
}
</style> 