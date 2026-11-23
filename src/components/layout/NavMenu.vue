<template>
  <div class="header-nav">
    <a-menu :selected-keys="selectedKeys" mode="horizontal" @click="onClick">
      <a-menu-item key="home">{{ $t('common.home') }}</a-menu-item>
      <a-menu-item key="label">{{ $t('common.label') }}</a-menu-item>
      <a-menu-item key="resource">{{ $t('common.resource') }}</a-menu-item>
      <a-sub-menu key="source">
        <template #title>{{ $t('common.sourceCode') }}</template>
        <a-menu-item key="github-backend">
          <a href="https://github.com/maliangnansheng/bbs-springboot" target="_blank" rel="noopener">
            <i class="iconfont icon-GitHub source-icon"></i>
            <b>{{ $t('common.backEnd') }}</b>{{ $t('common.sourceCode') }}
          </a>
        </a-menu-item>
        <a-menu-item key="github-frontend">
          <a href="https://github.com/maliangnansheng/bbs-vue-ui" target="_blank" rel="noopener">
            <i class="iconfont icon-GitHub source-icon"></i>
            <b>{{ $t('common.frontEnd') }}</b>{{ $t('common.sourceCode') }}
          </a>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="gitee-backend">
          <a href="https://gitee.com/maliangnansheng/bbs-springboot" target="_blank" rel="noopener">
            <i class="iconfont icon-gitee gitee-icon"></i>
            <b>{{ $t('common.backEnd') }}</b>{{ $t('common.sourceCode') }}
          </a>
        </a-menu-item>
        <a-menu-item key="gitee-frontend">
          <a href="https://gitee.com/maliangnansheng/bbs-vue-ui" target="_blank" rel="noopener">
            <i class="iconfont icon-gitee gitee-icon"></i>
            <b>{{ $t('common.frontEnd') }}</b>{{ $t('common.sourceCode') }}
          </a>
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item key="about">{{ $t('common.about') }}</a-menu-item>
    </a-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const selectedKeys = computed(() => {
  switch (route.name) {
    case 'home':
    case 'search':
      return ['home']
    case 'label':
    case 'labelDetail':
      return ['label']
    case 'resource':
      return ['resource']
    case 'about':
      return ['about']
    default:
      return []
  }
})

function onClick({ key }) {
  if (key === 'home') router.push('/')
  if (key === 'label') router.push('/label')
  if (key === 'resource') router.push('/resource')
  if (key === 'about') router.push('/about')
}
</script>

<style lang="less" scoped>
.header-nav {
  display: flex;
  align-items: center;
  height: 100%;
  min-width: 0;

  :deep(.ant-menu-horizontal) {
    background: transparent;
    border-bottom: 0;
    line-height: 46px;
  }

  /* 去掉选中态下划线（与 bbs-vue-ui 一致） */
  :deep(.ant-menu-horizontal > .ant-menu-item),
  :deep(.ant-menu-horizontal > .ant-menu-submenu) {
    top: 0;
    padding: 0 16px;
    border-bottom: 0;
  }
}

.source-icon {
  margin-right: 2px;
  color: #000;
}

.gitee-icon {
  margin-right: 2px;
  color: #c71d23;
}
</style>
