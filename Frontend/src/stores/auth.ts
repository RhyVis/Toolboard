import axios from "axios";
import crypto from "crypto";
import { defineStore } from "pinia";

/**
 * State:
 * 1 as success
 * 2 as failed
 */
async function validate(token: string) {
  if (token.length > 0) {
    try {
      let hashCode = crypto.createHash("sha1").update(token).digest("hex");
      return (await axios.post("/api/auth", { value: hashCode, hash: true }))
        .data as boolean;
    } catch (e) {
      console.error(e);
      return false;
    }
  } else {
    return false;
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    valid: false,
  }),
  getters: {
    async validateToken(state) {
      state.valid = await validate(state.token);
      return state.valid ? 1 : 2;
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
