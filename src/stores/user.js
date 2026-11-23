import { ref } from 'vue'
import { defineStore } from 'pinia'
import userApi from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false)
  const userId = ref(0)
  const picture = ref('')
  const isManage = ref(false)
  // 首页文章审核状态：enable / disabled / pendingReview
  const articleCheck = ref('enable')

  const loginVisible = ref(false)
  const registerVisible = ref(false)
  const mobileResetPasswordVisible = ref(false)
  const emailResetPasswordVisible = ref(false)

  const systemNotifyCount = ref(0)
  const taskNotifyCount = ref(0)

  function openLogin() {
    loginVisible.value = true
  }

  let accessPromise = null

  /** 拉取当前登录用户权限信息（未登录时后端返回 302，忽略即可） */
  async function fetchCurrentUser() {
    try {
      const res = await userApi.getCurrentUserAccess()
      if (res.code === 0 && res.data) {
        userId.value = res.data.userId
        isLogin.value = true
        isManage.value = (res.data.roles || []).some((role) => role.grade === 'NS_SUPER_ADMIN_ROLE')
      }
    } catch {
      // 未登录属正常情况，无需提示
      isLogin.value = false
    }
    return isLogin.value
  }

  /**
   * 确保已获取登录态（并发调用复用同一个请求）
   * 页面初始化时 App 与业务组件可能同时需要登录信息
   */
  function ensureUser() {
    if (isLogin.value && userId.value) return Promise.resolve(true)
    if (!accessPromise) {
      accessPromise = fetchCurrentUser().finally(() => {
        accessPromise = null
      })
    }
    return accessPromise
  }

  function reset() {
    isLogin.value = false
    userId.value = 0
    isManage.value = false
    picture.value = ''
    articleCheck.value = 'enable'
    systemNotifyCount.value = 0
    taskNotifyCount.value = 0
  }

  return {
    isLogin,
    userId,
    picture,
    isManage,
    articleCheck,
    loginVisible,
    registerVisible,
    mobileResetPasswordVisible,
    emailResetPasswordVisible,
    systemNotifyCount,
    taskNotifyCount,
    openLogin,
    fetchCurrentUser,
    ensureUser,
    reset
  }
})
