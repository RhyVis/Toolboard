<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import axios from "axios";

import CardFrame from "@/components/frames/CardFrame.vue";

class Card {
  index!: number;
  name!: string;
  local!: string;
  mean!: {
    upright: string;
    reversed: string;
  };
  img!: string;
  desc!: string[];
}

class CardPick {
  card!: Card;
  rev!: boolean;
  showImg!: boolean;
  showDesc!: boolean;
}

const query = reactive({
  count: 1,
  type: true,
  deck: "waite",
});

const config = {
  headers: { "Content-Type": "application/json" },
};

const activeTab = ref("simple");

const result = ref([] as CardPick[]);
// for test render
const tt = ref([
  {
    card: {
      index: 1,
      name: "TEST",
      local: "测试牌1",
      mean: {
        upright: "这是正位描述",
        reversed: "这是逆位描述",
      },
      img: "https://dist.rhynia.top/temp/14.png",
      desc: ["描述的第一行哦", "描述的第二行哦"],
    },
    showImg: true,
    showDesc: false,
    rev: false,
  },
]);

const showDescAll = ref(true);

const fullAble = computed(
  () => query.deck === "waite" || query.deck === "bilibili"
);

const allowedMax = computed(() => (fullAble.value && query.type ? 78 : 22));

const tooltip = computed(() =>
  fullAble.value ? "完整卡组包括小阿尔卡那" : "该卡组只包括大阿尔卡那"
);

async function drawDeck() {
  let request = {
    count: query.count,
    type: query.type,
    deck: query.deck,
  };
  const respond = (await axios.post("/api/tarot", request, config)).data
    .res as CardPick[];
  result.value = respond.map((card) => {
    card.showImg = true;
    card.showDesc = false;
    return card;
  });
}

const clear = () => (result.value = []);

const revText = (rev: boolean) => (rev ? "(逆位)" : "(正位)");

const revDesc = (card: CardPick) =>
  card.rev ? card.card.mean.reversed : card.card.mean.upright;
</script>

<template>
  <CardFrame title="塔罗牌">
    <el-form :model="query" label-width="auto">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="简单模式" name="simple">
          <el-form-item label="卡面类型">
            <el-radio-group v-model="query.deck" @change="clear">
              <el-radio-button label="维特塔罗" value="waite" />
              <el-radio-button label="幻星塔罗" value="bilibili" />
              <el-radio-button label="碧蓝档案" value="bluearchive" />
              <el-radio-button label="明日方舟" value="arknights" />
            </el-radio-group>
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
    <div v-if="result.length > 0">
      <el-divider />
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="12"
          :lg="6"
          v-for="(card, index) in result"
          :key="index"
        >
          <el-card>
            <template #header>
              <div @click="card.showImg = !card.showImg">
                <div class="h5 strong text-primary-emphasis">
                  {{ card.card.local }}
                </div>
                <i class="small">{{ index + 1 }} - {{ revText(card.rev) }}</i>
              </div>
            </template>
            <transition name="el-zoom-in-top">
              <div v-show="card.showImg">
                <div @click="card.showDesc = !card.showDesc" class="divfull">
                  <div v-show="!card.showDesc">
                    <img
                      class="imgfull"
                      :class="{ reversed: card.rev }"
                      :alt="card.card.name"
                      :src="card.card.img"
                      lazy
                    />
                  </div>
                  <div v-show="card.showDesc" style="text-align: left">
                    <div class="h6">
                      {{ revDesc(card) }}
                    </div>
                    <div class="text-muted" style="font-size: smaller">
                      {{ " " + card.card.desc.join("") }}
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </el-card>
        </el-col>
      </el-row>
      <div v-if="showDescAll">
        <el-divider />
        <el-row :gutter="10">
          <el-col
            :md="24"
            :lg="12"
            v-for="(item, index) in result"
            :key="index"
          >
            <el-card>
              <template #header>
                <div style="display: flex; justify-content: space-between">
                  <span class="h6">
                    <span class="h5 text-primary mt-1">{{
                      index + 1 + "号位 "
                    }}</span>
                    <span>
                      {{ item.card.local }}
                      <span style="font-size: smaller">{{
                        item.card.name
                      }}</span>
                    </span>
                  </span>
                  <i class="small mt-1">{{ revText(item.rev) }}</i>
                </div>
              </template>
              <div style="text-align: left">
                <div class="text-black h6">
                  {{ revDesc(item) }}
                </div>
                <div v-if="item.card.desc.length > 0">
                  <div
                    class="text-muted"
                    v-for="(desc, index) in item.card.desc"
                    :key="index"
                  >
                    {{ desc }}
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </CardFrame>
</template>

<style scoped>
.reversed {
  transform: rotate(180deg);
}
.divfull {
  width: 100%;
  height: 360px;
  display: flex;
  justify-content: center;
  align-items: center;
  .imgfull {
    max-width: 100%;
    max-height: 360px;
  }
}
</style>
