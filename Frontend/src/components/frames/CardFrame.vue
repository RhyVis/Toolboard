<script lang="ts" setup>
const props = defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="mb-5 mt-5" style="text-align: center">
    <el-card style="max-width: 85%; margin: 0 auto">
      <template #header>
        <div class="h3 mt-2 mb-2 text-center">{{ props.title }}</div>
      </template>
      <slot></slot>
      <template #footer>
        <div class="text-muted">Toolboard</div>
      </template>
    </el-card>
  </div>
</template>
