<template>
  <a-popover v-model:open="open" trigger="click" placement="bottomRight">
    <template #title>{{ $t('common.releaseArticle') }}</template>
    <template #content>
      <div class="publish-panel">
        <a-form :model="form" layout="horizontal" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-form-item :label="$t('common.addLabel')" required>
            <a-select
              v-model:value="form.labelIds"
              mode="multiple"
              :placeholder="$t('common.selectLabel')"
              :options="labelOptions"
              :field-names="{ label: 'labelName', value: 'id' }"
              @change="onLabelChange"
            />
          </a-form-item>
          <a-form-item :label="$t('common.articleCover')">
            <ArticleCoverUpload v-model="form.coverPreview" @change="onCoverChange" />
          </a-form-item>
        </a-form>
        <a-divider style="margin: 10px 0" />
        <div class="publish-actions">
          <a-button type="primary" :loading="submitting" @click="submit">
            {{ isEdit ? $t('common.sureAndUpdate') : $t('common.sureAndRelease') }}
          </a-button>
        </div>
      </div>
    </template>

    <a-button class="publish-trigger" type="primary">{{ isEdit ? $t('common.update') : $t('common.release') }}</a-button>
  </a-popover>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleCoverUpload from './ArticleCoverUpload.vue'
import labelApi from '@/api/label'
import articleApi from '@/api/article'
import { MAX_IMAGE_SIZE } from '@/utils'
import { message, toastError } from '@/utils/feedback'
import { useUserStore } from '@/stores/user'
import { translate as t } from '@/i18n'

const props = defineProps({
  title: { type: String, default: '' },
  markdown: { type: String, default: '' },
  html: { type: String, default: '' },
  // 编辑时可回填的标签
  defaultLabelIds: { type: Array, default: () => [] },
  defaultCover: { type: String, default: '' }
})

const route = useRoute()
const router = useRouter()
const user = useUserStore()

const open = ref(false)
const submitting = ref(false)
const labelList = ref([])
const form = reactive({
  labelIds: [...props.defaultLabelIds],
  coverFile: null,
  coverPreview: props.defaultCover
})

const isEdit = computed(() => Boolean(route.params.id))
const labelOptions = computed(() => labelList.value)

function onLabelChange(value) {
  if (value.length > 3) {
    message.warning('最多只能添加 3 个标签')
    form.labelIds = value.slice(0, 3)
  }
}

function onCoverChange(file) {
  if (file && file.size > MAX_IMAGE_SIZE) {
    message.warning(t('common.avatarSizeTip'))
    form.coverFile = null
    form.coverPreview = ''
    return
  }
  form.coverFile = file
}

async function submit() {
  if (!props.title.trim()) {
    message.warning('标题不能为空')
    return
  }
  if (!props.markdown.trim()) {
    message.warning('内容不能为空')
    return
  }
  if (!form.labelIds.length) {
    message.warning(t('common.selectLabel'))
    return
  }

  const data = new FormData()
  data.append('title', props.title.trim())
  data.append('markdown', props.markdown)
  data.append('html', props.html || '')
  data.append('labelIds', form.labelIds.join(','))
  if (form.coverFile) data.append('file', form.coverFile)
  if (isEdit.value) data.append('id', route.params.id)

  submitting.value = true
  try {
    if (isEdit.value) {
      await articleApi.update(data)
      message.success(t('common.update') + '成功')
      open.value = false
      router.back()
    } else {
      await articleApi.create(data)
      message.success(t('common.release') + '成功')
      open.value = false
      router.push(`/user/${user.userId}/article`)
    }
  } catch (error) {
    toastError(error, isEdit.value ? '更新失败' : '发布失败')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    const res = await labelApi.getLabelList({ currentPage: 1, pageSize: 100 })
    labelList.value = res.data.list || []
  } catch (error) {
    toastError(error, '标签加载失败')
  }
})
</script>

<style lang="less" scoped>
.publish-panel {
  width: 500px;
}

.publish-actions {
  display: flex;
  justify-content: flex-end;
}

.publish-trigger {
  height: 30px;
}
</style>
