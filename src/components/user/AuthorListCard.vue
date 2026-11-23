<template>
  <div class="author-list">
    <a-empty v-if="!data.length" description="暂无数据" />
    <div v-for="(item, index) in data" :key="item.id" class="author-row">
      <img :src="item.picture || defaultAvatar" alt="头像" class="author-avatar" @click="openUser(item.id)" />
      <div class="author-info">
        <a class="author-name" @click="openUser(item.id)">
          {{ item.name }}
          <img :src="levelIcon(item.level)" alt="等级" class="level-icon" @click.stop="openBook" />
        </a>
        <div class="author-intro">{{ item.intro }}</div>
        <div class="author-meta">
          {{ $t('common.get') }} {{ item.likeCount }}{{ $t('common.praise') }} · {{ item.readCount }}{{ $t('common.read') }}
        </div>
      </div>
      <a-button
        v-if="!item.isFollow"
        class="follow-button"
        :style="{ color: app.themeColor, borderColor: app.themeColor }"
        @click="toggleFollow(item, index)"
      >
        {{ $t('common.follow') }}
      </a-button>
      <a-button v-else class="follow-button followed" @click="toggleFollow(item, index)">
        {{ $t('common.haveFollowed') }}
      </a-button>
    </div>
    <div v-if="finish && !hasNext && data.length" class="author-list-end">{{ $t('common.noAgain') }}</div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import userApi from '@/api/user'
import { levelIcon } from '@/utils'
import { toastError } from '@/utils/feedback'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import defaultAvatar from '@/assets/img/default_avatar.png'

const emit = defineEmits(['followed'])

const props = defineProps({
  data: { type: Array, default: () => [] },
  finish: { type: Boolean, default: false },
  hasNext: { type: Boolean, default: false },
  // 关注列表场景需要传入被关注用户 id
  followField: { type: String, default: '' }
})

const app = useAppStore()
const user = useUserStore()
const router = useRouter()

function openUser(id) {
  window.open(router.resolve(`/user/${id}`).href, '_blank')
}

function openBook() {
  window.open(router.resolve('/book').href, '_blank')
}

async function toggleFollow(item, index) {
  if (!user.isLogin) {
    user.openLogin()
    return
  }
  const targetId = props.followField ? item[props.followField] : item.id
  try {
    await userApi.updateFollowState({ toUser: targetId })
    emit('followed', index)
  } catch (error) {
    toastError(error, '操作失败')
  }
}
</script>

<style lang="less" scoped>
.author-list {
  background: #fff;
}

.author-row {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f5f5f5;

  &:hover {
    background: #fafafa;
  }
}

.author-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}

.author-info {
  flex: 1;
  min-width: 0;
  padding: 0 16px;
}

.author-name {
  display: flex;
  align-items: center;
  color: #252933;
  font-size: 16px;
  font-weight: 600;
}

.level-icon {
  height: 16px;
  margin-left: 4px;
}

.author-intro {
  overflow: hidden;
  color: #8a919f;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.author-meta {
  color: #8a919f;
  font-size: 12px;
}

.follow-button {
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

.author-list-end {
  padding: 20px;
  color: #8a919f;
  text-align: center;
}
</style>
