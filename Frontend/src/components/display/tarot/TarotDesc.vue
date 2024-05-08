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
      <div class="title-merge">
        <span class="h6">
          <span class="h5 text-primary mt-1">{{ index + 1 + "号位 " }}</span>
          <span>
            {{ card.card.local }}
            <span style="font-size: smaller">{{ card.card.name }}</span>
          </span>
        </span>
        <i class="small mt-1">{{ revText(card.rev) }}</i>
      </div>
    </template>
    <div style="text-align: left">
      <div class="text-black h6 sp2">
        {{ revDesc(card) }}
      </div>
      <div v-if="card.card.desc.length > 0">
        <div
          class="text-muted"
          v-for="(desc, index) in card.card.desc"
          :key="index"
        >
          {{ desc }}
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.sp2 {
  text-indent: 2em;
}
.title-merge {
  display: flex;
  justify-content: space-between;
}
</style>
