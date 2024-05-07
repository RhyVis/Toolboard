import { defineStore } from 'pinia'

export const global = defineStore('global', {
  state: () => {
    return {
      global: 0
    }
  }
})
