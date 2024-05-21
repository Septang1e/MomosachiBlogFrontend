import {request} from "@/utils/request";
import type {RequestAPI} from "@/api/RequestAPI";
import {removeToken} from "@/utils/local-storage";

export interface User {
    username: string,
    password: string
}

export interface UserQueryDTO{
    userId: string
    nickname: string
    isAdmin: number
    email: string
    emailStatus: string
}
export interface AdminCountInfo {
    article_count : number,
    category_count : number,
    tag_count : number,
}

export type UserLoginResult = RequestAPI<string>
export type UserResult = RequestAPI<User>
export type UserAuthorizationResult = RequestAPI<string>
export type UserLogoutResult = RequestAPI<string>
export type AdminCountInfoResult = RequestAPI<AdminCountInfo>

export function adminLogin(user : User) {
    return request<UserLoginResult>({
        url: "/api/v1/login",
        method: 'post',
        data: user
    })
}

export function authorization() {
    return request<UserAuthorizationResult>({
        url: '/api/v1/authorize',
        method: 'get',
    })
}
export function logout() {
    removeToken()
    return request<UserLogoutResult>({
        url: "/api/v1/logout",
        method: 'post'
    })
}
export function getAdminCountInfo() {
    return request<AdminCountInfoResult>({
        url: "/api/v1/total/admin",
        method: 'get'
    })
}
export function emailVerify(email : string, userId: string) {
    return request<RequestAPI<String>>({
        url: `/api/admin/verify/email?email=${email}&userId=${userId}`,
        method: 'post'
    })
}