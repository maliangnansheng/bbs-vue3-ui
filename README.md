# Nan's BBS 南生论坛 · 前端（Vue 3 + Vite + Ant Design Vue 4）

[![](https://img.shields.io/badge/Author-马亮南生-orange.svg)](https://bbs.nansin.top/user/1640)
[![](https://img.shields.io/badge/version-4.0.0-brightgreen.svg)](https://github.com/maliangnansheng/bbs-springboot)
[![GitHub stars](https://img.shields.io/github/stars/maliangnansheng/bbs-springboot.svg?style=social&label=Stars)](https://github.com/maliangnansheng/bbs-springboot)

> [!TIP]
> 本项目基于 AGPL 3.0 协议完全开源，使用此项目时请遵守开源协议，如果觉得不错麻烦帮忙点一次 `Star⭐️`
>
> 个人学习使用不限制（公司使用或者商用需要 [**获取授权**](https://bbs.nansin.top/detail/600)）
>
> 加载太慢or图片加载不出来 [**点我**](https://bbs.nansin.top/detail/172)

## 仓库说明

> [!NOTE]
> 本仓库`bbs-vue3-ui`是【南生论坛3.0.0】前后端分离项目的**前端项目**
>
> 对应的**后端项目**仓库移步至：[bbs-springboot](https://github.com/maliangnansheng/bbs-springboot)

## 技术栈

- **框架**：Vue 3.5、Vue Router 4.6、Pinia 4
- **UI**：Ant Design Vue 4.2、@ant-design/icons-vue 7
- **构建**：Vite 8、Less 4、unplugin-vue-components（antd 组件按需自动引入）
- **请求**：Axios 1.x（统一拦截器、错误提示、登录态 302 处理）
- **Markdown**：md-editor-v3 7（编辑器 + 预览 + 目录）、markdown-it、highlight.js、KaTeX
- **时间处理**：Day.js
- **规范**：ESLint 10 + eslint-plugin-vue 10（flat config）

## 目录结构

```
bbs-vue3-ui
├── docs/                      # 环境依赖与启动说明（部署必读）
├── public/favicon.ico
├── scripts/                   # Playwright 冒烟/回归脚本
├── src
│   ├── api/                   # 接口层（request 拦截器 + 各模块接口）
│   ├── assets/                # 图片、字体、iconfont
│   ├── components
│   │   ├── article/           # 文章列表、正文、编辑器发布弹窗、封面、审核切换
│   │   ├── aside/             # 右侧栏卡片（简介、作者榜、最新评论、捐赠、备案…）
│   │   ├── auth/              # 登录/注册/找回密码弹窗
│   │   ├── books/             # 南生值说明页内容
│   │   ├── comment/           # 评论列表/单条评论/评论编辑器
│   │   ├── common/            # 骨架屏、悬浮按钮、Logo 上传
│   │   ├── label/             # 标签卡片与表单
│   │   ├── layout/            # 页头、导航、移动端抽屉、页面壳
│   │   ├── markdown/          # Markdown 预览与目录
│   │   ├── message/           # 消息下拉面板
│   │   ├── resource/          # 资源导航卡片与表单
│   │   └── user/              # 个人中心、设置、关注列表、头像上传等
│   ├── composables/           # useInfiniteScroll（滚动加载）
│   ├── i18n/                  # 中英文语言包
│   ├── router/                # 路由表
│   ├── stores/                # Pinia：app（主题/语言/屏幕）、user（登录态/消息数）
│   ├── styles/                # 全局样式
│   ├── utils/                 # 时间格式化、等级图标、XSS 转义、反馈封装、编辑器配置
│   └── views/                 # 页面（首页、详情、写文章、用户中心、设置、标签、资源…）
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

## 快速开始

```bash
# Node.js >= 20.19（推荐 22 LTS）
npm install

# 启动开发服务器（默认 http://127.0.0.1:8082，接口代理到 http://localhost:7010）
npm run dev

# 生产构建（产物在 dist/）
npm run build

# 本地预览生产产物（http://127.0.0.1:8082）
npm run preview

# 代码检查
npm run lint
```

## 联系作者

> **商用** 需要联系作者[**授权**](https://bbs.nansin.top/detail/600)（学习使用不需要授权）

1. 微信：maliangnansheng（[扫码](https://bbs.nansin.top/about)）
2. QQ：924818949（[扫码](https://bbs.nansin.top/about)）
