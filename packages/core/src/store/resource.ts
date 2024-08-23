import { defineStore } from 'pinia'

export const useResource = defineStore('resource', {
  state: () => ({
    components: [],
    blocks: [],
    dataSources: [],
  }),
})