import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:8082'
const browser = await chromium.launch({ channel: 'msedge' })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()

const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})
page.on('pageerror', (err) => errors.push('PAGEERROR: ' + err.message))

await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.screenshot({ path: 'screenshots/home.png' })
console.log('title:', await page.title())
console.log('errors:', JSON.stringify(errors.slice(0, 10), null, 1))
const text = await page.locator('body').innerText()
console.log('text:', text.slice(0, 400).replace(/\n+/g, ' | '))

await browser.close()
