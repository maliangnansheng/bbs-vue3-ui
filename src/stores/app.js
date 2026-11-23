import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const THEME_STORAGE_KEY = 'themeColor'
const LANGUAGE_STORAGE_KEY = 'language'
const CAROUSEL_STORAGE_KEY = 'isCarousel'

const DEFAULT_THEME = '#13c2c2'

function detectLocale() {
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (saved === 'zh_CN' || saved === 'en_US') return saved
  return navigator.language === 'zh-CN' ? 'zh_CN' : 'en_US'
}

export const useAppStore = defineStore('app', () => {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)
  // 小屏：隐藏侧栏、使用抽屉菜单
  const collapsed = ref(window.innerWidth < 1000)
  // 更小屏：收紧页面边距
  const collapsedMax = ref(window.innerWidth < 1300)
  const themeColor = ref(localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME)
  const colorOptions = ['#000000', '#3eaf7c', '#13c2c2', '#1869ff', '#722ed1', '#eb2f96']
  const locale = ref(detectLocale())
  // 1 启用首页轮播，0 关闭
  const isCarousel = ref(localStorage.getItem(CAROUSEL_STORAGE_KEY) === '0' ? 0 : 1)
  const userMaxLength = 10
  const manageDomain = ref(import.meta.env.VITE_MANAGE_DOMAIN || 'http://manage-test.nansin.top')

  const contentWidth = computed(() => (collapsed.value ? width.value - 120 : width.value - 314))
  const isPc = computed(() => width.value > 750)

  function updateViewport() {
    width.value = window.innerWidth
    height.value = window.innerHeight
    collapsed.value = window.innerWidth < 1000
    collapsedMax.value = window.innerWidth < 1300
  }

  function setThemeColor(color) {
    themeColor.value = color || DEFAULT_THEME
    localStorage.setItem(THEME_STORAGE_KEY, themeColor.value)
  }

  function setLocale(value) {
    locale.value = value === 'en_US' ? 'en_US' : 'zh_CN'
    localStorage.setItem(LANGUAGE_STORAGE_KEY, locale.value)
  }

  function toggleLocale() {
    setLocale(locale.value === 'zh_CN' ? 'en_US' : 'zh_CN')
  }

  function setCarousel(value) {
    isCarousel.value = Number(value) === 0 ? 0 : 1
    localStorage.setItem(CAROUSEL_STORAGE_KEY, String(isCarousel.value))
  }

  return {
    width,
    height,
    collapsed,
    collapsedMax,
    themeColor,
    colorOptions,
    locale,
    isCarousel,
    userMaxLength,
    manageDomain,
    contentWidth,
    isPc,
    updateViewport,
    setThemeColor,
    setLocale,
    toggleLocale,
    setCarousel
  }
})
