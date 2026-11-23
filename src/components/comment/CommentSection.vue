<template>
  <section id="article-comment" class="comment-section" :class="{ 'is-collapsed': app.collapsed }">
    <a-divider style="margin: 0 0 16px" />
    <p class="comment-title">{{ $t('common.comment') }}</p>

    <CommentEditor :article-id="articleId" @refresh="handleRefresh" />

    <div class="comment-header">
      <p class="comment-subtitle">
        <span id="article-comment-all"></span>
        {{ $t('common.hotComment') }}
      </p>
      <span class="comment-count">{{ commentCount }}</span>
      <a-radio-group v-model:value="sortRule" size="small" button-style="solid" @change="load">
        <a-radio-button value="hottest">{{ $t('common.hottest') }}</a-radio-button>
        <a-radio-button value="newest">{{ $t('common.newest') }}</a-radio-button>
      </a-radio-group>
    </div>

    <a-empty v-if="!loading && !comments.length" :description="$t('common.hotComment')" />
    <CommentItem
      v-for="item in comments"
      :key="item.id"
      :comment="item"
      :article-id="articleId"
      :article-user-id="articleUserId"
      @refresh="handleRefresh"
    />
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import CommentEditor from './CommentEditor.vue'
import CommentItem from './CommentItem.vue'
import commentApi from '@/api/comment'
import { toastError } from '@/utils/feedback'
import { useAppStore } from '@/stores/app'

const props = defineProps({
  articleId: { type: [String, Number], required: true },
  articleUserId: { type: [String, Number], default: 0 },
  commentCount: { type: Number, default: 0 }
})
const emit = defineEmits(['refresh-count'])

const app = useAppStore()
const comments = ref([])
const sortRule = ref('hottest')
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    const res = await commentApi.getCommentByArticleId({
      articleId: props.articleId,
      sortRule: sortRule.value
    })
    comments.value = res.data || []
  } catch (error) {
    toastError(error, '评论加载失败')
  } finally {
    loading.value = false
  }
}

function handleRefresh() {
  load()
  emit('refresh-count')
}

onMounted(load)
</script>

<style lang="less" scoped>
.comment-section {
  padding: 0 20px 20px;
  background: #fff;

  &.is-collapsed {
    padding: 0 10px 10px;
  }
}

.comment-title {
  margin-bottom: 12px;
  color: #252933;
  font-size: 18px;
  font-weight: 600;
  line-height: 30px;
}

.comment-header {
  display: flex;
  align-items: center;
  margin: 20px 0 8px;

  .comment-subtitle {
    margin: 0;
    color: #252933;
    font-size: 18px;
    font-weight: 600;
  }

  .comment-count {
    padding: 0 15px 0 8px;
    color: #9499a0;
  }
}

// 锚点跳转时避开顶部导航
#article-comment-all {
  display: inline-block;
  margin-top: -70px;
  padding-top: 70px;
}
</style>
