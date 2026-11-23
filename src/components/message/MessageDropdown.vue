<template>
  <div class="message-panel" @click.stop>
    <a-tabs v-model:active-key="activeKey" size="small" @change="load">
      <a-tab-pane v-for="tab in tabs" :key="tab.key">
        <template #tab>
          <span>
            {{ tab.title }}
            <span v-if="tab.count" class="message-tab-count">({{ tab.count }})</span>
          </span>
        </template>

        <div class="message-list">
          <a-empty v-if="!isLoading && !lists[tab.key].length" description="暂无消息" />
          <div v-for="item in lists[tab.key]" :key="item.id" class="message-item">
            <img class="message-icon" :src="tab.key === 'task' ? notificationIcon : messageIcon" alt="" />
            <div class="message-content">
              <a-tooltip :title="item.message">
                <div class="message-text">{{ item.message }}</div>
              </a-tooltip>
              <div class="message-time">{{ datetime(item.createTime) }}</div>
            </div>
          </div>
        </div>

        <div class="message-footer">
          <a :class="{ disabled: !lists[tab.key].length }" @click.prevent="markAllRead(tab.type)">
            {{ $t('common.makeAllRead') }}
          </a>
          <a @click.prevent="viewMore">{{ $t('common.more') }}</a>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import messageApi from '@/api/message'
import { datetime } from '@/utils'
import { toastError } from '@/utils/feedback'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import messageIcon from '@/assets/img/message/header-message.svg'
import notificationIcon from '@/assets/img/message/notification.svg'

const app = useAppStore()
const user = useUserStore()

const activeKey = ref('task')
const isLoading = ref(false)
const lists = reactive({ task: [], message: [] })

const tabs = computed(() => [
  { key: 'task', type: 0, title: '任务提醒', count: Number(user.taskNotifyCount || 0) },
  { key: 'message', type: 1, title: '公告通知', count: Number(user.systemNotifyCount || 0) }
])

async function load(key = activeKey.value) {
  const tab = tabs.value.find((item) => item.key === key) || tabs.value[0]
  isLoading.value = true
  try {
    const res = await messageApi.getMessageList({ current: 1, size: 10, type: tab.type, isRead: false })
    lists[tab.key] = res.data.list || []
  } catch (error) {
    toastError(error, '消息加载失败')
  } finally {
    isLoading.value = false
  }
}

async function markAllRead(type) {
  try {
    await messageApi.makeAllRead({ type })
    await load(activeKey.value)
  } catch (error) {
    toastError(error, '操作失败')
  }
}

function viewMore() {
  window.open(`${app.manageDomain}/messages`, '_blank')
}

onMounted(() => {
  load(activeKey.value)
})
</script>

<style lang="less">
.message-panel {
  width: 320px;
  padding: 4px 12px 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);

  .message-list {
    max-height: 300px;
    overflow-y: auto;
  }

  .message-item {
    display: flex;
    padding: 8px 0;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      border-bottom: 0;
    }
  }

  .message-icon {
    width: 18px;
    height: 18px;
    margin-top: 2px;
    margin-right: 8px;
  }

  .message-content {
    flex: 1;
    min-width: 0;
  }

  .message-text {
    display: -webkit-box;
    overflow: hidden;
    color: #333;
    font-size: 13px;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .message-time {
    margin-top: 2px;
    color: #b5b9b9;
    font-size: 12px;
  }

  .message-tab-count {
    color: #ff4d4f;
  }

  .message-footer {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-top: 1px solid #f0f0f0;

    .disabled {
      color: #bfbfbf;
      pointer-events: none;
    }
  }
}
</style>
