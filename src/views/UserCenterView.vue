<template>
  <AppLayout :max-width="1100">
    <a-row>
      <a-col :span="app.collapsed ? 24 : 18" :class="{ 'main-column': !app.collapsed }">
        <CustomEmpty v-if="loading" />
        <template v-else>
          <PersonalInfoCard :data="userInfo" @refresh="load" />
          <div class="block-gap"></div>
          <UserTabs :user-id="userId" />
        </template>
      </a-col>

      <a-col v-if="!app.collapsed" :span="6">
        <PersonalAchievement :data="userInfo" />
        <div class="block-gap"></div>
        <FollowStats :user-id="userId" />
        <div class="block-gap"></div>
        <DonateCard />
        <div class="block-gap"></div>
        <SiteFooterInfo />
      </a-col>
    </a-row>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import PersonalInfoCard from '@/components/user/PersonalInfoCard.vue'
import UserTabs from '@/components/user/UserTabs.vue'
import PersonalAchievement from '@/components/aside/PersonalAchievement.vue'
import FollowStats from '@/components/aside/FollowStats.vue'
import DonateCard from '@/components/aside/DonateCard.vue'
import SiteFooterInfo from '@/components/aside/SiteFooterInfo.vue'
import CustomEmpty from '@/components/common/CustomEmpty.vue'
import userApi from '@/api/user'
import { toastError } from '@/utils/feedback'
import { useAppStore } from '@/stores/app'

const app = useAppStore()
const route = useRoute()
const router = useRouter()

const userId = computed(() => Number(route.params.id))
const userInfo = ref({})
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    const res = await userApi.getUserInfo({ userId: userId.value })
    userInfo.value = res.data || {}
  } catch (error) {
    if (error.code === 4) {
      router.replace({
        name: 'notFound',
        params: { pathMatch: route.path.substring(1).split('/') }
      })
      return
    }
    toastError(error, '用户信息加载失败')
  } finally {
    loading.value = false
  }
}

watch(userId, () => load())

onMounted(load)
</script>
