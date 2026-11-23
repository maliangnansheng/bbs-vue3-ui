<template>
  <div class="audit-switcher" :class="{ 'is-collapsed': app.collapsed }">
    <a-badge :count="counts.enableCount" :overflow-count="999" :number-style="{ backgroundColor: '#07c19a', boxShadow: 'none' }">
      <div
        class="audit-item"
        :class="{ active: user.articleCheck === 'enable' }"
        title="审核通过"
        @click="select('enable')"
      >
        <CheckCircleOutlined style="color: #07c19a; font-size: 20px" />
      </div>
    </a-badge>

    <a-badge :count="counts.disabledCount" :overflow-count="999" :number-style="{ backgroundColor: 'red', boxShadow: 'none' }">
      <div
        class="audit-item"
        :class="{ active: user.articleCheck === 'disabled' }"
        title="审核拒绝"
        @click="select('disabled')"
      >
        <CloseCircleOutlined style="color: red; font-size: 20px" />
      </div>
    </a-badge>

    <a-badge
      :count="counts.pendingReviewCount"
      :overflow-count="999"
      :number-style="{ backgroundColor: '#faad14', boxShadow: 'none' }"
    >
      <div
        class="audit-item"
        :class="{ active: user.articleCheck === 'pendingReview' }"
        title="待审核"
        @click="select('pendingReview')"
      >
        <PauseCircleOutlined style="color: #faad14; font-size: 20px" />
      </div>
    </a-badge>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { CheckCircleOutlined, CloseCircleOutlined, PauseCircleOutlined } from '@ant-design/icons-vue'
import articleApi from '@/api/article'
import { toastError } from '@/utils/feedback'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const emit = defineEmits(['change'])
const app = useAppStore()
const user = useUserStore()

const counts = reactive({ enableCount: 0, disabledCount: 0, pendingReviewCount: 0 })

async function refresh(title) {
  try {
    const res = await articleApi.getArticleCheckCount({ title })
    Object.assign(counts, res.data || {})
  } catch (error) {
    toastError(error, '审核数据加载失败')
  }
}

function select(value) {
  user.articleCheck = value
  emit('change', value)
}

defineExpose({ refresh })
</script>

<style lang="less" scoped>
.audit-switcher {
  position: fixed;
  top: 100px;
  left: calc(50% - 620px);
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .audit-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    transition: background 0.2s;

    &.active {
      background: #000;
      box-shadow: 10px 10px 19px #489dcf, -2px -2px 19px #62d5ff;
    }
  }
}

@media screen and (max-width: 1240px) {
  .audit-switcher {
    display: none;
  }
}
</style>
