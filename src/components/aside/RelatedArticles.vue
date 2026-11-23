<template>
  <div v-if="list.length" class="side-card">
    <header class="side-card-header">
      <i class="iconfont icon-relat-article" :style="{ color: app.themeColor }"></i>
      {{ $t('common.relatArtilce') }}
    </header>
    <a-divider class="side-card-divider" />
    <a-list item-layout="horizontal" :data-source="list" :split="false">
      <template #renderItem="{ item }">
        <a-list-item class="related-item" @click="openDetail(item.id)">
          <a-list-item-meta :description="relatedMeta(item)">
            <template #title>
              <span class="related-title">{{ item.title }}</span>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import articleApi from '@/api/article'
import { toastError } from '@/utils/feedback'
import { useAppStore } from '@/stores/app'
import { translate as t } from '@/i18n'

const props = defineProps({
  labelIds: { type: Array, default: () => [] }
})

const router = useRouter()
const app = useAppStore()
const list = ref([])

function relatedMeta(item) {
  const count = item.articleCountDTO || {}
  return `${count.likeCount} ${t('common.like')} · ${count.commentCount} ${t('common.comment')}`
}

function openDetail(id) {
  window.open(router.resolve(`/detail/${id}`).href, '_blank')
}

async function load() {
  if (!props.labelIds.length) {
    list.value = []
    return
  }
  try {
    const res = await articleApi.getArticleList({
      currentPage: 1,
      pageSize: 4,
      labelIds: props.labelIds.join(',')
    })
    list.value = res.data.list || []
  } catch (error) {
    toastError(error, '相关文章加载失败')
  }
}

watch(() => props.labelIds.join(','), load)

onMounted(load)
</script>

<style lang="less" scoped>
.related-item {
  padding: 8px 15px;
  cursor: pointer;

  &:hover {
    background: #8b87870a;
  }

  :deep(.ant-list-item-meta-description) {
    color: #909090;
    font-size: 12px;
  }
}

.related-title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
