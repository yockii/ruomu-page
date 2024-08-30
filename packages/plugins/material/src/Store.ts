import { defineStore } from 'pinia'
import {
  httpGet,
  MaterialComponent,
  MaterialComponentGroup,
  MaterialLib,
  Paginate,
  useComponentsStore,
} from '@ruomu-ui/core'
import BuiltIn from './builtInLib.ts'


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
        const resp = await httpGet<Paginate<MaterialLib>>('/api/v1/materialLab/list', {offset: -1, limit: -1})
        if (resp.code === 200) {
          // 加上 BuiltIn.BuiltInLib
          // componentLibs.value = resp.data?.items || []
          this.componentLibs = [BuiltIn.BuiltInLib, ...resp.data?.items || []]

          useComponentsStore().addLibs(this.componentLibs)

          if (this.currentLib === null) {
            this.currentLib = this.componentLibs[0]
            this.checkLibGroups()
          }
        }
      } catch (error) {
        console.error(error)
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
      // TODO get groups from server
    },
    checkComponents() {
      if (this.currentLib) {
        if (this.currentLib.components && this.currentLib.components.length > 0) {
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
      // TODO get components from server
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