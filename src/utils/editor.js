import { config } from 'md-editor-v3'
import hljs from 'highlight.js/lib/common'
import katex from 'katex'
import 'highlight.js/styles/github.css'
import 'katex/dist/katex.min.css'

/**
 * md-editor-v3 默认从 unpkg CDN 拉取 highlight.js / katex，
 * 在离线或受限网络下会导致代码块无高亮、公式渲染失败。
 * 这里改为使用本地依赖实例，构建产物自带高亮样式与字体。
 */
config({
  editorExtensions: {
    highlight: {
      instance: hljs
    },
    katex: {
      instance: katex
    }
  }
})
