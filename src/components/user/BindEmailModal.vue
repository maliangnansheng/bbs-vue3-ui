<template>
  <a-modal :open="open" :title="$t('common.bindEmail')" :width="380" centered :confirm-loading="loading" @ok="submit" @cancel="close">
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <a-form-item name="email" :label="$t('common.email')">
        <a-input-search
          v-model:value="form.email"
          :placeholder="$t('common.pleaseInputYourEmail')"
          :enter-button="$t('common.getValidateCode')"
          :loading="sending"
          @search="sendCode"
        />
      </a-form-item>
      <a-form-item name="code" :label="$t('common.validateCode')">
        <a-input v-model:value="form.code" :placeholder="$t('common.needVerifyCode')" />
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

const EMAIL_REG = /^([a-z0-9A-Z]+[-|.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/

const formRef = ref(null)
const loading = ref(false)
const sending = ref(false)
const sent = ref(false)
const form = reactive({ email: '', code: '' })

const rules = computed(() => ({
  email: [
    { required: true, message: t('common.pleaseInputYourEmail'), trigger: 'blur' },
    {
      validator: async (_rule, value) => {
        if (!EMAIL_REG.test(value)) throw new Error(t('common.emailInvalid'))
      },
      trigger: 'blur'
    }
  ],
  code: [{ required: true, message: t('common.needVerifyCode'), trigger: 'blur' }]
}))

watch(
  () => props.open,
  (value) => {
    if (value) {
      form.email = ''
      form.code = ''
      sent.value = false
    }
  }
)

function close() {
  emit('update:open', false)
}

async function sendCode() {
  try {
    await formRef.value.validateFields(['email'])
  } catch {
    return
  }
  sending.value = true
  try {
    const exist = await userApi.isEmailExist(form.email)
    if (!exist.data) {
      message.warning(t('common.emailNumberNotBound'))
      return
    }
    await userApi.sendEmailVerifyCode({ email: form.email })
    sent.value = true
    message.success(t('common.verifyCodeSendSuccessed'))
  } catch (error) {
    toastError(error, '验证码发送失败')
  } finally {
    sending.value = false
  }
}

async function submit() {
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  if (!sent.value) {
    message.warning(t('common.sendVerifyCodeFirst'))
    return
  }
  loading.value = true
  try {
    await userApi.bindEmail({ email: form.email, code: form.code })
    message.success(t('common.bindEmailSuccessed'))
    emit('refresh')
    close()
  } catch (error) {
    toastError(error, '绑定失败')
  } finally {
    loading.value = false
  }
}
</script>
