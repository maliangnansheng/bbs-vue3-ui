import request from './request'

export default {
  // 用户动态
  getDynamicList(params) {
    return request.get('/api/bbs/dynamic/getList', { params })
  }
}
