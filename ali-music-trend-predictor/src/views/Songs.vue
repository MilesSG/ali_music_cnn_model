<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useDark } from '@vueuse/core'

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])

const isDarkMode = useDark()
const isLoading = ref(true)
const selectedTimeRange = ref('week')
const searchQuery = ref('')

// 热门歌曲数据
const trendingSongs = ref([
  { id: 1, name: '星辰大海', artist: '黄霄雲', popularity: 98, trend: 'up', weeklyChange: '+12%', genre: '流行' },
  { id: 2, name: 'Love Story', artist: 'Taylor Swift', popularity: 95, trend: 'up', weeklyChange: '+8%', genre: '乡村流行' },
  { id: 3, name: '起风了', artist: '买辣椒也用券', popularity: 94, trend: 'stable', weeklyChange: '+2%', genre: '民谣' },
  { id: 4, name: 'Bad Guy', artist: 'Billie Eilish', popularity: 91, trend: 'down', weeklyChange: '-3%', genre: '另类流行' },
  { id: 5, name: '我曾', artist: '隔壁老樊', popularity: 89, trend: 'up', weeklyChange: '+5%', genre: '民谣' },
  { id: 6, name: 'Blinding Lights', artist: 'The Weeknd', popularity: 88, trend: 'down', weeklyChange: '-1%', genre: '流行' },
  { id: 7, name: '句号', artist: '邓紫棋', popularity: 86, trend: 'up', weeklyChange: '+4%', genre: '流行' },
  { id: 8, name: 'Dance Monkey', artist: 'Tones and I', popularity: 84, trend: 'down', weeklyChange: '-6%', genre: '流行' },
  { id: 9, name: '光点', artist: '陈奕迅', popularity: 83, trend: 'stable', weeklyChange: '0%', genre: '粤语流行' },
  { id: 10, name: 'Shape of You', artist: 'Ed Sheeran', popularity: 82, trend: 'down', weeklyChange: '-2%', genre: '流行' }
])

// 歌曲趋势图数据
const songTrendData = ref({
  dates: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  series: [
    {
      name: '流行',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: '嘻哈',
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: '摇滚',
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: '电子',
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: '民谣',
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
})

// 音乐特征数据
const musicFeatures = ref({
  categories: ['能量', '舞曲性', '音乐性', '歌词性', '声音清晰度', '旋律感'],
  series: [
    {
      name: '热门歌曲平均特征',
      value: [0.8, 0.7, 0.6, 0.9, 0.7, 0.8]
    },
    {
      name: '流行歌曲平均特征',
      value: [0.7, 0.8, 0.5, 0.8, 0.6, 0.7]
    }
  ]
})

// 流派分布数据
const genreDistribution = ref([
  { value: 40, name: '流行' },
  { value: 20, name: '嘻哈' },
  { value: 15, name: '摇滚' },
  { value: 10, name: '电子' },
  { value: 15, name: '民谣' }
])

// 过滤的歌曲列表
const filteredSongs = computed(() => {
  if (!searchQuery.value) return trendingSongs.value
  
  const query = searchQuery.value.toLowerCase()
  return trendingSongs.value.filter(song => 
    song.name.toLowerCase().includes(query) || 
    song.artist.toLowerCase().includes(query) || 
    song.genre.toLowerCase().includes(query)
  )
})

// 图表实例
const charts = ref<{[key: string]: echarts.ECharts}>({})

// 更新歌曲趋势图
function updateSongTrends() {
  if (!charts.value.songTrendsChart) return

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: songTrendData.value.series.map(item => item.name)
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: songTrendData.value.dates
    },
    yAxis: {
      type: 'value',
      name: '流行度指数'
    },
    series: songTrendData.value.series.map(item => ({
      name: item.name,
      type: 'line',
      data: item.data,
      smooth: true,
      emphasis: {
        focus: 'series'
      }
    }))
  }

  charts.value.songTrendsChart.setOption(option)
}

// 更新歌曲特征图
function updateSongFeatures() {
  if (!charts.value.songFeaturesChart) return

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: musicFeatures.value.series.map(item => item.name)
    },
    radar: {
      indicator: musicFeatures.value.categories.map(category => ({
        name: category,
        max: 1
      }))
    },
    series: [
      {
        type: 'radar',
        data: musicFeatures.value.series.map(item => ({
          value: item.value,
          name: item.name
        }))
      }
    ]
  }

  charts.value.songFeaturesChart.setOption(option)
}

