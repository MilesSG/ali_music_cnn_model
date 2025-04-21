<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const popularityTrend = ref<HTMLElement | null>(null)
const genreDistribution = ref<HTMLElement | null>(null)
const trendsChart = ref<echarts.ECharts | null>(null)
const genreChart = ref<echarts.ECharts | null>(null)

onMounted(() => {
  // 初始化流行趋势图表
  if (popularityTrend.value) {
    trendsChart.value = echarts.init(popularityTrend.value)
    const option = {
      title: {
        text: '音乐流行趋势',
        left: 'center',
        textStyle: {
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
      },
      yAxis: {
        type: 'value',
        name: '流行指数'
      },
      series: [
        {
          name: '流行音乐',
          type: 'line',
          smooth: true,
          data: [120, 132, 101, 134, 90, 230, 210],
          lineStyle: {
            color: '#0ea5e9'
          },
          itemStyle: {
            color: '#0ea5e9'
          }
        },
        {
          name: '摇滚',
          type: 'line',
          smooth: true,
          data: [220, 182, 191, 234, 290, 330, 310],
          lineStyle: {
            color: '#d946ef'
          },
          itemStyle: {
            color: '#d946ef'
          }
        },
        {
          name: '电子音乐',
          type: 'line',
          smooth: true,
          data: [150, 232, 201, 154, 190, 330, 410],
          lineStyle: {
            color: '#6366f1'
          },
          itemStyle: {
            color: '#6366f1'
          }
        }
      ]
    }
    trendsChart.value.setOption(option)
  }

  // 初始化流派分布图表
  if (genreDistribution.value) {
    genreChart.value = echarts.init(genreDistribution.value)
    const option = {
      title: {
        text: '流派分布',
        left: 'center',
        textStyle: {
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '音乐流派',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: '流行音乐' },
            { value: 735, name: '摇滚' },
            { value: 580, name: '电子音乐' },
            { value: 484, name: '嘻哈' },
            { value: 300, name: '民谣' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    genreChart.value.setOption(option)
  }

  // 添加窗口大小变化时重新渲染图表
  window.addEventListener('resize', () => {
    trendsChart.value?.resize()
    genreChart.value?.resize()
  })
})
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">阿里音乐趋势分析仪表盘</h1>
      <p class="text-gray-600 dark:text-gray-400">
        使用CNN模型分析和预测音乐流行趋势，帮助您洞察音乐市场动态
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- 概览卡片 -->
      <div class="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <h2 class="text-xl font-semibold mb-2">预测准确率</h2>
        <div class="flex items-end">
          <span class="text-4xl font-bold">92.7%</span>
          <span class="ml-2 text-green-300">↑2.3%</span>
        </div>
        <p class="mt-2 text-sm opacity-80">CNN模型预测准确率提高了2.3%</p>
      </div>

      <div class="card bg-gradient-to-br from-secondary-500 to-secondary-700 text-white">
        <h2 class="text-xl font-semibold mb-2">趋势预测</h2>
        <div class="flex items-end">
          <span class="text-4xl font-bold">578</span>
          <span class="ml-2">首流行歌曲</span>
        </div>
        <p class="mt-2 text-sm opacity-80">预计未来30天内流行的歌曲数量</p>
      </div>
    </div>

    <!-- 图表部分 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <div ref="popularityTrend" class="h-80"></div>
      </div>

      <div class="card">
        <div ref="genreDistribution" class="h-80"></div>
      </div>
    </div>
  </div>
</template> 