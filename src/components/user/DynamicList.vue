<template>
  <div class="dynamic-list">
    <CustomEmpty v-if="spinning" />
    <template v-else>
      <a-empty v-if="!list.length" description="暂无动态" />
      <div v-for="(item, index) in list" :key="item.id || index">
        <div class="dynamic-item">
          <div class="dynamic-main">
            <a-avatar :size="46" :src="item.picture || defaultAvatar" />
            <span class="dynamic-user">{{ item.userName }}</span>
            <span class="dynamic-action">{{ actionText(item.type) }}</span>
            <a class="dynamic-title" @click="openTarget(item)">{{ item.title }}</a>
          </div>
          <small class="dynamic-time">{{ showtime(item.createTime) }}</small>
        </div>
        <div v-if="index !== list.length - 1" class="dynamic-gap"></div>
      </div>
      <div v-if="finish && !hasNext && list.length" class="dynamic-end">
        <a-divider style="margin-top: 0" />
        {{ $t('common.noAgain') }}
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CustomEmpty from '@/components/common/CustomEmpty.vue'
import dynamicApi from '@/api/dynamic'
import { showtime } from '@/utils'
import { toastError } from '@/utils/feedback'
import { translate as t } from '@/i18n'
import defaultAvatar from '@/assets/img/default_avatar.png'

const props = defineProps({
  userId: { type: [String, Number], required: true }
})
const emit = defineEmits(['total'])

const router = useRouter()
const list = ref([])
const spinning = ref(true)
const loading = ref(false)
const finish = ref(false)
const hasNext = ref(true)
const page = ref(1)

const actions = {
  writeArticle: 'dynamicWritten',
  likeArticle: 'dynamicLiked',
  likeComment: 'dynamicLiked',
  commentArticle: 'dynamicCommented',
  commentReply: 'dynamicReply',
  followUser: 'dynamicFollowed'
}

function actionText(type) {
  return actions[type] ? t(`common.${actions[type]}`) : ''
}

function openTarget(item) {
  if (item.type === 'followUser') {
    window.open(router.resolve(`/user/${item.objectId}`).href, '_blank')
    return
  }
  const hash = item.commentId ? `#reply-${item.commentId}` : ''
  window.open(router.resolve(`/detail/${item.objectId}${hash}`).href, '_blank')
}

async function fetchList(reset = true) {
  if (!reset && (loading.value || !hasNext.value)) return
  loading.value = true
  if (reset) {
    page.value = 1
    spinning.value = true
  }
  try {
    const res = await dynamicApi.getDynamicList({ currentPage: page.value, pageSize: 15, userId: props.userId })
    const rows = res.data.list || []
    list.value = reset ? rows : list.value.concat(rows)
    hasNext.value = rows.length > 0
    emit('total', res.data.total || 0)
  } catch (error) {
    hasNext.value = false
    toastError(error, '动态加载失败')
  } finally {
    loading.value = false
    spinning.value = false
    finish.value = true
  }
}

function loadMore() {
  page.value += 1
  fetchList(false)
}

defineExpose({ loadMore })

onMounted(() => fetchList(true))
</script>

<style lang="less" scoped>
.dynamic-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
}

.dynamic-main {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
}

.dynamic-user {
  color: #252933;
}

.dynamic-action {
  color: #8a9aa9;
}

.dynamic-title {
  overflow: hidden;
  color: #13c2c2;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.dynamic-time {
  flex-shrink: 0;
  padding-left: 10px;
  color: #b5b9b9;
}

.dynamic-gap {
  height: 10px;
  background: #f0f2f5;
}

.dynamic-end {
  padding-bottom: 20px;
  color: #8a919f;
  text-align: center;
}
</style>
