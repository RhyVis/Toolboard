import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    valid: false
  }),
  actions: {
    updateToken(token: string) {
      this.token = token
    },
    updateValid(state: boolean) {
      this.valid = state
    }
  },
  persist: {
    paths: ['token', 'valid']
  }
})
