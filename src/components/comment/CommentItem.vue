<template>
  <a-comment :id="`reply-${comment.id}`" class="comment-item">
    <template #author>
      <a class="comment-author" @click="openUser(comment.commentUser)">
        {{ comment.commentUserName }}
        <img :src="levelIcon(comment.level)" alt="等级" class="level-icon" @click.stop="openBook" />
        <small class="comment-time">{{ showtime(comment.createTime) }}</small>
      </a>
    </template>

    <template #avatar>
      <a-avatar :src="comment.picture || defaultAvatar" @click="openUser(comment.commentUser)" />
    </template>

    <template #content>
      <div class="comment-content" v-html="renderPlainText(comment.content)"></div>
      <div class="comment-ops">
        <a class="comment-op" @click="toggleLike">
          <i
            class="iconfont icon-like"
            :style="{ color: comment.isLike ? app.themeColor : '#8a919f' }"
          ></i>
          <small v-if="comment.likeCount">{{ comment.likeCount }}</small>
        </a>

        <a v-if="comment.depth < 2" class="comment-op" @click="toggleReply">
          <i class="iconfont icon-comment" style="color: #8a919f"></i>
          <small>{{ replying ? $t('common.cancelReply') : $t('common.reply') }}</small>
          <small v-if="comment.repliesCount">{{ comment.repliesCount }}</small>
        </a>

        <a-dropdown v-if="canDelete" :trigger="['click']" placement="bottom">
          <EllipsisOutlined class="comment-op comment-more" />
          <template #overlay>
            <a-menu>
              <a-menu-item key="delete" @click="removeComment">
                <span style="color: red">{{ $t('common.delete') }}</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </template>

    <CommentEditor
      v-if="replying"
      :article-id="articleId"
      :pre-id="comment.id"
      @refresh="emit('refresh')"
      @cancel="replying = false"
    />

    <CommentItem
      v-for="child in comment.depth < 2 ? comment.child || [] : []"
      :key="child.id"
      :comment="child"
      :article-id="articleId"
      :article-user-id="articleUserId"
      @refresh="emit('refresh')"
    />
  </a-comment>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { EllipsisOutlined } from '@ant-design/icons-vue'
import CommentEditor from './CommentEditor.vue'
import userApi from '@/api/user'
import commentApi from '@/api/comment'
import { levelIcon, renderPlainText, showtime } from '@/utils'
import { confirmAction, toastError } from '@/utils/feedback'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { translate as t } from '@/i18n'
import defaultAvatar from '@/assets/img/default_avatar.png'

const props = defineProps({
  comment: { type: Object, required: true },
  articleId: { type: [String, Number], required: true },
  articleUserId: { type: [String, Number], default: 0 }
})
const emit = defineEmits(['refresh'])

const app = useAppStore()
const user = useUserStore()
const router = useRouter()
const replying = ref(false)

const canDelete = computed(
  () => user.isLogin && (user.userId === props.comment.commentUser || user.userId === props.articleUserId)
)

function openUser(id) {
  window.open(router.resolve(`/user/${id}`).href, '_blank')
}

function openBook() {
  window.open(router.resolve('/book').href, '_blank')
}

async function toggleLike() {
  if (!user.isLogin) {
    user.openLogin()
    return
  }
  try {
    await userApi.updateLikeCommentState({ commentId: props.comment.id })
    emit('refresh')
  } catch (error) {
    toastError(error, '操作失败')
  }
}

function toggleReply() {
  if (!user.isLogin) {
    user.openLogin()
    return
  }
  replying.value = !replying.value
}

function removeComment() {
  confirmAction({
    title: t('common.deleteCommentTitle'),
    content: t('common.deletePrompt'),
    onOk: async () => {
      try {
        await commentApi.remove(props.comment.id)
        emit('refresh')
      } catch (error) {
        toastError(error)
      }
    }
  })
}
</script>

<style lang="less" scoped>
.comment-item {
  :deep(.ant-comment-inner) {
    padding: 8px 0;
  }

  :deep(.ant-comment-nested) {
    margin-left: 20px;
  }
}

.comment-author {
  font-size: 14px;
  color: #252933;
}

.level-icon {
  height: 14px;
  margin-left: 2px;
}

.comment-time {
  float: right;
  color: #b5b9b9;
  cursor: auto;
}

.comment-content {
  margin-bottom: 6px;
  color: #252933;
  word-break: break-word;
}

.comment-ops {
  display: flex;
  align-items: center;
  gap: 16px;
}

.comment-op {
  display: inline-flex;
  align-items: center;
  color: #8a919f;
  font-size: 13px;
  cursor: pointer;

  small {
    margin-left: 3px;
  }

  &:hover {
    color: #8a919fb3;
  }
}

.comment-more {
  margin-left: auto;
}
</style>
