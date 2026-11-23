<template>
  <div class="side-actions">
    <a-tooltip placement="right" :title="$t('common.like')">
      <a-badge
        :count="counts.likeCount"
        :overflow-count="999"
        :number-style="
          counts.isLike
            ? { backgroundColor: app.themeColor, boxShadow: `0 0 0 1px ${app.themeColor} inset` }
            : { backgroundColor: '#c2c8d1', boxShadow: '0 0 0 1px #c2c8d1 inset' }
        "
      >
        <button type="button" class="side-action" @click="toggleLike">
          <i
            class="iconfont icon-like"
            :style="{ color: counts.isLike ? app.themeColor : '#8a919f' }"
          ></i>
        </button>
      </a-badge>
    </a-tooltip>

    <a-badge
      :count="counts.commentCount"
      :overflow-count="999"
      :number-style="{ backgroundColor: '#c2c8d1', boxShadow: '0 0 0 1px #c2c8d1 inset' }"
    >
      <a href="#article-comment-all" class="side-action">
        <i class="iconfont icon-comment" style="color: #8a919f"></i>
      </a>
    </a-badge>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import articleApi from '@/api/article'
import userApi from '@/api/user'
import { toastError } from '@/utils/feedback'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  articleId: { type: [String, Number], required: true }
})
const emit = defineEmits(['count'])

const app = useAppStore()
const user = useUserStore()
const counts = reactive({ likeCount: 0, commentCount: 0, isLike: false })

async function load() {
  try {
    const res = await articleApi.getCountById({ id: props.articleId })
    Object.assign(counts, res.data || {})
    emit('count', counts)
  } catch {
    // 统计接口失败不影响阅读
  }
}

async function toggleLike() {
  if (!user.isLogin) {
    user.openLogin()
    return
  }
  try {
    await userApi.updateLikeState({ articleId: props.articleId })
    await load()
  } catch (error) {
    toastError(error, '操作失败')
  }
}

defineExpose({ load })

onMounted(load)
</script>

<style lang="less" scoped>
.side-actions {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding-top: 140px;
}

.side-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: #fff;
  border: 0;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  .iconfont {
    font-size: 20px;
  }
}
</style>
