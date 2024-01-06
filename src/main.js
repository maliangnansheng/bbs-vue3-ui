import { createApp } from 'vue';
import App from './App';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import router from './router'
import store from './store'
import "@/assets/css/main.css"
// 引入自定义全局字体样式表
import '@/assets/font/font.css'
// 引入iconfont的样式（iconfont的使用参照iconfont官网）
import '@/assets/icon/iconfont.css'
// 引入axios 初始化axios里面的配置
import "@/service/axios"
import moment from "moment"
import "./assets/css/main.less"
import utils from "./utils/utils"
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// import routerHistory from '@/router/vueRouterHistory';

// import VueClipboards from 'vue-clipboard2'

// Vue.config.productionTip = false;

// // 引入自定义工具模块
// Vue.prototype.$utils = utils
// Vue.prototype.$moment = moment
// // 将国际化添加为Vue的原型上的方法
// Vue.prototype.$t = store.state.translate.bind(store.state)

// Vue.use(Antd);
// Vue.use(mavonEditor)
// Vue.use(VueClipboards);

// export default new Vue({
//     router,
//     store,
//     render: h => h(App)
// }).$mount('#app')



const app = createApp(App);
app.config.globalProperties.$utils = utils;
app.config.globalProperties.$moment = moment;
app.config.globalProperties.$t = store.state.translate.bind(store.state);

app
    .use(Antd)
    .use(store)
    .use(router)
    .use(mavonEditor)
    .mount('#app');