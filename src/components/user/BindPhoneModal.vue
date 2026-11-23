<template>
  <a-modal :open="open" :title="$t('common.bindPhone')" :width="380" centered :confirm-loading="loading" @ok="submit" @cancel="close">
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <a-form-item name="phone" :label="$t('common.phone')">
        <a-input-search
          v-model:value="form.phone"
          :placeholder="$t('common.pleaseInputYourPhone')"
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

const PHONE_REG = /^1[3-9]\d{9}$/

const formRef = ref(null)
const loading = ref(false)
const sending = ref(false)
const sent = ref(false)
const form = reactive({ phone: '', code: '' })

const rules = computed(() => ({
  phone: [
    { required: true, message: t('common.pleaseInputYourPhone'), trigger: 'blur' },
    {
      validator: async (_rule, value) => {
        if (!PHONE_REG.test(value)) throw new Error(t('common.phoneInvalid'))
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
      form.phone = ''
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
    await formRef.value.validateFields(['phone'])
  } catch {
    return
  }
  sending.value = true
  try {
    const exist = await userApi.isPhoneExist(form.phone)
    if (!exist.data) {
      message.warning(t('common.mobileNumberNotBound'))
      return
    }
    await userApi.sendSmsVerifyCode({ phone: form.phone })
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
    await userApi.bindPhone({ phone: form.phone, code: form.code })
    message.success(t('common.bindPhoneSuccessed'))
    emit('refresh')
    close()
  } catch (error) {
    toastError(error, '绑定失败')
  } finally {
    loading.value = false
  }
}
</script>
