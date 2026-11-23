import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:8082'
const USER = process.env.BBS_USER || '椿'
const PASS = process.env.BBS_PASS || '123456'

const browser = await chromium.launch({ channel: 'msedge' })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('[pageerror] ' + e.message))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('[console] ' + m.text())
})

const results = []
const check = (name, ok, extra = '') => {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' -> ' + extra : ''}`)
}

async function login() {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.locator('.login-button').click()
  await page.locator('.auth-form input').first().fill(USER)
  await page.locator('.auth-form input[type="password"]').fill(PASS)
  await Promise.all([page.waitForLoadState('networkidle'), page.locator('.auth-form button[type="submit"]').click()])
  await page.waitForTimeout(1200)
}

await login()
check('login', (await page.locator('.header-avatar').count()) > 0)

/* ---------- 1. 点赞 / 取消点赞 ---------- */
await page.goto(BASE + '/detail/41', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
// 计数为 0 时 antd 会把徽章隐藏，innerText 仍能取到旧值，这里按可见性读取
const readLikeCount = async () => {
  const badge = page.locator('.side-actions .ant-badge-count').first()
  if (!(await badge.count())) return 0
  const visible = await badge.evaluate((el) => getComputedStyle(el).display !== 'none')
  return visible ? Number((await badge.innerText()).trim() || 0) : 0
}
const likeBefore = await readLikeCount()
await page.locator('.side-actions .side-action').first().click()
await page.waitForTimeout(900)
const likeAfter = await readLikeCount()
check('like toggled', likeAfter === likeBefore + 1 || likeAfter === likeBefore - 1, `${likeBefore} -> ${likeAfter}`)
await page.locator('.side-actions .side-action').first().click()
await page.waitForTimeout(900)
const likeRestored = await readLikeCount()
check('like restored', likeRestored === likeBefore, `${likeRestored}`)

/* ---------- 2. 评论新增 / 删除 ---------- */
const commentText = '自动化测试评论，请忽略 ' + Date.now()
await page.locator('.comment-editor textarea').fill(commentText)
await page.locator('.comment-editor button.ant-btn-primary').click()
await page.waitForTimeout(1500)
const commentVisible = (await page.locator('.comment-content', { hasText: commentText }).count()) > 0
check('comment created', commentVisible)
check('comment count text', (await page.locator('.comment-count').innerText()).trim() !== '0')

if (commentVisible) {
  const item = page.locator('.comment-item', { hasText: commentText }).first()
  await item.locator('.comment-more').click()
  await page.locator('.ant-dropdown-menu-item', { hasText: '删除' }).last().click()
  await page.locator('.ant-modal-confirm-btns button.ant-btn-primary').click()
  await page.waitForTimeout(1500)
  check('comment deleted', (await page.locator('.comment-content', { hasText: commentText }).count()) === 0)
}
await page.screenshot({ path: 'screenshots/20-comment.png' })

/* ---------- 3. 关注 / 取关（其他用户） ---------- */
const authors = await (await fetch(BASE + '/api/bbs/user/getHotAuthorsList?currentPage=1&pageSize=5')).json()
const other = (authors.data.list || []).find((item) => item.id !== 1812)
if (other) {
  await page.goto(`${BASE}/user/${other.id}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(900)
  const btn = page.locator('.profile-right button').first()
  const textBefore = (await btn.innerText()).trim()
  await btn.click()
  await page.waitForTimeout(1200)
  const textAfter = (await page.locator('.profile-right button').first().innerText()).trim()
  check('follow toggled', textBefore !== textAfter, `${textBefore} -> ${textAfter}`)
  await page.locator('.profile-right button').first().click()
  await page.waitForTimeout(1200)
  const textRestored = (await page.locator('.profile-right button').first().innerText()).trim()
  check('follow restored', textRestored === textBefore, textRestored)
}

/* ---------- 4. 发布文章 -> 删除 ---------- */
const title = '自动化测试文章-' + Date.now()
await page.goto(BASE + '/write', { waitUntil: 'networkidle' })
await page.waitForSelector('.md-editor')
await page.locator('.write-title').fill(title)
await page.locator('.cm-content').click()
await page.keyboard.type('# 自动化测试\n\n这是一篇用于验证发布流程的测试文章，将立即删除。')
await page.waitForTimeout(500)

await page.locator('.publish-trigger').click()
await page.waitForSelector('.publish-panel')
await page.locator('.publish-panel .ant-select-selector').click()
await page.waitForTimeout(500)
await page.locator('.ant-select-item-option').first().click()
await page.keyboard.press('Escape')
await page.locator('.publish-actions button').click()
await page.waitForTimeout(2500)
check('article published', page.url().includes('/user/'), page.url())

// 在个人文章列表中找到并删除
if (page.url().includes('/user/')) {
  await page.waitForTimeout(1200)
  const target = page.locator('.article-item', { hasText: title }).first()
  const found = (await page.locator('.article-item', { hasText: title }).count()) > 0
  check('article in my list', found)
  if (found) {
    await target.locator('.action-item').last().click()
    await page.locator('.ant-dropdown-menu-item', { hasText: '删除' }).last().click()
    await page.locator('.ant-modal-confirm-btns button.ant-btn-primary').click()
    await page.waitForTimeout(1800)
    check('article deleted', (await page.locator('.article-item', { hasText: title }).count()) === 0)
  }
}
await page.screenshot({ path: 'screenshots/21-after-publish.png' })

console.log('\nERRORS:', errors.length ? JSON.stringify([...new Set(errors)].slice(0, 10), null, 1) : 'none')
console.log(`SUMMARY: ${results.filter((r) => r.ok).length}/${results.length}`)
await browser.close()
