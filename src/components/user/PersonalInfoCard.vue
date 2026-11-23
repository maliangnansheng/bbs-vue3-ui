<template>
  <div class="profile-card" :class="{ 'is-collapsed': app.collapsed }">
    <div class="profile-top">
      <div class="profile-left">
        <a-avatar :size="88" :src="data.picture || defaultAvatar" />
        <div class="profile-info">
          <div class="profile-name">
            <span>{{ data.name }}</span>
            <img :src="levelIcon(data.level)" alt="等级" class="level-icon" />
          </div>

          <div class="profile-line">
            <span v-if="data.position">
              <i class="iconfont icon-office"></i>
              {{ data.position }}
            </span>
            <a v-else-if="isSelf" @click="goSettings">
              <PlusOutlined />
              {{ $t('common.notJob') }}
            </a>
          </div>

          <div class="profile-line">
            <span v-if="data.intro">
              <i class="iconfont icon-intro"></i>
              {{ data.intro }}
            </span>
            <a v-else-if="isSelf" @click="goSettings">
              <PlusOutlined />
              {{ $t('common.notHobbies') }}
            </a>
          </div>
        </div>
      </div>

      <div class="profile-right">
        <div class="profile-links">
          <a-tooltip placement="left" title="GitHub（开发中...）">
            <i class="iconfont icon-GitHub disabled-icon"></i>
          </a-tooltip>
          <a-tooltip placement="right" :title="$t('common.homePage')">
            <i
              class="iconfont icon-personal-center"
              :class="{ 'disabled-icon': !data.homePage }"
              @click="openHomePage"
            ></i>
          </a-tooltip>
        </div>

        <a-button v-if="isSelf" class="edit-button" :style="{ color: app.themeColor, borderColor: app.themeColor }" @click="goSettings">
          {{ $t('common.personalEdit') }}
        </a-button>
        <template v-else-if="user.isLogin">
          <a-button v-if="!data.isFollow" class="edit-button" :style="{ color: app.themeColor, borderColor: app.themeColor }" @click="toggleFollow">
            {{ $t('common.follow') }}
          </a-button>
          <a-button v-else class="edit-button followed" @click="toggleFollow">
            {{ $t('common.haveFollowed') }}
          </a-button>
        </template>
      </div>
    </div>

    <a-divider class="profile-divider" />

    <div class="profile-bottom">
      <div class="badge-summary">
        <img src="@/assets/img/badge.svg" alt="徽章" />
        <span>{{ $t('common.getBadge') + ' ' + currentBadgeLevel }}</span>
      </div>
      <div class="badge-list">
        <a-tooltip v-for="(badge, index) in earnedBadges" :key="badge.title" placement="top" :title="badge.title">
          <img :src="badgeIcon(index + 1)" alt="徽章" class="badge-icon" @click="openBook" />
        </a-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { PlusOutlined } from '@ant-design/icons-vue'
import userApi from '@/api/user'
import { BADGE_LEVELS, badgeIcon, badgeLevel, levelIcon } from '@/utils'
import { toastError } from '@/utils/feedback'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import defaultAvatar from '@/assets/img/default_avatar.png'

const props = defineProps({
  data: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['refresh'])

const app = useAppStore()
const user = useUserStore()
const router = useRouter()

const isSelf = computed(() => user.isLogin && user.userId === props.data.id)
const currentBadgeLevel = computed(() => badgeLevel(props.data.points))
const earnedBadges = computed(() => BADGE_LEVELS.filter((item) => Number(props.data.points || 0) >= item.min))

function goSettings() {
  router.push('/settings/profile')
}

function openBook() {
  window.open(router.resolve('/book').href, '_blank')
}

function openHomePage() {
  if (props.data.homePage) {
    window.open(props.data.homePage, '_blank')
  } else if (isSelf.value) {
    goSettings()
  }
}

async function toggleFollow() {
  try {
    await userApi.updateFollowState({ toUser: props.data.id })
    emit('refresh')
  } catch (error) {
    toastError(error, '操作失败')
  }
}
</script>

<style lang="less" scoped>
.profile-card {
  padding: 20px;
  background: #fff;

  &.is-collapsed {
    padding: 10px;
  }
}

.profile-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.profile-left {
  display: flex;
  min-width: 0;
}

.profile-info {
  padding-left: 14px;
  min-width: 0;
}

.profile-name {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 600;

  .level-icon {
    height: 18px;
    margin-left: 6px;
  }
}

.profile-line {
  margin-top: 4px;
  color: #4e5969;
  font-size: 13px;

  a {
    color: #13c2c2;
  }

  .iconfont {
    margin-right: 4px;
    color: #8a919f;
  }
}

.profile-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.profile-links {
  display: flex;
  gap: 12px;
  font-size: 18px;
}

.disabled-icon {
  color: #00000038;
}

.edit-button {
  height: 27px;
  border-radius: 2px;

  &:hover {
    color: #fff !important;
    background: #37c701;
    border-color: rgba(55, 199, 1, 0.6) !important;
  }

  &.followed {
    color: #fff !important;
    background: #37c701;
    border-color: rgba(55, 199, 1, 0.6) !important;
  }
}

.profile-divider {
  margin: 24px 0 16px;
}

.profile-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.badge-summary {
  display: flex;
  align-items: center;
  color: #4e5969;

  img {
    height: 20px;
    margin-right: 6px;
  }
}

.badge-list {
  display: flex;
  align-items: center;
  gap: 6px;
}

.badge-icon {
  height: 26px;
  cursor: pointer;
}
</style>
