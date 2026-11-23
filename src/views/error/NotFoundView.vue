<template>
  <AppLayout :max-width="1100">
    <div class="not-found">
      <img src="@/assets/img/404.svg" alt="404" />
      <a-button type="dashed" @click="router.push('/')">{{ $t('common.backHome') }}</a-button>
    </div>
  </AppLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()
</script>

<style lang="less" scoped>
.not-found {
  width: 100%;
  padding: 60px 0;
  background: #fff;
  text-align: center;

  img {
    width: 60%;
    max-width: 480px;
  }
}
</style>
