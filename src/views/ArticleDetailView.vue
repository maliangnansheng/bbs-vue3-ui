<template>
  <AppLayout :max-width="1100">
    <div class="article-layout">
      <div v-if="!app.collapsed" class="side-actions-wrap">
        <ArticleSideActions ref="actionsRef" :article-id="articleId" @count="onCount" />
      </div>

      <a-row class="article-row">
        <a-col :span="app.collapsed ? 24 : 18" :class="{ 'main-column': !app.collapsed }">
          <CustomEmpty v-if="loading" />
          <template v-else>
            <ArticleBody :article="article" :preview-id="previewId" @refresh="load" />
            <div class="block-gap"></div>
            <CommentSection
              :article-id="articleId"
              :article-user-id="article ? article.createUser : 0"
              :comment-count="commentCount"
              @refresh-count="refreshCount"
            />
          </template>
        </a-col>

        <a-col v-if="!app.collapsed && article" :span="6">
          <AuthorCard :user-id="article ? article.createUser : 0" />
          <div class="block-gap"></div>
          <RelatedArticles :label-ids="labelIds" />
          <div class="block-gap"></div>
          <HotAuthors />
          <div class="block-gap"></div>
          <TableOfContents :editor-id="previewId" />
          <div class="block-gap"></div>
          <SiteFooterInfo />
        </a-col>
      </a-row>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import ArticleBody from '@/components/article/ArticleBody.vue'
import ArticleSideActions from '@/components/article/ArticleSideActions.vue'
import CommentSection from '@/components/comment/CommentSection.vue'
import AuthorCard from '@/components/aside/AuthorCard.vue'
import RelatedArticles from '@/components/aside/RelatedArticles.vue'
import HotAuthors from '@/components/aside/HotAuthors.vue'
import TableOfContents from '@/components/markdown/TableOfContents.vue'
import SiteFooterInfo from '@/components/aside/SiteFooterInfo.vue'
import CustomEmpty from '@/components/common/CustomEmpty.vue'
import articleApi from '@/api/article'
import { toastError } from '@/utils/feedback'
import { useAppStore } from '@/stores/app'

const app = useAppStore()
const route = useRoute()
const router = useRouter()

const previewId = 'article-preview'
const articleId = computed(() => route.params.id)
const article = ref(null)
const loading = ref(true)
const commentCount = ref(0)
const actionsRef = ref(null)

const labelIds = computed(() => (article.value?.labelDTOS || []).map((item) => item.id))

async function load() {
  loading.value = true
  try {
    const res = await articleApi.getById({ id: articleId.value, isPv: true })
    article.value = res.data
    await nextTick()
    handleHash()
  } catch (error) {
    if (error.code === 4) {
      router.replace({
        name: 'notFound',
        params: { pathMatch: route.path.substring(1).split('/') }
      })
      return
    }
    toastError(error, '文章加载失败')
  } finally {
    loading.value = false
  }
}

function onCount(counts) {
  commentCount.value = Number(counts.commentCount || 0)
}

function refreshCount() {
  actionsRef.value?.load()
}

/** 处理地址栏锚点：评论定位、目录标题定位 */
function handleHash() {
  const hash = window.location.hash.replace('#', '')
  if (!hash) return
  // 评论区、正文均为异步渲染，最多重试 5 次（每次 400ms）
  let tries = 0
  const locate = () => {
    const target = document.getElementById(hash)
    if (!target) {
      tries += 1
      if (tries < 5) setTimeout(locate, 400)
      return
    }
    if (hash.startsWith('reply-')) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      target.classList.add('selected-comment')
      setTimeout(() => target.classList.remove('selected-comment'), 8000)
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }
  setTimeout(locate, 400)
}

watch(
  () => route.params.id,
  () => {
    if (route.name === 'detail') load()
  }
)

onMounted(load)
</script>

<style lang="less" scoped>
.article-layout {
  position: relative;
  width: 100%;
}

.article-row {
  width: 100%;
}

.side-actions-wrap {
  position: fixed;
  top: 0;
  left: calc(50% - 620px);
  z-index: 900;
  display: flex;
  flex-direction: column;
}

@media screen and (max-width: 1240px) {
  .side-actions-wrap {
    display: none;
  }
}

.selected-comment {
  animation: comment-highlight 8s ease-out;
}

@keyframes comment-highlight {
  from {
    background-color: rgba(19, 194, 194, 0.18);
  }
  to {
    background-color: transparent;
  }
}
</style>
