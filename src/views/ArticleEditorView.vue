<template>
  <div id="write-article">
    <div class="write-toolbar">
      <a-input
        v-model:value="title"
        class="write-title"
        size="large"
        :maxlength="100"
        :placeholder="$t('common.enterArticleTitle')"
      />

      <ArticlePublishPopover
        v-if="ready"
        class="write-publish"
        :title="title"
        :markdown="markdown"
        :html="html"
        :default-label-ids="labelIds"
        :default-cover="coverUrl"
      />

      <SwapOutlined class="write-icon" :style="{ color: app.themeColor }" />

      <a-tooltip placement="bottom" :title="$t('common.homePage')">
        <a-avatar :size="46" :src="user.picture || defaultAvatar" class="write-avatar" @click="openHome" />
      </a-tooltip>
    </div>

    <div class="write-editor">
      <MdEditor
        v-if="ready"
        v-model="markdown"
        :toolbars="toolbars"
        :placeholder="$t('common.startEditing')"
        preview-theme="github"
        code-theme="github"
        :footers="['markdownTotal', '=', 'scrollSwitch']"
        :no-mermaid="true"
        :no-echarts="true"
        @on-upload-img="onUploadImg"
        @on-html-changed="onHtmlChanged"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MdEditor, allToolbar } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { SwapOutlined } from '@ant-design/icons-vue'
import ArticlePublishPopover from '@/components/article/ArticlePublishPopover.vue'
import articleApi from '@/api/article'
import { MAX_IMAGE_SIZE } from '@/utils'
import { message, toastError } from '@/utils/feedback'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { translate as t } from '@/i18n'
import defaultAvatar from '@/assets/img/default_avatar.png'

const app = useAppStore()
const user = useUserStore()
const route = useRoute()
const router = useRouter()

const title = ref('')
const markdown = ref('')
const html = ref('')
const labelIds = ref([])
const coverUrl = ref('')
const ready = ref(false)

const isEdit = computed(() => Boolean(route.params.id))

// 精简工具栏：去掉需要 CDN 的 mermaid / katex 以及保存、GitHub 相关按钮
const excludedToolbars = ['mermaid', 'katex', 'save', 'github', 'prettier', 'htmlPreview']
const toolbars = allToolbar.filter((name) => !excludedToolbars.includes(name))

function openHome() {
  if (!user.isLogin) {
    user.openLogin()
    return
  }
  window.open(router.resolve(`/user/${user.userId}`).href, '_blank')
}

/** 编辑器内上传图片 */
async function onUploadImg(files, callback) {
  const urls = []
  for (const file of files) {
    if (file.size > MAX_IMAGE_SIZE) {
      message.warning(t('common.avatarSizeTip'))
      continue
    }
    const data = new FormData()
    data.append('picture', file)
    try {
      const res = await articleApi.uploadPicture(data)
      urls.push(res.data)
    } catch (error) {
      toastError(error, '图片上传失败')
    }
  }
  callback(urls)
}

function onHtmlChanged(value) {
  html.value = value
}

async function bootstrap() {
  // 未登录不允许进入编辑器
  await user.ensureUser()
  if (!user.isLogin) {
    user.openLogin()
    router.replace('/')
    return
  }

  if (!isEdit.value) {
    ready.value = true
    return
  }

  try {
    const res = await articleApi.getById({ id: route.params.id })
    const article = res.data || {}
    if (article.createUser !== user.userId) {
      message.warning('你无权编辑他人撰写的文章')
      router.replace('/')
      return
    }
    title.value = article.title || ''
    markdown.value = article.markdown || ''
    html.value = article.html || ''
    coverUrl.value = article.titleMap || ''
    labelIds.value = (article.labelDTOS || []).map((item) => item.id)
    ready.value = true
  } catch (error) {
    if (error.code === 4) {
      router.replace({
        name: 'notFound',
        params: { pathMatch: route.path.substring(1).split('/') }
      })
      return
    }
    toastError(error, '文章加载失败')
  }
}

onMounted(bootstrap)
</script>

<style lang="less">
/* 与 bbs-vue-ui 的 WriteArticle 保持一致：标题占满、操作按钮在右 */
#write-article {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: #fff;

  .write-toolbar {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    height: 8%;
    min-height: 64px;
    padding: 0;
    background: #fff;
  }

  .write-title {
    flex: 1 1 auto;
    width: auto;
    min-width: 0;
    height: 50px;
    margin: 0 15px;
    padding: 0;
    border: none;
    font-size: 26px;
    box-shadow: none;
  }

  .write-publish,
  .write-icon,
  .write-avatar {
    flex: 0 0 auto;
    margin: 0 15px;
  }

  .write-icon {
    font-size: 14px;
  }

  .write-avatar {
    cursor: pointer;
  }

  .write-editor {
    flex: 1 1 auto;
    min-height: 0;

    .md-editor {
      height: 100%;
      border: 0;
      border-radius: 0;
    }

    /* 与 bbs-vue-ui 的 mavon 工具栏底色一致 */
    .md-editor-toolbar-wrapper {
      background: #f4f4f4;
    }
  }
}
</style>
