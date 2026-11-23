import request from './request'

export default {
  // 标签列表
  getLabelList(params) {
    return request.get('/api/bbs/label/getList', { params })
  },
  // 上传标签 logo
  uploadLabelLogo(data) {
    return request.post('/api/bbs/label/uploadLabelLogo', data)
  },
  // 新增标签
  create(data) {
    return request.post('/api/bbs/label/create', data)
  },
  // 更新标签
  update(data) {
    return request.post('/api/bbs/label/update', data)
  },
  // 删除标签
  remove(id) {
    return request.post(`/api/bbs/label/delete/${id}`)
  }
}
