<script setup lang="ts">
import { reactive, ref } from "vue";
import axios from "axios";

import CardFrame from "@/components/frames/CardFrame.vue";
import CopyButton from "@/components/utils/CopyButton.vue";

const activeTab = ref("nmsl");

const query = reactive({
  text: "",
  dec: false,
});
const result = ref("");

const copyButtonKey = ref(0);

const resetButton = () => {
  copyButtonKey.value = new Date().getTime();
};

const fetchResult = async () => {
  const { text } = query;
  if (text.length === 0) {
    result.value = "你不输入转什么呢？";
  } else {
    const { dec } = query;
    const type = activeTab.value;
    const request = {
      type: type,
      text: text,
      dec: dec,
    };
    const respond = await axios.post("/api/codex", request);
    result.value = respond.data.res;
    resetButton();
  }
};
</script>

<template>
  <CardFrame title="抽象翻译器">
    <el-form :model="query" label-width="auto">
      <el-tabs v-model="activeTab">
        <!-- Abstract -->
        <el-tab-pane label="抽象转换" name="nmsl">
          <el-form-item label="原始文本">
            <el-input
              v-model="query.text"
              type="textarea"
              placeholder="你不输入你用什么工具？"
              required
            ></el-input>
          </el-form-item>
          <el-form-item label="解码抽象">
            <el-tooltip content="只能解析成拼音，并且不全" placement="top">
              <el-switch v-model="query.dec" />
            </el-tooltip>
          </el-form-item>
        </el-tab-pane>
        <!-- Traditional Chinese -->
        <el-tab-pane label="繁体转换" name="trad">
          <el-form-item label="原始文本">
            <el-input
              v-model="query.text"
              type="textarea"
              placeholder="你不输入你用什么工具？"
              required
            ></el-input>
          </el-form-item>
          <el-form-item label="解码抽象">
            <el-switch v-model="query.dec" />
          </el-form-item>
        </el-tab-pane>
        <!-- Spark -->
        <el-tab-pane label="火星转换" name="sprk">
          <el-form-item label="原始文本">
            <el-input
              v-model="query.text"
              type="textarea"
              placeholder="你不输入你用什么工具？"
              required
            ></el-input>
          </el-form-item>
          <el-form-item label="解码抽象">
            <el-switch v-model="query.dec" />
          </el-form-item>
        </el-tab-pane>
        <!-- Unifont diff -->
        <el-tab-pane label="形近转换" name="unic">
          <el-form-item label="原始文本">
            <el-input
              v-model="query.text"
              type="textarea"
              placeholder="你不输入你用什么工具？"
              required
            ></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item label="输出结果">
        <span>{{ result }}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchResult">启动！😅</el-button>
        <CopyButton :target="result" :key="copyButtonKey" />
      </el-form-item>
    </el-form>
  </CardFrame>
</template>
