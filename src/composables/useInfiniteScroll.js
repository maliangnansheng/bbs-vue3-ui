import { onBeforeUnmount, onMounted } from 'vue'

/**
 * 滚动到底部自动加载更多
 * 注意：项目页面滚动容器为 #app（不是 window）
 * @param {Object} options
 * @param {import('vue').Ref<boolean>} options.hasNext 是否还有下一页
 * @param {import('vue').Ref<boolean>} options.loading 是否正在请求
 * @param {Function} options.onLoadMore 加载下一页
 * @param {Function|string} [options.container] 滚动容器（默认 #app）
 * @param {number} [options.offset] 触底阈值
 */
export function useInfiniteScroll({ hasNext, loading, onLoadMore, container, offset = 100 }) {
  let el = null

  function getContainer() {
    if (typeof container === 'function') return container()
    if (typeof container === 'string') return document.querySelector(container)
    return document.querySelector('#app')
  }

  function handler(event) {
    const target = event.target
    if (!target || !hasNext.value || loading.value) return
    const { scrollTop, scrollHeight, clientHeight } = target
    if (scrollHeight - scrollTop <= clientHeight + offset) {
      onLoadMore()
    }
  }

  function bind() {
    el = getContainer()
    if (el) el.addEventListener('scroll', handler, { passive: true })
  }

  function unbind() {
    if (el) el.removeEventListener('scroll', handler)
    el = null
  }

  onMounted(bind)
  onBeforeUnmount(unbind)

  return { bind, unbind }
}
