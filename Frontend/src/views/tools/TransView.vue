<script lang="ts" setup>
import axios from "axios";
import CryptoJS from "crypto-js";
import { onMounted, reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useTranslStore } from "@/stores/tools/trans";

import CardFrame from "@/components/frames/CardFrame.vue";
import SelectSimple from "@/components/utils/SelectSimple.vue";
import CopyButton from "@/components/utils/CopyButton.vue";
import ReadButton from "@/components/utils/ReadButton.vue";
import ClearButton from "@/components/utils/ClearButton.vue";

const store = useTranslStore();

const query = reactive({
  endpoint: "",
  token: "",
  text: "",
  source_lang: "EN",
  target_lang: "ZH",
});

const auth = useAuthStore();

const titleMis = ref("");
const key = ref(0);
const result = ref("");

const options = ref([
  { value: "EN", label: "English" },
  { value: "ZH", label: "Chinese" },
  { value: "DE", label: "Deutsch" },
  { value: "ES", label: "Español" },
  { value: "FR", label: "French" },
  { value: "IT", label: "Italian" },
  { value: "JA", label: "Japanese" },
  { value: "KO", label: "Korean" },
  { value: "NL", label: "Dutch" },
  { value: "PL", label: "Polish" },
  { value: "PT", label: "Portuguese" },
  { value: "RU", label: "Russian" },
]);

const translate = async () => {
  const { text, source_lang, target_lang } = query;
  key.value = new Date().getTime();
  // Cache
  if (
    text === store.text &&
    source_lang === store.source_lang &&
    target_lang === store.target_lang
  ) {
    console.log("Read cached value");
    result.value = store.text;
  } else {
    // Check inputs
    if (text.length == 0) {
      result.value = "不能翻译空句子";
      return;
    }
    if (source_lang === target_lang) {
      result.value = "你喜欢原地翻译？";
      return;
    }

    store.updateLang(source_lang, target_lang);
    result.value = "别急，加载中";

    const { data, status, statusText } = await axios.post(
      query.endpoint,
      {
        text: text.replace(/[\r\n]/g, " "),
        source_lang: source_lang,
        target_lang: target_lang,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${query.token}`,
        },
      }
    );
    console.log(`${data.id}: ${data.method}`);
    if (data.data != undefined && data.alternatives != null) {
      const formatted = `${data.data}\n-------------\n${data.alternatives.join(
        "\n"
      )}`;
      result.value = store.text = formatted;
    } else {
      result.value = `${data.id}: ${data.method} [Translate Failed]\nType: ${status} - ${statusText}`;
    }
  }
};

onMounted(async () => {
  const storeSource = store.getLang[0];
  const storeTarget = store.getLang[1];
  if (storeSource != undefined && storeTarget != undefined) {
    query.source_lang = storeSource;
    query.target_lang = storeTarget;
  }
  const tokenHash = CryptoJS.SHA1(auth.token).toString();
  await axios
    .post("/api/auth/trans", { value: tokenHash, hash: true })
    .then((respond) => {
      const dToken = respond.data.res;
      if (dToken) {
        query.token = dToken.token;
        query.endpoint = dToken.endpoint;
        titleMis.value = "";
      } else {
        titleMis.value = "(未获取Token)";
      }
    });
});
</script>

<template>
  <CardFrame title="翻译前端">
    <el-form :model="query" label-width="auto">
      <el-form-item label="原始文本">
        <el-input
          v-model="query.text"
          :rows="5"
          type="textarea"
          placeholder="键入翻译内容"
          required
        />
      </el-form-item>
      <el-form-item label="原始语言">
        <SelectSimple v-model:select="query.source_lang" :options="options" />
      </el-form-item>
      <el-form-item label="目标语言">
        <SelectSimple v-model:select="query.target_lang" :options="options" />
      </el-form-item>
      <el-form-item label="翻译">
        <el-button type="primary" @click="translate">Go</el-button>
        <CopyButton :target="result.split('\n')[0]" :key="key" />
        <ReadButton v-model:target="query.text" />
        <ClearButton v-model:target="query.text" />
      </el-form-item>
      <el-form-item label="结果">
        <el-input :value="result" :rows="5" type="textarea" readonly />
      </el-form-item>
    </el-form>
  </CardFrame>
</template>
