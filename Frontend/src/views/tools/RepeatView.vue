<script lang="ts" setup>
import { reactive, ref } from "vue";
import useClipboard from "vue-clipboard3";

import CardFrame from "@/components/frames/CardFrame.vue";

const { toClipboard } = useClipboard();

const query = reactive({
  text: "",
  count: 1,
});

const activeTab = ref("simple");

const result = ref([""]);

const powCount = ref(false);
const mergeResult = ref(false);
const copyMode = ref(false);
const copyButton = ref("复制？😋");
const copyButtonType = ref("info");

function launch() {
  let repeated = [];
  const { text, count } = query;
  const pow = powCount.value;
  if (text.length > 0 && count > 0) {
    for (let i = 0; i < (pow ? Math.pow(2, count) : count); i++) {
      repeated.push(text);
    }
    result.value = repeated;
  } else {
    result.value = ["你为何不言不语？"];
  }
  resetButton();
}

async function copyt() {
  try {
    const { value } = copyMode;
    if (value) {
      await toClipboard(result.value.join("\n"));
    } else {
      await toClipboard(result.value.join(""));
    }
    copyButton.value = "成功";
    copyButtonType.value = "success";
  } catch (e) {
    console.log(e);
  }
}

function resetButton() {
  copyButton.value = "复制";
  copyButtonType.value = "info";
}
</script>

<template>
  <CardFrame title="复读机">
    <el-form :model="query" label-width="auto">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="普通复读" name="simple">
          <el-form-item label="原始文本">
            <el-input
              v-model="query.text"
              type="textarea"
              placeholder="你不输入你用什么工具？"
              required
            ></el-input>
          </el-form-item>
          <el-form-item label="复读数量">
            <el-input-number
              v-model="query.count"
              size="small"
              :min="1"
              :max="50"
            />
          </el-form-item>
          <el-form-item label="指数复制">
            <el-tooltip
              content="复读的最终数量将为(2^复读数量)"
              placement="top"
            >
              <el-switch v-model="powCount" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="合并结果">
            <el-tooltip content="把复读的结果塞到一行里面" placement="top">
              <el-switch v-model="mergeResult" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="换行复制">
            <el-switch v-model="copyMode" />
          </el-form-item>
          <el-form-item label="准备好了">
            <el-button type="danger" @click="launch">启动！😅</el-button>
            <el-button :type="copyButtonType" @click="copyt">
              {{ copyButton }}
            </el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <el-divider />
    <div class="mt-2 mb-2 text-muted">
      <div v-if="mergeResult">
        <div>{{ result.join("") }}</div>
      </div>
      <div v-else>
        <div v-for="(item, index) in result" :key="index">{{ item }}</div>
      </div>
    </div>
  </CardFrame>
</template>
