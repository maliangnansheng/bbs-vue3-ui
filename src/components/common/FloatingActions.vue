<template>
  <div class="floating-actions">
    <a-tooltip placement="left" :title="$t('common.backToTop')">
      <div class="floating-action" @click="backToTop">
        <i class="iconfont icon-backTop" :style="{ color: app.themeColor }"></i>
      </div>
    </a-tooltip>

    <a-tooltip placement="left" :title="$t('common.feedback')">
      <div class="floating-action" @click="openFeedback">
        <i class="iconfont icon-bug" style="color: red"></i>
      </div>
    </a-tooltip>

    <a-tooltip placement="left" :title="$t('common.githubCode')">
      <div class="floating-action" @click="openExternal('https://github.com/maliangnansheng/bbs-springboot')">
        <i class="iconfont icon-GitHub" style="color: #000"></i>
      </div>
    </a-tooltip>

    <a-tooltip placement="left" :title="$t('common.giteeCode')">
      <div class="floating-action" @click="openExternal('https://gitee.com/maliangnansheng/bbs-springboot')">
        <i class="iconfont icon-gitee" style="color: #c71d23"></i>
      </div>
    </a-tooltip>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const app = useAppStore()
const user = useUserStore()

function backToTop() {
  const container = document.querySelector('#app')
  if (container) container.scrollTo({ top: 0, behavior: 'smooth' })
}

function openExternal(url) {
  window.open(url, '_blank')
}

function openFeedback() {
  if (!user.isLogin) {
    user.openLogin()
    return
  }
  window.open(`${app.manageDomain}/createFeedback`, '_blank')
}
</script>

<style lang="less" scoped>
.floating-actions {
  position: fixed;
  right: 24px;
  bottom: 60px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .floating-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
    }

    .iconfont {
      font-size: 18px;
    }
  }
}

@media screen and (max-width: 1000px) {
  .floating-actions {
    display: none;
  }
}
</style>
