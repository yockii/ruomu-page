[English](README_EN.md)

# 若木低代码UI设计器
若木低代码UI设计器是一款无需编写任何代码即可设计和编辑UI组件的工具。它基于Vue.js框架构建，并利用Vue.js组件系统提供了丰富的UI组件集。

## 特性
- 拖放组件以创建UI设计
- 编辑组件属性
- 实时预览UI设计
- 保存和加载设计方案
- 兼容任何您想使用的UI库，只需为每个组件配置一些json文件

## 使用方法
1. 安装依赖项：`npm install @ruomu-ui/designer`
2. 在您的Vue.js项目中导入设计器组件并使用它：
```vue
<script setup lang="ts">
  import Designer from '@ruomu-ui/designer'
  const projectId = 'your-project-id'
</script>
<template>
  <Designer v-if="projectId" :runtime-src="`canvas.html?id=${your-project-id}`"/>
</template>
```

注意：您需要一个后端服务来存储项目数据，后端服务可以自行实现或使用我的开源项目 [ruomu-backend](https://github.com/yockii/ruomu)

`canvas.html` 是由后端服务渲染的，您可以根据需要自定义它。更多详情请参见 [canvas.html](https://github.com/yockii/ruomu/blob/main/views/canvas.html)。

一个简单的实现可以在 [ruomu-page/apps/designer](https://github.com/yockii/ruomu-page/tree/master/apps/designer) 中找到。

提示：后端BaseURL在`.env`文件中配置。如果您决定使用自己的后端服务，则需要遵循 [types](https://github.com/yockii/ruomu-page/tree/master/packages/types) 和 [api](https://github.com/yockii/ruomu-page/tree/master/packages/api)。

api包是可选的，您可以使用自己的API实现。