<template>
  <div class="settings-menu">
    <a-menu :selected-keys="selectedKeys" :mode="app.collapsed ? 'horizontal' : 'inline'" @click="onClick">
      <a-menu-item key="profile">
        <UserOutlined />
        <span>{{ $t('common.personalInformation') }}</span>
      </a-menu-item>
      <a-menu-item key="account">
        <SettingOutlined />
        <span>{{ $t('common.accountSettings') }}</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SettingOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useAppStore } from '@/stores/app'

const app = useAppStore()
const route = useRoute()
const router = useRouter()

const selectedKeys = computed(() => [route.name === 'account' ? 'account' : 'profile'])

function onClick({ key }) {
  router.push(`/settings/${key}`)
}
</script>
