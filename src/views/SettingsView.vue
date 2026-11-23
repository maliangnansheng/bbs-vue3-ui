<template>
  <AppLayout :max-width="1100">
    <div class="settings-wrap">
      <div class="settings-back">
        <span @click="backToProfile">
          <LeftOutlined />
          返回个人主页
        </span>
      </div>

      <template v-if="app.collapsed">
        <SettingsMenu class="settings-menu" />
        <div class="settings-content">
          <router-view />
        </div>
      </template>

      <a-row v-else class="settings-row">
        <a-col :span="6" class="settings-menu">
          <SettingsMenu />
        </a-col>
        <a-col :span="18" class="settings-content">
          <router-view />
        </a-col>
      </a-row>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LeftOutlined } from '@ant-design/icons-vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import SettingsMenu from '@/components/user/SettingsMenu.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const app = useAppStore()
const user = useUserStore()
const router = useRouter()

function backToProfile() {
  router.push(`/user/${user.userId}`)
}

onMounted(async () => {
  await user.ensureUser()
  if (!user.isLogin) {
    user.openLogin()
    router.replace('/')
  }
})
</script>

<style lang="less" scoped>
.settings-wrap {
  width: 100%;
  max-width: 1100px;
}

.settings-back {
  display: flex;
  align-items: center;
  height: 46px;
  padding-left: 20px;
  background: #fff;
  color: #909090;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;

    &:hover {
      color: #07c19a;
    }
  }
}

.settings-row {
  margin-top: 10px;
  width: 100%;
}

.settings-menu {
  min-height: 635px;
  background: #fff;
}

.settings-content {
  min-height: 635px;
  background: #fff;
}
</style>
