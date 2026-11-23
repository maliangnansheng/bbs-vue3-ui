import { message, Modal } from 'ant-design-vue'
import { errorText } from '@/api/request'

export { message, errorText }

/** 统一错误提示 */
export function toastError(error, fallback) {
  message.error(errorText(error, fallback))
}

/**
 * 二次确认弹窗
 * @param {Object} options
 * @param {string} options.title 标题
 * @param {string} [options.content] 内容
 * @param {Function} options.onOk 确认回调
 */
export function confirmAction({ title, content, okText = '确定', cancelText = '取消', onOk, onCancel }) {
  return Modal.confirm({
    title,
    content,
    centered: true,
    okText,
    cancelText,
    async onOk() {
      if (typeof onOk === 'function') return onOk()
      return undefined
    },
    onCancel: typeof onCancel === 'function' ? onCancel : undefined
  })
}
