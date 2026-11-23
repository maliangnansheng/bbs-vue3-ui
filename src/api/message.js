import request from './request'

export default {
  // 通知列表（type：1 系统通知，0 任务提醒）
  getMessageList(params) {
    return request.get('/api/bbs/notify/getList', { params })
  },
  // 全部已读
  makeAllRead(params) {
    return request.post('/api/bbs/notify/haveRead', null, { params })
  },
  // 标记单条已读
  markRead(data) {
    return request.post('/api/bbs/notify/markRead', data)
  }
}
