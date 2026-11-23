import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'ant-design-vue/dist/reset.css'
import '@/styles/index.less'
import '@/assets/font/font.css'
import '@/assets/icon/iconfont.css'
import '@/utils/editor'
import App from './App.vue'
import router from './router'
import { translate } from './i18n'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.config.globalProperties.$t = translate

app.mount('#app')
