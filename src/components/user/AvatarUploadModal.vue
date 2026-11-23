<template>
  <a-modal :open="open" :title="null" :width="360" :footer="null" centered @cancel="close">
    <p class="avatar-modal-title">{{ $t('common.editAvatar') }}</p>
    <p class="avatar-modal-tip">{{ $t('common.avatarTip')[0] }}</p>
    <p class="avatar-modal-tip">{{ $t('common.avatarTip')[1] }}</p>

    <a-progress v-if="progress > 0" :percent="progress" size="small" />

    <label :for="inputId" class="avatar-picker">
      <img :src="preview || avatarBg" alt="头像" />
    </label>
    <input :id="inputId" type="file" accept=".jpg, .jpeg, .png" class="avatar-input" @change="onFileChange" />

    <div class="avatar-modal-footer">
      <a-button type="primary" :loading="loading" @click="submit">{{ $t('common.save') }}</a-button>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import userApi from '@/api/user'
import { MAX_IMAGE_SIZE } from '@/utils'
import { message, toastError } from '@/utils/feedback'
import { useUserStore } from '@/stores/user'
import { translate as t } from '@/i18n'
import avatarBg from '@/assets/img/avatar-bg.png'

const props = defineProps({
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['update:open', 'refresh'])

const user = useUserStore()
const inputId = `avatar-${Math.random().toString(36).slice(2, 9)}`
const preview = ref(user.picture)
const file = ref(null)
const loading = ref(false)
const progress = ref(0)

watch(
  () => props.open,
  (value) => {
    if (value) {
      preview.value = user.picture
      file.value = null
      progress.value = 0
    }
  }
)

function onFileChange(event) {
  const selected = event.target.files && event.target.files[0]
  if (!selected) return
  file.value = selected
  preview.value = URL.createObjectURL(selected)
}

function close() {
  emit('update:open', false)
}

async function submit() {
  if (!file.value) {
    message.warning(t('common.noPictureTip'))
    return
  }
  if (file.value.size > MAX_IMAGE_SIZE) {
    message.warning(t('common.avatarSizeTip'))
    return
  }
  const data = new FormData()
  data.append('picture', file.value)
  loading.value = true
  try {
    await userApi.uploadUserPicture(data, (event) => {
      if (event.total) progress.value = Number(((event.loaded / event.total) * 100).toFixed(2))
    })
    message.success(t('common.uploadSuccessed'))
    emit('refresh')
    close()
  } catch (error) {
    progress.value = 0
    toastError(error, '头像上传失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
.avatar-modal-title {
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 600;
}

.avatar-modal-tip {
  margin-bottom: 2px;
  color: #8a919f;
  font-size: 12px;
}

.avatar-picker {
  display: block;
  width: 100%;
  margin-top: 8px;
  cursor: pointer;

  img {
    width: 100%;
    border-radius: 4px;
  }
}

.avatar-input {
  display: none;
}

.avatar-modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
