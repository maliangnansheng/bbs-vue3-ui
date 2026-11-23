<template>
  <div class="article-body" :class="{ 'is-collapsed': app.collapsed }">
    <template v-if="article">
      <div class="article-head">
        <h1>{{ article.title }}</h1>
        <span v-if="article.state === -1" class="iconfont icon-pendingReview state-icon state-pending"></span>
        <span v-if="article.state === 0" class="iconfont icon-reviewRejected state-icon state-rejected"></span>
      </div>

      <div class="article-meta">
        <div class="article-author">
          <a-avatar :size="46" :src="article.picture || defaultAvatar" class="author-avatar" @click="openUser" />
          <div class="author-info">
            <div class="author-name">
              <a @click="openUser">{{ article.createUserName }}</a>
              <img :src="levelIcon(level)" alt="等级" class="level-icon" @click.stop="openBook" />
            </div>
            <div class="author-sub">
              <span>{{ datetime(article.createTime) }}</span>
              <span class="author-views">{{ $t('common.read') + ' ' + (article.pv || 0) }}</span>
            </div>
          </div>
        </div>

        <div class="article-actions">
          <a-button
            v-if="isOwner"
            class="follow-button"
            :style="{ color: app.themeColor, borderColor: app.themeColor }"
            @click="router.push(`/edit/${article.id}`)"
          >
            {{ $t('common.edit') }}
          </a-button>
          <template v-else-if="user.isLogin">
            <a-button v-if="!followed" class="follow-button" :style="{ color: app.themeColor, borderColor: app.themeColor }" @click="toggleFollow">
              {{ $t('common.follow') }}
            </a-button>
            <a-button v-else class="follow-button followed" @click="toggleFollow">
              {{ $t('common.haveFollowed') }}
            </a-button>
          </template>
        </div>
      </div>

      <div v-if="article.titleMap" class="article-cover">
        <img :src="article.titleMap" alt="题图" />
      </div>

      <div class="article-content">
        <MarkdownPreview :content="article.markdown || ''" :editor-id="previewId" />
      </div>
    </template>

    <CustomEmpty v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MarkdownPreview from '@/components/markdown/MarkdownPreview.vue'
import CustomEmpty from '@/components/common/CustomEmpty.vue'
import userApi from '@/api/user'
import { datetime, levelIcon } from '@/utils'
import { toastError } from '@/utils/feedback'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import defaultAvatar from '@/assets/img/default_avatar.png'

const props = defineProps({
  article: { type: Object, default: null },
  previewId: { type: String, default: 'article-preview' }
})
const emit = defineEmits(['refresh'])

const app = useAppStore()
const user = useUserStore()
const router = useRouter()

const level = computed(() => {
  const count = props.article?.articleCountDTO || {}
  return count.level || props.article?.level
})

const followed = computed(() => Boolean(props.article?.articleCountDTO?.isFollow))
const isOwner = computed(() => user.isLogin && props.article && user.userId === props.article.createUser)

function openUser() {
  if (!props.article) return
  window.open(router.resolve(`/user/${props.article.createUser}`).href, '_blank')
}

function openBook() {
  window.open(router.resolve('/book').href, '_blank')
}

async function toggleFollow() {
  try {
    await userApi.updateFollowState({ toUser: props.article.createUser })
    emit('refresh')
  } catch (error) {
    toastError(error, '关注操作失败')
  }
}
</script>

<style lang="less" scoped>
.article-body {
  padding: 20px;
  background: #fff;

  &.is-collapsed {
    padding: 10px;
  }
}

.article-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  h1 {
    margin-bottom: 8px;
    color: #252933;
    font-size: 32px;
    font-weight: 700;
    line-height: 1.31;
    word-break: break-word;
  }
}

.state-icon {
  font-size: 38px;
}

.state-pending {
  color: #faad14;
}

.state-rejected {
  color: red;
}

.article-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
}

.article-author {
  display: flex;
  align-items: center;
}

.author-avatar {
  cursor: pointer;
}

.author-info {
  padding-left: 10px;
}

.author-name {
  display: flex;
  align-items: center;
  font-size: 17px;

  a {
    color: #252933;
  }
}

.level-icon {
  height: 16px;
  margin-left: 4px;
}

.author-sub {
  color: #8a919f;
  font-size: 13px;

  span + span {
    margin-left: 12px;
  }
}

.follow-button {
  display: flex;
  align-items: center;
  justify-content: center;
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

.article-cover {
  padding-top: 20px;

  img {
    width: 100%;
  }
}

.article-content {
  padding-top: 20px;
}
</style>
