<template>
  <a-upload
    list-type="picture-card"
    :file-list="fileList"
    :custom-request="customRequest"
    :preview="false"
    accept=".jpg, .jpeg, .png"
    @change="onChange"
    @remove="onRemove"
  >
    <div v-if="!fileList.length">
      <PlusOutlined />
      <div class="upload-text">Upload</div>
    </div>
  </a-upload>
</template>

<script setup>
import { ref, watch } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { MAX_IMAGE_SIZE } from '@/utils'
import { message } from '@/utils/feedback'
import { translate as t } from '@/i18n'

const props = defineProps({
  // 已上传成功的图片地址
  url: { type: String, default: '' },
  // 上传方法，接收 FormData，返回 { data: 图片地址 }
  uploader: { type: Function, required: true }
})
const emit = defineEmits(['update:url'])

const fileList = ref([])

watch(
  () => props.url,
  (value) => {
    if (value) {
      fileList.value = [{ uid: '-1', name: 'logo', status: 'done', url: value }]
    } else if (fileList.value.length && fileList.value[0].status === 'done') {
      fileList.value = []
    }
  },
  { immediate: true }
)

function onChange({ fileList: list }) {
  fileList.value = list
}

async function customRequest({ file, onSuccess, onError }) {
  if (file.size > MAX_IMAGE_SIZE) {
    message.warning(t('common.avatarSizeTip'))
    fileList.value = []
    onError?.(new Error('size'))
    return
  }
  const data = new FormData()
  data.append('logo', file)
  try {
    const res = await props.uploader(data)
    fileList.value = [{ uid: file.uid, name: file.name, status: 'done', url: res.data }]
    emit('update:url', res.data)
    onSuccess?.(res)
  } catch (error) {
    fileList.value = []
    message.error(error.desc || '上传失败')
    onError?.(error)
  }
}

function onRemove() {
  fileList.value = []
  emit('update:url', '')
}
</script>

<style lang="less" scoped>
.upload-text {
  margin-top: 4px;
  font-size: 12px;
}
</style>
