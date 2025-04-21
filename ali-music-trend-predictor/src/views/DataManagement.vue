<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 数据集类型
interface Dataset {
  id: number
  name: string
  description: string
  size: string
  created: string
  isActive: boolean
}

// 模拟数据集
const datasets = reactive<Dataset[]>([
  {
    id: 1,
    name: '阿里音乐基础数据集',
    description: '包含2020-2022年阿里音乐平台上的基础用户播放数据',
    size: '1.2GB',
    created: '2022-10-15',
    isActive: true
  },
  {
    id: 2,
    name: '音乐特征数据集',
    description: '包含10万首歌曲的音频特征提取数据',
    size: '850MB',
    created: '2022-11-20',
    isActive: false
  },
  {
    id: 3,
    name: '用户行为数据集',
    description: '用户播放、收藏、分享等行为数据',
    size: '2.5GB',
    created: '2023-01-05',
    isActive: false
  },
  {
    id: 4,
    name: '历史趋势数据集',
    description: '2018-2022年音乐流行趋势历史数据',
    size: '450MB',
    created: '2023-02-10',
    isActive: false
  }
])

// 上传文件相关状态
const uploadDialogVisible = ref(false)
const uploadProgress = ref(0)
const isUploading = ref(false)
const fileName = ref('')
const fileDescription = ref('')

// 模拟上传过程
function uploadFile() {
  if (!fileName.value) {
    ElMessage.warning('请输入数据集名称')
    return
  }
  
  isUploading.value = true
  uploadProgress.value = 0
  
  // 模拟上传进度
  const interval = setInterval(() => {
    uploadProgress.value += Math.floor(Math.random() * 10) + 1
    
    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100
      clearInterval(interval)
      
      // 模拟添加新数据集
      setTimeout(() => {
        const newId = Math.max(...datasets.map(d => d.id)) + 1
        datasets.push({
          id: newId,
          name: fileName.value,
          description: fileDescription.value || '无描述',
          size: '未知',
          created: new Date().toISOString().split('T')[0],
          isActive: false
        })
        
        isUploading.value = false
        uploadDialogVisible.value = false
        ElMessage.success('数据集上传成功')
        
        // 重置表单
        fileName.value = ''
        fileDescription.value = ''
      }, 500)
    }
  }, 200)
}

