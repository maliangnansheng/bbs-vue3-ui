<template>
  <AppLayout :max-width="800">
    <div class="book-view">
      <NanShengValue />
      <div class="block-gap"></div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import NanShengValue from '@/components/books/NanShengValue.vue'
</script>

<style lang="less" scoped>
.book-view {
  width: 100%;
}
</style>
