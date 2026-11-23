<template>
  <a-modal :open="user.mobileResetPasswordVisible" :footer="null" :width="340" centered @cancel="close">
    <a-form ref="formRef" class="auth-form" :model="form" :rules="rules" @finish="submit">
      <h1 class="auth-title">{{ $t('common.mobileResetPassword') }}</h1>

      <a-form-item name="phone">
        <a-input v-model:value="form.phone" size="large" :placeholder="$t('common.phone')">
          <template #prefix><PhoneOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
        </a-input>
      </a-form-item>

      <a-form-item name="code">
        <a-input-search
          v-model:value="form.code"
          size="large"
          :placeholder="$t('common.validateCode')"
          :enter-button="$t('common.getValidateCode')"
          :loading="sending"
          @search="sendCode"
        >
          <template #prefix><SafetyCertificateOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
        </a-input-search>
      </a-form-item>

      <a-form-item name="newPassword">
        <a-input-password v-model:value="form.newPassword" size="large" :placeholder="$t('common.newPassword')">
          <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
        </a-input-password>
      </a-form-item>

      <a-form-item class="auth-actions">
        <a-button type="primary" size="large" block html-type="submit" :loading="loading">
          {{ $t('common.saveChanges') }}
        </a-button>
        <div class="auth-switch">
          <a class="auth-link" @click="toEmail">{{ $t('common.emailResetPassword') }}</a>
          <a class="auth-link" style="float: right" @click="toLogin">{{ $t('common.loginNow') }}</a>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { LockOutlined, PhoneOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue'
import userApi from '@/api/user'
import { message, toastError } from '@/utils/feedback'
import { useUserStore } from '@/stores/user'
import { translate as t } from '@/i18n'

const PHONE_REG = /^1[3-9]\d{9}$/

const user = useUserStore()
const formRef = ref(null)
const loading = ref(false)
const sending = ref(false)
const form = reactive({ phone: '', code: '', newPassword: '' })

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
  code: [{ required: true, message: t('common.needVerifyCode'), trigger: 'blur' }],
  newPassword: [{ required: true, message: t('common.pleaseInputYourNewPassword'), trigger: 'blur' }]
}))

function close() {
  user.mobileResetPasswordVisible = false
}

function toEmail() {
  user.mobileResetPasswordVisible = false
  user.emailResetPasswordVisible = true
}

function toLogin() {
  user.mobileResetPasswordVisible = false
  user.loginVisible = true
}

async function sendCode() {
  if (!PHONE_REG.test(form.phone)) {
    message.warning(t('common.phoneInvalid'))
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
    message.success(t('common.verifyCodeSendSuccessed'))
  } catch (error) {
    toastError(error, '验证码发送失败')
  } finally {
    sending.value = false
  }
}

async function submit() {
  loading.value = true
  try {
    await userApi.phoneResetPassword({
      phone: form.phone,
      code: form.code,
      newPassword: form.newPassword
    })
    message.success(t('common.pleaseLoginAgain'))
    toLogin()
  } catch (error) {
    toastError(error, '重置失败')
  } finally {
    loading.value = false
  }
}
</script>
