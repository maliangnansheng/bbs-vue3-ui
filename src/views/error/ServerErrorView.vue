<template>
  <AppLayout :max-width="1100">
    <a-result status="500" title="500" :sub-title="$t('common.serverError')">
      <template #extra>
        <a-button type="primary" @click="router.push('/')">{{ $t('common.backHome') }}</a-button>
      </template>
    </a-result>
  </AppLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()
</script>
