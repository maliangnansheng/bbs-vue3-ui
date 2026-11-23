<template>
  <a-layout-header class="app-header">
    <div class="main-header">
      <div class="header-left">
        <div v-if="!app.collapsed" class="header-logo" @click="goHome">
          <img src="@/assets/img/logo-lanse.png" alt="南生论坛" />
        </div>
        <NavMenu v-if="!app.collapsed" />
        <MobileNav v-else />
      </div>

      <div class="header-right">
        <!-- 搜索 -->
        <div class="header-search">
          <a-input
            v-model:value="keyword"
            :placeholder="$t('common.searchPlaceholder')"
            class="header-search-input"
            @press-enter="onSearch(keyword)"
          >
            <template #suffix>
              <SearchOutlined class="header-search-icon" @click="onSearch(keyword)" />
            </template>
          </a-input>
        </div>

        <!-- 写文章 -->
        <div v-if="user.isLogin && !app.collapsed" class="header-item" @click="router.push('/write')">
          <span class="header-text">{{ $t('common.writeArticle') }}</span>
        </div>

        <!-- 管理端 -->
        <div v-if="!user.isLogin && !app.collapsed" class="header-item" @click="openManage">
          <span class="header-text">{{ $t('common.management') }}</span>
        </div>

        <!-- 主题色 -->
        <a-dropdown :trigger="['click']" placement="bottomRight" overlay-class-name="theme-color-dropdown">
          <div class="header-item">
            <i class="iconfont icon-theme" :style="{ color: app.themeColor }"></i>
          </div>
          <template #overlay>
            <div class="theme-color-panel">
              <p class="theme-color-title">{{ $t('common.themeColor') }}</p>
              <div class="theme-color-options">
                <button
                  v-for="color in app.colorOptions"
                  :key="color"
                  type="button"
                  class="theme-color-item"
                  :style="{ background: color }"
                  @click="app.setThemeColor(color)"
                >
                  <CheckOutlined v-if="app.themeColor === color" class="theme-color-check" />
                </button>
              </div>
            </div>
          </template>
        </a-dropdown>

        <!-- 消息通知 -->
        <div v-if="user.isLogin" class="header-item">
          <a-dropdown :trigger="['click']" placement="bottomRight" overlay-class-name="header-message-dropdown">
            <a-badge :count="messageCount" :overflow-count="99" class="header-badge">
              <i class="iconfont icon-bell"></i>
            </a-badge>
            <template #overlay>
              <MessageDropdown />
            </template>
          </a-dropdown>
        </div>

        <!-- 头像 -->
        <div v-if="user.isLogin" class="header-item">
          <a-dropdown :trigger="['click']" placement="bottomRight">
            <div class="header-avatar">
              <a-avatar v-if="user.picture" :src="user.picture" :size="32" />
              <img v-else :src="defaultAvatar" alt="头像" class="default-avatar" />
            </div>
            <template #overlay>
              <a-menu @click="onUserMenuClick">
                <a-menu-item key="write">
                  <i class="iconfont icon-writeArticle"></i>
                  {{ $t('common.writeArticle') }}
                </a-menu-item>
                <a-menu-item key="profile">
                  <i class="iconfont icon-user-picture"></i>
                  {{ $t('common.profile') }}
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="settings">
                  <i class="iconfont icon-setUp"></i>
                  {{ $t('common.setUp') }}
                </a-menu-item>
                <a-menu-item key="about">
                  <i class="iconfont icon-about"></i>
                  {{ $t('common.about') }}
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="manage">
                  <i class="iconfont icon-setUp"></i>
                  {{ $t('common.management') }}
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout">
                  <i class="iconfont icon-quit"></i>
                  {{ $t('common.logOut') }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>

        <!-- 语言切换 -->
        <div v-if="!app.collapsed" class="header-item header-language" @click="app.toggleLocale()">
          <GlobalOutlined />
          <span class="header-text">{{ app.locale === 'en_US' ? '中' : 'En' }}</span>
        </div>

        <!-- 登录 -->
        <div v-if="!user.isLogin" class="header-item header-item-login">
          <a-button class="login-button" @click="user.openLogin()">{{ $t('common.login') }}</a-button>
        </div>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { CheckOutlined, GlobalOutlined, SearchOutlined } from '@ant-design/icons-vue'
import NavMenu from './NavMenu.vue'
import MobileNav from './MobileNav.vue'
import MessageDropdown from '@/components/message/MessageDropdown.vue'
import authApi from '@/api/auth'
import { errorText, message } from '@/utils/feedback'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import defaultAvatar from '@/assets/img/default_avatar.png'

const props = defineProps({
  searchContent: { type: String, default: '' }
})
const emit = defineEmits(['search'])

const app = useAppStore()
const user = useUserStore()
const router = useRouter()

const keyword = ref(props.searchContent)

const messageCount = computed(() => Number(user.systemNotifyCount || 0) + Number(user.taskNotifyCount || 0))

watch(
  () => props.searchContent,
  (value) => {
    keyword.value = value
  }
)

function goHome() {
  router.push('/')
}

function onSearch(value) {
  const text = (value || '').trim()
  router.push({ path: '/search', query: text ? { query: text } : {} })
  emit('search', text)
}

function openManage() {
  window.open(app.manageDomain, '_blank')
}

function onUserMenuClick({ key }) {
  switch (key) {
    case 'write':
      router.push('/write')
      break
    case 'profile':
      window.open(router.resolve(`/user/${user.userId}`).href, '_blank')
      break
    case 'settings':
      router.push('/settings/profile')
      break
    case 'about':
      window.open(router.resolve('/about').href, '_blank')
      break
    case 'manage':
      openManage()
      break
    case 'logout':
      logout()
      break
    default:
      break
  }
}

async function logout() {
  try {
    await authApi.logout()
    user.reset()
    window.location.reload()
  } catch (error) {
    message.error(errorText(error, '退出登录失败'))
  }
}
</script>

<style lang="less" scoped>
.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1100px;
  height: 100%;
  background: #fff;
}

