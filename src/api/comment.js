import request from './request'

export default {
  // 文章评论列表
  getCommentByArticleId(params) {
    return request.get('/api/bbs/comment/getCommentByArticleId', { params })
  },
  // 最新评论
  getLatestComment(params) {
    return request.get('/api/bbs/comment/getLatestComment', { params })
  },
  // 发表评论
  create(data) {
    return request.post('/api/bbs/comment/create', data)
  },
  // 删除评论
  remove(id) {
    return request.post(`/api/bbs/comment/delete/${id}`)
  }
}
