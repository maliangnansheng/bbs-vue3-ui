import dayjs from 'dayjs'

const levelImages = import.meta.glob('../assets/img/level/Lv*.svg', { eager: true, import: 'default' })

const levelMap = Object.fromEntries(
  Object.entries(levelImages).map(([path, url]) => [path.split('/').pop().replace('.svg', ''), url])
)

/** 用户等级图标（Lv1 ~ Lv6） */
export function levelIcon(level) {
  const key = level ? String(level) : 'Lv1'
  return levelMap[key] || levelMap.Lv1
}

const badgeImages = import.meta.glob('../assets/img/level/badge-Lv*.svg', { eager: true, import: 'default' })

const badgeMap = Object.fromEntries(
  Object.entries(badgeImages).map(([path, url]) => [path.split('/').pop().replace('.svg', ''), url])
)

/** 身份徽章图标（badge-Lv1 ~ badge-Lv6） */
export function badgeIcon(level) {
  return badgeMap[`badge-Lv${level}`] || ''
}

/** 南生值对应的身份门槛（与书籍说明页保持一致） */
export const BADGE_LEVELS = [
  { min: 0, title: '新手' },
  { min: 100, title: '麒麟儿' },
  { min: 300, title: '三好学生' },
  { min: 600, title: '技术贡献者' },
  { min: 1000, title: '优秀作者' },
  { min: 1500, title: '共建者' }
]

/** 根据南生值计算当前身份等级（1~6） */
export function badgeLevel(points) {
  const value = Number(points || 0)
  let level = 1
  BADGE_LEVELS.forEach((item, index) => {
    if (value >= item.min) level = index + 1
  })
  return level
}

/** 时间显示：刚刚 / x分钟前 / 昨天 / x天前 ... 超过一年显示完整时间 */
export function showtime(time) {
  if (!time) return ''
  const date = typeof time === 'number' ? new Date(time) : new Date(String(time).replace(/-/g, '/'))
  if (Number.isNaN(date.getTime())) return String(time)

  const diff = (Date.now() - date.getTime()) / 1000
  const day = Math.floor(diff / 86400)

  if (Number.isNaN(day) || day < 0) {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  }
  if (day === 0) {
    if (diff < 60) return '刚刚'
    if (diff < 120) return '1分钟前'
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
    if (diff < 7200) return '1小时前'
    return `${Math.floor(diff / 3600)}小时前`
  }
  if (day === 1) return '昨天'
  if (day < 7) return `${day}天前`
  if (day < 30) return `${Math.floor(day / 7)}周前`
  if (day < 365) return `${Math.floor(day / 30)}月前`
  return `${Math.floor(day / 365)}年前`
}

/** 完整时间 */
export function datetime(time) {
  if (!time) return ''
  const date = typeof time === 'number' ? new Date(time) : new Date(String(time).replace(/-/g, '/'))
  if (Number.isNaN(date.getTime())) return String(time)
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

/** 判断文本是否超出容器宽度（用于 tooltip 展示） */
export function isClamp(event) {
  try {
    const width = event.target.clientWidth
    const originWidth = event.target.nextElementSibling.clientWidth
    return originWidth > width
  } catch {
    return false
  }
}

/** HTML 转义，避免用户内容被当作标签执行（防 XSS） */
export function escapeHtml(text) {
  if (text === null || text === undefined) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** 评论等纯文本渲染：转义 + 换行 */
export function renderPlainText(text) {
  return escapeHtml(text).replace(/\r?\n/g, '<br />')
}

/** 图片大小限制：5M */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export function isImageTooLarge(file) {
  return Boolean(file) && file.size > MAX_IMAGE_SIZE
}

/** 滚动到页面顶部（页面滚动容器为 #app） */
export function scrollPageTop() {
  const app = document.querySelector('#app')
  if (app) app.scrollTop = 0
}

/** 平滑滚动到指定 id 元素 */
export function scrollToAnchor(id, options = {}) {
  if (!id) return
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', ...options })
}
