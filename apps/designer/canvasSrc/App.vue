<script setup lang="ts">
  import { type Schema, useProjectStore, parseStyles } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import { h, onMounted, type VNode } from 'vue'

  const projectStore = useProjectStore()
  const {currentPageSchema} = storeToRefs(projectStore)

  const Container = () => {
    const children:VNode[] = []
    if (currentPageSchema.value && currentPageSchema.value.children) {
      for (const node of currentPageSchema.value.children) {
        children.push(render(node))
      }
    }
    return h('div', {}, children)
  }

  const render = (schema: Schema) => {
    const children:VNode[] = []
    if (schema.children && schema.children.length > 0) {
      for (const node of schema.children) {
        children.push(render(node))
      }
    }
    
    let props = {
      ...schema.props,
      "data-component-id": schema.id,
    }
    // 如果组件有独立的style属性
    if (schema.style) {
      if (props["style"]) {
        // 如果已经有style属性，则合并，但注意，schema.style是字符串，需要转换为对象
        props["style"] = {
          ...props["style"],
          ...parseStyles(schema.style)
        }
      } else {
        props["style"] = schema.style
      }
    }
    
    
    const result = h(schema.tagName, props, children)

    // 附加 rm-node class
    if (result.props?.class) {
      result.props.class = result.props.class + ' rm-node'
    } else {
      if (result.props) {
        result.props.class = 'rm-node'
      } else {
        result.props = {class: 'rm-node'}
      }
    }
    
    
    // // 给个最小宽度和高度，如果原来已经有了，则不设置
    // if (result.props.style) {
    //   result.props.style = {
    //     paddingTop: '2px',
    //     paddingBottom: '2px',
    //     paddingLeft: '6px',
    //     paddingRight: '6px',
    //     ...result.props.style,
    //   }
    // } else {
    //   result.props.style = {
    //     paddingTop: '2px',
    //     paddingBottom: '2px',
    //     paddingLeft: '6px',
    //     paddingRight: '6px',
    //   }
    // }

    return result
  }
  
  onMounted(() => {
    
    // innerCanvasReady event
    window.parent?.dispatchEvent(new CustomEvent('innerCanvasReady'))
  })
</script>

<template>
  <Container />
</template>

<style scoped>
</style>
