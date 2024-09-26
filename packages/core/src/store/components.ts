import { defineStore } from 'pinia'
import type { MaterialComponent, MaterialLib } from '@ruomu-ui/types'
import { MaterialComponentApi } from '@ruomu-ui/api'

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
    getLibByActiveLibId(alId:string) {
      return this.libs.find(lib => lib.activeVersionId === alId)
    },
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
    findComponentById(componentId: string, libVersionId?: string) {
      for (const lib of this.libs) {
        if (libVersionId && lib.activeVersionId !== libVersionId) {
          continue
        }
        
        const component = lib.components.find(item => item.id === componentId)
        if (component) {
          return component
        } else if (libVersionId) {
          this.getLibComponents(lib.code)
        }
      }
      return null
    },
    async getLibComponents(libCode: string) {
      const lib = this.libs.find(lib => lib.code === libCode)
      if (!lib) {
        return
      }
      try {
        const resp = await MaterialComponentApi.list({libVersionId: lib.activeVersionId})
        this.addComponents(libCode, resp.data?.items || [])
      } catch (error) {
        console.error(error)
      }
    }
  }
})