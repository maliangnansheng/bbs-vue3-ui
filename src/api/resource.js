import request from './request'

export default {
  // 资源导航列表
  getResourceList(params) {
    return request.get('/api/bbs/resource/getList', { params })
  },
  // 资源分类
  getCategorys() {
    return request.get('/api/bbs/resource/getCategorys')
  },
  // 上传资源 logo
  uploadResourceLogo(data) {
    return request.post('/api/bbs/resource/uploadResourceLogo', data)
  },
  // 新增资源
  create(data) {
    return request.post('/api/bbs/resource/create', data)
  },
  // 更新资源
  update(data) {
    return request.post('/api/bbs/resource/update', data)
  },
  // 删除资源
  remove(id) {
    return request.post(`/api/bbs/resource/delete/${id}`)
  }
}
