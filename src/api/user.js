import request from './request'

export default {
  // 当前用户权限
  getCurrentUserAccess() {
    return request.get('/api/bbs/user/getCurrentUserRights')
  },
  // 评论点赞 / 取消点赞
  updateLikeCommentState(params) {
    return request.get('/api/bbs/user/updateLikeCommentState', { params })
  },
  // 文章点赞 / 取消点赞
  updateLikeState(params) {
    return request.get('/api/bbs/user/updateLikeState', { params })
  },
  // 热门作者列表
  getHotAuthorsList(params) {
    return request.get('/api/bbs/user/getHotAuthorsList', { params })
  },
  // 关注 / 粉丝列表
  getFollowUsers(params) {
    return request.get('/api/bbs/user/getFollowUsers', { params })
  },
  // 用户信息
  getUserInfo(params) {
    return request.get('/api/bbs/user/getUserInfo', { params })
  },
  // 关注 / 粉丝数量
  getFollowCount(params) {
    return request.get('/api/bbs/user/getFollowCount', { params })
  },
  // 关注 / 取关
  updateFollowState(params) {
    return request.get('/api/bbs/user/updateFollowState', { params })
  },
  // 上传头像
  uploadUserPicture(data, onUploadProgress) {
    return request.post('/api/bbs/user/uploadUserPicture', data, { onUploadProgress })
  },
  // 更新用户基本信息
  updateUserBasicInfo(data) {
    return request.post('/api/bbs/user/updateUserBasicInfo', data)
  },
  // 发送短信验证码
  sendSmsVerifyCode(params) {
    return request.get('/api/bbs/user/sendSmsVerifyCode', { params })
  },
  // 发送邮件验证码
  sendEmailVerifyCode(params) {
    return request.get('/api/bbs/user/sendEmailVerifyCode', { params })
  },
  // 绑定 / 解绑手机
  bindPhone(data) {
    return request.post('/api/bbs/user/bindPhone', data)
  },
  untiePhone() {
    return request.post('/api/bbs/user/untiePhone')
  },
  // 绑定 / 解绑邮箱
  bindEmail(data) {
    return request.post('/api/bbs/user/bindEmail', data)
  },
  untieEmail() {
    return request.post('/api/bbs/user/untieEmail')
  },
  // 修改密码
  updatePassword(data) {
    return request.post('/api/bbs/user/updatePassword', data)
  },
  // 邮箱 / 手机 / 用户名判重
  isValidEmail(params) {
    return request.get('/api/bbs/user/isValidEmail', { params })
  },
  isValidPhone(params) {
    return request.get('/api/bbs/user/isValidPhone', { params })
  },
  isValidUser(params) {
    return request.get('/api/bbs/user/isValidUser', { params })
  },
  // 手机 / 邮箱是否已绑定
  isPhoneExist(phone) {
    return request.post(`/api/bbs/user/isPhoneExist/${phone}`)
  },
  isEmailExist(email) {
    return request.post(`/api/bbs/user/isEmailExist/${email}`)
  },
  // 重置密码
  phoneResetPassword(data) {
    return request.post('/api/bbs/user/phoneResetPassword', data)
  },
  emailResetPassword(data) {
    return request.post('/api/bbs/user/emailResetPassword', data)
  },
  // 用户操作数量（文章、关注、点赞等）
  getUserOperateCount(params) {
    return request.get('/api/bbs/user/getUserOperateCount', { params })
  }
}
