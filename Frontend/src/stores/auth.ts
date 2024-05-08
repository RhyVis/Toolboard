import axios from "axios";
import { defineStore } from "pinia";

/**
 * State:
 * 1 as success
 * 2 as failed
 */
async function validate(token: string) {
  if (token.length > 0) {
    try {
      let { res } = (await axios.post("/api/auth", { token: token })).data;
      return res ? 1 : 2;
    } catch (e) {
      console.error(e);
      return 2;
    }
  } else {
    return 2;
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    valid: false,
  }),
  getters: {
    async validateToken(state) {
      return await validate(state.token);
    },
  },
  actions: {
    updateToken(token: string) {
      this.token = token;
    },
    updateValid(state: boolean) {
      this.valid = state;
    },
  },
  persist: {
    paths: ["token", "valid"],
  },
});
