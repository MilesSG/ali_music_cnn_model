import { ref, reactive } from 'vue'
import type { Song, MusicFeatures } from './CNNService'

export interface Dataset {
  id: number
  name: string
  description: string
  size: string
  created: string
  isActive: boolean
  songs?: Song[]
}

// 模拟数据生成函数
function generateRandomFeatures(): MusicFeatures {
  return {
    tempo: Math.random(),
    energy: Math.random(),
    danceability: Math.random(),
    acousticness: Math.random(),
    instrumentalness: Math.random(),
    liveness: Math.random(),
    valence: Math.random()
  }
}

// 创建一些示例歌曲
function createSampleSongs(count: number): Song[] {
  const genres = ['流行', '摇滚', '电子', '嘻哈', '民谣', 'R&B', '爵士']
  const artistNames = ['李伟', '张明', '王强', '陈刚', '赵志', '杨华', '周杰', '刘洋', '孙军', '郑涛']
  
  const songs: Song[] = []
  
  for (let i = 0; i < count; i++) {
    const genre = genres[Math.floor(Math.random() * genres.length)]
    const artist = artistNames[Math.floor(Math.random() * artistNames.length)]
    
    songs.push({
      id: `song_${i + 1}`,
      name: `${genre}歌曲${i + 1}`,
      artist,
      features: generateRandomFeatures(),
      popularity: Math.floor(Math.random() * 40) + 60 // 60-100 范围内的随机流行度
    })
  }
  
  return songs
}

// 示例数据集
const sampleDatasets: Dataset[] = [
  {
    id: 1,
    name: '阿里音乐基础数据集',
    description: '包含2020-2022年阿里音乐平台上的基础用户播放数据',
    size: '1.2GB',
    created: '2022-10-15',
    isActive: true,
    songs: createSampleSongs(100)
  },
  {
    id: 2,
    name: '音乐特征数据集',
    description: '包含10万首歌曲的音频特征提取数据',
    size: '850MB',
    created: '2022-11-20',
    isActive: false,
    songs: createSampleSongs(60)
  },
  {
    id: 3,
    name: '用户行为数据集',
    description: '用户播放、收藏、分享等行为数据',
    size: '2.5GB',
    created: '2023-01-05',
    isActive: false,
    songs: createSampleSongs(80)
  },
  {
    id: 4,
    name: '历史趋势数据集',
    description: '2018-2022年音乐流行趋势历史数据',
    size: '450MB',
    created: '2023-02-10',
    isActive: false,
    songs: createSampleSongs(40)
  }
]

// 创建响应式数据存储
const datasets = reactive<Dataset[]>(sampleDatasets)
const activeDataset = ref<Dataset | null>(datasets.find(ds => ds.isActive) || null)

// 数据服务
export const dataService = {
  // 获取所有数据集
  getDatasets(): Dataset[] {
    return datasets
  },
  
  // 获取当前激活的数据集
  getActiveDataset(): Dataset | null {
    return activeDataset.value
  },
  
  // 激活数据集
  activateDataset(id: number): boolean {
    // 重置当前激活状态
    datasets.forEach(dataset => {
      dataset.isActive = false
    })
    
    const dataset = datasets.find(ds => ds.id === id)
    if (dataset) {
      dataset.isActive = true
      activeDataset.value = dataset
      return true
    }
    
    return false
  },
  
  // 添加新数据集
  addDataset(name: string, description: string, size: string = '未知'): Dataset {
    const newId = Math.max(...datasets.map(d => d.id)) + 1
    const newDataset: Dataset = {
      id: newId,
      name,
      description,
      size,
      created: new Date().toISOString().split('T')[0],
      isActive: false,
      songs: createSampleSongs(Math.floor(Math.random() * 50) + 30) // 生成30-80首歌曲
    }
    
    datasets.push(newDataset)
    return newDataset
  },
  
  // 删除数据集
  deleteDataset(id: number): boolean {
    const index = datasets.findIndex(dataset => dataset.id === id)
    if (index !== -1) {
      // 不允许删除激活的数据集
      if (datasets[index].isActive) {
        return false
      }
      
      datasets.splice(index, 1)
      return true
    }
    return false
  },
  
  // 获取激活数据集中的歌曲
  getActiveSongs(): Song[] {
    return activeDataset.value?.songs || []
  },
  
  // 获取数据集中的歌曲
  getSongs(datasetId: number): Song[] {
    const dataset = datasets.find(ds => ds.id === datasetId)
    return dataset?.songs || []
  },
  
  // 获取所有流派
  getGenres(): string[] {
    const allSongs = datasets.flatMap(ds => ds.songs || [])
    const genres = new Set(allSongs.map(song => song.name.split('歌曲')[0]))
    return Array.from(genres)
  },
  
  // 通过流派获取歌曲
  getSongsByGenre(genre: string): Song[] {
    const allSongs = activeDataset.value?.songs || []
    return allSongs.filter(song => song.name.startsWith(genre))
  },
  
  // 更新歌曲预测结果
  updateSongPredictions(songs: Song[]): void {
    // 更新激活数据集中的歌曲预测结果
    if (!activeDataset.value || !activeDataset.value.songs) return
    
    songs.forEach(updatedSong => {
      const songIndex = activeDataset.value!.songs!.findIndex(s => s.id === updatedSong.id)
      if (songIndex !== -1) {
        activeDataset.value!.songs![songIndex].predictedPopularity = updatedSong.predictedPopularity
      }
    })
  }
}

// 为其他组件提供快速访问
export const useDataService = () => dataService 