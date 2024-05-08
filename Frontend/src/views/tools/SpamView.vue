<script setup lang="ts">
import { reactive, ref } from "vue";
import axios from "axios";
import useClipboard from "vue-clipboard3";

import CardFrame from "@/components/frames/CardFrame.vue";

const { toClipboard } = useClipboard();

const query = reactive({
  type: "spam_min",
  code: "",
  limit: 1,
});

const result = ref([
  "快乐生活每一天，请不要用这个工具的结果来攻击他人哦😊",
  "仅供学习交流使用，由您不当使用造成的后果，将由您承担",
]);

const mergeResult = ref(false);
const copyMode = ref(false);
const copyButton = ref("复制？😋");
const copyButtonType = ref("info");

const mult = ref(false);
const rept = ref({
  enable: false,
  count: 1,
});

const config = {
  headers: { "Content-Type": "application/json" },
};

const activeTab = ref("spam");

function changeTab() {
  switch (activeTab.value) {
    case "spam":
      query.type = "spam_min";
      break;
    case "mmr":
      query.type = "genshin";
      break;
    default:
  }
}

function resetButton() {
  copyButton.value = "复制？😋";
  copyButtonType.value = "info";
}

async function copyt() {
  try {
    const { value } = copyMode;
    if (value) {
      await toClipboard(result.value.join("\n"));
    } else {
      await toClipboard(result.value.join(""));
    }
    copyButton.value = "成功！😌";
    copyButtonType.value = "success";
  } catch (e) {
    console.log(e);
  }
}

async function fetchSpam() {
  const request = {
    type: query.type,
    code: query.code,
    limit: mult.value ? query.limit : 1,
  };
  const respond = (await axios.post("/api/spam", request, config)).data
    .res as Array<Result>;
  let textList = respond.map((obj) => obj.text.split(/\\n|\n/g)).flat();
  if (rept.value.enable) {
    result.value = textList
      .map((text) => {
        if (mergeResult.value) {
          return text.repeat(rept.value.count);
        } else {
          let repeated = [];
          for (let i = 0; i < rept.value.count; i++) {
            repeated.push(text);
          }
          return repeated;
        }
      })
      .flat();
  } else {
    result.value = textList;
  }
  resetButton();
}

class Result {
  text!: string;
}
</script>

<template>
  <CardFrame title="弹药库">
    <el-form :model="query" label-width="auto">
      <el-tabs v-model="activeTab" @tab-change="changeTab">
        <el-tab-pane label="祖安特区" name="spam">
          <el-form-item label="使用说明">
            <span>高强度的版本很容易被夹，建议加上转义</span>
          </el-form-item>
          <el-form-item label="选择强度">
            <el-radio-group v-model="query.type">
              <el-radio-button label="小喷怡情😋" value="spam_min" />
              <el-radio-button label="火力全开😠" value="spam_max" />
            </el-radio-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="二游笑话" name="mmr">
          <el-form-item label="使用说明">
            <span style="text-align: left"
              >介于各路孝子挂对面的时候都是截图挂人，所以这数据库里面很多东西也都是OCR扫出来的，有错字就当二游痴子没文化吧</span
            >
          </el-form-item>
          <el-form-item label="选择游戏">
            <el-radio-group v-model="query.type">
              <el-tooltip content="原神" placement="top">
                <el-radio-button label="原神怎么你了" value="genshin" />
              </el-tooltip>
              <el-tooltip content="明日方舟" placement="top">
                <el-radio-button label="二游半壁江山" value="arknights" />
              </el-tooltip>
            </el-radio-group>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item label="加密方式">
        <el-radio-group v-model="query.code">
          <el-radio-button label="直白对决😅" value="" />
          <el-radio-button label="抽象加密🤗" value="nmsl" />
          <el-radio-button label="繁体传统🤔" value="trad" />
          <el-radio-button label="火星密文😘" value="sprk" />
          <el-radio-button label="形近转换🧐" value="unic" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="妙语连珠">
        <el-switch v-model="mult" />
      </el-form-item>
      <el-form-item label="数量" v-if="mult">
        <el-input-number
          v-model="query.limit"
          size="small"
          :min="1"
          :max="10"
        />
      </el-form-item>
      <el-form-item label="连续复读">
        <el-switch v-model="rept.enable" />
      </el-form-item>
      <el-form-item label="数量" v-if="rept.enable">
        <el-input-number v-model="rept.count" size="small" :min="1" :max="10" />
      </el-form-item>
      <el-form-item label="合并结果" v-if="rept.enable || mult">
        <el-tooltip content="把复读的结果塞到一行里面" placement="top">
          <el-switch v-model="mergeResult" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="换行复制" v-if="rept.enable || mult">
        <el-switch v-model="copyMode" />
      </el-form-item>
      <el-form-item label="准备好了">
        <el-button type="danger" @click="fetchSpam">开干！😤</el-button>
        <el-button :type="copyButtonType" @click="copyt">
          {{ copyButton }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-divider />
    <div class="mt-2 mb-2 text-muted">
      <div v-for="(item, index) in result" :key="index">{{ item }}</div>
    </div>
  </CardFrame>
</template>
