<script setup lang="ts">
  import { NList, NListItem, NThing, NButton, NIcon, NCollapseTransition } from 'naive-ui'
  import { JsMethod, useProjectStore } from '@ruomu-ui/core'
  import { computed, ref } from 'vue'
  import { ChevronDown, ChevronUp, Plus } from '@vicons/tabler'
  import MethodPanel from './MethodPanel.vue'
  import { usePluginFunctionStore } from './Store.ts'
  import { storeToRefs } from 'pinia'

  const projectStore = useProjectStore()
  const myStore = usePluginFunctionStore()
  const jsBlock = computed(() => projectStore.currentPageSchema?.js)
  const methods = computed(() => jsBlock.value?.methods)
  
  const {showMethodPanel, currentMethod} = storeToRefs(myStore)
  
  const showBuiltInMethods = ref(false)
  const showCustomMethods = ref(true)
  
  const showMethod = (method: JsMethod) => {
    currentMethod.value = method
    showMethodPanel.value = true
  }
  const addNewMethod = (code: string) => {
    // 如果有id,则不理会，否则新增
    currentMethod.value.code = code
    if (!currentMethod.value.id) {
      currentMethod.value.id = Date.now() + ''
      projectStore.addNewCustomMethod(currentMethod.value)
    }
    showMethodPanel.value = false
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
    }
  }
</script>

<template>
  <div class="w-180px relative">
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
        <n-list-item>
          <n-thing title="onMounted" description="在页面挂载后执行" />
        </n-list-item>
        <n-list-item>
          <n-thing title="onUnmounted" description="在页面卸载后执行" />
        </n-list-item>
        <n-list-item>
          <n-thing title="onUpdated" description="在页面更新后执行" />
        </n-list-item>
        <n-list-item>
          <n-thing title="onBeforeMount" description="在页面挂载前执行" />
        </n-list-item>
        <n-list-item>
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
    
    <method-panel v-if="showMethodPanel" :method="currentMethod" @close="showMethodPanel=false" @confirm="addNewMethod" @remove="removeMethod"/>
  </div>
</template>

<style scoped>
</style>