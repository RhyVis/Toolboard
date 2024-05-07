<script lang="ts" setup>
import axios from 'axios'
import moment from 'moment'
import { ref, computed } from 'vue'

import versionJson from '@/../public/version.json'

const versionState = ref(0)

const versionLocal = versionJson.compileTime
const versionLocalF = moment(new Date(versionLocal)).format('YYYY/MM/DD (HH:mm:ss)')

const versionRemote = ref(0)
const versionRemoteF = computed(() => {
  switch (versionState.value) {
    case 1:
      return {
        type: 'success',
        text: `${moment(new Date(versionRemote.value)).format('YYYY/MM/DD (HH:mm:ss)')} 最新版本`
      }
    case 2:
      return {
        type: 'warning',
        text: `${moment(new Date(versionRemote.value)).format('YYYY/MM/DD (HH:mm:ss)')} 需要刷新`
      }
    case -1:
      return {
        type: 'danger',
        text: '版本获取失败'
      }
    default:
      return {
        type: 'info',
        text: '等待版本获取'
      }
  }
})

;(async () => {
  try {
    const versionFetch = (await axios.get('/api/version')).data.compileTime
    if (versionFetch != 'ERROR') {
      console.log(`Remote version: ${versionFetch} | Local version: ${versionLocal}`)
      versionRemote.value = versionFetch
      if (versionLocal != versionFetch) {
        versionState.value = 2
      } else {
        versionState.value = 1
      }
    }
  } catch (e) {
    console.error(e)
    versionState.value = -1
  }
})()
</script>

<template>
  <div style="text-align: left">
    <div>
      <span> + 构建版本 => </span>
      <el-tag :type="versionRemoteF.type">{{ versionRemoteF.text }}</el-tag>
    </div>
    <div>
      <span> + 缓存版本 => </span>
      <el-tag type="info">{{ versionLocalF }} 本地缓存 </el-tag>
    </div>
  </div>
</template>