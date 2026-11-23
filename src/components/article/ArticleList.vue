<template>
  <div id="article-list" class="article-list">
    <a-list item-layout="vertical" :data-source="data" :split="false">
      <template #renderItem="{ item }">
        <a-list-item class="article-item" @click="openDetail(item.id)">
          <template #actions>
            <span class="action-item">
              <EyeOutlined class="action-icon" />
              <span>{{ item.pv }}</span>
            </span>
            <span class="action-item" @click.stop="toggleLike(item)">
              <LikeOutlined class="action-icon" :style="isLiked(item) ? { color: app.themeColor } : null" />
              <span :style="isLiked(item) ? { color: app.themeColor } : null">{{ item.articleCountDTO.likeCount }}</span>
            </span>
            <span class="action-item" @click.stop="openComment(item.id)">
              <MessageOutlined class="action-icon" />
              <span>{{ item.articleCountDTO.commentCount }}</span>
            </span>
            <span v-if="canOperate(item)" class="action-item" @click.stop>
              <a-dropdown :trigger="['click']" placement="bottom">
                <EllipsisOutlined class="action-icon" />
                <template #overlay>
                  <a-menu>
                    <a-menu-item
                      v-if="isAdminAudit && (item.state === -1 || item.state !== 1)"
                      key="pass"
                      @click="changeState(item, 1)"
                    >
                      <span style="color: #3eaf7c">{{ $t('common.pass') }}</span>
                    </a-menu-item>
                    <a-menu-item
                      v-if="isAdminAudit && (item.state === -1 || item.state !== 0)"
                      key="reject"
                      @click="changeState(item, 0)"
                    >
                      <span style="color: red">{{ $t('common.reject') }}</span>
                    </a-menu-item>
                    <a-menu-item v-if="isAdminAudit && !item.top" key="top" @click="setTop(item, true)">
                      <span style="color: #1869ff">{{ $t('common.isTop') }}</span>
                    </a-menu-item>
                    <a-menu-item v-if="isAdminAudit && item.top" key="untop" @click="setTop(item, false)">
                      <span style="color: #eb2f96">{{ $t('common.isNotTop') }}</span>
                    </a-menu-item>
                    <a-menu-item v-if="isOwner(item)" key="edit" @click="router.push(`/edit/${item.id}`)">
                      <span style="color: #722ed1">{{ $t('common.edit') }}</span>
                    </a-menu-item>
                    <a-menu-item v-if="isOwner(item)" key="delete" @click="removeArticle(item)">
                      <span style="color: red">{{ $t('common.delete') }}</span>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </span>
          </template>

          <template #extra>
            <div v-if="item.titleMap || (item.labelDTOS && item.labelDTOS.length)" class="article-extra">
              <div class="article-labels">
                <template v-for="(label, index) in item.labelDTOS" :key="label.id">
                  <a @click.stop="openLabel(label.id)">{{ label.labelName }}</a>
                  <span v-if="index !== 0" class="label-divider">|</span>
                </template>
              </div>
              <img v-if="item.titleMap" :src="item.titleMap" alt="题图" class="article-cover" />
            </div>
          </template>

          <a-list-item-meta>
            <template #title>
              <div class="article-title-row" @click.stop="openUser(item.createUser)">
                <div class="article-author">
                  <span class="author-name">{{ item.createUserName }}</span>
                  <img :src="levelIcon(item.level)" alt="等级" class="level-icon" @click.stop="openBook" />
                  <small class="article-time">{{ showtime(item.createTime) }}</small>
                  <template v-if="isUserCenter && (isOwner(item) || user.isManage)">
                    <small v-if="item.state === -1" class="state state-pending">{{ $t('common.pendingReview') }}</small>
                    <small v-if="item.state === 0" class="state state-rejected">{{ $t('common.auditReviewRejected') }}</small>
                    <small v-if="item.state === 1" class="state state-approved">{{ $t('common.auditApproved') }}</small>
                  </template>
                </div>
                <a-tooltip v-if="item.top" placement="left" :title="$t('common.top')">
                  <FireOutlined :style="{ color: app.themeColor }" />
                </a-tooltip>
              </div>
            </template>
            <template #avatar>
              <a-avatar
                :src="item.picture || defaultAvatar"
                class="article-avatar"
                @click.stop="openUser(item.createUser)"
              />
            </template>
            <template #description>
              <span class="article-title">{{ item.title }}</span>
            </template>
          </a-list-item-meta>

          <div class="article-excerpt">{{ item.content }}</div>
        </a-list-item>
      </template>
    </a-list>

    <div v-if="finish && !hasNext && data.length" class="list-end">
      <a-divider />
      {{ $t('common.noAgain') }}
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { EllipsisOutlined, EyeOutlined, FireOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue'
import userApi from '@/api/user'
import articleApi from '@/api/article'
import { levelIcon, showtime } from '@/utils'
import { confirmAction, message, toastError } from '@/utils/feedback'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { translate as t } from '@/i18n'
import defaultAvatar from '@/assets/img/default_avatar.png'

const props = defineProps({
  data: { type: Array, default: () => [] },
  finish: { type: Boolean, default: false },
  hasNext: { type: Boolean, default: false },
  // 用户中心场景：展示文章审核状态
  isUserCenter: { type: Boolean, default: false },
  // 管理员首页审核场景
  isAdminAudit: { type: Boolean, default: false }
})
const emit = defineEmits(['update-data', 'article-top', 'refresh'])

const app = useAppStore()
const user = useUserStore()
const router = useRouter()

function isOwner(item) {
  return user.isLogin && user.userId === item.createUser
}

function canOperate(item) {
  return (props.isAdminAudit && user.isManage) || isOwner(item)
}

function isLiked(item) {
  return Boolean(item.articleCountDTO && item.articleCountDTO.isLike)
}

function openDetail(id) {
  window.open(router.resolve(`/detail/${id}`).href, '_blank')
}

function openComment(id) {
  window.open(router.resolve(`/detail/${id}#article-comment-all`).href, '_blank')
}

function openUser(id) {
  window.open(router.resolve(`/user/${id}`).href, '_blank')
}

function openLabel(id) {
  window.open(router.resolve(`/label/${id}`).href, '_blank')
}

function openBook() {
  window.open(router.resolve('/book').href, '_blank')
}

async function toggleLike(item) {
  if (!user.isLogin) {
    user.openLogin()
    return
  }
  try {
    await userApi.updateLikeState({ articleId: item.id })
    const count = item.articleCountDTO
    count.isLike = !count.isLike
    count.likeCount += count.isLike ? 1 : -1
  } catch (error) {
    toastError(error, '操作失败')
  }
}

function changeState(item, state) {
  confirmAction({
    title: t('common.confirmReject'),
    onOk: async () => {
      try {
        await articleApi.updateState({ id: item.id, state })
        const next = props.data.filter((article) => article.id !== item.id)
        emit('update-data', next)
        message.success(t('common.approvalSuccessed'))
      } catch (error) {
        toastError(error)
      }
    }
  })
}

function setTop(item, top) {
  confirmAction({
    title: top ? t('common.confirmTop') : t('common.confirmNotTop'),
    onOk: async () => {
      try {
        await articleApi.articleTop({ id: item.id, top })
        message.success(top ? t('common.topSuccessed') : t('common.notTopSuccessed'))
        emit('article-top')
      } catch (error) {
        toastError(error)
      }
    }
  })
}

function removeArticle(item) {
  confirmAction({
    title: t('common.deleteArticleTitle'),
    content: t('common.deletePrompt'),
    onOk: async () => {
      try {
        await articleApi.remove(item.id)
        message.success(t('common.delete') + '成功')
        emit('update-data', props.data.filter((article) => article.id !== item.id))
        emit('refresh')
      } catch (error) {
        toastError(error)
      }
    }
  })
}
</script>

<style lang="less" scoped>
.article-list {
  background: #fff;
}

.article-item {
  padding: 20px;
  cursor: pointer;

  &:hover {
    background: #f4f5f57a;
  }

  :deep(.ant-list-item-main) {
    min-width: 0;
    width: 50%;
  }

  :deep(.ant-list-item-action) {
    margin-left: 0;
  }

  :deep(.ant-list-item-action > li) {
    padding: 0 12px;
  }

  :deep(.ant-list-item-action-split) {
    display: none;
  }
}

.action-item {
  display: inline-flex;
  align-items: center;
  color: #8a919f;
  transition: color 0.2s;

  &:hover {
    color: #13c2c2;
  }
}

.action-icon {
  margin-right: 6px;
}

.article-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.article-author {
  display: flex;
  align-items: baseline;
  min-width: 0;
}

.author-name {
  padding-right: 2px;
}

.level-icon {
  height: 16px;
  margin-right: 6px;
}

.article-time {
  color: #b5b9b9;
}

.state {
  padding-left: 10px;
  font-size: 12px;
}

.state-pending {
  color: #faad14;
}

.state-rejected {
  color: red;
}

.state-approved {
  color: #3eaf7c;
}

.article-avatar {
  cursor: pointer;
}

.article-title {
  display: block;
  overflow: hidden;
  color: #1d2129;
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.article-excerpt {
  display: -webkit-box;
  overflow: hidden;
  color: #4e5969;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.article-extra {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.article-labels {
  color: #8a919f;

  a {
    color: #8a919f;

    &:hover {
      color: #13c2c2;
    }
  }
}

.label-divider {
  padding: 0 6px;
  color: #d9d9d9;
}

.article-cover {
  width: 150px;
  max-height: 113px;
  margin-top: 10px;
  object-fit: cover;
}

.list-end {
  padding-bottom: 20px;
  text-align: center;
}

@media screen and (max-width: 576px) {
  .article-item :deep(.ant-list-item-extra) {
    display: none;
  }

  .article-cover {
    display: none;
  }
}
</style>
