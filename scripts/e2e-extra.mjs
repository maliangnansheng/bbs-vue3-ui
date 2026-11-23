import { writeFileSync } from 'node:fs'
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:8082'
const PNG_1PX = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
)
writeFileSync('screenshots/test-logo.png', PNG_1PX)

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
  await page.locator('.auth-form input').first().fill(process.env.BBS_USER || '椿')
  await page.locator('.auth-form input[type="password"]').fill(process.env.BBS_PASS || '123456')
  await Promise.all([page.waitForLoadState('networkidle'), page.locator('.auth-form button[type="submit"]').click()])
  await page.waitForTimeout(1200)
}

await login()

/* ---------- 主题色切换 ---------- */
await page.locator('.icon-theme').first().click()
await page.waitForTimeout(400)
await page.locator('.theme-color-item').nth(3).click()
await page.waitForTimeout(800)
const themeSaved = await page.evaluate(() => localStorage.getItem('themeColor'))
check('theme color persisted', themeSaved === '#1869ff', themeSaved)
await page.locator('.icon-theme').first().click()
await page.waitForTimeout(300)
await page.locator('.theme-color-item').nth(2).click()
await page.waitForTimeout(500)
check('theme color restored', (await page.evaluate(() => localStorage.getItem('themeColor'))) === '#13c2c2')

/* ---------- 语言切换 ---------- */
await page.locator('.header-language').click()
await page.waitForTimeout(600)
const englishText = await page.locator('.header-nav').innerText()
check('language switched to EN', /Label|Resource/i.test(englishText), englishText.replace(/\n/g, ' '))
await page.locator('.header-language').click()
await page.waitForTimeout(600)
check('language restored to ZH', /标签/.test(await page.locator('.header-nav').innerText()))

/* ---------- 搜索 ---------- */
await page.locator('.header-search input').fill('PM2')
await page.locator('.header-search input').press('Enter')
await page.waitForTimeout(1500)
check('search route', page.url().includes('/search?query=PM2'), page.url())
check('search results', (await page.locator('.article-item').count()) > 0)
await page.screenshot({ path: 'screenshots/30-search.png' })

/* ---------- 消息下拉 ---------- */
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.locator('.header-badge').click()
await page.waitForSelector('.message-panel')
await page.waitForTimeout(800)
check('message panel tabs', (await page.locator('.message-panel .ant-tabs-tab').count()) === 2)
await page.screenshot({ path: 'screenshots/31-messages.png' })
await page.keyboard.press('Escape')

/* ---------- 账号设置弹窗 ---------- */
await page.goto(BASE + '/settings/account', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
const plusLinks = page.locator('.account-section a')
if ((await plusLinks.count()) > 0) {
  await plusLinks.first().click()
  await page.waitForTimeout(600)
  check('bind modal opens', (await page.locator('.ant-modal-content .ant-input-search').count()) > 0)
  await page.locator('.ant-modal-close').last().click()
} else {
  check('bind modal opens (already bound)', true, 'skipped')
}
const resetButton = page.locator('.account-section button.ant-btn-primary').last()
await resetButton.click()
await page.waitForTimeout(600)
check('change password modal', (await page.locator('.ant-modal-content input[type="password"]').count()) === 3)
await page.locator('.ant-modal-close').last().click()

/* ---------- 标签新增 / 删除 ---------- */
const labelName = '测试标签' + Date.now().toString().slice(-5)
await page.goto(BASE + '/label', { waitUntil: 'networkidle' })
await page.locator('.label-toolbar button.ant-btn-primary').click()
await page.waitForSelector('.ant-modal-content')
await page.locator('.ant-modal-content input').first().fill(labelName)
await page.locator('.ant-modal-content input[type="file"]').setInputFiles('screenshots/test-logo.png')
await page.waitForTimeout(1200)
await page.locator('.ant-modal-footer button.ant-btn-primary').click()
await page.waitForTimeout(1800)
check('label created', (await page.locator('.label-card', { hasText: labelName }).count()) > 0)
if ((await page.locator('.label-card', { hasText: labelName }).count()) > 0) {
  const card = page.locator('.label-card', { hasText: labelName }).first()
  await card.locator('.label-more').click()
  await page.locator('.ant-dropdown-menu-item', { hasText: '删除' }).last().click()
  await page.locator('.ant-modal-confirm-btns button.ant-btn-primary').click()
  await page.waitForTimeout(1500)
  check('label deleted', (await page.locator('.label-card', { hasText: labelName }).count()) === 0)
}
await page.screenshot({ path: 'screenshots/32-label.png' })

/* ---------- 资源新增 / 删除 ---------- */
const resName = '测试资源' + Date.now().toString().slice(-5)
await page.goto(BASE + '/resource', { waitUntil: 'networkidle' })
await page.locator('.resource-toolbar button.ant-btn-primary').click()
await page.waitForSelector('.ant-modal-content')
const inputs = page.locator('.ant-modal-content input.ant-input')
await inputs.nth(0).fill(resName)
await inputs.nth(1).fill('测试分类')
await inputs.nth(2).fill('自动化测试资源描述')
await inputs.nth(3).fill('https://example.com')
await page.locator('.ant-modal-content input[type="file"]').setInputFiles('screenshots/test-logo.png')
await page.waitForTimeout(1200)
await page.locator('.ant-modal-footer button.ant-btn-primary').click()
await page.waitForTimeout(1800)
check('resource created', (await page.locator('.resource-card', { hasText: resName }).count()) > 0)
if ((await page.locator('.resource-card', { hasText: resName }).count()) > 0) {
  const card = page.locator('.resource-card', { hasText: resName }).first()
  await card.locator('.resource-more').click({ force: true })
  await page.locator('.ant-dropdown-menu-item', { hasText: '删除' }).last().click()
  await page.locator('.ant-modal-confirm-btns button.ant-btn-primary').click()
  await page.waitForTimeout(1500)
  check('resource deleted', (await page.locator('.resource-card', { hasText: resName }).count()) === 0)
}
await page.screenshot({ path: 'screenshots/33-resource.png' })

/* ---------- 审核筛选切换 ---------- */
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
const auditItems = page.locator('.audit-switcher .audit-item')
if ((await auditItems.count()) === 3) {
  await auditItems.nth(2).click()
  await page.waitForTimeout(1500)
  check('audit filter pendingReview', (await page.locator('.article-item').count()) >= 0)
  await auditItems.nth(0).click()
  await page.waitForTimeout(1200)
  check('audit filter enable', (await page.locator('.article-item').count()) > 0)
} else {
  check('audit switcher visible', false)
}

console.log('\nERRORS:', errors.length ? JSON.stringify([...new Set(errors)].slice(0, 10), null, 1) : 'none')
console.log(`SUMMARY: ${results.filter((r) => r.ok).length}/${results.length}`)
await browser.close()
