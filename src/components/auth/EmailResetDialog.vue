<template>
  <a-modal :open="user.emailResetPasswordVisible" :footer="null" :width="340" centered @cancel="close">
    <a-form ref="formRef" class="auth-form" :model="form" :rules="rules" @finish="submit">
      <h1 class="auth-title">{{ $t('common.emailResetPassword') }}</h1>

      <a-form-item name="email">
        <a-input v-model:value="form.email" size="large" :placeholder="$t('common.email')">
          <template #prefix><MailOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
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
          <a class="auth-link" @click="toMobile">{{ $t('common.mobileResetPassword') }}</a>
          <a class="auth-link" style="float: right" @click="toLogin">{{ $t('common.loginNow') }}</a>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { LockOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue'
import userApi from '@/api/user'
import { message, toastError } from '@/utils/feedback'
import { useUserStore } from '@/stores/user'
import { translate as t } from '@/i18n'

const EMAIL_REG = /^([a-z0-9A-Z]+[-|.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/

const user = useUserStore()
const formRef = ref(null)
const loading = ref(false)
const sending = ref(false)
const form = reactive({ email: '', code: '', newPassword: '' })

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
  code: [{ required: true, message: t('common.needVerifyCode'), trigger: 'blur' }],
  newPassword: [{ required: true, message: t('common.pleaseInputYourNewPassword'), trigger: 'blur' }]
}))

function close() {
  user.emailResetPasswordVisible = false
}

function toMobile() {
  user.emailResetPasswordVisible = false
  user.mobileResetPasswordVisible = true
}

function toLogin() {
  user.emailResetPasswordVisible = false
  user.loginVisible = true
}

async function sendCode() {
  if (!EMAIL_REG.test(form.email)) {
    message.warning(t('common.emailInvalid'))
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
    await userApi.emailResetPassword({
      email: form.email,
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
