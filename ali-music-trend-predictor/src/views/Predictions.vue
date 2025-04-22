<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts'
import { useDark } from '@vueuse/core'

const isDarkMode = useDark()

// 模拟数据 - 预测分数
const predictionScores = ref([
  { name: '周杰伦', value: 96, change: '+3.2%', trend: 'up' },
  { name: 'Taylor Swift', value: 92, change: '+2.1%', trend: 'up' },
  { name: '林俊杰', value: 88, change: '+1.5%', trend: 'up' },
  { name: '薛之谦', value: 85, change: '+0.8%', trend: 'up' },
  { name: 'BLACKPINK', value: 83, change: '+4.2%', trend: 'up' },
  { name: '华晨宇', value: 81, change: '-0.5%', trend: 'down' },
  { name: '张惠妹', value: 79, change: '+1.2%', trend: 'up' },
  { name: '陈奕迅', value: 78, change: '-1.3%', trend: 'down' },
  { name: '李荣浩', value: 77, change: '+0.7%', trend: 'up' },
  { name: '朴树', value: 75, change: '+2.4%', trend: 'up' }
])

// 模拟数据 - 预测因素
const predictionFactors = ref([
  { name: '流媒体播放量', weight: 25 },
  { name: '社交媒体热度', weight: 20 },
  { name: '歌曲情感分析', weight: 15 },
  { name: '历史表现数据', weight: 15 },
  { name: '音频特征分析', weight: 10 },
  { name: '粉丝互动率', weight: 10 },
  { name: '市场趋势', weight: 5 }
])

// 模拟数据 - 预测准确率历史
const accuracyHistory = ref({
  months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  values: [85, 86, 88, 87, 89, 91, 90, 92, 93, 94, 93, 95]
})

// 图表实例
let factorsChart: echarts.ECharts | null = null
let accuracyChart: echarts.ECharts | null = null

// 初始化图表
function initCharts() {
  // 预测因素图表
  const factorsChartDom = document.getElementById('prediction-factors-chart')
  if (factorsChartDom) {
    factorsChart = echarts.init(factorsChartDom, isDarkMode.value ? 'dark' : undefined)
    
    const factorsOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: predictionFactors.value.map(item => item.name)
      },
      series: [
        {
          name: '预测因素',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
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
          data: predictionFactors.value.map(item => ({
            name: item.name,
            value: item.weight
          }))
        }
      ]
    }
    
    factorsChart.setOption(factorsOption)
  }
  
  // 预测准确率历史图表
  const accuracyChartDom = document.getElementById('accuracy-history-chart')
  if (accuracyChartDom) {
    accuracyChart = echarts.init(accuracyChartDom, isDarkMode.value ? 'dark' : undefined)
    
    const accuracyOption = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: accuracyHistory.value.months
      },
      yAxis: {
        type: 'value',
        min: 80,
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: '预测准确率',
          type: 'line',
          smooth: true,
          data: accuracyHistory.value.values,
          markPoint: {
            data: [
              { type: 'max', name: '最大值' },
              { type: 'min', name: '最小值' }
            ]
          },
          areaStyle: {
            opacity: 0.3
          }
        }
      ]
    }
    
    accuracyChart.setOption(accuracyOption)
  }
}

// 当前选中的艺术家
const selectedArtist = ref(predictionScores.value[0])

// 计算属性 - 根据分数分类艺术家
const artistCategories = computed(() => {
  return {
    superstar: predictionScores.value.filter(artist => artist.value >= 90),
    rising: predictionScores.value.filter(artist => artist.value >= 80 && artist.value < 90),
    stable: predictionScores.value.filter(artist => artist.value >= 70 && artist.value < 80),
    declining: predictionScores.value.filter(artist => artist.value < 70)
  }
})

// 选择艺术家
function selectArtist(artist) {
  selectedArtist.value = artist
}

// 监听窗口大小变化，调整图表大小
function handleResize() {
  if (factorsChart) {
    factorsChart.resize()
  }
  if (accuracyChart) {
    accuracyChart.resize()
  }
}

// 生命周期钩子
onMounted(() => {
  console.log('Predictions组件挂载')
  window.addEventListener('resize', handleResize)
  
  // 初始化图表
  setTimeout(() => {
    initCharts()
  }, 100)
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  
  if (factorsChart) {
    factorsChart.dispose()
    factorsChart = null
  }
  
  if (accuracyChart) {
    accuracyChart.dispose()
    accuracyChart = null
  }
})
</script>

