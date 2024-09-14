import { defineStore } from 'pinia'
import type {
  MaterialComponent,
  MaterialComponentGroup,
  MaterialLib,
} from '@ruomu-ui/types'
import {
  useComponentsStore, useProjectStore,
} from '@ruomu-ui/core'
import BuiltIn from './builtInLib.ts'
import { MaterialComponentApi, MaterialComponentGroupApi, MaterialLibApi } from '@ruomu-ui/api'


export type Lib = MaterialLib & {groups?: MaterialComponentGroup[], components?: MaterialComponent[]}
export type Group = MaterialComponentGroup & {components?: MaterialComponent[], expanded?: boolean}

interface State {
  currentLib: Lib | null;
  componentLibs: Lib[];
  fetching?: boolean;
}

export const usePluginMaterialStore = defineStore('pluginMaterial', {
  state: ():State => ({
    currentLib: null,
    componentLibs: [] ,
  }),
  actions: {
    async getLibs() {
      if (this.fetching) {
        return
      }
      this.fetching = true
      try {
        const resp = await MaterialLibApi.list({offset: -1, limit: -1, projectId: useProjectStore().project?.id})
        if (resp.code === 0) {
          // 加上 BuiltIn.BuiltInLib
          // componentLibs.value = resp.data?.items || []
          this.componentLibs = [BuiltIn.BuiltInLib, ...resp.data?.items || []]

          useComponentsStore().addLibs(this.componentLibs)
          
          for (const lib of resp.data?.items || []) {
            this.checkLibGroups(lib)
          }
        }
      } catch (error) {
        console.error(error)
        this.componentLibs = [BuiltIn.BuiltInLib || []]
      } finally {
        this.fetching = false
      }

      if (this.currentLib === null && this.componentLibs.length > 0) {
        this.currentLib = this.componentLibs[0]
        this.checkLibGroups(this.currentLib)
      }
    },
    checkLibGroups(lib: Lib) {
      if (lib) {
        if (lib.groups && lib.groups.length > 0) {
          this.checkComponents(lib)
        } else {
          this.getGroups(lib)
        }
      }
    },
    async getGroups(lib: Lib) {
      if (!lib) {
        return
      }
      if (lib.code === "builtIn") {
        lib.groups = BuiltIn.BuiltInComponentGroups
        this.checkComponents(lib)
        return
      }
      try {
        const resp = await MaterialComponentGroupApi.list({libCode: lib.code})
        if (resp.code === 0) {
          lib.groups = resp.data?.items || []
          this.checkComponents(lib)
        }
      } catch (error) {
        console.error(error)
      }
    },
    checkComponents(lib: Lib) {
      if (lib) {
        if (lib.components && lib.components.length > 0) {
          this.buildGroupComponents(lib)
          return
        } else {
          if (lib && lib.code) {
            this.getComponents(lib)
          }
        }
      }
    },
    async getComponents(lib: Lib) {
      const libCode = lib.code
      if (libCode === "builtIn") {
        lib.components = BuiltIn.BuiltInComponents
        useComponentsStore().addComponents(libCode, BuiltIn.BuiltInComponents)
        this.buildGroupComponents(lib)
        return
      }
      try {
        const resp = await MaterialComponentApi.list({libVersionId: lib.activeVersionId})
        if (resp.code === 0) {
          lib.components = resp.data?.items || []
          useComponentsStore().addComponents(libCode, lib.components)
          this.buildGroupComponents(lib)
        }
      } catch (error) {
        console.error(error)
      }
    },
    buildGroupComponents(lib: Lib) {
      if (lib) {
        if (lib.groups && lib.groups.length > 0) {
          lib.groups.forEach((group: Group) => {
            group.components = lib.components?.filter((component) => {
              return component.groupId === group.id
            })
          })
        }
      }
    }
  }
})