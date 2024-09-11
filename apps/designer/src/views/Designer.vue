<script setup lang="ts">
  import Designer from "@ruomu-ui/designer"
  import { onMounted, ref } from 'vue'
  import type { Project } from '@ruomu-ui/types'
  import {ProjectApi} from "@ruomu-ui/api"
  import { useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  
  const projectStore = useProjectStore()
  const {project} = storeToRefs(projectStore)
  
  const getProject = async (id: string) => {
    try {
      const resp = await ProjectApi.instance(id)
      project.value = resp.data || {}
    } catch (error) {
      console.log(error)
    }
  }
  
  onMounted(() => {
    const projectId = '28010609669849088'
    getProject(projectId)
  })
</script>

<template>
  <designer v-if="project.id" runtime-src="canvas.html?id=28010609669849088" />
</template>
