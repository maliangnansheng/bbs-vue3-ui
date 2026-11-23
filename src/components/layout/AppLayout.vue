<template>
  <a-layout class="app-layout">
    <AppHeader class="page-header" :search-content="searchContent" @search="(value) => emit('search', value)" />
    <a-layout-content>
      <main class="page-main" :class="mainClass" :style="mainStyle">
        <slot />
      </main>
    </a-layout-content>
    <FloatingActions v-if="!app.collapsed && showActions" />
  </a-layout>
</template>

<script setup>
import { computed } from 'vue'
import AppHeader from './AppHeader.vue'
import FloatingActions from '@/components/common/FloatingActions.vue'
import { useAppStore } from '@/stores/app'

const props = defineProps({
  searchContent: { type: String, default: '' },
  // 内容区最大宽度，传 0 表示占满
  maxWidth: { type: [Number, String], default: 1100 },
  // 小屏时去掉左右内边距
  fluid: { type: Boolean, default: false },
  showActions: { type: Boolean, default: true }
})
const emit = defineEmits(['search'])

const app = useAppStore()

const mainClass = computed(() => ({
  'page-main--narrow': Number(props.maxWidth) === 900,
  'page-main--full': Number(props.maxWidth) === 0
}))

const mainStyle = computed(() => {
  if (Number(props.maxWidth) === 0) {
    return app.collapsed && props.fluid ? { maxWidth: '100%' } : {}
  }
  return { maxWidth: typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth }
})
</script>
