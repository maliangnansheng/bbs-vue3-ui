<template>
  <div class="resource-grid">
    <a-empty v-if="!data.length" description="暂无资源" />
    <div v-for="item in data" :key="item.id" class="resource-card" @click="openExternal(item.link)">
      <div class="resource-head">
        <a-avatar :size="36" :src="item.logo" shape="square" />
        <div class="resource-name">{{ item.resourceName }}</div>
      </div>
      <div class="resource-desc">{{ item.desc }}</div>

      <a-dropdown v-if="user.isManage" :trigger="['click']" placement="bottom">
        <EllipsisOutlined class="resource-more" @click.stop />
        <template #overlay>
          <a-menu>
            <a-menu-item key="edit" @click="emit('edit', item)">{{ $t('common.edit') }}</a-menu-item>
            <a-menu-item key="delete" @click="emit('delete', item)">
              <span style="color: red">{{ $t('common.delete') }}</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup>
import { EllipsisOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

defineProps({
  data: { type: Array, default: () => [] }
})
const emit = defineEmits(['edit', 'delete'])
const user = useUserStore()

function openExternal(link) {
  if (link) window.open(link, '_blank')
}
</script>

<style lang="less" scoped>
.resource-grid {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.resource-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 25%;
  padding: 10px;
  background: #fff;
  border-right: 20px solid #f0f2f5;
  border-bottom: 20px solid #f0f2f5;
  box-sizing: border-box;
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
}

.resource-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.resource-name {
  color: #333;
  font-size: 18px;
  font-weight: 400;
}

.resource-desc {
  display: -webkit-box;
  padding: 10px 0;
  overflow: hidden;
  color: #909090;
  font-size: 13px;
  line-height: 20px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.resource-more {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #909090;
}

@media screen and (max-width: 1000px) {
  .resource-card {
    width: 100%;
    border-right: 0;
    border-bottom: 10px solid #f0f2f5;
  }
}
</style>
