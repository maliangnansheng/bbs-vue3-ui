<template>
  <div class="site-footer">
    <div class="site-footer-links">
      <a-tooltip placement="bottom" :title="$t('common.getTheWord')">
        <div class="footer-link" @click="openDesignDoc">{{ $t('common.designDocument') }}</div>
      </a-tooltip>
      <a class="footer-link" href="https://www.bilibili.com/video/BV1he4y1C7rk" target="_blank" rel="noopener">
        {{ $t('common.userGuidance') }}
      </a>
      <a class="footer-link" href="https://juejin.cn/" target="_blank" rel="noopener">{{ $t('common.links') }}</a>
      <a class="footer-link" href="/about" target="_blank">{{ $t('common.about') }}</a>
    </div>
    <div class="site-footer-copyright">
      版权 ©
      <a href="/" target="_blank">南生论坛</a>
      丨
      <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener">蜀ICP备19014736号-1</a>
    </div>
  </div>
</template>

<script setup>
function openDesignDoc() {
  window.open(
    'https://76.nansin.top/doc/%E5%8D%97%E7%94%9F%E8%AE%BA%E5%9D%9B%E7%9A%84%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0.doc',
    '_blank'
  )
}
</script>

<style lang="less" scoped>
.site-footer {
  padding: 10px 8px;
  background: #fff;
  font-size: 12px;
  line-height: 2;
  text-align: center;

  a,
  .footer-link {
    color: #909090;
    cursor: pointer;

    &:hover {
      color: #13c2c2;
    }
  }
}

.site-footer-links {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.site-footer-copyright {
  color: #909090;
}
</style>
