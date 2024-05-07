<script setup lang="ts">
import VersionCheck from '@/components/utils/VersionCheck.vue'
import CardFrame from '@/components/frames/CardFrame.vue'
</script>

<template>
  <CardFrame title="主页">
    <div class="text-center strong">不会还要我教你怎么用吧，不会吧不会吧</div>
    <el-divider />
    <VersionCheck />
  </CardFrame>
</template>
