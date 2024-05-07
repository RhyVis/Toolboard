<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()

const routerToolsNoAuth = [
  { index: '/tarot', label: 'TAROT' },
  { index: '/codex', label: 'CODEX' },
  { index: '/spam', label: 'SPAM' },
  { index: '/rept', label: 'REPEAT' }
]

const routerToolsAuth = [{ index: '/trans', label: 'TRANSL' }]

const authSign = ref(false)
const authPass = () => (authSign.value = !authSign.value)
</script>

<template>
  <el-container>
    <el-header>
      <el-menu :default-active="1" mode="horizontal" :router="true">
        <el-menu-item index="/">Home</el-menu-item>
        <el-sub-menu index="#">
          <template #title>Tools</template>
          <el-menu-item v-for="(item, index) in routerToolsNoAuth" :key="index" :index="item.index">
            {{ item.label }}
          </el-menu-item>
          <div v-if="auth.valid">
            <el-menu-item v-for="(item, index) in routerToolsAuth" :key="index" :index="item.index">
              {{ item.label }}
            </el-menu-item>
          </div>
        </el-sub-menu>
        <div @click="authPass">
          <el-menu-item index="/info" disabled>Info</el-menu-item>
        </div>
        <div v-if="authSign">
          <el-menu-item index="/auth">Auth</el-menu-item>
        </div>
      </el-menu>
    </el-header>
    <RouterView />
  </el-container>
</template>

<style scoped>
.radius {
  border: 1px solid var(--el-border-color);
  border-top: 1px;
  border-bottom: 1px;
}
.parent {
  text-decoration: none;
  color: inherit;
  font-weight: inherit;
}
</style>
