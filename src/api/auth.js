import request from './request'

export default {
  // 注册
  register(data) {
    return request.post('/api/bbs/sso/register', data)
  },
  // 登录
  login(data) {
    return request.post('/api/bbs/sso/login', data)
  },
  // 退出登录
  logout() {
    return request.get('/api/bbs/sso/logout')
  }
}
