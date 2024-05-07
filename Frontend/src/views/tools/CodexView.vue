<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import useClipboard from 'vue-clipboard3'

import CardFrame from '@/components/frames/CardFrame.vue'
import CopyButton from '@/components/utils/CopyButton.vue'

const { toClipboard } = useClipboard()

const query = ref({
  text: '',
  dec: false
})

const result = ref('')

const copyButton = ref('复制？😋')
const copyButtonType = ref('info')

const config = {
  headers: { 'Content-Type': 'application/json' }
}

const activeTab = ref('nmsl')

function resetButton() {
  copyButton.value = '复制？😋'
  copyButtonType.value = 'info'
}

async function copyt() {
  try {
    await toClipboard(result.value)
    copyButton.value = '成功！😌'
    copyButtonType.value = 'success'
  } catch (e) {
    console.log(e)
  }
}

async function fetchResult() {
  const { text } = query.value
  if (text.length === 0) {
    result.value = '🧣🐭入转🈹🏀，啥👃'
  } else {
    const { dec } = query.value
    const type = activeTab.value
    const request = {
      type: type,
      text: text,
      dec: dec
    }
    const respond = await axios.post('/api/codex', request, config)
    result.value = respond.data.res
    resetButton()
  }
}
</script>

<template>
  <CardFrame title="抽象翻译器">
    <el-form :model="query" label-width="auto">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="抽象转换" name="nmsl">
          <el-form-item label="原始文本">
            <el-input
              v-model="query.text"
              type="textarea"
              placeholder="你不输入你用什么工具？"
              required
            ></el-input>
          </el-form-item>
          <el-form-item label="解码抽象">
            <el-tooltip content="只能解析成拼音，并且不全" placement="top">
              <el-switch v-model="query.dec" />
            </el-tooltip>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="繁体转换" name="trad">
          <el-form-item label="原始文本">
            <el-input
              v-model="query.text"
              type="textarea"
              placeholder="你不输入你用什么工具？"
              required
            ></el-input>
          </el-form-item>
          <el-form-item label="解码抽象">
            <el-switch v-model="query.dec" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="火星转换" name="sprk">
          <el-form-item label="原始文本">
            <el-input
              v-model="query.text"
              type="textarea"
              placeholder="你不输入你用什么工具？"
              required
            ></el-input>
          </el-form-item>
          <el-form-item label="解码抽象">
            <el-switch v-model="query.dec" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="形近转换" name="unic">
          <el-form-item label="原始文本">
            <el-input
              v-model="query.text"
              type="textarea"
              placeholder="你不输入你用什么工具？"
              required
            ></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item label="输出结果">
        <span>{{ result }}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchResult">启动！😅</el-button>
        <el-button :type="copyButtonType" @click="copyt">{{ copyButton }}</el-button>
      </el-form-item>
    </el-form>
  </CardFrame>
</template>
