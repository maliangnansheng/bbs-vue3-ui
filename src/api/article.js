import request from './request'

export default {
  // 文章列表
  getArticleList(params) {
    return request.get('/api/bbs/article/getList', { params })
  },
  // 个人发布的文章
  getPersonalArticles(params) {
    return request.get('/api/bbs/article/getPersonalArticles', { params })
  },
  // 待审核文章
  getPendingReviewArticles(params) {
    return request.get('/api/bbs/article/getPendingReviewArticles', { params })
  },
  // 已禁用文章
  getDisabledArticles(params) {
    return request.get('/api/bbs/article/getDisabledArticles', { params })
  },
  // 修改审批状态
  updateState(data) {
    return request.post('/api/bbs/article/updateState', data)
  },
  // 点赞过的文章
  getLikesArticle(params) {
    return request.get('/api/bbs/article/getLikesArticle', { params })
  },
  // 文章/评论/访问总数
  getArticleCommentVisitTotal() {
    return request.get('/api/bbs/article/getArticleCommentVisitTotal')
  },
  // 上传正文图片
  uploadPicture(data) {
    return request.post('/api/bbs/article/uploadPicture', data)
  },
  // 新建文章
  create(data) {
    return request.post('/api/bbs/article/create', data)
  },
  // 更新文章
  update(data) {
    return request.post('/api/bbs/article/update', data)
  },
  // 文章详情
  getById(params) {
    return request.get('/api/bbs/article/getById', { params })
  },
  // 文章统计（点赞数、评论数、是否点赞）
  getCountById(params) {
    return request.get('/api/bbs/article/getCountById', { params })
  },
  // 置顶 / 取消置顶
  articleTop(params) {
    return request.get('/api/bbs/article/articleTop', { params })
  },
  // 删除文章
  remove(id) {
    return request.post(`/api/bbs/article/delete/${id}`)
  },
  // 审核数据量
  getArticleCheckCount(params) {
    return request.get('/api/bbs/article/getArticleCheckCount', { params })
  }
}
