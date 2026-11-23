<template>
  <MdPreview
    :id="editorId"
    :model-value="content"
    preview-theme="github"
    code-theme="github"
    :md-heading-id="headingId"
    :no-mermaid="true"
    :no-echarts="true"
    class="markdown-preview"
  />
</template>

<script setup>
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { markdownHeadingId } from '@/utils/markdown'

defineProps({
  content: { type: String, default: '' },
  editorId: { type: String, default: 'article-preview' }
})

const headingId = markdownHeadingId
</script>

<style lang="less">
.markdown-preview {
  background: #fff;

  .md-editor-preview-wrapper {
    padding: 0;
  }

  .md-editor-preview {
    font-size: 16px;
    line-height: 1.8;
  }

  // 代码块复制按钮位置微调
  .md-editor-code .copy-button {
    opacity: 0.6;
  }
}
</style>
