<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 图表引用
const genrePopularityChart = ref<HTMLElement | null>(null)
const timeSeriesChart = ref<HTMLElement | null>(null)
const featureCorrelationChart = ref<HTMLElement | null>(null)
const clusteringChart = ref<HTMLElement | null>(null)

// 图表实例
const genreChart = ref<echarts.ECharts | null>(null)
const timeChart = ref<echarts.ECharts | null>(null)
const correlationChart = ref<echarts.ECharts | null>(null)
const clusterChart = ref<echarts.ECharts | null>(null)

// 时间范围
const timeRange = ref('month')

// 初始化所有图表
onMounted(() => {
  initGenrePopularityChart()
  initTimeSeriesChart()
  initFeatureCorrelationChart()
  initClusteringChart()
  
  // 添加窗口大小变化时重新渲染图表
  window.addEventListener('resize', () => {
    genreChart.value?.resize()
    timeChart.value?.resize()
    correlationChart.value?.resize()
    clusterChart.value?.resize()
  })
})

// 初始化流派流行度对比图
function initGenrePopularityChart() {
  if (genrePopularityChart.value) {
    genreChart.value = echarts.init(genrePopularityChart.value)
    const option = {
      title: {
        text: '各音乐流派流行度对比',
        left: 'center',
        textStyle: {
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['当前流行度', '预测流行度'],
        top: '10%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: ['流行', '摇滚', '电子', '嘻哈', '民谣', '爵士', 'R&B']
      },
      series: [
        {
          name: '当前流行度',
          type: 'bar',
          data: [78, 65, 83, 72, 58, 42, 68],
          itemStyle: {
            color: '#0ea5e9'
          }
        },
        {
          name: '预测流行度',
          type: 'bar',
          data: [82, 70, 92, 75, 56, 38, 72],
          itemStyle: {
            color: '#d946ef'
          }
        }
      ]
    }
    genreChart.value.setOption(option)
  }
}

// 初始化时间序列图
function initTimeSeriesChart() {
  if (timeSeriesChart.value) {
    timeChart.value = echarts.init(timeSeriesChart.value)
    updateTimeSeriesChart()
  }
}

// 更新时间序列图
function updateTimeSeriesChart() {
  if (!timeChart.value) return

  let dates: string[] = []
  let popularityData: number[] = []
  
  // 根据选择的时间范围生成不同的数据
  if (timeRange.value === 'week') {
    dates = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    popularityData = [65, 59, 80, 81, 90, 96, 85]
  } else if (timeRange.value === 'month') {
    dates = Array.from({ length: 30 }, (_, i) => `${i + 1}日`)
    popularityData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 40) + 60)
  } else if (timeRange.value === 'year') {
    dates = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    popularityData = [75, 68, 72, 78, 83, 80, 79, 82, 85, 88, 92, 95]
  }
  
  const option = {
    title: {
      text: '音乐流行度时间趋势',
      left: 'center',
      textStyle: {
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates
    },
    yAxis: {
      type: 'value',
      name: '流行指数'
    },
    series: [
      {
        name: '平均流行度',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(14, 165, 233, 0.5)'
            }, {
              offset: 1, color: 'rgba(14, 165, 233, 0.05)'
            }]
          }
        },
        emphasis: {
          focus: 'series'
        },
        smooth: true,
        data: popularityData,
        lineStyle: {
          color: '#0ea5e9'
        },
        itemStyle: {
          color: '#0ea5e9'
        }
      }
    ]
  }
  
  timeChart.value.setOption(option)
}

// 初始化特征相关性图
function initFeatureCorrelationChart() {
  if (featureCorrelationChart.value) {
    correlationChart.value = echarts.init(featureCorrelationChart.value)
    const option = {
      title: {
        text: '音乐特征与流行度相关性',
        left: 'center',
        textStyle: {
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['节奏', '能量', '跳跃性', '原声性', '器乐性', '现场感', '情绪价']
      },
      yAxis: {
        type: 'value',
        name: '相关系数',
        min: -1,
        max: 1
      },
      series: [
        {
          name: '与流行度相关性',
          type: 'bar',
          data: [0.75, 0.82, 0.68, -0.45, -0.32, 0.28, 0.62],
          itemStyle: {
            color: function(params: any) {
              const value = params.data
              return value >= 0 ? '#0ea5e9' : '#ef4444'
            }
          }
        }
      ]
    }
    correlationChart.value.setOption(option)
  }
}

// 初始化聚类分析图
function initClusteringChart() {
  if (clusteringChart.value) {
    clusterChart.value = echarts.init(clusteringChart.value)
    
    // 生成随机散点数据
    function generateData() {
      const data = []
      // 生成三个聚类
      for (let cluster = 0; cluster < 3; cluster++) {
        const centerX = Math.random() * 60 + 20
        const centerY = Math.random() * 60 + 20
        const pointCount = Math.floor(Math.random() * 30) + 20
        
        for (let i = 0; i < pointCount; i++) {
          const x = centerX + (Math.random() - 0.5) * 20
          const y = centerY + (Math.random() - 0.5) * 20
          data.push([x, y, cluster])
        }
      }
      return data
    }
    
    const data = generateData()
    
    const option = {
      title: {
        text: '音乐流行度聚类分析',
        left: 'center',
        textStyle: {
          color: '#333'
        }
      },
      tooltip: {
        formatter: function(params: any) {
          const clusterNames = ['高流行度', '中等流行度', '低流行度']
          return `聚类: ${clusterNames[params.data[2]]}<br/>能量: ${params.data[0].toFixed(2)}<br/>跳跃性: ${params.data[1].toFixed(2)}`
        }
      },
      xAxis: {
        name: '能量',
        type: 'value'
      },
      yAxis: {
        name: '跳跃性',
        type: 'value'
      },
      series: [
        {
          name: '音乐聚类',
          type: 'scatter',
          symbolSize: 10,
          data: data,
          itemStyle: {
            color: function(params: any) {
              const clusterColors = ['#0ea5e9', '#d946ef', '#f97316']
              return clusterColors[params.data[2]]
            }
          }
        }
      ]
    }
    
    clusterChart.value.setOption(option)
  }
}

// 更改时间范围
function changeTimeRange(range: string) {
  timeRange.value = range
  updateTimeSeriesChart()
}

console.log('分析页面组件加载')
</script>

<template>
  <div class="container mx-auto p-8">
    <div class="bg-blue-600 text-white p-8 rounded-lg text-center text-3xl font-bold">
      测试页面 - 分析
    </div>
  </div>
</template> 