// 更新流派分布图
function updateGenreDistribution() {
  if (!charts.value.genreDistributionChart) return

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: genreDistribution.value.map(item => item.name)
    },
    series: [
      {
        name: '流派分布',
        type: 'pie',
        radius: ['50%', '70%'],
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
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: genreDistribution.value
      }
    ]
  }

  charts.value.genreDistributionChart.setOption(option)
}

// 初始化图表
function initCharts() {
  console.log('初始化歌曲分析图表')
  
  // 歌曲趋势图表
  nextTick(() => {
    try {
      const trendsChartElement = document.getElementById('song-trends-chart')
      if (trendsChartElement) {
        charts.value.songTrendsChart = echarts.init(trendsChartElement, isDarkMode.value ? 'dark' : undefined)
        updateSongTrends()
      } else {
        console.error('未找到歌曲趋势图表DOM元素')
      }
    } catch (error) {
      console.error('初始化歌曲趋势图表出错:', error)
    }
  })

  // 歌曲特征图表
  nextTick(() => {
    try {
      const featuresChartElement = document.getElementById('song-features-chart')
      if (featuresChartElement) {
        charts.value.songFeaturesChart = echarts.init(featuresChartElement, isDarkMode.value ? 'dark' : undefined)
        updateSongFeatures()
      } else {
        console.error('未找到歌曲特征图表DOM元素')
      }
    } catch (error) {
      console.error('初始化歌曲特征图表出错:', error)
    }
  })

  // 流派分布图表
  nextTick(() => {
    try {
      const genreChartElement = document.getElementById('genre-distribution-chart')
      if (genreChartElement) {
        charts.value.genreDistributionChart = echarts.init(genreChartElement, isDarkMode.value ? 'dark' : undefined)
        updateGenreDistribution()
      } else {
        console.error('未找到流派分布图表DOM元素')
      }
    } catch (error) {
      console.error('初始化流派分布图表出错:', error)
    }
  })
}

// 监听窗口大小变化
function handleResize() {
  Object.values(charts.value).forEach(chart => {
    chart && chart.resize()
  })
}

// 改变时间范围
function changeTimeRange(range: string) {
  selectedTimeRange.value = range
  isLoading.value = true
  
  // 模拟数据加载延迟
  setTimeout(() => {
    isLoading.value = false
    // 在实际应用中，这里应该根据新的时间范围重新请求数据
    initCharts()
  }, 500)
}

// 组件挂载时
onMounted(() => {
  console.log('歌曲页面组件已挂载')
  
  // 模拟数据加载
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
      <h1 class="text-2xl font-bold mb-2">热门歌曲分析</h1>
      <p class="text-gray-600 dark:text-gray-400">
        探索最受欢迎的歌曲，分析流行趋势和音乐特征
      </p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div class="relative w-full md:w-64">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索歌曲、艺术家或流派..."
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
            selectedTimeRange === range 
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
        <p class="mt-2">加载歌曲数据中...</p>
      </div>
    </div>

    <div v-else>
      <!-- 图表区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 class="text-lg font-semibold mb-4">歌曲流派趋势</h2>
          <div id="song-trends-chart" class="w-full h-80"></div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 class="text-lg font-semibold mb-4">流派分布</h2>
          <div id="genre-distribution-chart" class="w-full h-80"></div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
        <h2 class="text-lg font-semibold mb-4">歌曲特征分析</h2>
        <div id="song-features-chart" class="w-full h-80"></div>
      </div>

      <!-- 热门歌曲列表 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold">热门歌曲榜单</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            显示 {{ filteredSongs.length }} 首歌曲
          </p>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">排名</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">歌曲</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">艺术家</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">流派</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">流行度</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">周变化</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">趋势</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(song, index) in filteredSongs" :key="song.id" class="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ index + 1 }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ song.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ song.artist }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ song.genre }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div class="bg-blue-600 h-2.5 rounded-full" :style="`width: ${song.popularity}%`"></div>
                    </div>
                    <span class="ml-2 text-sm text-gray-900 dark:text-white">{{ song.popularity }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm" :class="{
                    'text-green-600 dark:text-green-400': song.weeklyChange.startsWith('+'),
                    'text-red-600 dark:text-red-400': song.weeklyChange.startsWith('-'),
                    'text-gray-500 dark:text-gray-400': song.weeklyChange === '0%'
                  }">{{ song.weeklyChange }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': song.trend === 'up',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': song.trend === 'down',
                      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200': song.trend === 'stable'
                    }">
                    <i class="fas" :class="{
                      'fa-arrow-up': song.trend === 'up',
                      'fa-arrow-down': song.trend === 'down',
                      'fa-minus': song.trend === 'stable'
                    }"></i>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式 */
</style> 