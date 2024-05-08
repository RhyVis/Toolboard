<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import axios from "axios";
import type { Card, CardPick } from "@/misc/tarotType";

import CardFrame from "@/components/frames/CardFrame.vue";
import TarotMain from "@/components/display/tarot/TarotMain.vue";
import TarotDesc from "@/components/display/tarot/TarotDesc.vue";
import SelectSimple from "@/components/utils/SelectSimple.vue";

const query = reactive({
  count: 1,
  type: true,
  deck: "bilibili",
});

const activeTab = ref("simple");

const deckTypes = [
  { value: "waite", label: "韦特" },
  { value: "bilibili", label: "幻星集" },
  { value: "bluearchive", label: "碧蓝档案" },
  { value: "arknights", label: "明日方舟" },
];

const result = ref([] as CardPick[]);

const showDescAll = ref(true);
const fullAble = computed(
  () => query.deck === "waite" || query.deck === "bilibili"
);
const allowedMax = computed(() => (fullAble.value && query.type ? 78 : 22));
const tooltip = computed(() =>
  fullAble.value ? "完整卡组包括小阿尔卡那" : "该卡组只包括大阿尔卡那"
);

const drawDeck = async () => {
  const respond = (await axios.post("/api/tarot", query)).data
    .res as CardPick[];
  result.value = respond.map((card) => {
    card.showImg = true;
    card.showDesc = false;
    return card;
  });
};
const clear = () => (result.value = []);
</script>

<template>
  <CardFrame title="塔罗牌">
    <el-form :model="query" label-width="auto">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="简单模式" name="simple">
          <el-form-item label="卡面类型">
            <SelectSimple v-model:select="query.deck" :options="deckTypes" />
          </el-form-item>
          <el-form-item label="完整卡组">
            <el-tooltip :content="tooltip" placement="top">
              <el-switch v-model="query.type" :disabled="!fullAble" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="展示提示">
            <el-tooltip content="在下方展示所有抽到牌的提示" placement="top">
              <el-switch v-model="showDescAll" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="抽牌数量">
            <el-input-number
              v-model="query.count"
              size="small"
              min="1"
              :max="allowedMax"
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item label="准备完成">
        <el-button type="primary" @click="drawDeck">抽牌</el-button>
      </el-form-item>
    </el-form>
    <!--Result sheet-->
    <div v-if="result.length > 0">
      <el-divider />
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :lg="6" v-for="(card, index) in result">
          <TarotMain :key="index" :card="card" :index="index" />
        </el-col>
      </el-row>
      <!--Description-->
      <div v-if="showDescAll">
        <el-divider />
        <el-row :gutter="10">
          <el-col :md="24" :lg="12" v-for="(card, index) in result">
            <TarotDesc :key="index" :card="card" :index="index" />
          </el-col>
        </el-row>
      </div>
    </div>
  </CardFrame>
</template>
