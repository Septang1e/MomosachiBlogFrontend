import {ElMessage} from "element-plus";


import type {AxiosInstance, AxiosRequestConfig} from "axios"

import axios from "axios"
import {merge, get} from "lodash-es"
import Nprogress from "nprogress";
import router from "@/router";
import {useRoute, useRouter} from "vue-router";
import Router from "@/router";
import {getToken} from "@/utils/local-storage";


function createService() : AxiosInstance{
    const service = axios.create();
    //请求拦截
    service.interceptors.request.use(
        (config)=>config,
        (error)=>Promise.reject(error)
    )
    service.interceptors.response.use(
        (response)=>{
            const apiData = response.data
            //二进制数据直接返回
            const responseType = response.request?.responseType
            if(responseType==="blob" || responseType==="arraybuffer")return apiData
            //
            const code = apiData.code
            if(code===undefined){
                ElMessage.error(  apiData.data === null ? "接口错误" : apiData)
                return Promise.reject(new Error("接口错误"))
            }
            switch (code){
                case 2:
                    
                case 1:
                    return apiData
                default:
                    ElMessage.error(apiData.message || "Error")
                    if(apiData.message != null && (apiData.message === "文章不存在" || apiData.message === "标签不存在" || apiData.message === "分类不存在")) {
                        Router.replace('/')
                    }
                    return Promise.reject(new Error("Error"))
            }
        },
        (error)=>{
            const status = get(error, "response.status")
            switch (status) {
                case 400:
                    error.message = "请求错误"
                    break
                case 401:
                    // Token 过期时
                    break
                case 403:
                    error.message = "拒绝访问"
                    break
                case 404:
                    error.message = "请求地址出错"
                    break
                case 408:
                    error.message = "请求超时"
                    break
                case 500:
                    error.message = "服务器内部错误"
                    break
                case 501:
                    error.message = "服务未实现"
                    break
                case 502:
                    error.message = "网关错误"
                    break
                case 503:
                    error.message = "服务不可用"
                    break
                case 504:
                    error.message = "网关超时"
                    break
                case 505:
                    error.message = "HTTP 版本不受支持"
                    break
                default:
                    break
            }
            ElMessage.error(error.message)
            return Promise.reject(error)
        }
    )
    return service
}
function createRequest(service : AxiosInstance){
    return function <T>(config : AxiosRequestConfig):Promise<T>{
        const token = getToken()
        const defaultConfig = {
            headers:{
                //是否携带token
                Authorization: token,
                "Content-Type": "application/json"
            },
            timeout: 5000,
            baseURL: "http://localhost:8080",
            data: {}
        }
        const mergeConfig = merge(defaultConfig,config)
        return service(mergeConfig)
    }
}

const service = createService()
export const request = createRequest(service)