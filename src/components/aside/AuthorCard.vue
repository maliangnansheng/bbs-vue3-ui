<template>
  <div v-if="data && data.id" class="author-card side-card">
    <div class="author-info" @click="openUser">
      <a-avatar :size="46" :src="data.picture || defaultAvatar" />
      <div class="author-meta">
        <div class="author-name">
          <span>{{ data.name }}</span>
          <img :src="levelIcon(data.level)" alt="等级" />
        </div>
        <div v-if="data.intro" class="author-intro">{{ data.intro }}</div>
      </div>
    </div>

    <a-divider class="author-divider" />

    <div class="author-stat">
      <div class="stat-icon" :style="{ background: app.themeColor }">
        <i class="iconfont icon-like" style="color: #fff; font-size: 12px"></i>
      </div>
      <span>{{ $t('common.getLikes') + ' ' + (data.likeCount || 0) }}</span>
    </div>
    <div class="author-stat">
      <div class="stat-icon" :style="{ background: app.themeColor }">
        <i class="iconfont icon-eye" style="color: #fff; font-size: 12px"></i>
      </div>
      <span>{{ $t('common.articleRead') + ' ' + (data.readCount || 0) }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import userApi from '@/api/user'
import { levelIcon } from '@/utils'
import { toastError } from '@/utils/feedback'
import { useAppStore } from '@/stores/app'
import defaultAvatar from '@/assets/img/default_avatar.png'

const props = defineProps({
  userId: { type: Number, default: 0 }
})

const router = useRouter()
const app = useAppStore()
const data = ref({})

const currentId = computed(() => props.userId)

function openUser() {
  if (!data.value.id) return
  window.open(router.resolve(`/user/${data.value.id}`).href, '_blank')
}

async function load() {
  if (!currentId.value) return
  try {
    const res = await userApi.getUserInfo({ userId: currentId.value })
    data.value = res.data || {}
  } catch (error) {
    toastError(error, '作者信息加载失败')
  }
}

watch(currentId, load)

onMounted(load)
</script>

<style lang="less" scoped>
.author-card {
  padding: 20px 15px;
}

.author-info {
  display: flex;
  cursor: pointer;
}

.author-meta {
  padding-left: 10px;
  min-width: 0;
}

.author-name {
  display: flex;
  align-items: center;
  font-size: 17px;

  img {
    height: 16px;
    margin-left: 4px;
  }
}

.author-intro {
  display: -webkit-box;
  overflow: hidden;
  color: #00000085;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.author-divider {
  margin: 16px 0 8px;
}

.author-stat {
  display: flex;
  align-items: center;
  padding-top: 8px;

  .stat-icon {
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
