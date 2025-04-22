<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { useDark } from '@vueuse/core'

// 注册必要的echarts组件
echarts.use([GridComponent, TooltipComponent, LegendComponent, BarChart, LineChart, PieChart, RadarChart, CanvasRenderer])

// 是否为深色模式
const isDarkMode = useDark()

// 状态管理
const isLoading = ref(true)
const searchQuery = ref('')
const filterGenre = ref('全部')
const sortBy = ref('popularity')
const sortOrder = ref('desc')

// 模拟数据 - 实际项目中应从API获取
const artistsList = ref([
  { id: 1, name: '周杰伦', avatarUrl: 'https://via.placeholder.com/150', popularity: 98, monthlySongs: 5200000, genre: '流行', followers: 8500000, growthRate: 2.5, topHit: '稻香' },
  { id: 2, name: '林俊杰', avatarUrl: 'https://via.placeholder.com/150', popularity: 95, monthlySongs: 4800000, genre: '流行', followers: 7800000, growthRate: 3.1, topHit: '修炼爱情' },
  { id: 3, name: '陈奕迅', avatarUrl: 'https://via.placeholder.com/150', popularity: 94, monthlySongs: 4500000, genre: '流行', followers: 7200000, growthRate: 1.8, topHit: '十年' },
  { id: 4, name: '薛之谦', avatarUrl: 'https://via.placeholder.com/150', popularity: 92, monthlySongs: 4100000, genre: '流行', followers: 6500000, growthRate: 4.2, topHit: '演员' },
  { id: 5, name: '张艺兴', avatarUrl: 'https://via.placeholder.com/150', popularity: 89, monthlySongs: 3800000, genre: '流行/说唱', followers: 6200000, growthRate: 5.5, topHit: 'Sheep' },
  { id: 6, name: '华晨宇', avatarUrl: 'https://via.placeholder.com/150', popularity: 88, monthlySongs: 3600000, genre: '流行/摇滚', followers: 5900000, growthRate: 3.7, topHit: '齐天' },
  { id: 7, name: '李荣浩', avatarUrl: 'https://via.placeholder.com/150', popularity: 87, monthlySongs: 3400000, genre: '流行', followers: 5600000, growthRate: 2.9, topHit: '模特' },
  { id: 8, name: '王力宏', avatarUrl: 'https://via.placeholder.com/150', popularity: 85, monthlySongs: 3200000, genre: '流行', followers: 5300000, growthRate: 1.5, topHit: '大城小爱' },
  { id: 9, name: '邓紫棋', avatarUrl: 'https://via.placeholder.com/150', popularity: 91, monthlySongs: 3900000, genre: '流行/摇滚', followers: 6300000, growthRate: 4.8, topHit: '泡沫' },
  { id: 10, name: '五月天', avatarUrl: 'https://via.placeholder.com/150', popularity: 90, monthlySongs: 3700000, genre: '摇滚', followers: 6100000, growthRate: 2.3, topHit: '倔强' },
  { id: 11, name: '马思唯', avatarUrl: 'https://via.placeholder.com/150', popularity: 82, monthlySongs: 2900000, genre: '说唱', followers: 4800000, growthRate: 7.2, topHit: '马思唯Freestyle' },
  { id: 12, name: '毛不易', avatarUrl: 'https://via.placeholder.com/150', popularity: 86, monthlySongs: 3300000, genre: '民谣', followers: 5500000, growthRate: 3.4, topHit: '消愁' }
])

// 流派列表
const genres = computed(() => {
  const uniqueGenres = new Set(artistsList.value.map(artist => artist.genre))
  return ['全部', ...Array.from(uniqueGenres)]
})

// 过滤和排序后的艺术家列表
const filteredArtists = computed(() => {
  let result = artistsList.value

  // 应用搜索过滤
  if (searchQuery.value) {
    result = result.filter(artist => 
      artist.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 应用流派过滤
  if (filterGenre.value !== '全部') {
    result = result.filter(artist => 
      artist.genre.includes(filterGenre.value)
    )
  }

  // 应用排序
  result = [...result].sort((a, b) => {
    const aValue = a[sortBy.value as keyof typeof a]
    const bValue = b[sortBy.value as keyof typeof b]
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue
    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder.value === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue)
    }
    return 0
  })

  return result
})

