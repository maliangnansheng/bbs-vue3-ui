<template>
  <div class="comment-editor">
    <a-textarea
      v-model:value="content"
      :placeholder="$t('common.commentPlaceholder')"
      :auto-size="{ minRows: 3, maxRows: 10 }"
      allow-clear
      @keydown="onKeydown"
    />
    <div class="comment-editor-footer">
      <a-button v-if="preId" size="small" type="text" @click="emit('cancel')">
        {{ $t('common.cancelReply') }}
      </a-button>
      <a-button type="primary" :loading="loading" @click="submit">
        {{ $t('common.postComment') }}
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import commentApi from '@/api/comment'
import { message, toastError } from '@/utils/feedback'
import { useUserStore } from '@/stores/user'
import { translate as t } from '@/i18n'

const props = defineProps({
  articleId: { type: [String, Number], required: true },
  // 回复的父评论 id，0 表示直接评论文章
  preId: { type: [String, Number], default: 0 }
})
const emit = defineEmits(['refresh', 'cancel'])

const user = useUserStore()
const content = ref('')
const loading = ref(false)

function onKeydown(event) {
  // Ctrl + Enter 发送
  if (event.ctrlKey && (event.key === 'Enter' || event.keyCode === 13)) {
    submit()
  }
}

async function submit() {
  if (!user.isLogin) {
    user.openLogin()
    return
  }
  const text = content.value.trim()
  if (!text) {
    message.warning(t('common.pleaseEnterComment'))
    return
  }
  loading.value = true
  try {
    await commentApi.create({
      articleId: props.articleId,
      preId: props.preId || 0,
      content: text
    })
    content.value = ''
    emit('refresh')
    emit('cancel')
  } catch (error) {
    toastError(error, '评论失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
.comment-editor-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}
</style>
