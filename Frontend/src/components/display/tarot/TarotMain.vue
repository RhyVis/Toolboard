<script lang="ts" setup>
import type { CardPick } from "@/misc/tarotType";

defineProps<{
  card: CardPick;
  index: number;
}>();

const revText = (rev: boolean) => (rev ? "(逆位)" : "(正位)");
const revDesc = (card: CardPick) =>
  card.rev ? card.card.mean.reversed : card.card.mean.upright;
</script>

<template>
  <el-card class="mb-2">
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
