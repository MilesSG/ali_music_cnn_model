<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import * as tf from '@tensorflow/tfjs'
import { ElMessage } from 'element-plus'

// 模拟歌曲数据
interface Song {
  id: number
  name: string
  artist: string
  genre: string
  features: number[]
  popularity: number
  predictedPopularity?: number
}

// 示例歌曲数据
const songs = reactive<Song[]>([
  {
    id: 1,
    name: '城市之光',
    artist: '李伟',
    genre: '流行',
    features: [0.8, 0.6, 0.4, 0.7, 0.5, 0.3, 0.9],
    popularity: 89,
  },
  {
    id: 2,
    name: '蓝色海洋',
    artist: '张明',
    genre: '民谣',
    features: [0.3, 0.7, 0.6, 0.4, 0.8, 0.5, 0.2],
    popularity: 75,
  },
  {
    id: 3,
    name: '电子梦境',
    artist: '王强',
    genre: '电子',
    features: [0.9, 0.4, 0.7, 0.8, 0.3, 0.6, 0.5],
    popularity: 92,
  },
  {
    id: 4,
    name: '摇滚时代',
    artist: '陈刚',
    genre: '摇滚',
    features: [0.7, 0.8, 0.9, 0.6, 0.4, 0.5, 0.3],
    popularity: 84,
  },
  {
    id: 5,
    name: '嘻哈节奏',
    artist: '赵志',
    genre: '嘻哈',
    features: [0.6, 0.9, 0.5, 0.3, 0.7, 0.8, 0.4],
    popularity: 78,
  }
])

const isLoading = ref(false)
const model = ref<tf.LayersModel | null>(null)
const selectedSong = ref<Song | null>(null)
const predictionResult = ref<number | null>(null)
const predictionsVisible = ref(false)
const dialogVisible = ref(false)
const features = reactive({
  tempo: 0.5,
  energy: 0.5,
  danceability: 0.5,
  acousticness: 0.5,
  instrumentalness: 0.5,
  liveness: 0.5,
  valence: 0.5
})

// 模拟加载 CNN 模型
async function loadModel() {
  try {
    isLoading.value = true
    
    // 在实际应用中，这里应该加载已经训练好的模型
    // 这里我们创建一个简单的模型用于演示
    const mockModel = tf.sequential()
    mockModel.add(tf.layers.dense({
      inputShape: [7],
      units: 32,
      activation: 'relu'
    }))
    mockModel.add(tf.layers.dense({
      units: 16,
      activation: 'relu'
    }))
    mockModel.add(tf.layers.dense({
      units: 1,
      activation: 'sigmoid'
    }))
    
    mockModel.compile({
      optimizer: tf.train.adam(),
      loss: 'meanSquaredError'
    })
    
    // 保存模型引用
    model.value = mockModel
    
    // 训练模型（在实际应用中应该使用已训练好的模型）
    const inputs = tf.tensor2d(songs.map(song => song.features))
    const outputs = tf.tensor2d(songs.map(song => [song.popularity / 100]))
    
    await mockModel.fit(inputs, outputs, {
      epochs: 100,
      verbose: 0
    })
    
    ElMessage.success('模型加载成功')
    
  } catch (error) {
    console.error('模型加载失败:', error)
    ElMessage.error('模型加载失败')
  } finally {
    isLoading.value = false
  }
}

// 预测所有歌曲的流行度
async function predictAllSongs() {
  if (!model.value) {
    ElMessage.warning('模型尚未加载')
    return
  }
  
  isLoading.value = true
  
  try {
    const inputs = tf.tensor2d(songs.map(song => song.features))
    const predictions = await model.value.predict(inputs) as tf.Tensor
    
    const predictionValues = await predictions.arraySync() as number[][]
    
    // 更新歌曲预测结果
    songs.forEach((song, index) => {
      song.predictedPopularity = Math.round(predictionValues[index][0] * 100)
    })
    
    predictionsVisible.value = true
    ElMessage.success('预测完成')
  } catch (error) {
    console.error('预测失败:', error)
    ElMessage.error('预测失败')
  } finally {
    isLoading.value = false
  }
}

// 预测自定义特征
async function predictCustomFeatures() {
  if (!model.value) {
    ElMessage.warning('模型尚未加载')
    return
  }
  
  isLoading.value = true
  
  try {
    const customFeatures = [
      features.tempo,
      features.energy,
      features.danceability,
      features.acousticness,
      features.instrumentalness,
      features.liveness,
      features.valence
    ]
    
    const input = tf.tensor2d([customFeatures])
    const prediction = await model.value.predict(input) as tf.Tensor
    const value = await prediction.arraySync() as number[][]
    
    predictionResult.value = Math.round(value[0][0] * 100)
    ElMessage.success('预测完成')
  } catch (error) {
    console.error('预测失败:', error)
    ElMessage.error('预测失败')
  } finally {
    isLoading.value = false
  }
}

