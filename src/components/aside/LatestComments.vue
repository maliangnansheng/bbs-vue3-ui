<template>
  <div v-if="list.length" class="side-card">
    <header class="side-card-header">{{ $t('common.latestComment') }}</header>
    <a-divider class="side-card-divider" />
    <a-list item-layout="horizontal" :data-source="list" :split="false">
      <template #renderItem="{ item }">
        <a-list-item class="comment-item" @click="openComment(item)">
          <a-list-item-meta>
            <template #avatar>
              <a-avatar :src="item.picture || defaultAvatar" />
            </template>
            <template #description>
              <span class="comment-text" v-html="item.content"></span>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import commentApi from '@/api/comment'
import { toastError } from '@/utils/feedback'
import defaultAvatar from '@/assets/img/default_avatar.png'

const router = useRouter()
const list = ref([])

function openComment(item) {
  window.open(router.resolve(`/detail/${item.articleId}#reply-${item.id}`).href, '_blank')
}

onMounted(async () => {
  try {
    const res = await commentApi.getLatestComment({ currentPage: 1, pageSize: 6 })
    list.value = res.data.list || []
  } catch (error) {
    toastError(error, '最新评论加载失败')
  }
})
</script>

<style lang="less" scoped>
.comment-item {
  padding: 8px 15px;
  cursor: pointer;

  &:hover {
    background: #8b87870a;
  }

  :deep(.ant-list-item-meta) {
    align-items: center;
  }

  :deep(.ant-list-item-meta-description) {
    display: -webkit-box;
    overflow: hidden;
    color: #909090;
    font-size: 12px;
    line-height: 22px;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
}

.comment-text {
  :deep(p) {
    margin-bottom: 0;
  }
}
</style>
