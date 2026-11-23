import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:8082'
const browser = await chromium.launch({ channel: 'msedge' })
const errors = []
const results = []

function check(name, ok, extra = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' -> ' + extra : ''}`)
}

async function newPage(width, height) {
  const ctx = await browser.newContext({ viewport: { width, height } })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[console] ${m.text()}`)
  })
  return page
}

const page = await newPage(1440, 900)

// 详情页右栏（作者 + 相关文章）
await page.goto(BASE + '/detail/41', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
check('detail: author card', (await page.locator('.author-card').count()) === 1)
check('detail: related articles', (await page.locator('.related-item').count()) > 0)
await page.screenshot({ path: 'screenshots/10-detail-fixed.png' })

// 首页搜索框宽度 & 审核按钮位置
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
const searchWidth = await page.locator('.header-search').evaluate((el) => el.getBoundingClientRect().width)
check('home: search width >= 220', searchWidth >= 220, String(searchWidth))
await page.screenshot({ path: 'screenshots/11-home-fixed.png' })

// 移动端
const mobile = await newPage(390, 844)
for (const [path, name] of [
  ['/', 'home'],
  ['/detail/41', 'detail'],
  ['/label', 'label'],
  ['/user/1812', 'user']
]) {
  await mobile.goto(BASE + path, { waitUntil: 'networkidle' })
  await mobile.waitForTimeout(600)
  const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  check(`mobile ${name}: no horizontal overflow`, overflow <= 2, `overflow=${overflow}`)
  await mobile.screenshot({ path: `screenshots/12-mobile-${name}.png`, fullPage: false })
}

// 设置页：登录后表单应有值
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const authed = await ctx.newPage()
authed.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`))
await authed.goto(BASE + '/', { waitUntil: 'networkidle' })
await authed.locator('.login-button').click()
await authed.locator('.auth-form input').first().fill(process.env.BBS_USER || '椿')
await authed.locator('.auth-form input[type="password"]').fill(process.env.BBS_PASS || '123456')
await Promise.all([authed.waitForLoadState('networkidle'), authed.locator('.auth-form button[type="submit"]').click()])
await authed.waitForTimeout(1200)
await authed.goto(BASE + '/settings/profile', { waitUntil: 'networkidle' })
await authed.waitForTimeout(1200)
const usernameValue = await authed.locator('.profile-view form input').first().inputValue()
check('settings: profile prefilled', usernameValue.length > 0, usernameValue.slice(0, 3) + '**')
await authed.screenshot({ path: 'screenshots/13-settings-filled.png' })

console.log('\nERRORS:', errors.length ? JSON.stringify([...new Set(errors)].slice(0, 15), null, 1) : 'none')
console.log(`SUMMARY: ${results.filter((r) => r.ok).length}/${results.length}`)
await browser.close()
