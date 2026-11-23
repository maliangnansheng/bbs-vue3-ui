<template>
  <div class="article-tab-list">
    <CustomEmpty v-if="spinning" />
    <ArticleList
      v-else
      :data="list"
      :finish="!loading"
      :has-next="hasNext"
      :is-user-center="mode === 'personal'"
      @update-data="onDataUpdate"
      @refresh="reload"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import CustomEmpty from '@/components/common/CustomEmpty.vue'
import ArticleList from '@/components/article/ArticleList.vue'
import articleApi from '@/api/article'
import { toastError } from '@/utils/feedback'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  userId: { type: [String, Number], required: true },
  // personal：我的文章；likes：我点赞的文章
  mode: { type: String, default: 'personal' }
})
const emit = defineEmits(['total'])

const user = useUserStore()
const list = ref([])
const spinning = ref(true)
const loading = ref(false)
const hasNext = ref(true)
const page = ref(1)

async function fetchList(reset = true) {
  if (!reset && (loading.value || !hasNext.value)) return
  loading.value = true
  if (reset) {
    page.value = 1
    spinning.value = true
  }
  const params = { currentPage: page.value, pageSize: 10 }
  if (props.mode === 'likes') {
    params.likeUser = props.userId
  } else {
    params.createUser = props.userId
    if (!user.isManage) params.articleStateEnum = 'enable'
  }
  try {
    const request = props.mode === 'likes' ? articleApi.getLikesArticle : articleApi.getPersonalArticles
    const res = await request(params)
    const rows = res.data.list || []
    list.value = reset ? rows : list.value.concat(rows)
    hasNext.value = rows.length > 0
    emit('total', res.data.total || 0)
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
  fetchList(false)
}

function onDataUpdate(next) {
  list.value = next
}

function reload() {
  fetchList(true)
}

defineExpose({ loadMore })

onMounted(() => fetchList(true))
</script>
