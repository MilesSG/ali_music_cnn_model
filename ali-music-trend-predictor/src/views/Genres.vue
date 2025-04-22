<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { BarChart, PieChart, LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { useDark } from '@vueuse/core'

// 注册必要的echarts组件
echarts.use([GridComponent, BarChart, PieChart, LineChart, CanvasRenderer])

// 是否为深色模式
const isDarkMode = useDark()

// 状态管理
const isLoading = ref(true)
const searchQuery = ref('')
const timeRange = ref('month') // 'week', 'month', 'year'

// 模拟数据 - 实际项目中应从API获取
const genresList = ref([
  { id: 1, name: '流行', popularity: 85, growth: 12, songs: 12500, artists: 2300, avgDuration: 3.5 },
  { id: 2, name: '说唱', popularity: 78, growth: 18, songs: 8900, artists: 1200, avgDuration: 3.8 },
  { id: 3, name: '摇滚', popularity: 72, growth: 5, songs: 9500, artists: 1800, avgDuration: 4.2 },
  { id: 4, name: '民谣', popularity: 65, growth: 8, songs: 7300, artists: 1500, avgDuration: 4.0 },
  { id: 5, name: '电子', popularity: 69, growth: 15, songs: 6100, artists: 950, avgDuration: 4.5 },
  { id: 6, name: '古典', popularity: 45, growth: 2, songs: 4200, artists: 850, avgDuration: 7.2 },
  { id: 7, name: '爵士', popularity: 42, growth: 4, songs: 3800, artists: 750, avgDuration: 5.8 },
  { id: 8, name: '乡村', popularity: 39, growth: 3, songs: 3500, artists: 650, avgDuration: 3.9 },
  { id: 9, name: 'R&B', popularity: 68, growth: 10, songs: 6800, artists: 1100, avgDuration: 3.7 },
  { id: 10, name: '金属', popularity: 41, growth: 6, songs: 4100, artists: 780, avgDuration: 4.7 }
])

// 搜索过滤结果
const filteredGenres = computed(() => {
  if (!searchQuery.value) return genresList.value
  return genresList.value.filter(genre => 
    genre.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 流派总数统计数据
const genreStats = computed(() => {
  return {
    totalGenres: genresList.value.length,
    avgPopularity: Math.round(genresList.value.reduce((sum, genre) => sum + genre.popularity, 0) / genresList.value.length),
    avgGrowth: Math.round(genresList.value.reduce((sum, genre) => sum + genre.growth, 0) / genresList.value.length * 10) / 10,
    totalSongs: genresList.value.reduce((sum, genre) => sum + genre.songs, 0),
  }
})

// 历史趋势数据
const trendData = ref({
  '流行': [60, 65, 72, 78, 81, 85],
  '说唱': [45, 52, 58, 65, 72, 78],
  '摇滚': [75, 74, 72, 71, 72, 72],
  '电子': [42, 48, 55, 60, 65, 69],
  '民谣': [55, 58, 60, 62, 63, 65]
})

// 图表实例
const charts = ref<{[key: string]: echarts.ECharts}>({})

// 初始化图表
function initCharts() {
  console.log('初始化流派分析图表')
  // 流派流行度图表
  nextTick(() => {
    try {
      const popularityChartElement = document.getElementById('genre-popularity-chart')
      if (popularityChartElement) {
        charts.value.popularityChart = echarts.init(popularityChartElement, isDarkMode.value ? 'dark' : undefined)
        updatePopularityChart()
      } else {
        console.error('未找到流派流行度图表DOM元素')
      }
    } catch (error) {
      console.error('初始化流派流行度图表出错:', error)
    }
  })

  // 流派增长趋势图表
  nextTick(() => {
    try {
      const growthChartElement = document.getElementById('genre-growth-chart')
      if (growthChartElement) {
        charts.value.growthChart = echarts.init(growthChartElement, isDarkMode.value ? 'dark' : undefined)
        updateGrowthChart()
      } else {
        console.error('未找到流派增长趋势图表DOM元素')
      }
    } catch (error) {
      console.error('初始化流派增长趋势图表出错:', error)
    }
  })

  // 流派趋势变化图表
  nextTick(() => {
    try {
      const trendChartElement = document.getElementById('genre-trend-chart')
      if (trendChartElement) {
        charts.value.trendChart = echarts.init(trendChartElement, isDarkMode.value ? 'dark' : undefined)
        updateTrendChart()
      } else {
        console.error('未找到流派趋势变化图表DOM元素')
      }
    } catch (error) {
      console.error('初始化流派趋势变化图表出错:', error)
    }
  })
}

// 更新流派流行度图表
function updatePopularityChart() {
  if (!charts.value.popularityChart) return
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: '5%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '流行度',
      max: 100
    },
    yAxis: {
      type: 'category',
      data: genresList.value.sort((a, b) => b.popularity - a.popularity).slice(0, 8).map(genre => genre.name),
      axisLabel: {
        interval: 0
      }
    },
    series: [
      {
        name: '流行度指数',
        type: 'bar',
        data: genresList.value.sort((a, b) => b.popularity - a.popularity).slice(0, 8).map(genre => genre.popularity),
        itemStyle: {
          color: function(params) {
            const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4']
            return colorList[params.dataIndex % colorList.length]
          }
        }
      }
    ]
  }
  charts.value.popularityChart.setOption(option)
}

// 更新流派增长趋势图表
function updateGrowthChart() {
  if (!charts.value.growthChart) return
  
  const data = genresList.value.sort((a, b) => b.growth - a.growth).slice(0, 8)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}% ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      data: data.map(genre => genre.name)
    },
    series: [
      {
        name: '增长率',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data.map(genre => ({
          value: genre.growth,
          name: genre.name
        }))
      }
    ]
  }
  
  charts.value.growthChart.setOption(option)
}

