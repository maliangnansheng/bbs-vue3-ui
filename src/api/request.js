import axios from 'axios'
import { useUserStore } from '@/stores/user'

/**
 * 统一请求实例
 * 后端约定：HTTP 200 且响应体 code === 0 表示成功，其余情况 code 为业务错误码，
 * code === 302 表示未登录（需要弹出登录框）。
 */
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '',
  timeout: 20000,
  withCredentials: true
})

function handleUnauthorized() {
  const user = useUserStore()
  user.isLogin = false
  user.loginVisible = true
}

request.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

request.interceptors.response.use(
  (response) => {
    const user = useUserStore()
    const { headers, config, data: body } = response

    // 后端在响应头回传头像、未读消息数量，用于全局状态同步
    if (headers['x-user-picture']) user.picture = headers['x-user-picture']
    if (headers['x-system-notify-count'] !== undefined) {
      user.systemNotifyCount = Number(headers['x-system-notify-count'])
    }
    if (headers['x-task-notify-count'] !== undefined) {
      user.taskNotifyCount = Number(headers['x-task-notify-count'])
    }

    if (!body) {
      return Promise.reject({ code: -1, desc: '服务响应异常，请稍后重试' })
    }
    if (body.code === 0) {
      return body
    }
    // 权限接口的 302 属于「未登录」的正常返回，交给调用方处理
    if (body.code === 302 && !String(config.url).includes('/user/getCurrentUserRights')) {
      handleUnauthorized()
    }
    return Promise.reject(body)
  },
  (error) => {
    if (error.response) {
      const body = error.response.data
      if (body && body.code === 302) {
        handleUnauthorized()
      }
      return Promise.reject(body && body.desc ? body : { code: error.response.status, desc: `请求失败（${error.response.status}）` })
    }
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({ code: -1, desc: '请求超时，请稍后重试' })
    }
    return Promise.reject({ code: -1, desc: '网络异常，请检查网络或后端服务是否正常' })
  }
)

/** 从异常对象中取出可展示给用户的文案 */
export function errorText(error, fallback = '操作失败') {
  return (error && error.desc) || fallback
}

export default request
