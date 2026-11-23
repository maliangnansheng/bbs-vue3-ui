<template>
  <div class="account-view">
    <a-spin :spinning="loading">
      <p class="section-title">{{ $t('common.accountSettings') }}</p>
      <a-divider />

      <section class="account-section">
        <div class="section-label">{{ $t('common.phone') }}</div>
        <div class="section-value">{{ userInfo.phone || '未绑定' }}</div>
        <a-popconfirm
          v-if="userInfo.phone"
          :title="$t('common.unBindPhoneTitle')"
          :ok-text="$t('common.unBind')"
          :cancel-text="$t('common.cancel')"
          @confirm="unbindPhone"
        >
          <a-button danger size="small">{{ $t('common.unBind') }}</a-button>
        </a-popconfirm>
        <a v-else @click="bindPhoneOpen = true"><PlusOutlined /> {{ $t('common.bindPhone') }}</a>
      </section>

      <a-divider />

      <section class="account-section">
        <div class="section-label">{{ $t('common.email') }}</div>
        <div class="section-value">{{ userInfo.email || '未绑定' }}</div>
        <a-popconfirm
          v-if="userInfo.email"
          :title="$t('common.unBindEmailTitle')"
          :ok-text="$t('common.unBind')"
          :cancel-text="$t('common.cancel')"
          @confirm="unbindEmail"
        >
          <a-button danger size="small">{{ $t('common.unBind') }}</a-button>
        </a-popconfirm>
        <a v-else @click="bindEmailOpen = true"><PlusOutlined /> {{ $t('common.bindEmail') }}</a>
      </section>

      <a-divider />

      <section class="account-section">
        <div class="section-label">{{ $t('common.userPassword') }}</div>
        <div class="section-value">***************</div>
        <a-button type="primary" size="small" @click="passwordOpen = true">{{ $t('common.reset') }}</a-button>
      </section>

      <a-divider />
    </a-spin>

    <BindPhoneModal v-model:open="bindPhoneOpen" @refresh="load" />
    <BindEmailModal v-model:open="bindEmailOpen" @refresh="load" />
    <ChangePasswordModal v-model:open="passwordOpen" @refresh="load" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import BindPhoneModal from '@/components/user/BindPhoneModal.vue'
import BindEmailModal from '@/components/user/BindEmailModal.vue'
import ChangePasswordModal from '@/components/user/ChangePasswordModal.vue'
import userApi from '@/api/user'
import { message, toastError } from '@/utils/feedback'
import { useUserStore } from '@/stores/user'
import { translate as t } from '@/i18n'

const user = useUserStore()
const loading = ref(true)
const userInfo = ref({})
const bindPhoneOpen = ref(false)
const bindEmailOpen = ref(false)
const passwordOpen = ref(false)

async function load() {
  await user.ensureUser()
  if (!user.userId) {
    loading.value = false
    return
  }
  loading.value = true
  try {
    const res = await userApi.getUserInfo({ userId: user.userId })
    userInfo.value = res.data || {}
  } catch (error) {
    toastError(error, '账号信息加载失败')
  } finally {
    loading.value = false
  }
}

async function unbindPhone() {
  try {
    await userApi.untiePhone()
    message.success(t('common.unBindPhoneSuccessed'))
    load()
  } catch (error) {
    toastError(error, '解绑失败')
  }
}

async function unbindEmail() {
  try {
    await userApi.untieEmail()
    message.success(t('common.unBindEmailSuccessed'))
    load()
  } catch (error) {
    toastError(error, '解绑失败')
  }
}

onMounted(load)
</script>

<style lang="less" scoped>
.account-view {
  padding: 20px 24px;
}

.section-title {
  margin-bottom: 0;
  font-size: 16px;
  font-weight: 600;
}

.account-section {
  display: flex;
  align-items: center;
  min-height: 40px;
}

.section-label {
  width: 80px;
  color: #4e5969;
  font-weight: 500;
}

.section-value {
  flex: 1;
  color: #8a919f;
}
</style>
