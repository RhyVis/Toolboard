<script lang="ts" setup>
import CardFrame from "@/components/frames/CardFrame.vue";
import CopyButton from "@/components/utils/CopyButton.vue";
import ReadButton from "@/components/utils/ReadButton.vue";
import axios from "axios";
import { reactive, ref } from "vue";

const query = reactive({
  text: "",
});
const result = ref("");
const key = ref(0);

const store = async () => {
  key.value = new Date().getMilliseconds();
  if (query.text.length == 0) {
    alert("Store text should exist!");
    return;
  }
  if (
    query.text == "存储成功" ||
    query.text == "存储失败" ||
    query.text == "不会存储提示词"
  ) {
    query.text = "不会存储提示词";
  }
  const dt = (await axios.post("/api/save", { text: query.text })).data.res;
  if (dt) {
    query.text = "存储成功";
  } else {
    query.text = "存储失败";
  }
};

const select = async () => {
  key.value = new Date().getMilliseconds();
  const dt = (await axios.get("/api/save")).data.res;
  result.value = dt;
};
</script>

<template>
  <CardFrame title="存储字符">
    <el-form ref="formRef" :model="query" label-width="auto">
      <el-form-item label="存储内容">
        <el-input
          v-model="query.text"
          type="textarea"
          placeholder="输入要保存的内容"
          required
        />
      </el-form-item>
      <el-form-item label="读取内容">
        <el-input
          :value="result"
          type="textarea"
          placeholder="存储于远程的内容"
          readonly
        />
      </el-form-item>
      <el-form-item label="操作数据">
        <el-button type="primary" @click="store">存储</el-button>
        <el-button type="primary" @click="select">读取</el-button>
        <CopyButton :target="result" :key="key" />
        <ReadButton v-model:target="query.text" />
      </el-form-item>
    </el-form>
  </CardFrame>
</template>