<template>
  <div class="min-h-screen pt-6 pb-16 pl-0 md:pl-4 pr-0 md:pr-4">
    <!-- 页面标题 -->
    <div class="bg-white dark:bg-gray-800 shadow-md p-6 mb-6 rounded-lg">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">音乐趋势预测分析</h1>
      <p class="text-gray-600 dark:text-gray-300">使用先进的AI算法分析和预测艺术家和歌曲的热度趋势</p>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- 预测因素分析 -->
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">预测因素权重</h2>
        <div id="prediction-factors-chart" class="w-full h-64"></div>
        <div class="mt-4 space-y-2">
          <div v-for="(factor, index) in predictionFactors" :key="index" class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ factor.name }}</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ factor.weight }}%</span>
          </div>
        </div>
      </div>
      
      <!-- 预测准确率历史 -->
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">预测准确率历史</h2>
        <div id="accuracy-history-chart" class="w-full h-64"></div>
        <div class="mt-4 flex justify-center">
          <div class="px-4 py-2 bg-green-100 dark:bg-green-800 rounded-md">
            <span class="text-green-800 dark:text-green-100 font-medium">
              当前准确率: 95.2%
            </span>
          </div>
        </div>
      </div>
      
      <!-- 艺术家预测分数 -->
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">艺术家预测分数</h2>
        <div class="space-y-2 max-h-64 overflow-y-auto pr-2">
          <div 
            v-for="(artist, index) in predictionScores" 
            :key="index"
            @click="selectArtist(artist)"
            class="flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors"
            :class="[
              selectedArtist === artist ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700',
            ]"
          >
            <span class="text-gray-800 dark:text-white font-medium">{{ artist.name }}</span>
            <div class="flex items-center">
              <span 
                class="text-sm font-bold mr-2" 
                :class="[
                  artist.value >= 90 ? 'text-green-600 dark:text-green-400' : 
                  artist.value >= 80 ? 'text-blue-600 dark:text-blue-400' : 
                  artist.value >= 70 ? 'text-yellow-600 dark:text-yellow-400' : 
                  'text-red-600 dark:text-red-400'
                ]"
              >
                {{ artist.value }}
              </span>
              <span 
                class="text-xs" 
                :class="[
                  artist.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                ]"
              >
                {{ artist.change }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 详细艺术家分析 -->
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">艺术家详细分析</h2>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600 dark:text-gray-300">分数:</span>
          <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ selectedArtist.value }}</span>
        </div>
      </div>
      
      <div class="flex flex-col md:flex-row md:space-x-6">
        <div class="w-full md:w-1/3 mb-4 md:mb-0">
          <div class="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            <img 
              :src="`https://picsum.photos/seed/${selectedArtist.name}/400/400`" 
              :alt="selectedArtist.name" 
              class="object-cover"
            />
          </div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-4">{{ selectedArtist.name }}</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            热度趋势: <span :class="selectedArtist.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ selectedArtist.change }}
            </span>
          </p>
        </div>
        
        <div class="w-full md:w-2/3">
          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">预测信心分数</h4>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full" :style="`width: ${selectedArtist.value}%`"></div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">流媒体表现</h4>
                <p class="text-lg font-semibold text-gray-800 dark:text-white">优秀</p>
                <p class="text-xs text-gray-600 dark:text-gray-300">月均播放量增长 32%</p>
              </div>
              
              <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">社交媒体热度</h4>
                <p class="text-lg font-semibold text-gray-800 dark:text-white">很高</p>
                <p class="text-xs text-gray-600 dark:text-gray-300">微博话题阅读量 3.5 亿</p>
              </div>
              
              <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">潜在市场</h4>
                <p class="text-lg font-semibold text-gray-800 dark:text-white">扩大中</p>
                <p class="text-xs text-gray-600 dark:text-gray-300">新增粉丝群体年轻化趋势明显</p>
              </div>
              
              <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">热门程度持续性</h4>
                <p class="text-lg font-semibold text-gray-800 dark:text-white">长期</p>
                <p class="text-xs text-gray-600 dark:text-gray-300">预计保持热度 18+ 个月</p>
              </div>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">AI 分析建议</h4>
              <p class="text-gray-800 dark:text-white text-sm bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                该艺术家在当前市场有极高人气，建议增加合作机会，可考虑跨界合作拓展受众面。新专辑发布时机建议在第三季度，以配合市场热度周期。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 艺术家分类 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
          <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          超级明星
        </h3>
        <div class="space-y-2">
          <div v-for="(artist, index) in artistCategories.superstar" :key="index" class="flex justify-between items-center">
            <span class="text-gray-800 dark:text-white">{{ artist.name }}</span>
            <span class="text-green-600 dark:text-green-400 font-medium">{{ artist.value }}</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
          <span class="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          上升之星
        </h3>
        <div class="space-y-2">
          <div v-for="(artist, index) in artistCategories.rising" :key="index" class="flex justify-between items-center">
            <span class="text-gray-800 dark:text-white">{{ artist.name }}</span>
            <span class="text-blue-600 dark:text-blue-400 font-medium">{{ artist.value }}</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
          <span class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
          稳定表现
        </h3>
        <div class="space-y-2">
          <div v-for="(artist, index) in artistCategories.stable" :key="index" class="flex justify-between items-center">
            <span class="text-gray-800 dark:text-white">{{ artist.name }}</span>
            <span class="text-yellow-600 dark:text-yellow-400 font-medium">{{ artist.value }}</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
          <span class="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          热度下降
        </h3>
        <div class="space-y-2">
          <div v-for="(artist, index) in artistCategories.declining" :key="index" class="flex justify-between items-center">
            <span class="text-gray-800 dark:text-white">{{ artist.name }}</span>
            <span class="text-red-600 dark:text-red-400 font-medium">{{ artist.value }}</span>
          </div>
          <div v-if="artistCategories.declining.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-2">
            暂无数据
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 美化滚动条 */
div::-webkit-scrollbar {
  width: 6px;
}

div::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

div::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

div::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.dark div::-webkit-scrollbar-track {
  background: #2d3748;
}

.dark div::-webkit-scrollbar-thumb {
  background: #4a5568;
}
</style> 