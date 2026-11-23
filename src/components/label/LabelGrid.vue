<template>
  <div class="label-grid">
    <a-empty v-if="!data.length" description="暂无标签" />
    <div v-for="item in data" :key="item.id" class="label-card">
      <a-avatar :size="60" :src="item.logo" shape="square" class="label-logo" @click="openLabel(item.id)" />
      <div class="label-name" @click="openLabel(item.id)">{{ item.labelName }}</div>
      <div class="label-count">{{ item.articleUseCount }} {{ $t('common.article') }}</div>

      <a-dropdown v-if="user.isManage" :trigger="['click']" placement="bottom">
        <EllipsisOutlined class="label-more" />
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
import { useRouter } from 'vue-router'
import { EllipsisOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

defineProps({
  data: { type: Array, default: () => [] }
})
const emit = defineEmits(['edit', 'delete'])

const user = useUserStore()
const router = useRouter()

function openLabel(id) {
  window.open(router.resolve(`/label/${id}`).href, '_blank')
}
</script>

<style lang="less" scoped>
.label-grid {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.label-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20%;
  padding: 20px;
  background: #fff;
  border-right: 20px solid #f0f2f5;
  border-bottom: 20px solid #f0f2f5;
  box-sizing: border-box;
}

.label-logo,
.label-name {
  cursor: pointer;
}

.label-name {
  padding-top: 5px;
  color: #333;
  font-size: 20px;
  line-height: 40px;
  text-align: center;
  word-break: break-all;
}

.label-count {
  color: #909090;
  font-size: 16px;
}

.label-more {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #909090;
  cursor: pointer;
}

@media screen and (max-width: 1000px) {
  .label-card {
    width: 100%;
    border-right: 0;
    border-bottom: 10px solid #f0f2f5;
  }
}
</style>
