<template>
  <AppLayout :search-content="searchText" @search="onSearch">
    <a-col :span="app.collapsed ? 24 : 18" :class="{ 'main-column': !app.collapsed }">
      <AuditSwitcher v-if="user.isManage" ref="auditRef" @change="reload" />

      <CustomEmpty v-if="spinning" />
      <template v-else>
        <CarouselBanner v-if="!app.collapsed && app.isCarousel === 1" />
        <div v-if="!app.collapsed && app.isCarousel === 1" class="block-gap"></div>

        <ArticleList
          :data="listData"
          :finish="!loading"
          :has-next="hasNext"
          :is-admin-audit="user.isManage"
          @update-data="onDataUpdate"
          @article-top="reload"
          @refresh="reload"
        />
      </template>
    </a-col>

    <a-col v-if="!app.collapsed" :span="6">
      <ProjectIntro />
      <div class="block-gap"></div>
      <HotAuthors />
      <div class="block-gap"></div>
      <LatestComments />
      <div class="block-gap"></div>
      <DonateCard />
      <div class="block-gap"></div>
      <SiteFooterInfo />
    </a-col>
  </AppLayout>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import ArticleList from '@/components/article/ArticleList.vue'
import AuditSwitcher from '@/components/article/AuditSwitcher.vue'
import CarouselBanner from '@/components/concern/CarouselBanner.vue'
import CustomEmpty from '@/components/common/CustomEmpty.vue'
import ProjectIntro from '@/components/aside/ProjectIntro.vue'
import HotAuthors from '@/components/aside/HotAuthors.vue'
import LatestComments from '@/components/aside/LatestComments.vue'
import DonateCard from '@/components/aside/DonateCard.vue'
import SiteFooterInfo from '@/components/aside/SiteFooterInfo.vue'
import articleApi from '@/api/article'
import { toastError } from '@/utils/feedback'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const app = useAppStore()
const user = useUserStore()
const route = useRoute()
const router = useRouter()

const spinning = ref(true)
const loading = ref(false)
const listData = ref([])
const hasNext = ref(true)
const searchText = ref(String(route.query.query || ''))
const auditRef = ref(null)
const params = reactive({ currentPage: 1, pageSize: 12 })

const auditApis = {
  enable: articleApi.getArticleList,
  pendingReview: articleApi.getPendingReviewArticles,
  disabled: articleApi.getDisabledArticles
}

async function fetchList(reset = true) {
  if (!reset && (loading.value || !hasNext.value)) return
  loading.value = true
  if (reset) {
    params.currentPage = 1
    spinning.value = true
  }
  const request = auditApis[user.isManage ? user.articleCheck : 'enable']
  try {
    const res = await request({ ...params, title: searchText.value || undefined })
    const list = res.data.list || []
    listData.value = reset ? list : listData.value.concat(list)
    hasNext.value = list.length > 0
  } catch (error) {
    hasNext.value = false
    toastError(error, '文章列表加载失败')
  } finally {
    loading.value = false
    spinning.value = false
  }
}

function reload() {
  fetchList(true)
  auditRef.value?.refresh(searchText.value || undefined)
}

function loadMore() {
  params.currentPage += 1
  fetchList(false)
}

function onDataUpdate(next) {
  listData.value = next
  auditRef.value?.refresh(searchText.value || undefined)
}

function onSearch(value) {
  searchText.value = value
}

watch(
  () => route.query.query,
  (value) => {
    searchText.value = String(value || '')
    reload()
  }
)

useInfiniteScroll({ hasNext, loading, onLoadMore: loadMore })

onMounted(() => {
  // 从详情页返回时恢复搜索词
  if (route.name === 'search' && !searchText.value) {
    router.replace('/')
    return
  }
  reload()
})
</script>

