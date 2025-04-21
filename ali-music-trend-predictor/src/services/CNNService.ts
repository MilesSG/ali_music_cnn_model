import * as tf from '@tensorflow/tfjs'

export interface MusicFeatures {
  tempo: number
  energy: number
  danceability: number
  acousticness: number
  instrumentalness: number
  liveness: number
  valence: number
}

export interface Song {
  id: string
  name: string
  artist: string
  features: MusicFeatures
  popularity?: number
  predictedPopularity?: number
}

class CNNService {
  private model: tf.LayersModel | null = null
  private isModelLoaded = false
  private isModelTraining = false
  private modelAccuracy = 0

  /**
   * 加载预训练模型或创建新模型
   */
  async loadModel(): Promise<boolean> {
    try {
      // 在实际应用中，这里应该加载已经训练好的模型
      // 例如: this.model = await tf.loadLayersModel('model_url_or_indexdb_path')
      
      // 这里我们创建一个简单的CNN模型
      const model = tf.sequential()
      
      // 输入层: 7个特征
      model.add(tf.layers.reshape({
        targetShape: [7, 1, 1],
        inputShape: [7]
      }))
      
      // 卷积层
      model.add(tf.layers.conv2d({
        filters: 16,
        kernelSize: [3, 1],
        activation: 'relu',
        padding: 'same'
      }))
      
      model.add(tf.layers.maxPooling2d({
        poolSize: [2, 1]
      }))
      
      model.add(tf.layers.conv2d({
        filters: 32,
        kernelSize: [3, 1],
        activation: 'relu',
        padding: 'same'
      }))
      
      // 展平层
      model.add(tf.layers.flatten())
      
      // 全连接层
      model.add(tf.layers.dense({
        units: 64,
        activation: 'relu'
      }))
      
      model.add(tf.layers.dropout({ rate: 0.25 }))
      
      model.add(tf.layers.dense({
        units: 32,
        activation: 'relu'
      }))
      
      // 输出层
      model.add(tf.layers.dense({
        units: 1,
        activation: 'sigmoid'
      }))
      
      // 编译模型
      model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError',
        metrics: ['accuracy']
      })
      
      this.model = model
      this.isModelLoaded = true
      console.log('CNN模型已创建')
      
      return true
    } catch (error) {
      console.error('加载模型失败:', error)
      return false
    }
  }

  /**
   * 使用训练数据训练模型
   */
  async trainModel(songs: Song[], epochs = 50): Promise<void> {
    if (!this.model || !this.isModelLoaded) {
      throw new Error('模型未加载')
    }
    
    if (this.isModelTraining) {
      throw new Error('模型正在训练中')
    }
    
    try {
      this.isModelTraining = true
      console.log('开始训练模型...')
      
      // 准备训练数据
      const features = songs.map(song => [
        song.features.tempo,
        song.features.energy,
        song.features.danceability,
        song.features.acousticness,
        song.features.instrumentalness,
        song.features.liveness,
        song.features.valence
      ])
      
      const labels = songs.map(song => song.popularity ? song.popularity / 100 : 0.5)
      
      const xs = tf.tensor2d(features)
      const ys = tf.tensor2d(labels.map(l => [l]))
      
      // 训练模型
      const result = await this.model.fit(xs, ys, {
        epochs,
        batchSize: 32,
        validationSplit: 0.2,
        shuffle: true,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss.toFixed(4)}, accuracy = ${logs?.acc.toFixed(4)}`)
            this.modelAccuracy = logs?.acc || 0
          }
        }
      })
      
      console.log('模型训练完成', result)
      
      // 清理张量
      xs.dispose()
      ys.dispose()
      
    } catch (error) {
      console.error('训练模型失败:', error)
      throw error
    } finally {
      this.isModelTraining = false
    }
  }

  /**
   * 预测歌曲流行度
   */
  async predictPopularity(features: MusicFeatures): Promise<number> {
    if (!this.model || !this.isModelLoaded) {
      throw new Error('模型未加载')
    }
    
    try {
      // 准备特征数据
      const inputFeatures = [
        features.tempo,
        features.energy,
        features.danceability,
        features.acousticness,
        features.instrumentalness,
        features.liveness,
        features.valence
      ]
      
      const input = tf.tensor2d([inputFeatures])
      
      // 执行预测
      const prediction = this.model.predict(input) as tf.Tensor
      
      // 获取预测结果
      const result = await prediction.dataSync()[0]
      
      // 清理张量
      input.dispose()
      prediction.dispose()
      
      // 返回预测的流行度 (0-100)
      return Math.round(result * 100)
    } catch (error) {
      console.error('预测失败:', error)
      throw error
    }
  }

  /**
   * 批量预测多首歌曲的流行度
   */
  async batchPredict(songs: Song[]): Promise<Song[]> {
    if (!this.model || !this.isModelLoaded) {
      throw new Error('模型未加载')
    }
    
    try {
      // 准备特征数据
      const features = songs.map(song => [
        song.features.tempo,
        song.features.energy,
        song.features.danceability,
        song.features.acousticness,
        song.features.instrumentalness,
        song.features.liveness,
        song.features.valence
      ])
      
      const input = tf.tensor2d(features)
      
      // 执行预测
      const predictions = this.model.predict(input) as tf.Tensor
      
      // 获取预测结果
      const results = await predictions.array() as number[][]
      
      // 更新歌曲预测结果
      const updatedSongs = songs.map((song, index) => ({
        ...song,
        predictedPopularity: Math.round(results[index][0] * 100)
      }))
      
      // 清理张量
      input.dispose()
      predictions.dispose()
      
      return updatedSongs
    } catch (error) {
      console.error('批量预测失败:', error)
      throw error
    }
  }

  /**
   * 保存模型
   */
  async saveModel(path: string): Promise<void> {
    if (!this.model || !this.isModelLoaded) {
      throw new Error('模型未加载')
    }
    
    try {
      await this.model.save(path)
      console.log('模型已保存')
    } catch (error) {
      console.error('保存模型失败:', error)
      throw error
    }
  }

  /**
   * 获取模型准确率
   */
  getModelAccuracy(): number {
    return this.modelAccuracy
  }

  /**
   * 模型是否已加载
   */
  isLoaded(): boolean {
    return this.isModelLoaded
  }

  /**
   * 模型是否正在训练
   */
  isTraining(): boolean {
    return this.isModelTraining
  }
}

// 导出服务单例
export const cnnService = new CNNService() 