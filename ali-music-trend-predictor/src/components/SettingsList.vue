<script setup lang="ts">
import { computed } from 'vue'

interface Setting {
  id: string
  name: string
  description?: string
  type: 'toggle' | 'select' | 'input' | 'button' | 'range'
  value: any
  options?: { label: string; value: any }[]
  min?: number
  max?: number
  step?: number
  action?: () => void
  disabled?: boolean
}

interface Props {
  title: string
  settings: Setting[]
  icon?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:settings'])

const updateSetting = (setting: Setting, newValue: any) => {
  const updatedSettings = [...props.settings]
  const index = updatedSettings.findIndex(s => s.id === setting.id)
  
  if (index !== -1) {
    updatedSettings[index] = {
      ...updatedSettings[index],
      value: newValue
    }
    
    emit('update:settings', updatedSettings)
  }
}

const hasActions = computed(() => props.settings.some(s => s.type === 'button'))
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
    <div class="flex items-center mb-4">
      <i v-if="icon" :class="['fas', `fa-${icon}`, 'text-blue-500 mr-3']"></i>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
    </div>
    
    <div class="space-y-4">
      <div v-for="setting in settings" :key="setting.id" class="flex items-start justify-between">
        <div>
          <div class="text-gray-900 dark:text-white font-medium">{{ setting.name }}</div>
          <div v-if="setting.description" class="text-sm text-gray-500 dark:text-gray-400">
            {{ setting.description }}
          </div>
        </div>
        
        <div>
          <!-- Toggle -->
          <label v-if="setting.type === 'toggle'" class="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              :checked="setting.value"
              @change="updateSetting(setting, !setting.value)"
              class="sr-only peer"
              :disabled="setting.disabled"
            >
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
          
          <!-- Select -->
          <select 
            v-else-if="setting.type === 'select'" 
            :value="setting.value"
            @change="updateSetting(setting, $event.target.value)"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :disabled="setting.disabled"
          >
            <option 
              v-for="option in setting.options" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          
          <!-- Input -->
          <input 
            v-else-if="setting.type === 'input'" 
            :value="setting.value"
            @input="updateSetting(setting, $event.target.value)"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :disabled="setting.disabled"
          >
          
          <!-- Range -->
          <div v-else-if="setting.type === 'range'" class="flex items-center gap-2">
            <input 
              type="range" 
              :min="setting.min" 
              :max="setting.max" 
              :step="setting.step" 
              :value="setting.value"
              @input="updateSetting(setting, Number($event.target.value))"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              :disabled="setting.disabled"
            >
            <span class="text-sm text-gray-900 dark:text-white min-w-[40px] text-right">
              {{ setting.value }}
            </span>
          </div>
          
          <!-- Button -->
          <button 
            v-else-if="setting.type === 'button'"
            @click="setting.action && setting.action()"
            class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-sm"
            :disabled="setting.disabled"
          >
            {{ setting.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-list {
  transition: all 0.3s ease;
}

/* 针对不同控件的暗黑模式优化 */
:deep(.dark) {
  input[type="range"]::-webkit-slider-thumb {
    background-color: #3b82f6;
  }
  
  input[type="range"]::-moz-range-thumb {
    background-color: #3b82f6;
  }
}

/* 禁用状态样式 */
button:disabled,
input:disabled,
select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 