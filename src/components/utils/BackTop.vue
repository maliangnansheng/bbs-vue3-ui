<template>
  <div id="components-back-top-demo-custom">
    <a-back-top :visibilityHeight="600" :target="targetFn">
      <a-tooltip placement="left">
        <template #title>
          {{ $t("common.backToTop") }}
        </template>
        <div class="ant-back-top-inner" style="background: #fff">
          <i class="iconfont icon-backTop" :style="{color: $store.state.themeColor}"></i>
        </div>
      </a-tooltip>
    </a-back-top>
  </div>
</template>


<script>
  export default {
    methods: {
      targetFn() {
        // 设置监听滚动的元素
        return document.querySelector("#app");
      },
    }
  }
</script>

<style scoped>
  #components-back-top-demo-custom .ant-back-top {
    /* 44px */
    bottom: 228px;
    right: auto;
  }
  #components-back-top-demo-custom .ant-back-top-inner {
    height: 34px;
    width: 34px;
    line-height: 34px;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    font-size: 20px;
  }
</style>