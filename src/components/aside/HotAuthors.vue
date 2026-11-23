<template>
  <div v-if="list.length" class="side-card">
    <header class="side-card-header">🎖️ {{ $t('common.authorList') }}</header>
    <a-divider class="side-card-divider" />
    <a-list item-layout="horizontal" :data-source="list" :split="false">
      <template #renderItem="{ item }">
        <a-list-item class="author-item" @click="openUser(item.id)">
          <a-list-item-meta :description="item.intro">
            <template #title>
              <span class="author-title">
                <span>{{ item.name }}</span>
                <img :src="levelIcon(item.level)" alt="等级" @click.stop="openBook" />
              </span>
            </template>
            <template #avatar>
              <a-avatar :src="item.picture || defaultAvatar" />
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
    <a-divider class="side-card-divider" />
    <div class="side-card-more" @click="openFullList">
      <a>
        {{ $t('common.fullList') }}
        <RightOutlined />
      </a>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { RightOutlined } from '@ant-design/icons-vue'
import userApi from '@/api/user'
import { levelIcon } from '@/utils'
import { toastError } from '@/utils/feedback'
import defaultAvatar from '@/assets/img/default_avatar.png'

const router = useRouter()
const list = ref([])

function openUser(id) {
  window.open(router.resolve(`/user/${id}`).href, '_blank')
}

function openBook() {
  window.open(router.resolve('/book').href, '_blank')
}

function openFullList() {
  window.open(router.resolve('/recommended').href, '_blank')
}

onMounted(async () => {
  try {
    const res = await userApi.getHotAuthorsList({ currentPage: 1, pageSize: 3 })
    list.value = res.data.list || []
  } catch (error) {
    toastError(error, '作者榜加载失败')
  }
})
</script>

<style lang="less" scoped>
.author-item {
  padding: 8px 15px;
  cursor: pointer;

  &:hover {
    background: #8b87870a;
  }

  :deep(.ant-list-item-meta) {
    align-items: center;
  }

  :deep(.ant-list-item-meta-description) {
    display: -webkit-box;
    overflow: hidden;
    color: #909090;
    font-size: 10px;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
}

.author-title {
  display: flex;
  align-items: baseline;

  img {
    height: 14px;
    margin-left: 2px;
  }
}
</style>
