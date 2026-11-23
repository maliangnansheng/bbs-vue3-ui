<template>
  <div v-if="data && data.points !== undefined" class="achievement-card side-card">
    <header class="side-card-header">
      <i class="iconfont icon-achievement" :style="{ color: app.themeColor }"></i>
      {{ $t('common.personalAchievement') }}
    </header>
    <a-divider class="side-card-divider" />

    <div v-for="item in items" :key="item.key" class="achievement-item" @click="item.key === 'points' ? openBook() : null">
      <div class="achievement-icon" :style="{ background: app.themeColor }">
        <i class="iconfont" :class="item.icon" style="color: #fff; font-size: 12px"></i>
      </div>
      <span>{{ item.label + ' ' + item.value }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { translate as t } from '@/i18n'

const props = defineProps({
  data: { type: Object, default: () => ({}) }
})

const app = useAppStore()
const router = useRouter()

const items = computed(() => [
  { key: 'like', icon: 'icon-like', label: t('common.getLikes'), value: props.data.likeCount || 0 },
  { key: 'read', icon: 'icon-eye', label: t('common.articleRead'), value: props.data.readCount || 0 },
  { key: 'points', icon: 'icon-rise', label: t('common.nanshengValue'), value: props.data.points || 0 }
])

function openBook() {
  window.open(router.resolve('/book').href, '_blank')
}
</script>

<style lang="less" scoped>
.achievement-card {
  padding-bottom: 12px;
}

.achievement-item {
  display: flex;
  align-items: center;
  padding: 8px 15px 0;
  cursor: pointer;

  .achievement-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 11px;
  }

  span {
    padding-left: 8px;
  }
}
</style>
