<template>
  <a-modal :open="user.registerVisible" :footer="null" :width="340" centered @cancel="close">
    <a-form ref="formRef" class="auth-form" :model="form" :rules="rules" @finish="submit">
      <h1 class="auth-title">{{ t('common.userRegister') }}</h1>

      <a-form-item name="username" has-feedback>
        <a-input
          v-model:value="form.username"
          size="large"
          autocomplete="off"
          :maxlength="app.userMaxLength"
          :placeholder="t('common.pleaseInputYourUsername')"
          @change="syncCounter"
        >
          <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
          <template #suffix>
            <span class="auth-counter">{{ form.username.length }}/{{ app.userMaxLength }}</span>
          </template>
        </a-input>
      </a-form-item>

      <a-form-item name="password" has-feedback>
        <a-input-password v-model:value="form.password" size="large" autocomplete="off" :placeholder="t('common.password')">
          <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
        </a-input-password>
      </a-form-item>

      <a-form-item name="confirmPassword" has-feedback>
        <a-input-password
          v-model:value="form.confirmPassword"
          size="large"
          autocomplete="off"
          :placeholder="t('common.confirmPassword')"
        >
          <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
        </a-input-password>
      </a-form-item>

      <a-form-item class="auth-actions">
        <a-button type="primary" size="large" block html-type="submit" :loading="loading">
          {{ t('common.register') }}
        </a-button>
        <div class="auth-switch">
          Or
          <a class="auth-link" @click="toLogin">{{ t('common.loginNow') }}</a>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import authApi from '@/api/auth'
import userApi from '@/api/user'
import { errorText, message } from '@/utils/feedback'
import { translate as t } from '@/i18n'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const app = useAppStore()
const user = useUserStore()
const formRef = ref(null)
const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

function syncCounter() {
  // 仅用于触发视图更新（长度由 form.username 派生）
}

const rules = computed(() => ({
  username: [
    {
      required: true,
      validator: async (_rule, value) => {
        if (!value) throw new Error(t('common.pleaseInputYourUsername'))
        try {
          await userApi.isValidUser({ username: value })
        } catch (error) {
          throw new Error(errorText(error, t('common.pleaseInputYourUsername')), { cause: error })
        }
      },
      trigger: 'blur'
    }
  ],
  password: [{ required: true, message: t('common.pleaseInputYourPassword'), trigger: 'blur' }],
  confirmPassword: [
    {
      required: true,
      validator: async (_rule, value) => {
        if (!value) throw new Error(t('common.pleaseInputYourPassword'))
        if (value !== form.password) throw new Error(t('common.passwordNotMatch'))
      },
      trigger: 'blur'
    }
  ]
}))

function close() {
  user.registerVisible = false
}

function toLogin() {
  user.registerVisible = false
  user.loginVisible = true
}

async function submit() {
  loading.value = true
  try {
    await authApi.register({ name: form.username.trim(), password: form.password })
    message.success(t('common.registerSuccess'))
    window.location.reload()
  } catch (error) {
    message.error(errorText(error, t('common.register') + '失败'))
  } finally {
    loading.value = false
  }
}
</script>
