import {createApp, onMounted, watch} from 'vue'
import { createPinia } from 'pinia'

import "boxicons/css/boxicons.css"

import "@/assets/global.css"

//plugins的css
import "nprogress/nprogress.css"

import "animate.css"
import "@/assets/animation.css"
import "element-plus/dist/index.css"

import "element-plus/theme-chalk/dark/css-vars.css"
import ElementPlus from 'element-plus'


import App from './App.vue'
import router from './router'
import {loadElementPlusIcon} from "@/plugins/element-plus-icon-vue";

const app = createApp(App)

loadElementPlusIcon(app)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)


app.mount('#app')