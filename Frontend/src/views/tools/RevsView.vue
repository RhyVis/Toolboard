<script lang="ts" setup>
import CardFrame from "@/components/frames/CardFrame.vue";
import CopyButton from "@/components/utils/CopyButton.vue";
import ClearButton from "@/components/utils/ClearButton.vue";
import ReadButton from "@/components/utils/ReadButton.vue";
import { reactive, ref } from "vue";

const query = reactive({
  text: "",
  mode: "rev",
});
const key = ref(0);
const result = ref("");

const modes = [
  { label: "反转", value: "rev" },
  { label: "内翻", value: "fold-in" },
  { label: "外翻", value: "fold-out" },
];

const action = async () => {
  key.value = new Date().getTime();
  if (query.text.length > 0) {
    const reversed = [...query.text].reverse().join("");
    switch (query.mode) {
      case "rev":
        result.value = reversed;
        break;
      case "fold-in":
        result.value = query.text + reversed;
        break;
      case "fold-out":
        result.value = reversed + query.text;
        break;
      default:
        console.log(`Unexpected mode: ${query.mode}`);
        break;
    }
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
      <el-form-item label="模式">
        <el-radio-group v-model="query.mode" size="small">
          <el-radio-button
            v-for="(mode, index) in modes"
            :key="index"
            :label="mode.label"
            :value="mode.value"
          />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="执行">
        <el-button @click="action">启动</el-button>
      </el-form-item>
      <el-form-item label="操作">
        <CopyButton :target="result" :key="key" />
        <ReadButton v-model:target="query.text" />
        <ClearButton v-model:target="query.text" />
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
