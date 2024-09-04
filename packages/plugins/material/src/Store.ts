import { defineStore } from 'pinia'
import type {
  MaterialComponent,
  MaterialComponentGroup,
  MaterialLib,
} from '@ruomu-ui/types'
import {
  useComponentsStore,
} from '@ruomu-ui/core'
import BuiltIn from './builtInLib.ts'
import { MaterialComponentApi, MaterialComponentGroupApi, MaterialLibApi } from '@ruomu-ui/api'


export type Lib = MaterialLib & {groups?: MaterialComponentGroup[], components?: MaterialComponent[]}
export type Group = MaterialComponentGroup & {components?: MaterialComponent[], expanded?: boolean}

interface State {
  currentLib: Lib | null;
  componentLibs: Lib[];
}

export const usePluginMaterialStore = defineStore('pluginMaterial', {
  state: ():State => ({
    currentLib: null,
    componentLibs: [] ,
  }),
  actions: {
    async getLibs() {
      try {
        const resp = await MaterialLibApi.list({offset: -1, limit: -1})
        if (resp.code === 200) {
          // 加上 BuiltIn.BuiltInLib
          // componentLibs.value = resp.data?.items || []
          this.componentLibs = [BuiltIn.BuiltInLib, ...resp.data?.items || []]

          useComponentsStore().addLibs(this.componentLibs)

        }
      } catch (error) {
        console.error(error)
        this.componentLibs = [BuiltIn.BuiltInLib || []]
      }

      if (this.currentLib === null && this.componentLibs.length > 0) {
        this.currentLib = this.componentLibs[0]
        this.checkLibGroups()
      }
    },
    checkLibGroups() {
      if (this.currentLib) {
        if (this.currentLib.groups && this.currentLib.groups.length > 0) {
          this.checkComponents()
        } else {
          this.getGroups()
        }
      }
    },
    async getGroups() {
      if (!this.currentLib) {
        return
      }
      if (this.currentLib.code === "builtIn") {
        this.currentLib.groups = BuiltIn.BuiltInComponentGroups
        this.checkComponents()
        return
      }
      try {
        const resp = await MaterialComponentGroupApi.list({libCode: this.currentLib.code})
        if (resp.code === 200) {
          this.currentLib.groups = resp.data?.items || []
          this.checkComponents()
        }
      } catch (error) {
        console.error(error)
      }
    },
    checkComponents() {
      if (this.currentLib) {
        if (this.currentLib.components && this.currentLib.components.length > 0) {
          this.buildGroupComponents()
          return
        } else {
          this.getComponents()
        }
      }
    },
    async getComponents() {
      if (!this.currentLib || !this.currentLib.code) {
        return
      }
      const libCode = this.currentLib.code
      if (libCode === "builtIn") {
        this.currentLib.components = BuiltIn.BuiltInComponents
        useComponentsStore().addComponents(libCode, BuiltIn.BuiltInComponents)
        this.buildGroupComponents()
        return
      }
      try {
        const resp = await MaterialComponentApi.list({libVersionId: this.currentLib.activeVersionId})
        if (resp.code === 200) {
          this.currentLib.components = resp.data?.items || []
          useComponentsStore().addComponents(libCode, this.currentLib.components)
          this.buildGroupComponents()
        }
      } catch (error) {
        console.error(error)
      }
    },
    buildGroupComponents() {
      if (this.currentLib) {
        if (this.currentLib.groups && this.currentLib.groups.length > 0) {
          this.currentLib.groups.forEach((group: Group) => {
            group.components = this.currentLib?.components?.filter((component) => {
              return component.groupId === group.id
            })
          })
        }
      }
    }
  }
})