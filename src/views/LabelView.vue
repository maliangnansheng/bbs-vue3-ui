<template>
  <AppLayout :max-width="900">
    <div class="label-view">
      <div class="label-toolbar">
        <a-input-search v-model:value="keyword" :placeholder="$t('common.searchLabel')" allow-clear @search="onSearch" />
        <a-button v-if="user.isManage" type="primary" @click="openCreate">{{ $t('common.add') }}</a-button>
      </div>

      <CustomEmpty v-if="spinning" />
      <LabelGrid v-else :data="list" @edit="openEdit" @delete="removeLabel" />

      <div v-if="!hasNext && list.length" class="label-end">{{ $t('common.noAgain') }}</div>
    </div>

    <LabelFormModal v-model:open="formOpen" :label="editing" @saved="reload" />
  </AppLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import LabelGrid from '@/components/label/LabelGrid.vue'
import LabelFormModal from '@/components/label/LabelFormModal.vue'
import CustomEmpty from '@/components/common/CustomEmpty.vue'
import labelApi from '@/api/label'
import { confirmAction, message, toastError } from '@/utils/feedback'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import { useUserStore } from '@/stores/user'
import { translate as t } from '@/i18n'

const user = useUserStore()
const list = ref([])
const spinning = ref(true)
const loading = ref(false)
const hasNext = ref(true)
const page = ref(1)
const keyword = ref('')
const formOpen = ref(false)
const editing = ref(null)

async function fetchList(reset = true) {
  if (!reset && (loading.value || !hasNext.value)) return
  loading.value = true
  if (reset) {
    page.value = 1
    spinning.value = true
  }
  try {
    const res = await labelApi.getLabelList({
      currentPage: page.value,
      pageSize: 25,
      labelName: keyword.value || undefined
    })
    const rows = res.data.list || []
    list.value = reset ? rows : list.value.concat(rows)
    hasNext.value = rows.length > 0
  } catch (error) {
    hasNext.value = false
    toastError(error, '标签加载失败')
  } finally {
    loading.value = false
    spinning.value = false
  }
}

function loadMore() {
  page.value += 1
  fetchList(false)
}

function onSearch(value) {
  keyword.value = (value || '').trim()
  fetchList(true)
}

function reload() {
  fetchList(true)
}

function openCreate() {
  editing.value = null
  formOpen.value = true
}

function openEdit(item) {
  editing.value = item
  formOpen.value = true
}

function removeLabel(item) {
  confirmAction({
    title: t('common.deleteLabelTitle'),
    content: t('common.deletePrompt'),
    onOk: async () => {
      try {
        await labelApi.remove(item.id)
        message.success('删除成功')
        reload()
      } catch (error) {
        toastError(error)
      }
    }
  })
}

useInfiniteScroll({ hasNext, loading, onLoadMore: loadMore })

onMounted(() => fetchList(true))
</script>

<style lang="less" scoped>
/* 与 bbs-vue-ui 一致：整页 900px 宽，内容撑满 */
.label-view {
  width: 100%;
}

.label-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 30px 0;
  //background: #fff;

  :deep(.ant-input-search) {
    flex: 1;
  }

  .ant-btn {
    height: 30px;
  }
}

.label-end {
  padding: 20px;
  color: #8a919f;
  text-align: center;
}
</style>
