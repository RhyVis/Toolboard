<script lang="ts" setup>
import axios from 'axios'
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

import CardFrame from '@/components/frames/CardFrame.vue'

const query = reactive({
  token: ''
})

const auth = useAuthStore()

const verifyButtonType = ref('primary')
const verifyButtonText = ref('更新')

const verify = async () => {
  let { token } = query
  if (token.length > 0 && token != 'Blank means useless') {
    auth.updateToken(token)
    let { res } = (await axios.post('/api/auth', { token: token })).data
    if (res === true) {
      verifyButtonType.value = 'success'
      verifyButtonText.value = '成功'
      auth.updateValid(true)
    } else {
      auth.updateValid(false)
    }
  } else {
    query.token = 'Blank means useless'
  }
}

const clearButtonType = ref('secondary')
const clearButtonText = ref('移除')

const clear = () => {
  auth.$reset()
  clearButtonType.value = 'danger'
  clearButtonText.value = '成功'
}
</script>

<template>
  <CardFrame title="校验">
    <el-form :model="query" label-width="auto">
      <el-form-item label="后端校验码">
        <el-input v-model="query.token" type="text" placeholder="在这里输入后端设置的Token" />
      </el-form-item>
      <el-form-item label="验证">
        <el-button :type="verifyButtonType" @click="verify">{{ verifyButtonText }}</el-button>
        <el-button :type="clearButtonType" @click="clear">{{ clearButtonText }}</el-button>
      </el-form-item>
    </el-form>
  </CardFrame>
</template>
