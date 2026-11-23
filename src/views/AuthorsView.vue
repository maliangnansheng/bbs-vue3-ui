<template>
  <AppLayout :max-width="1100">
    <a-col :span="app.collapsed ? 24 : 16" :offset="app.collapsed ? 0 : 4">
      <CustomEmpty v-if="spinning" />
      <AuthorListCard v-else :data="list" :finish="!loading" :has-next="hasNext" @followed="onFollowed" />
    </a-col>
  </AppLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import AuthorListCard from '@/components/user/AuthorListCard.vue'
import CustomEmpty from '@/components/common/CustomEmpty.vue'
import userApi from '@/api/user'
import { toastError } from '@/utils/feedback'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import { useAppStore } from '@/stores/app'

const app = useAppStore()
const spinning = ref(true)
const loading = ref(false)
const list = ref([])
const hasNext = ref(true)
const page = ref(1)

async function fetchList(reset = true) {
  if (!reset && (loading.value || !hasNext.value)) return
  loading.value = true
  if (reset) {
    page.value = 1
    spinning.value = true
  }
  try {
    const res = await userApi.getHotAuthorsList({ currentPage: page.value, pageSize: 10 })
    const rows = res.data.list || []
    list.value = reset ? rows : list.value.concat(rows)
    hasNext.value = rows.length > 0
  } catch (error) {
    hasNext.value = false
    toastError(error, '作者榜加载失败')
  } finally {
    loading.value = false
    spinning.value = false
  }
}

function onFollowed(index) {
  const item = list.value[index]
  if (item) item.isFollow = !item.isFollow
}

function loadMore() {
  page.value += 1
  fetchList(false)
}

useInfiniteScroll({ hasNext, loading, onLoadMore: loadMore })

onMounted(() => fetchList(true))
</script>
