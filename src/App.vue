<template>
  <a-config-provider :locale="antdLocale" :theme="themeConfig">
    <router-view />
    <AuthDialogs />
  </a-config-provider>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import zhCNLocale from 'ant-design-vue/es/locale/zh_CN'
import enUSLocale from 'ant-design-vue/es/locale/en_US'
import AuthDialogs from '@/components/auth/AuthDialogs.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { scrollPageTop } from '@/utils'

const app = useAppStore()
const user = useUserStore()
const route = useRoute()

// antd 组件语言包
const antdLocale = computed(() => (app.locale === 'en_US' ? enUSLocale : zhCNLocale))

// 主题色动态切换（ant-design-vue 4.x 使用 Design Token，无需再编译 less）
const themeConfig = computed(() => ({
  hashed: false,
  token: {
    colorPrimary: app.themeColor,
    colorLink: app.themeColor,
    borderRadius: 4
  }
}))

function handleResize() {
  app.updateViewport()
}

// 路由切换后确保滚动容器回到顶部
watch(
  () => route.fullPath,
  () => {
    scrollPageTop()
  }
)

watch(
  () => app.locale,
  (value) => {
    document.documentElement.lang = value === 'en_US' ? 'en' : 'zh-CN'
  },
  { immediate: true }
)

onMounted(() => {
  app.updateViewport()
  window.addEventListener('resize', handleResize)
  user.ensureUser()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
