import { defineStore } from "pinia";

export const useTranslStore = defineStore("trans", {
  state: () => ({
    text: "",
    source_lang: "EN",
    target_lang: "EN",
  }),
  getters: {
    getLang(state) {
      return [state.source_lang, state.target_lang];
    },
  },
  actions: {
    updateLang(source_lang: string, target_lang: string) {
      this.source_lang = source_lang;
      this.target_lang = target_lang;
    },
  },
  persist: {
    paths: ["source_lang", "target_lang"],
  },
});
