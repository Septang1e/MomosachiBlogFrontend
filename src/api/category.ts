import {request} from "@/utils/request";
import type {RequestAPI} from "@/api/RequestAPI";
import type {Page} from "@/api/article";

export interface Category {
    name : string,
    pid : string
}
export interface CategoryDTO{
    category : Category,
    articleCount : string
}
export interface CategoryQueryDTO {
    id: string,
    name: string,
    status: number,
    pid: string
}
export type CategoryApiRequestData = RequestAPI<CategoryDTO>
export type CategoryQueryRequestData = RequestAPI<Page<CategoryQueryDTO>>

export function getAllCategory(){
    return request<CategoryApiRequestData>({
        url: '/api/categories',
        method: 'get'
    })
}

export function addCategory(data : CategoryQueryDTO){
    return request<RequestAPI<String>>({
        url: '/api/admin/category/add',
        method : 'post',
        data
    })
}

export function updateCategory(data : CategoryQueryDTO) {
    return request<RequestAPI<String>>({
        url: '/api/admin/category/edit',
        method: 'post',
        data
    })
}

export function queryCategoryPagination(current : number, size : number, keyword : string | undefined) {
    let url = `/api/admin/category/pagination/${current}/${size}`
    if(keyword != undefined) {
        url = `${url}?keyword=${keyword}`
    }
    return request<CategoryQueryRequestData>({
        url: url,
        method: 'get'
    })
}

export function fetchDeletedCategory(current : number, size : number, keyword: string | undefined) {
    let url = `/api/admin/bin/category/pagination/${current}/${size}`
    if(keyword !== undefined) {
        url = `${url}?keyword=${keyword}`
    }
    return request<CategoryQueryRequestData>({
        url: url,
        method: "get"
    })
}



export function deleteCategory(idList : string[]) {
    return request<RequestAPI<String>>({
        url: '/api/admin/category',
        method: 'delete',
        data: idList
    })
}

export function categoryStatusHandler(idList : string[]) {
    return request<RequestAPI<String>>({
        url: '/api/admin/category/status',
        method: 'post',
        data: idList
    })
}

export function recycleCategory(data : string[]) {
    return request<RequestAPI<String>>({
        url: '/api/admin/bin/category',
        method: 'post',
        data
    })
}
export function removeCategoryFromDatabase(data : string[]) {
    return request<RequestAPI<String>>({
        url: '/api/admin/bin/category',
        method: 'delete',
        data
    })
}