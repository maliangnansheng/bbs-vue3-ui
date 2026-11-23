<template>
  <div class="user-tabs">
    <a-tabs v-model:active-key="activeKey" @change="onTabChange">
      <a-tab-pane key="dynamic">
        <template #tab>
          <span class="tab-label"><i class="iconfont icon-dynamic"></i>{{ $t('common.dynamic') }}</span>
        </template>
        <DynamicList v-if="mounted.dynamic" ref="dynamicRef" :user-id="userId" @total="(n) => (dynamicTotal = n)" />
      </a-tab-pane>

      <a-tab-pane key="article">
        <template #tab>
          <span class="tab-label">
            <i class="iconfont icon-relat-article"></i>{{ $t('common.article') }} {{ articleTotal }}
          </span>
        </template>
        <ArticleTabList
          v-if="mounted.article"
          ref="articleRef"
          :user-id="userId"
          mode="personal"
          @total="(n) => (articleTotal = n)"
        />
      </a-tab-pane>

      <a-tab-pane key="follow">
        <template #tab>
          <span class="tab-label">
            <i class="iconfont icon-follow"></i>{{ $t('common.follow') }} {{ followedTotal + fanTotal }}
          </span>
        </template>
        <FollowTabs
          v-if="mounted.follow"
          ref="followRef"
          :user-id="userId"
          :followed-total="followedTotal"
          :fan-total="fanTotal"
        />
      </a-tab-pane>

      <a-tab-pane key="like">
        <template #tab>
          <span class="tab-label"><i class="iconfont icon-like"></i>{{ $t('common.like') }} {{ likeTotal }}</span>
        </template>
        <ArticleTabList
          v-if="mounted.like"
          ref="likeRef"
          :user-id="userId"
          mode="likes"
          @total="(n) => (likeTotal = n)"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DynamicList from './DynamicList.vue'
import ArticleTabList from './ArticleTabList.vue'
import FollowTabs from './FollowTabs.vue'
import userApi from '@/api/user'
import { toastError } from '@/utils/feedback'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'

const props = defineProps({
  userId: { type: [String, Number], required: true }
})

const route = useRoute()
const router = useRouter()

const validTabs = ['dynamic', 'article', 'follow', 'like']
const activeKey = ref('dynamic')
const mounted = reactive({ dynamic: false, article: false, follow: false, like: false })

const dynamicRef = ref(null)
const articleRef = ref(null)
const followRef = ref(null)
const likeRef = ref(null)

const dynamicTotal = ref(0)
const articleTotal = ref(0)
const likeTotal = ref(0)
const followedTotal = ref(0)
const fanTotal = ref(0)

const loading = ref(false)

function activate(key) {
  const tab = validTabs.includes(key) ? key : 'dynamic'
  activeKey.value = tab
  mounted[tab] = true
}

async function fetchCounts() {
  try {
    const res = await userApi.getUserOperateCount({ userId: props.userId })
    articleTotal.value = res.data.articleCount || 0
    likeTotal.value = res.data.likeCount || 0
    followedTotal.value = res.data.followCount || 0
    fanTotal.value = res.data.fanCount || 0
  } catch (error) {
    toastError(error, '统计数据加载失败')
  }
}

function onTabChange(key) {
  activate(key)
  const suffix = key === 'dynamic' ? '' : `/${key}`
  router.replace(`/user/${props.userId}${suffix}`)
}

function activeRef() {
  if (activeKey.value === 'article') return articleRef.value
  if (activeKey.value === 'like') return likeRef.value
  if (activeKey.value === 'follow') return followRef.value
  return dynamicRef.value
}

// 单一滚动监听，分发给当前 tab 的列表，避免多个监听互相覆盖
useInfiniteScroll({
  hasNext: ref(true),
  loading,
  onLoadMore: () => {
    activeRef()?.loadMore?.()
  }
})

watch(
  () => route.params.userCenterTab,
  (value) => {
    const tab = validTabs.includes(value) ? value : 'dynamic'
    if (tab !== activeKey.value) activate(tab)
  }
)

onMounted(() => {
  activate(route.params.userCenterTab || 'dynamic')
  fetchCounts()
})
</script>

<style lang="less" scoped>
.user-tabs {
  background: #fff;

  /* 还原 antd 1.x（bbs-vue-ui）的页签间距：左右各 16px，页签之间无缝 */
  :deep(.ant-tabs-tab) {
    margin: 0;
    padding: 12px 16px;
  }

  :deep(.ant-tabs-nav) {
    margin-bottom: 16px;
  }
}

.tab-label .iconfont {
  margin-right: 4px;
}
</style>
