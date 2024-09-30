<script setup lang="ts">
  import { NButton, NCollapseTransition, NIcon, NList, NListItem, NThing } from 'naive-ui'
  import type { JsMethod } from '@ruomu-ui/types'
  import { deepClone, useProjectStore } from '@ruomu-ui/core'
  import { computed, ref } from 'vue'
  import { ChevronDown, ChevronUp, Plus } from '@vicons/tabler'
  import MethodPanel from './MethodPanel.vue'
  import { usePluginFunctionStore } from './Store.ts'
  import { storeToRefs } from 'pinia'
  import BuiltInMethodPanel from './BuiltInMethodPanel.vue'

  const projectStore = useProjectStore()
  const myStore = usePluginFunctionStore()
  const jsBlock = computed(() => projectStore.currentPageSchema?.js)
  const methods = computed(() => jsBlock.value?.methods)
  
  const {showMethodPanel, currentMethod} = storeToRefs(myStore)
  
  const showBuiltInMethods = ref(false)
  const showCustomMethods = ref(true)
  
  const showMethod = (method: JsMethod) => {
    currentMethod.value = deepClone(method)
    showMethodPanel.value = true
    showBuiltInMethodPanel.value = false
  }
  const addNewMethod = (resultCode: string) => {
    // 如果有id,则不理会，否则新增
    const cs = resultCode.split("\n")
    // 去掉首尾行
    currentMethod.value.code = cs.slice(1, cs.length - 1).join('\n')
    if (!currentMethod.value.id) {
      currentMethod.value.id = Date.now() + ''
    }
    projectStore.addNewCustomMethod(currentMethod.value)
    showMethodPanel.value = false
    projectStore.pageDirt = true
  }
  const removeMethod = () => {
    if (currentMethod.value.id) {
      projectStore.removeCustomMethod(currentMethod.value.id)
      currentMethod.value = {
        name: '',
        description: '',
        code: '',
        params: [],
      }
      showMethodPanel.value = false
      projectStore.pageDirt = true
    }
  }
  
  // 内置方法
  const currentBuiltInMethodCode = ref('') 
  const currentBuiltInMethod = ref('')
  const showBuiltInMethodPanel = ref(false)
  const editBuiltInMethod = (methodName: string) => {
    console.log(methodName)
    switch (methodName) {
      case 'onMounted':
        currentBuiltInMethodCode.value = jsBlock.value?.onMounted || ''
        break
      case 'onUnmounted':
        currentBuiltInMethodCode.value = jsBlock.value?.onUnmounted || ''
        break
      case 'onUpdated':
        currentBuiltInMethodCode.value = jsBlock.value?.onUpdated || ''
        break
      case 'onBeforeMount':
        currentBuiltInMethodCode.value = jsBlock.value?.onBeforeMount || ''
        break
      case 'onBeforeUnmount':
        currentBuiltInMethodCode.value = jsBlock.value?.onBeforeUnmount || ''
        break
      default:
        return
    }
    currentBuiltInMethod.value = methodName
    showBuiltInMethodPanel.value = true
    showMethodPanel.value = false
  }
  
  const confirmBuiltInMethodEdition = (resultCode: string) => {
    if(projectStore.currentPageSchema) {
      const cs = resultCode.split("\n")
      // 去掉首尾行
      const code = cs.slice(1, cs.length - 1).join('\n')
      
      if(!projectStore.currentPageSchema.js) {
        projectStore.currentPageSchema.js = {
          onMounted: '',
          onUnmounted: '',
          onUpdated: '',
          onBeforeMount: '',
          onBeforeUnmount: '',
          methods: []
        }
      }
      switch (currentBuiltInMethod.value) {
          case 'onMounted':
            projectStore.currentPageSchema.js.onMounted = code
            break
          case 'onUnmounted':
            projectStore.currentPageSchema.js.onUnmounted = code
            break
          case 'onUpdated':
            projectStore.currentPageSchema.js.onUpdated = code
            break
          case'onBeforeMount':
            projectStore.currentPageSchema.js.onBeforeMount = code
            break
          case 'onBeforeUnmount':
            projectStore.currentPageSchema.js.onBeforeUnmount = code
            break
          default:
            return
        }
      
      showBuiltInMethodPanel.value = false
      projectStore.pageDirt = true
    }
  }
</script>

<template>
  <div class="w-240px relative">
    <div class="bg-#EFEFEF mt-8px px-8px h-36px flex items-center justify-between cursor-pointer" @click="showBuiltInMethods= !showBuiltInMethods">
      <div class="flex items-center">
        <n-icon size="18">
          <ChevronUp v-if="showBuiltInMethods"/>
          <ChevronDown v-else/>
        </n-icon>
        <div class="ml-4px">内置方法</div>
      </div>
    </div>
    <n-collapse-transition :show="showBuiltInMethods">
      <n-list hoverable clickable>
        <n-list-item @click="editBuiltInMethod('onMounted')">
          <n-thing title="onMounted" description="在页面挂载后执行"/>
        </n-list-item>
        <n-list-item @click="editBuiltInMethod('onUnmounted')">
          <n-thing title="onUnmounted" description="在页面卸载后执行" />
        </n-list-item>
        <n-list-item @click="editBuiltInMethod('onUpdated')">
          <n-thing title="onUpdated" description="在页面更新后执行" />
        </n-list-item>
        <n-list-item @click="editBuiltInMethod('onBeforeMount')">
          <n-thing title="onBeforeMount" description="在页面挂载前执行" />
        </n-list-item>
        <n-list-item @click="editBuiltInMethod('onBeforeUnmount')">
          <n-thing title="onBeforeUnmount" description="在页面卸载前执行" />
        </n-list-item>
      </n-list>
    </n-collapse-transition>

    <div class="bg-#EFEFEF mt-8px px-8px h-36px flex items-center justify-between cursor-pointer" @click="showCustomMethods= !showCustomMethods">
      <div class="flex items-center">
        <n-icon size="18">
          <ChevronUp v-if="showCustomMethods"/>
          <ChevronDown v-else/>
        </n-icon>
        <div class="ml-4px">自定义方法</div>
      </div>
      <n-button text :focusable="false" @click.stop="showMethod({name: '',description: '',code: '',params: []})">
        <template #icon>
          <n-icon>
            <Plus />
          </n-icon>
        </template>
      </n-button>
    </div>
    <n-collapse-transition :show="showCustomMethods">
      <n-list hoverable clickable>
        <n-list-item v-for="m in methods" :key="m.id" @click="showMethod(m)">
          <n-thing :title="m.name" :description="m.description" />
        </n-list-item>
      </n-list>
    </n-collapse-transition>
    
    <built-in-method-panel v-if="showBuiltInMethodPanel" @close="showBuiltInMethodPanel=false" :code="currentBuiltInMethodCode" :method-name="currentBuiltInMethod" @confirm="confirmBuiltInMethodEdition" />
    <method-panel v-if="showMethodPanel" :method="currentMethod" @close="showMethodPanel=false" @confirm="addNewMethod" @remove="removeMethod"/>
  </div>
</template>

<style scoped>
</style>