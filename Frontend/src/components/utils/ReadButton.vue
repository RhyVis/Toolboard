<script lang="ts" setup>
import { computed, ref } from "vue";

defineProps({
  target: {
    type: String,
    required: true,
  },
});

const buttonState = ref(0);
const buttonDisplay = computed(() => {
  switch (buttonState.value) {
    case 0:
      return {
        type: "info",
        value: "读取",
      };
    case 1:
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

const emit = defineEmits(["update:target"]);
const action = async () => {
  buttonState.value = 0;
  try {
    const text = await navigator.clipboard.readText();
    emit("update:target", text);
  } catch (err) {
    buttonState.value = 1;
    console.error("Failed to read clipboard contents: ", err);
  }
};
</script>

<template>
  <el-button :type="buttonDisplay.type" @click="action">
    {{ buttonDisplay.value }}
  </el-button>
</template>