// 更新流派趋势变化图表
function updateTrendChart() {
  if (!charts.value.trendChart) return
  
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  const series = Object.entries(trendData.value).map(([name, data]) => {
    return {
      name: name,
      type: 'line',
      data: data,
      smooth: true
    }
  })
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: Object.keys(trendData.value)
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months
    },
    yAxis: {
      type: 'value',
      name: '流行度'
    },
    series: series
  }
  
  charts.value.trendChart.setOption(option)
}

// 监听窗口大小变化
function handleResize() {
  Object.values(charts.value).forEach(chart => {
    chart && chart.resize()
  })
}

// 更新时间范围
function changeTimeRange(range: string) {
  timeRange.value = range
  // 在实际应用中，应当根据时间范围请求新数据
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    // 更新图表
    updatePopularityChart()
    updateGrowthChart()
    updateTrendChart()
  }, 500)
}

// 组件挂载时
onMounted(() => {
  console.log('流派页面组件已挂载')
  setTimeout(() => {
    isLoading.value = false
    initCharts()
  }, 800)
  
  window.addEventListener('resize', handleResize)
})

// 组件卸载时
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  Object.values(charts.value).forEach(chart => {
    chart && chart.dispose()
  })
})
</script>

<template>
  <div class="p-4 pb-20">
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-2">流派分析</h1>
      <p class="text-gray-600 dark:text-gray-400">
        探索不同音乐流派的流行趋势、增长率和相关统计
      </p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div class="relative w-full md:w-64">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索流派..."
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none"
        />
        <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
      </div>
      
      <div class="flex space-x-2">
        <button
          v-for="range in ['week', 'month', 'year']"
          :key="range"
          @click="changeTimeRange(range)"
          :class="[
            'px-4 py-2 rounded-lg',
            timeRange === range 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          ]"
        >
          {{ range === 'week' ? '周' : range === 'month' ? '月' : '年' }}
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
        <p class="mt-2">加载流派数据中...</p>
      </div>
    </div>

    <div v-else>
      <!-- 流派统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <i class="fas fa-music text-blue-500 dark:text-blue-300"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">流派总数</p>
              <p class="text-2xl font-bold">{{ genreStats.totalGenres }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <i class="fas fa-chart-line text-green-500 dark:text-green-300"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">平均流行度</p>
              <p class="text-2xl font-bold">{{ genreStats.avgPopularity }}<span class="text-sm">/100</span></p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-4">
              <i class="fas fa-arrow-trend-up text-yellow-500 dark:text-yellow-300"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">平均增长率</p>
              <p class="text-2xl font-bold">+{{ genreStats.avgGrowth }}%</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
              <i class="fas fa-compact-disc text-purple-500 dark:text-purple-300"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">总歌曲数</p>
              <p class="text-2xl font-bold">{{ (genreStats.totalSongs/1000).toFixed(1) }}K</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 class="text-lg font-semibold mb-4">流派流行度排名</h2>
          <div id="genre-popularity-chart" class="w-full h-80"></div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 class="text-lg font-semibold mb-4">流派增长率分布</h2>
          <div id="genre-growth-chart" class="w-full h-80"></div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
        <h2 class="text-lg font-semibold mb-4">流派趋势变化 (近6个月)</h2>
        <div id="genre-trend-chart" class="w-full h-80"></div>
      </div>

      <!-- 流派列表 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold">流派详细数据</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">流派名称</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">流行度</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">增长率</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">歌曲数</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">艺术家数</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">平均时长</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="genre in filteredGenres" :key="genre.id" class="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">{{ genre.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex items-center">
                    <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div class="bg-blue-600 h-2.5 rounded-full" :style="`width: ${genre.popularity}%`"></div>
                    </div>
                    <span class="ml-2">{{ genre.popularity }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span class="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    +{{ genre.growth }}%
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ genre.songs.toLocaleString() }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ genre.artists.toLocaleString() }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ genre.avgDuration }}分钟</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 50;
}

.dark .loading-overlay {
  background-color: rgba(30, 41, 59, 0.8);
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #4f46e5;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style> 