// 艺术家统计数据
const artistStats = computed(() => {
  return {
    totalArtists: artistsList.value.length,
    avgPopularity: Math.round(artistsList.value.reduce((sum, artist) => sum + artist.popularity, 0) / artistsList.value.length),
    totalListens: artistsList.value.reduce((sum, artist) => sum + artist.monthlySongs, 0),
    avgGrowth: Math.round(artistsList.value.reduce((sum, artist) => sum + artist.growthRate, 0) / artistsList.value.length * 10) / 10
  }
})

// 图表实例
const charts = ref<{[key: string]: echarts.ECharts}>({})

// 初始化图表
function initCharts() {
  console.log('初始化艺术家分析图表')
  
  // 顶级艺术家流行度对比图表
  nextTick(() => {
    try {
      const popularityChartElement = document.getElementById('artist-popularity-chart')
      if (popularityChartElement) {
        charts.value.popularityChart = echarts.init(popularityChartElement, isDarkMode.value ? 'dark' : undefined)
        updatePopularityChart()
      } else {
        console.error('未找到艺术家流行度图表DOM元素')
      }
    } catch (error) {
      console.error('初始化艺术家流行度图表出错:', error)
    }
  })

  // 流派分布图表
  nextTick(() => {
    try {
      const genreDistributionElement = document.getElementById('genre-distribution-chart')
      if (genreDistributionElement) {
        charts.value.genreDistributionChart = echarts.init(genreDistributionElement, isDarkMode.value ? 'dark' : undefined)
        updateGenreDistributionChart()
      } else {
        console.error('未找到流派分布图表DOM元素')
      }
    } catch (error) {
      console.error('初始化流派分布图表出错:', error)
    }
  })

  // 艺术家增长趋势图表
  nextTick(() => {
    try {
      const growthTrendElement = document.getElementById('growth-trend-chart')
      if (growthTrendElement) {
        charts.value.growthTrendChart = echarts.init(growthTrendElement, isDarkMode.value ? 'dark' : undefined)
        updateGrowthTrendChart()
      } else {
        console.error('未找到艺术家增长趋势图表DOM元素')
      }
    } catch (error) {
      console.error('初始化艺术家增长趋势图表出错:', error)
    }
  })
}

// 更新顶级艺术家流行度对比图表
function updatePopularityChart() {
  if (!charts.value.popularityChart) return
  
  const topArtists = [...artistsList.value].sort((a, b) => b.popularity - a.popularity).slice(0, 10)
  
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
      type: 'category',
      data: topArtists.map(artist => artist.name),
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      name: '流行度',
      max: 100
    },
    series: [
      {
        name: '流行度指数',
        type: 'bar',
        data: topArtists.map(artist => artist.popularity),
        itemStyle: {
          color: function(params) {
            const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#c23531']
            return colorList[params.dataIndex % colorList.length]
          }
        }
      }
    ]
  }
  
  charts.value.popularityChart.setOption(option)
}

// 更新流派分布图表
function updateGenreDistributionChart() {
  if (!charts.value.genreDistributionChart) return
  
  const genreCounts = artistsList.value.reduce((acc, artist) => {
    const genres = artist.genre.split('/')
    genres.forEach(genre => {
      const trimmedGenre = genre.trim()
      acc[trimmedGenre] = (acc[trimmedGenre] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)
  
  const data = Object.entries(genreCounts).map(([name, value]) => ({ name, value }))
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      data: data.map(item => item.name)
    },
    series: [
      {
        name: '艺术家流派',
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
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data
      }
    ]
  }
  
  charts.value.genreDistributionChart.setOption(option)
}

// 更新艺术家增长趋势图表
function updateGrowthTrendChart() {
  if (!charts.value.growthTrendChart) return
  
  const growthData = [...artistsList.value]
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, 8)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    radar: {
      indicator: [
        { name: '流行度', max: 100 },
        { name: '粉丝数', max: 10000000 },
        { name: '月播放量', max: 6000000 },
        { name: '增长率', max: 10 }
      ]
    },
    series: [
      {
        type: 'radar',
        data: growthData.map(artist => {
          return {
            name: artist.name,
            value: [
              artist.popularity,
              artist.followers,
              artist.monthlySongs,
              artist.growthRate
            ]
          }
        })
      }
    ]
  }
  
  charts.value.growthTrendChart.setOption(option)
}

