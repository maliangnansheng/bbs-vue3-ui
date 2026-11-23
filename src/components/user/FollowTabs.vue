<template>
  <div class="follow-tabs">
    <a-tabs v-model:active-key="activeKey" @change="onChange">
      <a-tab-pane key="followed">
        <template #tab>{{ $t('common.followed') }} {{ followedTotal }}</template>
        <CustomEmpty v-if="followed.spinning" />
        <template v-else>
          <a-empty v-if="!followed.list.length" description="暂无关注" />
          <AuthorListCard
            v-else
            :data="followed.list"
            :finish="!followed.loading"
            :has-next="followed.hasNext"
            follow-field="toUser"
            @followed="(i) => toggleLocal('followed', i)"
          />
        </template>
      </a-tab-pane>

      <a-tab-pane key="fan">
        <template #tab>{{ $t('common.followMe') }} {{ fanTotal }}</template>
        <CustomEmpty v-if="fan.spinning" />
        <template v-else>
          <a-empty v-if="!fan.list.length" description="暂无粉丝" />
          <AuthorListCard
            v-else
            :data="fan.list"
            :finish="!fan.loading"
            :has-next="fan.hasNext"
            follow-field="fromUser"
            @followed="(i) => toggleLocal('fan', i)"
          />
        </template>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import CustomEmpty from '@/components/common/CustomEmpty.vue'
import AuthorListCard from './AuthorListCard.vue'
import userApi from '@/api/user'
import { toastError } from '@/utils/feedback'

const props = defineProps({
  userId: { type: [String, Number], required: true },
  followedTotal: { type: Number, default: 0 },
  fanTotal: { type: Number, default: 0 }
})
const activeKey = ref('followed')

const followed = reactive({ list: [], page: 1, hasNext: true, loading: false, spinning: true })
const fan = reactive({ list: [], page: 1, hasNext: true, loading: false, spinning: true })

function stateOf(mode) {
  return mode === 'fan' ? fan : followed
}

async function fetchList(mode, reset = true) {
  const state = stateOf(mode)
  if (!reset && (state.loading || !state.hasNext)) return
  state.loading = true
  if (reset) {
    state.page = 1
    state.spinning = true
  }
  const params = { currentPage: state.page, pageSize: 10 }
  if (mode === 'fan') {
    params.getFan = props.userId
  } else {
    params.getBigCow = props.userId
  }
  try {
    const res = await userApi.getFollowUsers(params)
    const rows = res.data.list || []
    state.list = reset ? rows : state.list.concat(rows)
    state.hasNext = rows.length > 0
  } catch (error) {
    state.hasNext = false
    toastError(error, '列表加载失败')
  } finally {
    state.loading = false
    state.spinning = false
  }
}

function toggleLocal(mode, index) {
  const item = stateOf(mode).list[index]
  if (item) item.isFollow = !item.isFollow
}

function onChange(key) {
  if (!stateOf(key).list.length) fetchList(key, true)
}

function loadMore() {
  return fetchList(activeKey.value, false)
}

watch(
  () => props.userId,
  () => {
    fetchList('followed', true)
    fetchList('fan', true)
  }
)

defineExpose({ loadMore })

onMounted(() => {
  fetchList('followed', true)
  fetchList('fan', true)
})
</script>

<style lang="less" scoped>
.follow-tabs {
  :deep(.ant-tabs-tab) {
    margin: 0;
    padding: 12px 16px;
  }

  :deep(.ant-tabs-nav) {
    margin-bottom: 16px;
  }
}
</style>
