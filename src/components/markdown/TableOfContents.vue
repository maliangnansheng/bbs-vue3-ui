<template>
  <div class="toc-card side-card">
    <header class="side-card-header">{{ $t('common.toc') }}</header>
    <a-divider class="side-card-divider" />
    <div class="toc-body">
      <MdCatalog
        :editor-id="editorId"
        :md-heading-id="headingId"
        :scroll-element="'#app'"
        :scroll-element-offset-top="80"
        :offset-top="10"
      />
    </div>
  </div>
</template>

<script setup>
import { MdCatalog } from 'md-editor-v3'
import { markdownHeadingId } from '@/utils/markdown'

defineProps({
  editorId: { type: String, default: 'article-preview' }
})

const headingId = markdownHeadingId
</script>

<style lang="less">
.toc-card {
  padding-bottom: 10px;

  .toc-body {
    max-height: 640px;
    overflow-y: auto;
  }

  .md-editor-catalog {
    padding-left: 4px;
  }

  .md-editor-catalog-link span {
    color: #333;
    font-size: 14px;
  }

  .md-editor-catalog-active > span {
    color: #0366d6;
    font-weight: 700;
  }

  .md-editor-catalog-indicator {
    background-color: #0366d6;
  }
}
</style>
