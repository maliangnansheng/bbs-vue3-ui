import { createRouter, createWebHistory } from 'vue-router'
import { scrollPageTop } from '@/utils'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/recommended',
    name: 'recommended',
    component: () => import('@/views/AuthorsView.vue')
  },
  {
    path: '/write',
    name: 'write',
    component: () => import('@/views/ArticleEditorView.vue')
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component: () => import('@/views/ArticleEditorView.vue')
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: () => import('@/views/ArticleDetailView.vue')
  },
  {
    path: '/user/:id/:userCenterTab?',
    name: 'user',
    component: () => import('@/views/UserCenterView.vue')
  },
  {
    path: '/label',
    name: 'label',
    component: () => import('@/views/LabelView.vue')
  },
  {
    path: '/label/:id',
    name: 'labelDetail',
    component: () => import('@/views/LabelArticleView.vue')
  },
  {
    path: '/settings',
    component: () => import('@/views/SettingsView.vue'),
    children: [
      { path: '', redirect: '/settings/profile' },
      { path: 'profile', name: 'profile', component: () => import('@/views/settings/ProfileView.vue') },
      { path: 'account', name: 'account', component: () => import('@/views/settings/AccountView.vue') }
    ]
  },
  {
    path: '/resource',
    name: 'resource',
    component: () => import('@/views/ResourceView.vue')
  },
  {
    path: '/book',
    name: 'book',
    component: () => import('@/views/BookView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue')
  },
  {
    path: '/commentDonate',
    name: 'commentDonate',
    component: () => import('@/views/CommentDonateView.vue')
  },
  {
    path: '/500',
    name: 'serverError',
    component: () => import('@/views/error/ServerErrorView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/error/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    // 页面滚动容器是 #app，这里同步复位
    scrollPageTop()
    return { top: 0 }
  }
})

export default router
