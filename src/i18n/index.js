import zhCN from './zh-CN'
import enUS from './en-US'
import { useAppStore } from '@/stores/app'

const dictionaries = {
  zh_CN: zhCN,
  en_US: enUS
}

function resolve(dict, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), dict)
}

/**
 * 国际化翻译方法，用法：$t('common.login')
 * 未命中时依次回退：当前语言 -> 中文 -> key 最后一段
 */
export function translate(key) {
  if (!key) return ''
  const app = useAppStore()
  const current = dictionaries[app.locale] || zhCN
  const value = resolve(current, key)
  if (value !== undefined) return value
  const fallback = resolve(zhCN, key)
  return fallback !== undefined ? fallback : key.split('.').pop()
}

export const availableLocales = [
  { value: 'zh_CN', label: '中文' },
  { value: 'en_US', label: 'English' }
]
