# Ruomu Low Code UI Designer
Ruomu Low Code UI Designer is a low-code UI designer that allows you to design and edit UI components without writing any code. It is built on top of the Vue.js framework and uses the Vue.js component system to provide a rich set of UI components.

## Features
- Drag and drop components to create a UI design
- Edit properties of components
- Preview the UI design in real-time
- Save and load designs
- Compatible with any UI Library you want to use only with some json configurations for each component

## Usage
1. Install the dependencies: `npm install @ruomu-ui/designer`
2. In your Vue.js project, import the designer component and use it:
```vue
<script setup lang="ts">
  import Designer from '@ruomu-ui/designer'
  const projectId = 'your-project-id'
</script>
<template>
  <Designer v-if="projectId" :runtime-src="`canvas.html?id=${your-project-id}`"/>
</template>
```

note: you need a backend service to store the project data, the backend service can be implemented by yourself or using my open source project [ruomu-backend](https://github.com/yockii/ruomu)

the `canvas.html` is rendered by the backend service, you can customize it according to your needs. see [canvas.html](https://github.com/yockii/ruomu/blob/main/views/canvas.html) for more details.

a simple implementation for this can be found in [ruomu-page/apps/designer](https://github.com/yockii/ruomu-page/tree/master/apps/designer)