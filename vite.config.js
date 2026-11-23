import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // 后端（bbs-springboot bbs-rest 模块）地址，context-path 为 /api
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:7010'

  return {
    plugins: [
      vue(),
      // ant-design-vue 4.x 使用 CSS-in-JS，无需按需引入样式文件
      Components({
        dts: false,
        resolvers: [AntDesignVueResolver({ importStyle: false, resolveIcons: true })]
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    server: {
      host: '127.0.0.1',
      port: 8082,
      proxy: {
        '/api': {
          target: proxyTarget,
          // 保留浏览器请求的 Host，后端据此写 cookie domain，
          // 否则用 127.0.0.1 访问时 cookie 会因 domain 不匹配而丢失
          changeOrigin: false
        }
      }
    },
    preview: {
      host: '127.0.0.1',
      port: 8082,
      // 本地预览打包产物时同样代理接口，方便验收
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: false
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // 交由 rolldown 自动拆分：路由级懒加载 + 依赖自动分包
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined
            if (id.includes('ant-design-vue') || id.includes('@ant-design')) return 'antd'
            if (id.includes('md-editor-v3') || id.includes('@vavt') || id.includes('markdown-it') || id.includes('highlight.js')) return 'editor'
            if (id.includes('node_modules/vue') || id.includes('vue-router') || id.includes('pinia')) return 'vue'
            return undefined
          }
        }
      }
    }
  }
})
