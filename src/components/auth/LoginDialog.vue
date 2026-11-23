<template>
  <a-modal :open="user.loginVisible" :footer="null" :width="330" centered @cancel="close">
    <a-form ref="formRef" class="auth-form" :model="form" :rules="rules" @finish="submit">
      <h1 class="auth-title">{{ t('common.accountPasswordLogin') }}</h1>

      <a-form-item name="name">
        <a-input v-model:value="form.name" size="large" allow-clear :placeholder="t('common.username')">
          <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
        </a-input>
      </a-form-item>

      <a-form-item name="password">
        <a-input-password v-model:value="form.password" size="large" :placeholder="t('common.password')">
          <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
        </a-input-password>
      </a-form-item>

      <a-form-item class="auth-actions">
        <div class="auth-row">
          <a-checkbox v-model:checked="form.remember">{{ t('common.rememberMe') }}</a-checkbox>
          <a class="auth-link" @click="toMobileReset">{{ t('common.forgotPassword') }}</a>
        </div>
        <a-button type="primary" size="large" block html-type="submit" :loading="loading">
          {{ t('common.login') }}
        </a-button>
        <div class="auth-switch">
          Or
          <a class="auth-link" @click="toRegister">{{ t('common.registerNow') }}</a>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import authApi from '@/api/auth'
import { errorText, message } from '@/utils/feedback'
import { translate as t } from '@/i18n'
import { useUserStore } from '@/stores/user'

const REMEMBER_KEY = 'rememberUsername'
const user = useUserStore()
const formRef = ref(null)
const loading = ref(false)
const form = reactive({
  name: localStorage.getItem(REMEMBER_KEY) || '',
  password: '',
  remember: Boolean(localStorage.getItem(REMEMBER_KEY))
})

const rules = computed(() => ({
  name: [{ required: true, message: t('common.pleaseInputYourUsername'), trigger: 'blur' }],
  password: [{ required: true, message: t('common.pleaseInputYourPassword'), trigger: 'blur' }]
}))

watch(
  () => user.loginVisible,
  (visible) => {
    if (!visible && formRef.value) formRef.value.clearValidate()
  }
)

function close() {
  user.loginVisible = false
}

function toRegister() {
  user.loginVisible = false
  user.registerVisible = true
}

function toMobileReset() {
  user.loginVisible = false
  user.mobileResetPasswordVisible = true
}

async function submit() {
  loading.value = true
  try {
    await authApi.login({ name: form.name.trim(), password: form.password })
    if (form.remember) {
      localStorage.setItem(REMEMBER_KEY, form.name.trim())
    } else {
      localStorage.removeItem(REMEMBER_KEY)
    }
    message.success(t('common.loginSuccess'))
    // 登录成功后重新加载，确保各页面状态、消息数量与权限同步
    window.location.reload()
  } catch (error) {
    message.error(errorText(error, t('common.login') + '失败'))
  } finally {
    loading.value = false
  }
}
</script>
