<template>
  <div class="mobile-nav">
    <MenuUnfoldOutlined class="mobile-nav-trigger" @click="visible = true" />
    <a-drawer title="Nan's BBS" placement="left" :width="240" :open="visible" :closable="false" @close="visible = false">
      <a-menu mode="inline" @click="onClick">
        <a-menu-item key="home">{{ $t('common.home') }}</a-menu-item>
        <a-menu-item key="label">{{ $t('common.label') }}</a-menu-item>
        <a-menu-item key="resource">{{ $t('common.resource') }}</a-menu-item>
        <a-menu-item key="authors">{{ $t('common.authorList') }}</a-menu-item>
        <a-menu-item key="comments">{{ $t('common.commentDonate') }}</a-menu-item>
        <a-menu-item v-if="user.isLogin" key="write">{{ $t('common.writeArticle') }}</a-menu-item>
        <a-menu-divider />
        <a-menu-item key="manage">{{ $t('common.management') }}</a-menu-item>
        <a-menu-item key="source">{{ $t('common.sourceCode') }}</a-menu-item>
        <a-menu-item key="about">{{ $t('common.about') }}</a-menu-item>
        <a-menu-divider />
        <a-menu-item key="locale">
          <GlobalOutlined />
          <span style="padding-left: 6px">{{ app.locale === 'en_US' ? '中文' : 'English' }}</span>
        </a-menu-item>
      </a-menu>
    </a-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { GlobalOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const app = useAppStore()
const user = useUserStore()
const router = useRouter()
const visible = ref(false)

const routes = {
  home: '/',
  label: '/label',
  resource: '/resource',
  authors: '/recommended',
  comments: '/commentDonate',
  write: '/write',
  about: '/about'
}

function onClick({ key }) {
  visible.value = false
  if (key === 'locale') {
    app.toggleLocale()
    return
  }
  if (key === 'manage') {
    window.open(app.manageDomain, '_blank')
    return
  }
  if (key === 'source') {
    window.open('https://github.com/maliangnansheng/bbs-springboot', '_blank')
    return
  }
  if (routes[key]) router.push(routes[key])
}
</script>

<style lang="less" scoped>
.mobile-nav {
  display: flex;
  align-items: center;
  height: 40px;
}

.mobile-nav-trigger {
  padding: 0 8px;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}
</style>
