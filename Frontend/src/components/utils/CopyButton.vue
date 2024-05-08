<script lang="ts" setup>
import { computed, ref } from "vue";
import useClipboard from "vue-clipboard3";

const props = defineProps({
  target: {
    type: String,
    default: "",
  },
  mode: {
    type: Number,
    default: 0,
  },
});

const state = ref(0);
const display = computed(() => {
  switch (state.value) {
    case 0:
      return {
        type: "primary",
        value: "复制",
      };
    case 1:
      return {
        type: "success",
        value: "成功",
      };
    case 2:
      return {
        type: "danger",
        value: "失败",
      };
    default:
      return {
        type: "warning",
        value: "未知",
      };
  }
});

const { toClipboard } = useClipboard();
const copyAct = async () => {
  const { target } = props;
  if (target != undefined) {
    try {
      await toClipboard(target);
      state.value = 1;
    } catch (e) {
      console.error(e);
      state.value = 2;
    }
  } else {
    state.value = 2;
  }
};
</script>

<template>
  <el-button :type="display.type" @click="copyAct">
    {{ display.value }}
  </el-button>
</template>
