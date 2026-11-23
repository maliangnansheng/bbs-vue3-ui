<template>
  <AppLayout :max-width="900">
    <div class="label-article-view">
      <CustomEmpty v-if="spinning" />
      <template v-else>
        <div class="label-header">
          <a-avatar :size="100" shape="square" :src="labelInfo.logo" />
          <div class="label-title">{{ labelInfo.labelName }}</div>
          <div class="label-sub">{{ labelInfo.articleUseCount }} {{ $t('common.article') }}</div>
        </div>

        <ArticleList :data="list" :finish="!loading" :has-next="hasNext" />
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import ArticleList from '@/components/article/ArticleList.vue'
import CustomEmpty from '@/components/common/CustomEmpty.vue'
import articleApi from '@/api/article'
import labelApi from '@/api/label'
import { toastError } from '@/utils/feedback'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'

const route = useRoute()
const router = useRouter()

const labelId = computed(() => route.params.id)
const labelInfo = ref({})
const list = ref([])
const spinning = ref(true)
const loading = ref(false)
const hasNext = ref(true)
const page = ref(1)

async function fetchLabel() {
  try {
    const res = await labelApi.getLabelList({ id: labelId.value, currentPage: 1, pageSize: 10 })
    const item = (res.data.list || [])[0]
    if (!item) {
      router.replace({ name: 'notFound', params: { pathMatch: route.path.substring(1).split('/') } })
      return
    }
    labelInfo.value = item
  } catch (error) {
    toastError(error, '标签信息加载失败')
  }
}

async function fetchArticles(reset = true) {
  if (!reset && (loading.value || !hasNext.value)) return
  loading.value = true
  if (reset) {
    page.value = 1
    spinning.value = true
  }
  try {
    const res = await articleApi.getArticleList({
      currentPage: page.value,
      pageSize: 10,
      labelIds: labelId.value
    })
    const rows = res.data.list || []
    list.value = reset ? rows : list.value.concat(rows)
    hasNext.value = rows.length > 0
  } catch (error) {
    hasNext.value = false
    toastError(error, '文章加载失败')
  } finally {
    loading.value = false
    spinning.value = false
  }
}

function loadMore() {
  page.value += 1
  fetchArticles(false)
}

useInfiniteScroll({ hasNext, loading, onLoadMore: loadMore })

watch(
  () => route.params.id,
  () => {
    fetchLabel()
    fetchArticles(true)
  }
)

onMounted(() => {
  fetchLabel()
  fetchArticles(true)
})
</script>

<style lang="less" scoped>
.label-article-view {
  width: 100%;
}

.label-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  background: #fff;
  border-bottom: 10px solid #f0f2f5;
}

.label-title {
  padding-top: 8px;
  color: #333;
  font-size: 20px;
  line-height: 36px;
}

.label-sub {
  color: #909090;
  font-size: 15px;
}
</style>
