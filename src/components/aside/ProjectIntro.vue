<template>
  <div class="project-intro">
    <img src="@/assets/img/about-nsbbs.png" alt="南生论坛" class="project-banner" />
    <div class="project-avatar">
      <a-avatar :size="80" :src="avatarImage" />
    </div>
    <p class="project-desc">{{ $t('common.projectIntro') }}</p>

    <a-divider class="project-divider">{{ $t('common.commonCount') }}</a-divider>

    <div class="project-stats">
      <div v-for="stat in stats" :key="stat.key" class="project-stat">
        <p>{{ stat.label }}</p>
        <a-badge
          v-if="stat.key !== 'carousel'"
          :count="stat.value"
          :overflow-count="9999999"
          :number-style="{ backgroundColor: app.themeColor }"
        />
        <a-switch
          v-else
          :checked="app.isCarousel === 1"
          size="small"
          @change="(checked) => app.setCarousel(checked ? 1 : 0)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import articleApi from '@/api/article'
import { toastError } from '@/utils/feedback'
import { useAppStore } from '@/stores/app'
import { translate as t } from '@/i18n'
import avatarImage from '@/assets/img/nan.jpg'

const app = useAppStore()
const data = reactive({ articleCount: 0, commentCount: 0, visitCount: 0 })

const stats = computed(() => [
  { key: 'article', label: t('common.article'), value: data.articleCount },
  { key: 'comment', label: t('common.comment'), value: data.commentCount },
  { key: 'visit', label: t('common.visit'), value: data.visitCount },
  { key: 'carousel', label: t('common.carousel'), value: 0 }
])

onMounted(async () => {
  try {
    const res = await articleApi.getArticleCommentVisitTotal()
    Object.assign(data, res.data || {})
  } catch (error) {
    toastError(error, '统计数据加载失败')
  }
})
</script>

<style lang="less" scoped>
.project-intro {
  background: #fff;

  .project-banner {
    width: 100%;
  }

  .project-avatar {
    position: relative;
    top: -25px;
    text-align: center;
  }

  .project-desc {
    padding: 0 10px 10px;
    color: #4e5969;
    line-height: 28px;
    text-align: center;
  }

  .project-divider {
    font-size: 12px;
  }

  .project-stats {
    display: flex;
    padding-bottom: 10px;
    text-align: center;

    .project-stat {
      flex: 1;

      p {
        margin-bottom: 4px;
      }
    }
  }
}
</style>
