import { defineStore } from 'pinia'
import { MaterialComponent, MaterialLib } from '../types'

type Lib = MaterialLib & {
  components: MaterialComponent[]
}

type componentsStoreState = {
  libs: Lib[]
}

export const useComponentsStore = defineStore("components", {
  state: () : componentsStoreState => ({
    libs: []
  }),
  actions: {
    addLibs(libs: MaterialLib[]) {
      // 注意重复的不添加
      libs.forEach(lib => {
        if (!this.libs.find(item => item.code === lib.code)) {
          this.libs.push({
            ...lib,
            components: []
          })
        }
      })
    },
    addComponents(libCode: string, components: MaterialComponent[]) {
      const lib = this.libs.find(lib => lib.code === libCode)
      if (lib) {
        // 注意重复的不添加
        components.forEach(component => {
          if (!lib.components.find(item => item.tagName === component.tagName)) {
            lib.components.push(component)
          }
        })
      }
    },
    findComponentById(componentId: string) {
      for (const lib of this.libs) {
        const component = lib.components.find(item => item.id === componentId)
        if (component) {
          return component
        }
      }
      return null
    }
  }
})