// 激活数据集
function activateDataset(id: number) {
  ElMessageBox.confirm(
    '激活此数据集将会取消当前活跃的数据集，确定继续吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      // 设置所有数据集为非活跃
      datasets.forEach(dataset => {
        dataset.isActive = false
      })
      
      // 设置选中的数据集为活跃
      const dataset = datasets.find(dataset => dataset.id === id)
      if (dataset) {
        dataset.isActive = true
        ElMessage.success(`已激活数据集: ${dataset.name}`)
      }
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 删除数据集
function deleteDataset(id: number) {
  const dataset = datasets.find(dataset => dataset.id === id)
  
  if (!dataset) return
  
  if (dataset.isActive) {
    ElMessage.error('无法删除当前激活的数据集')
    return
  }
  
  ElMessageBox.confirm(
    `确定要删除数据集 "${dataset.name}" 吗？此操作不可恢复。`,
    '警告',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'error',
    }
  )
    .then(() => {
      const index = datasets.findIndex(dataset => dataset.id === id)
      if (index !== -1) {
        datasets.splice(index, 1)
        ElMessage.success('数据集已删除')
      }
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 导出数据集
function exportDataset(id: number) {
  const dataset = datasets.find(dataset => dataset.id === id)
  if (!dataset) return
  
  ElMessage.success(`正在导出数据集: ${dataset.name}`)
  
  // 这里只是模拟导出过程，实际应用中应该调用后端API
  setTimeout(() => {
    ElMessage.success(`数据集 ${dataset.name} 导出完成`)
  }, 1500)
}

// 预处理状态
const preprocessingActive = ref(false)
const preprocessingProgress = ref(0)
const preprocessingStep = ref('')
const preprocessingSteps = [
  '数据加载中...',
  '清理无效数据...',
  '标准化特征...',
  '处理缺失值...',
  '特征工程...',
  '数据分割...',
  '数据预处理完成!'
]

// 开始预处理
function startPreprocessing() {
  const activeDataset = datasets.find(dataset => dataset.isActive)
  
  if (!activeDataset) {
    ElMessage.warning('请先激活一个数据集')
    return
  }
  
  preprocessingActive.value = true
  preprocessingProgress.value = 0
  preprocessingStep.value = preprocessingSteps[0]
  
  let currentStep = 0
  
  // 模拟预处理过程
  const interval = setInterval(() => {
    preprocessingProgress.value += Math.floor(Math.random() * 5) + 1
    
    if (preprocessingProgress.value >= (currentStep + 1) * (100 / preprocessingSteps.length)) {
      currentStep++
      
      if (currentStep < preprocessingSteps.length) {
        preprocessingStep.value = preprocessingSteps[currentStep]
      }
      
      if (currentStep >= preprocessingSteps.length) {
        clearInterval(interval)
        ElMessage.success('数据预处理完成')
        
        // 重置状态 (保留一段时间以展示完成状态)
        setTimeout(() => {
          preprocessingActive.value = false
          preprocessingProgress.value = 0
          preprocessingStep.value = ''
        }, 2000)
      }
    }
  }, 200)
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">数据管理</h1>
      <p class="text-gray-600 dark:text-gray-400">
        管理您的音乐数据集，进行上传、激活和预处理操作
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- 左侧：数据集列表 -->
      <div class="lg:col-span-3">
        <div class="card">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">数据集列表</h2>
            <button 
              class="btn btn-primary"
              @click="uploadDialogVisible = true"
            >
              上传数据集
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">名称</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">描述</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">大小</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">创建日期</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="dataset in datasets" :key="dataset.id" class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td class="px-4 py-3">{{ dataset.name }}</td>
                  <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ dataset.description }}</td>
                  <td class="px-4 py-3">{{ dataset.size }}</td>
                  <td class="px-4 py-3">{{ dataset.created }}</td>
                  <td class="px-4 py-3">
                    <span 
                      v-if="dataset.isActive" 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    >
                      激活中
                    </span>
                    <span v-else class="text-gray-500 dark:text-gray-400">未激活</span>
                  </td>
                  <td class="px-4 py-3 text-right space-x-2">
                    <button 
                      v-if="!dataset.isActive"
                      @click="activateDataset(dataset.id)"
                      class="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                    >
                      激活
                    </button>
                    <button 
                      @click="exportDataset(dataset.id)"
                      class="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                    >
                      导出
                    </button>
                    <button 
                      v-if="!dataset.isActive"
                      @click="deleteDataset(dataset.id)"
                      class="text-red-600 dark:text-red-400 hover:underline text-sm"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 右侧：数据预处理 -->
      <div class="lg:col-span-1">
        <div class="card">
          <h2 class="text-xl font-semibold mb-4">数据预处理</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
            对当前激活的数据集进行预处理，包括清洗、标准化和特征工程等操作
          </p>

          <div v-if="preprocessingActive" class="mb-6">
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium">{{ preprocessingStep }}</span>
              <span class="text-sm font-medium">{{ preprocessingProgress }}%</span>
            </div>
            <el-progress :percentage="preprocessingProgress" />
          </div>

          <button
            class="w-full btn btn-primary"
            @click="startPreprocessing"
            :disabled="preprocessingActive"
          >
            <span v-if="preprocessingActive">处理中...</span>
            <span v-else>开始预处理</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 上传数据集对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传数据集"
      width="500px"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">数据集名称</label>
          <input
            v-model="fileName"
            type="text"
            class="input"
            placeholder="输入数据集名称"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">描述</label>
          <textarea
            v-model="fileDescription"
            class="input"
            rows="3"
            placeholder="描述该数据集的内容和用途"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">数据集文件</label>
          <div class="flex items-center justify-center w-full">
            <label class="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">点击上传</span> 或拖放文件
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">CSV, JSON 或 XLSX 文件</p>
              </div>
              <input type="file" class="hidden" />
            </label>
          </div>
        </div>

        <div v-if="isUploading" class="mt-4">
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium">上传中...</span>
            <span class="text-sm font-medium">{{ uploadProgress }}%</span>
          </div>
          <el-progress :percentage="uploadProgress" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md"
            @click="uploadDialogVisible = false"
            :disabled="isUploading"
          >
            取消
          </button>
          <button
            class="btn btn-primary"
            @click="uploadFile"
            :disabled="isUploading"
          >
            <span v-if="isUploading">上传中...</span>
            <span v-else>上传</span>
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template> 