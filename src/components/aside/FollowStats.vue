<template>
  <div class="follow-stats side-card">
    <div class="stat">
      <span>{{ $t('common.follow') }}</span>
      <b>{{ data.followCount || 0 }}</b>
    </div>
    <a-divider type="vertical" />
    <div class="stat">
      <span>{{ $t('common.fan') }}</span>
      <b>{{ data.fanCount || 0 }}</b>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import userApi from '@/api/user'
import { toastError } from '@/utils/feedback'

const props = defineProps({
  userId: { type: Number, default: 0 }
})

const data = reactive({ followCount: 0, fanCount: 0 })

onMounted(async () => {
  if (!props.userId) return
  try {
    const res = await userApi.getFollowCount({ userId: props.userId })
    Object.assign(data, res.data || {})
  } catch (error) {
    toastError(error, '关注数据加载失败')
  }
})
</script>

<style lang="less" scoped>
.follow-stats {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 15px 0;

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 25px;
  }
}
</style>