.header-left {
  display: flex;
  align-items: center;
  height: 100%;
}

.header-logo {
  display: flex;
  align-items: center;
  height: 40px;
  cursor: pointer;

  img {
    display: block;
    height: 100%;
  }
}

.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;

  .header-search,
  .header-item,
  .header-item-login {
    padding: 0 12px;
  }

  .header-item {
    display: flex;
    align-items: center;
    height: 40px;
    color: #71777c;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }

  /* 图标尺寸与 bbs-vue-ui 保持一致（全局 .main-header .iconfont 为 24px） */
  .iconfont {
    display: block;
    font-size: 24px;
    line-height: 1;
  }

  .header-text {
    padding-left: 2px;
  }

  .header-language {
    gap: 3px;
    padding-left: 6px;
  }

  .header-badge {
    position: relative;

    :deep(.ant-badge-count) {
      top: 2px;
      right: 5px;
    }
  }

  .header-avatar,
  .default-avatar {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }

  .default-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .header-item-login {
    cursor: auto;

    &:hover {
      opacity: 1;
    }
  }

  .login-button {
    height: 32px;
    padding: 0 15px;
    color: #007fff;
    background: rgba(30, 128, 255, 0.05);
    border: 1px solid rgba(30, 128, 255, 0.3);
    border-radius: 4px;
    box-shadow: none;
  }
}

/* 搜索框：与 bbs-vue-ui 一致——白底白边、无背景，放大镜内嵌在输入框右侧 */
.header-search {
  width: 200px;

  :deep(.ant-input-affix-wrapper) {
    height: 32px;
    padding: 0 11px;
    background: #fff;
    border: 1px solid #fff;
    border-radius: 4px;
    box-shadow: none;
    transition: box-shadow 0.2s;

    &-focused {
      background: #fff;
      border-color: #fff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }

  :deep(.ant-input) {
    background: transparent;
    font-size: 14px;
  }
}

.header-search-icon {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: rgba(0, 0, 0, 0.65);
  }
}

@media screen and (max-width: 999px) {
  .header-right {
    .header-search,
    .header-item,
    .header-item-login {
      padding: 0 8px;
    }
  }

  .header-search {
    flex: 1 1 auto;
    width: auto;
    max-width: 220px;
    min-width: 0;
  }
}
</style>
