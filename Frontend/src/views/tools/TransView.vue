<script lang="ts" setup>
import axios from "axios";
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth";

import CardFrame from "@/components/frames/CardFrame.vue";

const query = reactive({
  endpoint: "",
  token: "",
  text: "",
  source_lang: "EN",
  target_lang: "ZH",
});

const auth = useAuthStore();

const titleMis = ref("");

const result = ref("");

const options = ref([
  { id: "EN", label: "English" },
  { id: "ZH", label: "Chinese" },
  { id: "DE", label: "Deutsch" },
  { id: "ES", label: "Español" },
  { id: "FR", label: "French" },
  { id: "IT", label: "Italian" },
  { id: "JA", label: "Japanese" },
  { id: "KO", label: "Korean" },
  { id: "NL", label: "Dutch" },
  { id: "PL", label: "Polish" },
  { id: "PT", label: "Portuguese" },
  { id: "RU", label: "Russian" },
]);

const translate = async () => {
  const { text, source_lang, target_lang } = query;
  if (text.length == 0) {
    result.value = "不能翻译空句子";
    return;
  }
  if (source_lang === target_lang) {
    result.value = "你喜欢原地翻译？";
    return;
  }

  localStorage.setItem("trans_source_lang", source_lang);
  localStorage.setItem("trans_target_lang", target_lang);

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
    result.value = `${data.data}\n-------------\n${data.alternatives.join(
      "\n"
    )}`;
  } else {
    result.value = `${data.id}: ${data.method} [Translate Failed]\nType: ${status} - ${statusText}`;
  }
};

(async function () {
  const storeSource = localStorage.getItem("trans_source_lang");
  const storeTarget = localStorage.getItem("trans_target_lang");
  if (storeSource != undefined && storeTarget != undefined) {
    query.source_lang = storeSource;
    query.target_lang = storeTarget;
  }
  await axios.post("/api/auth/trans", { token: auth.token }).then((respond) => {
    const dToken = respond.data.res;
    //console.log(dToken)
    if (dToken) {
      query.token = dToken.token;
      query.endpoint = dToken.endpoint;
      titleMis.value = "";
    } else {
      titleMis.value = "(未获取Token)";
    }
  });
})();
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
        <el-select
          v-model="query.source_lang"
          value-key="id"
          placeholder="Select"
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="目标语言">
        <el-select
          v-model="query.target_lang"
          value-key="id"
          placeholder="Select"
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="翻译">
        <el-button type="primary" @click="translate">Go</el-button>
      </el-form-item>
      <el-form-item label="翻译">
        <el-input :value="result" :rows="5" type="textarea" readonly />
      </el-form-item>
    </el-form>
  </CardFrame>
</template>
