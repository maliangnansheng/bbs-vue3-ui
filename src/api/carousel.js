import request from './request'

export default {
  // 首页轮播图
  getCarouselList() {
    return request.get('/api/bbs/carousel/getList')
  }
}
