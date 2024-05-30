<script lang="ts" setup>
import CardFrame from "@/components/frames/CardFrame.vue";
import CopyButton from "@/components/utils/CopyButton.vue";
import { reactive, ref } from "vue";

const query = reactive({
  text: "",
});
const result = ref("");

const reverse = async () => {
  if (query.text.length > 0) {
    result.value = [...query.text].reverse().join("");
  } else {
    result.value = "你很喜欢这样吗";
  }
};
</script>

<template>
  <CardFrame title="倒叙内容">
    <el-form ref="formRef" :model="query" label-width="auto">
      <el-form-item label="原始文本">
        <el-input
          v-model="query.text"
          type="textarea"
          placeholder="你不输入你用什么工具？"
          required
        />
      </el-form-item>
      <el-form-item label="倒叙">
        <el-button @click="reverse">启动</el-button>
        <CopyButton :target="result" />
      </el-form-item>
    </el-form>
    <div v-if="result.length > 0">
      <el-divider />
      <div style="text-align: left" class="text-muted">
        {{ result }}
      </div>
    </div>
  </CardFrame>
</template>
