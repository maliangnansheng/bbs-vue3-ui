<template>
  <div class="side-card donate-card">
    <header class="side-card-header">{{ $t('common.friendDonate') }}</header>
    <a-divider class="side-card-divider" />

    <div class="donate-text">
      <small>{{ $t('common.donateContent1') }}</small>
      <br />
      <small>{{ $t('common.donateContent2') }}</small>
    </div>

    <!-- 境外收款 -->
    <div v-if="app.locale !== 'zh_CN'" class="donate-overseas">
      <p><b>Where can I send money?</b></p>
      <small>Alipay Cooperative overseas remittance platform: </small>
      <a href="https://remit.alipay.com" target="_blank" rel="noopener">https://remit.alipay.com</a>
      <p><b>What information should I fill in at the money transfer platform?</b></p>
      <small>Alipay ID: </small>
      <span :style="{ color: app.themeColor }">m15680982093_1@163.com</span>
      <br />
      <small>Last Name: </small>
      <span :style="{ color: app.themeColor }">MA</span>
      <br />
      <small>First Name: </small>
      <span :style="{ color: app.themeColor }">LIANG</span>
    </div>

    <!-- 中文收款码 -->
    <a-tabs v-else size="small" class="donate-tabs">
      <a-tab-pane key="custom" tab="随意">
        <img src="https://aid.nansin.top/default/donate-weixin-custom.png" alt="微信赞赏码" />
      </a-tab-pane>
      <a-tab-pane key="99" tab="😏">
        <img src="https://aid.nansin.top/default/donate-weixin-99.png" alt="微信赞赏码" />
      </a-tab-pane>
      <a-tab-pane key="20" tab="20 元">
        <img src="https://aid.nansin.top/default/donate-weixin-20.png" alt="微信赞赏码" />
      </a-tab-pane>
      <a-tab-pane key="10" tab="10 元">
        <img src="https://aid.nansin.top/default/donate-weixin-10.png" alt="微信赞赏码" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const app = useAppStore()
</script>

<style lang="less" scoped>
.donate-text {
  padding: 12px 15px 0;

  small {
    color: #8a6d3b;
    line-height: 30px;
  }
}

.donate-overseas {
  padding: 0 15px 10px;
  font-size: 12px;

  small {
    color: #8a919f;
  }
}

.donate-tabs {
  padding: 0 10px 10px;

  img {
    width: 100%;
  }

  :deep(.ant-tabs-tab) {
    padding: 6px 8px;
  }
}
</style>
