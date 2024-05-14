/// <reference types="vite/client" />


import axios from "axios";

declare module '@/utils/*'

declare module '*.vue' {
    import { DefineComponent } from "vue"
    const component: DefineComponent<{}, {}, any>
    export default component
}