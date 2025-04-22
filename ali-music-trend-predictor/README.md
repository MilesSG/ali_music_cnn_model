# 🎵 阿里音乐趋势预测系统 (Ali Music Trend Prediction System)

<p align="center">
  <img src="public/logo.svg" alt="阿里音乐趋势预测系统" width="200"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.3.4-42b883" alt="Vue.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0.2-3178c6" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-4.4.5-646cff" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" />
</p>


![系统运行截图](ali-music-trend-predictor/imgs/image.png)


## 🔥 项目特性

- 🎨 **现代UI**：基于Element Plus和Tailwind CSS构建的响应式界面
- 📊 **数据可视化**：使用ECharts呈现复杂数据关系和趋势
- 🌙 **暗色模式**：支持明/暗主题一键切换，提升用户体验
- 🌐 **多语言支持**：内置中英文语言切换功能
- 💾 **数据管理**：支持多种数据源配置和数据导出选项
- ⚡ **性能优化**：采用Vue 3 Composition API和VueUse工具
- 🔧 **自定义设置**：个性化用户偏好、缓存控制和系统配置

## 🛠️ 技术栈

- **前端框架**: Vue 3, TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **UI组件**: Element Plus
- **CSS框架**: Tailwind CSS
- **功能增强**: VueUse, Vue Router
- **数据可视化**: ECharts
- **图标库**: Font Awesome

## 🔍 功能介绍

- **Dashboard**: 展示关键音乐指标、趋势图表和预测统计
- **预测分析**: 提供音乐趋势预测结果和详细分析
- **艺人分析**: 追踪和分析艺人流行度和成长趋势
- **歌曲分析**: 评估歌曲特征与流行度关系
- **流派分析**: 探索不同音乐流派的流行趋势和特点
- **个性化设置**: 自定义主题、数据源、缓存和导出选项

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/MilesSG/ali_music_cnn_model.git

# 进入项目目录
cd ali-music-trend-predictor

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 🌐 浏览器支持

- Chrome (最近2个版本)
- Firefox (最近2个版本)
- Edge (最近2个版本)
- Safari (最近2个版本)

## 📊 数据处理流程

1. 数据收集：从多个音乐平台API采集原始数据
2. 数据清洗：去除异常和重复数据点
3. 特征提取：使用CNN模型提取关键音乐特征
4. 趋势分析：应用时间序列分析和机器学习算法
5. 结果展示：通过交互式图表和报告呈现结果

## 📝 项目结构

```
src/
├── assets/      # 静态资源
├── components/  # 组件
├── services/    # API服务
├── stores/      # Pinia状态管理
├── styles/      # 全局样式
├── types/       # TypeScript类型定义
├── utils/       # 工具函数
├── views/       # 页面视图
│   ├── Dashboard.vue    # 仪表盘
│   ├── Predictions.vue  # 预测页面
│   ├── Artists.vue      # 艺术家分析
│   ├── Songs.vue        # 歌曲分析
│   ├── Genres.vue       # 流派分析
│   └── Settings.vue     # 用户设置与系统配置
├── App.vue      # 根组件
└── main.ts      # 入口文件
```

## 👨‍💻 开发团队

- 项目负责人：[姓名]
- 前端开发：[姓名]
- 算法工程师：[姓名]
- UI/UX设计：[姓名]

## 📄 许可证

[MIT License](LICENSE)

## 🔗 相关链接

- [项目文档](https://example.com/docs)
- [API文档](https://example.com/api)
- [贡献指南](https://example.com/contributing)

---

<p align="center">© 2025 阿里音乐趋势预测系统. All Rights Reserved.</p> 