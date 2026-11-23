import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:8082'
const USER = process.env.BBS_USER || '椿'
const PASS = process.env.BBS_PASS || '123456'

const browser = await chromium.launch({ channel: 'msedge' })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()

const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`)
})
page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`))

const results = []
function check(name, ok, extra = '') {
  results.push({ name, ok, extra })
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' -> ' + extra : ''}`)
}

async function go(path) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' })
}

// 1. 首页
await go('/')
check('home: title', (await page.title()) === '南生论坛')
check('home: header white', (await page.locator('.app-header').evaluate((el) => getComputedStyle(el).backgroundColor)) === 'rgb(255, 255, 255)')
check('home: article items', (await page.locator('.article-item').count()) > 0)
await page.screenshot({ path: 'screenshots/01-home.png' })

// 2. 登录
await page.locator('.login-button').click()
await page.waitForSelector('.auth-form')
await page.locator('.auth-form input').first().fill(USER)
await page.locator('.auth-form input[type="password"]').fill(PASS)
await Promise.all([page.waitForLoadState('networkidle'), page.locator('.auth-form button[type="submit"]').click()])
await page.waitForTimeout(1500)
const loggedIn = (await page.locator('.header-avatar').count()) > 0
check('login: avatar shown', loggedIn)

if (!loggedIn) {
  await page.screenshot({ path: 'screenshots/02-login-failed.png' })
}

// 3. 文章详情
await go('/detail/41')
check('detail: markdown rendered', (await page.locator('.md-editor-preview h1, .md-editor-preview h2').count()) > 0)
check('detail: toc catalog', (await page.locator('.md-editor-catalog-link').count()) > 0)
check('detail: comment section', (await page.locator('#article-comment').count()) > 0)
await page.screenshot({ path: 'screenshots/03-detail.png' })

// 目录点击后滚动
const beforeScroll = await page.locator('#app').evaluate((el) => el.scrollTop)
if ((await page.locator('.md-editor-catalog-link').count()) > 1) {
  await page.locator('.md-editor-catalog-link').nth(1).click()
  await page.waitForTimeout(800)
  const afterScroll = await page.locator('#app').evaluate((el) => el.scrollTop)
  check('detail: toc scroll works', afterScroll !== beforeScroll, `${beforeScroll} -> ${afterScroll}`)
}

// 4. 各页面可访问
for (const [path, name] of [
  ['/label', 'label'],
  ['/resource', 'resource'],
  ['/recommended', 'recommended'],
  ['/book', 'book'],
  ['/about', 'about'],
  ['/commentDonate', 'commentDonate'],
  ['/500', '500'],
  ['/not-exist-page', '404']
]) {
  await go(path)
  const bodyText = await page.locator('body').innerText()
  const ok = name === '404' ? (await page.locator('.not-found').count()) === 1 : bodyText.length > 30
  check(`page ${name}`, ok, path)
}

// 5. 用户中心
await go('/user/1812')
check('user center: profile card', (await page.locator('.profile-card').count()) > 0)
check('user center: tabs', (await page.locator('.ant-tabs-tab').count()) >= 4)
await page.screenshot({ path: 'screenshots/04-user-center.png' })

// 切换 tab 到文章
await page.locator('.ant-tabs-tab').nth(1).click()
await page.waitForTimeout(1200)
check('user center: article tab items', (await page.locator('.article-item').count()) > 0)

// 6. 设置页
await go('/settings/profile')
check('settings: profile form', (await page.locator('.profile-view form').count()) > 0)
await page.screenshot({ path: 'screenshots/05-settings.png' })
await go('/settings/account')
check('settings: account section', (await page.locator('.account-section').count()) === 3)

// 7. 写文章页
await go('/write')
await page.waitForSelector('.md-editor', { timeout: 15000 })
check('editor: mounted', (await page.locator('.md-editor').count()) > 0)
await page.screenshot({ path: 'screenshots/06-editor.png' })

// 8. 首页管理员审核面板
await go('/')
check('home: audit switcher (admin)', (await page.locator('.audit-switcher').count()) > 0)
await page.screenshot({ path: 'screenshots/07-home-admin.png' })

console.log('\nCONSOLE ERRORS:', errors.length ? JSON.stringify(errors.slice(0, 20), null, 1) : 'none')
console.log(`\nSUMMARY: ${results.filter((r) => r.ok).length}/${results.length} passed`)

await browser.close()
