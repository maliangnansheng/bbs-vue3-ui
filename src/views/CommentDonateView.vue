<template>
  <AppLayout :max-width="420">
    <div class="comment-donate-view">
      <LatestComments />
      <div class="block-gap"></div>
      <DonateCard />
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import LatestComments from '@/components/aside/LatestComments.vue'
import DonateCard from '@/components/aside/DonateCard.vue'
</script>

<style lang="less" scoped>
.comment-donate-view {
  width: 100%;
}
</style>