// 监听窗口大小变化
function handleResize() {
  Object.values(charts.value).forEach(chart => {
    chart && chart.resize()
  })
}

// 组件挂载时
onMounted(() => {
  console.log('艺术家页面组件已挂载')
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
      <h1 class="text-2xl font-bold mb-2">艺术家分析</h1>
      <p class="text-gray-600 dark:text-gray-400">
        查看热门艺术家排名、流行趋势分析和流派分布
      </p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div class="relative w-full md:w-64">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索艺术家..."
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none"
        />
        <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
      </div>
      
      <div class="flex flex-wrap gap-2">
        <select
          v-model="filterGenre"
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none"
        >
          <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
        </select>
        
        <select
          v-model="sortBy"
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none"
        >
          <option value="popularity">按流行度</option>
          <option value="monthlySongs">按月播放量</option>
          <option value="followers">按粉丝数</option>
          <option value="growthRate">按增长率</option>
          <option value="name">按名称</option>
        </select>
        
        <button
          @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'"
          class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:outline-none"
        >
          <i :class="[
            'fas', 
            sortOrder === 'desc' ? 'fa-sort-amount-down' : 'fa-sort-amount-up'
          ]"></i>
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
        <p class="mt-2">加载艺术家数据中...</p>
      </div>
    </div>

    <div v-else>
      <!-- 艺术家统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <i class="fas fa-users text-blue-500 dark:text-blue-300"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">艺术家总数</p>
              <p class="text-2xl font-bold">{{ artistStats.totalArtists }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <i class="fas fa-star text-green-500 dark:text-green-300"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">平均流行度</p>
              <p class="text-2xl font-bold">{{ artistStats.avgPopularity }}<span class="text-sm">/100</span></p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-4">
              <i class="fas fa-play text-yellow-500 dark:text-yellow-300"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">总月播放量</p>
              <p class="text-2xl font-bold">{{ (artistStats.totalListens/1000000).toFixed(1) }}M</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
              <i class="fas fa-chart-line text-purple-500 dark:text-purple-300"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">平均增长率</p>
              <p class="text-2xl font-bold">+{{ artistStats.avgGrowth }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 class="text-lg font-semibold mb-4">顶级艺术家流行度对比</h2>
          <div id="artist-popularity-chart" class="w-full h-80"></div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 class="text-lg font-semibold mb-4">艺术家流派分布</h2>
          <div id="genre-distribution-chart" class="w-full h-80"></div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
        <h2 class="text-lg font-semibold mb-4">艺术家多维度分析</h2>
        <div id="growth-trend-chart" class="w-full h-80"></div>
      </div>

      <!-- 艺术家列表 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold">热门艺术家列表</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            显示 {{ filteredArtists.length }} 位艺术家
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          <div 
            v-for="artist in filteredArtists" 
            :key="artist.id"
            class="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div class="relative pb-[100%] bg-gray-200 dark:bg-gray-600">
              <img 
                :src="artist.avatarUrl" 
                :alt="artist.name"
                class="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div class="p-4">
              <h3 class="text-lg font-medium">{{ artist.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ artist.genre }}</p>
              
              <div class="mt-3 space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-500 dark:text-gray-400">流行度</span>
                  <span class="text-sm font-medium">{{ artist.popularity }}</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                  <div class="bg-blue-600 h-1.5 rounded-full" :style="`width: ${artist.popularity}%`"></div>
                </div>
              </div>
              
              <div class="mt-4 flex flex-wrap justify-between text-xs text-gray-500 dark:text-gray-400">
                <div>
                  <i class="fas fa-headphones mr-1"></i>
                  <span>{{ (artist.monthlySongs/1000000).toFixed(1) }}M 播放</span>
                </div>
                <div>
                  <i class="fas fa-user-plus mr-1"></i>
                  <span>{{ (artist.followers/1000000).toFixed(1) }}M 粉丝</span>
                </div>
              </div>
              
              <div class="mt-4 text-xs">
                <span class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                  <i class="fas fa-arrow-up mr-1"></i>{{ artist.growthRate }}%
                </span>
                <span class="ml-2">热门单曲: {{ artist.topHit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style> 