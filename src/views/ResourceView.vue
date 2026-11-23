<template>
  <AppLayout :max-width="1100">
    <div class="resource-view">
      <div class="resource-toolbar">
        <a-radio-group v-model:value="category" button-style="solid" @change="onCategoryChange">
          <a-radio-button value="">全部资源</a-radio-button>
          <a-radio-button v-for="item in categories" :key="item" :value="item">{{ item }}</a-radio-button>
        </a-radio-group>
        <a-button v-if="user.isManage" type="primary" @click="openCreate">{{ $t('common.add') }}</a-button>
      </div>

      <CustomEmpty v-if="spinning" />
      <ResourceGrid v-else :data="list" @edit="openEdit" @delete="removeResource" />

      <div v-if="!hasNext && list.length" class="resource-end">{{ $t('common.noAgain') }}</div>
    </div>

    <ResourceFormModal v-model:open="formOpen" :resource="editing" @saved="reload" />
  </AppLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import ResourceGrid from '@/components/resource/ResourceGrid.vue'
import ResourceFormModal from '@/components/resource/ResourceFormModal.vue'
import CustomEmpty from '@/components/common/CustomEmpty.vue'
import resourceApi from '@/api/resource'
import { confirmAction, message, toastError } from '@/utils/feedback'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import { useUserStore } from '@/stores/user'
import { translate as t } from '@/i18n'

const user = useUserStore()
const list = ref([])
const categories = ref([])
const category = ref('')
const spinning = ref(true)
const loading = ref(false)
const hasNext = ref(true)
const page = ref(1)
const formOpen = ref(false)
const editing = ref(null)

async function fetchCategories() {
  try {
    const res = await resourceApi.getCategorys()
    categories.value = (res.data || []).filter((item) => item !== 'all')
  } catch (error) {
    toastError(error, '分类加载失败')
  }
}

async function fetchList(reset = true) {
  if (!reset && (loading.value || !hasNext.value)) return
  loading.value = true
  if (reset) {
    page.value = 1
    spinning.value = true
  }
  try {
    const res = await resourceApi.getResourceList({
      currentPage: page.value,
      pageSize: 32,
      category: category.value || undefined
    })
    const rows = res.data.list || []
    list.value = reset ? rows : list.value.concat(rows)
    hasNext.value = rows.length > 0
  } catch (error) {
    hasNext.value = false
    toastError(error, '资源加载失败')
  } finally {
    loading.value = false
    spinning.value = false
  }
}

function loadMore() {
  page.value += 1
  fetchList(false)
}

function onCategoryChange() {
  fetchList(true)
}

function reload() {
  fetchCategories()
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

function removeResource(item) {
  confirmAction({
    title: t('common.deleteResourceTitle'),
    content: t('common.deletePrompt'),
    onOk: async () => {
      try {
        await resourceApi.remove(item.id)
        message.success('删除成功')
        reload()
      } catch (error) {
        toastError(error)
      }
    }
  })
}

useInfiniteScroll({ hasNext, loading, onLoadMore: loadMore })

onMounted(() => {
  fetchCategories()
  fetchList(true)
})
</script>

<style lang="less" scoped>
/* 与 bbs-vue-ui 一致：整页 1100px 宽，4 列卡片 */
.resource-view {
  width: 100%;
}

.resource-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px 0;
  //background: #fff;

  .ant-btn {
    height: 30px;
  }

  /* 与 bbs-vue-ui 一致：分类按钮各自独立、间距 10px */
  :deep(.ant-radio-group) {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  :deep(.ant-radio-button-wrapper) {
    border-left: 1px solid #d9d9d9;
    border-radius: 4px;

    &::before {
      display: none;
    }
  }
}

.resource-end {
  padding: 20px;
  color: #8a919f;
  text-align: center;
}
</style>
