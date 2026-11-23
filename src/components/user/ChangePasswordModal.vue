<template>
  <a-modal
    :open="open"
    :title="$t('common.changePassword')"
    :width="380"
    centered
    :confirm-loading="loading"
    :ok-text="$t('common.reset')"
    @ok="submit"
    @cancel="close"
  >
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <a-form-item name="oldPassword" :label="$t('common.oldPassword')">
        <a-input-password v-model:value="form.oldPassword" :placeholder="$t('common.needOldPassword')" />
      </a-form-item>
      <a-form-item name="newPassword" :label="$t('common.newPassword')">
        <a-input-password v-model:value="form.newPassword" :placeholder="$t('common.needNewPassword')" />
      </a-form-item>
      <a-form-item name="confirmPassword" :label="$t('common.confirmPassword')">
        <a-input-password v-model:value="form.confirmPassword" :placeholder="$t('common.newPasswordAgain')" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import userApi from '@/api/user'
import { message, toastError } from '@/utils/feedback'
import { translate as t } from '@/i18n'

const props = defineProps({
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['update:open', 'refresh'])

const formRef = ref(null)
const loading = ref(false)
const form = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })

const rules = computed(() => ({
  oldPassword: [{ required: true, message: t('common.needOldPassword'), trigger: 'blur' }],
  newPassword: [{ required: true, message: t('common.needNewPassword'), trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: t('common.newPasswordAgain'), trigger: 'blur' },
    {
      validator: async (_rule, value) => {
        if (value !== form.newPassword) throw new Error(t('common.passwordNotMatch'))
      },
      trigger: 'blur'
    }
  ]
}))

watch(
  () => props.open,
  (value) => {
    if (value) {
      form.oldPassword = ''
      form.newPassword = ''
      form.confirmPassword = ''
    }
  }
)

function close() {
  emit('update:open', false)
}

async function submit() {
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  loading.value = true
  try {
    await userApi.updatePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword })
    message.success(t('common.changePasswordSuccessed'))
    emit('refresh')
    close()
  } catch (error) {
    toastError(error, '修改失败')
  } finally {
    loading.value = false
  }
}
</script>