// 选择歌曲进行详细分析
function selectSong(song: Song) {
  selectedSong.value = song
  dialogVisible.value = true
}

onMounted(() => {
  loadModel()
})
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">音乐流行度预测</h1>
      <p class="text-gray-600 dark:text-gray-400">
        使用CNN深度学习模型预测音乐流行度趋势，帮助发现潜在的热门歌曲
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧：歌曲列表 -->
      <div class="lg:col-span-2">
        <div class="card mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">歌曲数据</h2>
            <button
              class="btn btn-primary"
              @click="predictAllSongs"
              :disabled="isLoading || !model"
            >
              <span v-if="isLoading">预测中...</span>
              <span v-else>预测流行度</span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">歌曲名</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">艺术家</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">流派</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">实际流行度</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" v-if="predictionsVisible">预测流行度</th>
                  <th class="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="song in songs" :key="song.id" class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td class="px-4 py-3">{{ song.name }}</td>
                  <td class="px-4 py-3">{{ song.artist }}</td>
                  <td class="px-4 py-3">{{ song.genre }}</td>
                  <td class="px-4 py-3">{{ song.popularity }}</td>
                  <td class="px-4 py-3" v-if="predictionsVisible">
                    <span 
                      :class="{
                        'text-green-600 dark:text-green-400': song.predictedPopularity && song.predictedPopularity >= song.popularity,
                        'text-red-600 dark:text-red-400': song.predictedPopularity && song.predictedPopularity < song.popularity
                      }"
                    >
                      {{ song.predictedPopularity }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <button 
                      class="text-primary-600 dark:text-primary-400 hover:underline"
                      @click="selectSong(song)"
                    >
                      详情
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 右侧：自定义预测 -->
      <div class="lg:col-span-1">
        <div class="card">
          <h2 class="text-xl font-semibold mb-4">自定义预测</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">调整音乐属性参数来预测流行度</p>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">节奏 (Tempo)</label>
              <el-slider v-model="features.tempo" :step="0.01" :min="0" :max="1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">能量 (Energy)</label>
              <el-slider v-model="features.energy" :step="0.01" :min="0" :max="1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">跳跃性 (Danceability)</label>
              <el-slider v-model="features.danceability" :step="0.01" :min="0" :max="1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">原声性 (Acousticness)</label>
              <el-slider v-model="features.acousticness" :step="0.01" :min="0" :max="1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">器乐性 (Instrumentalness)</label>
              <el-slider v-model="features.instrumentalness" :step="0.01" :min="0" :max="1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">现场感 (Liveness)</label>
              <el-slider v-model="features.liveness" :step="0.01" :min="0" :max="1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">情绪价 (Valence)</label>
              <el-slider v-model="features.valence" :step="0.01" :min="0" :max="1" />
            </div>

            <div class="mt-6">
              <button
                class="w-full btn btn-primary"
                @click="predictCustomFeatures"
                :disabled="isLoading || !model"
              >
                <span v-if="isLoading">预测中...</span>
                <span v-else>预测流行度</span>
              </button>
            </div>

            <div v-if="predictionResult !== null" class="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p class="font-medium text-gray-700 dark:text-gray-300">预测流行度：</p>
              <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {{ predictionResult }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 歌曲详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="歌曲详情分析"
      width="80%"
      @close="selectedSong = null"
    >
      <template v-if="selectedSong">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-xl font-bold mb-4">{{ selectedSong.name }}</h3>
            <p><span class="font-medium">艺术家:</span> {{ selectedSong.artist }}</p>
            <p><span class="font-medium">流派:</span> {{ selectedSong.genre }}</p>
            <p><span class="font-medium">实际流行度:</span> {{ selectedSong.popularity }}</p>
            <p v-if="selectedSong.predictedPopularity">
              <span class="font-medium">预测流行度:</span> 
              <span :class="{
                'text-green-600': selectedSong.predictedPopularity >= selectedSong.popularity,
                'text-red-600': selectedSong.predictedPopularity < selectedSong.popularity
              }">
                {{ selectedSong.predictedPopularity }}
              </span>
            </p>
          </div>
          
          <div>
            <h4 class="font-medium mb-2">音乐特征分析</h4>
            <div class="space-y-2">
              <div v-for="(value, index) in selectedSong.features" :key="index">
                <div class="flex justify-between mb-1">
                  <span class="text-sm">{{ ['节奏', '能量', '跳跃性', '原声性', '器乐性', '现场感', '情绪价'][index] }}</span>
                  <span class="text-sm">{{ (value * 100).toFixed(0) }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    class="bg-primary-600 h-2 rounded-full"
                    :style="{ width: `${value * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template> 