import {request} from "@/utils/request"
import type {RequestAPI} from "@/api/RequestAPI";
import type {Tag, TagDTO} from "@/api/tag";
import type {Category} from "@/api/category";

export interface ArticleDTO {
    title : string,
    content : string,
    tags : TagDTO[],
    pid : string,
    category : string,
    categoryPid : string,
    description : string,
    //缩略图
    thumbnail : string,
    isComment : number,
    viewCount : number,
    createTime : string,
    updateTime : string,
    updateUser : string,
    createUser : string,
    likeCount: number
}
export interface ArticleFormData {
    id: string
    title: string,
    content: string,
    tags: Tag[],
    pid: string,
    thumbnail: string,
    isComment: number,//1 不能，0可以
    status: number,// 1 草稿，0默认
    categoryPid: string,
    category: string,
    description: string,
}
export interface Page<T> {
    total : number,
    size : number,
    current : number,
    orders : [],
    searchCount : boolean,
    pages : number,
    optimizeCountSql : boolean,
    maxLimit : any,
    countId : any,
    records : T[]
}


type ArticlePage = Page<ArticleDTO>

export type ArticleDTOResult = RequestAPI<ArticlePage>
export type ArticleResult = RequestAPI<ArticleDTO>
export type ArticleFormPage = RequestAPI<Page<ArticleFormData>>

export function articlePagination(current : number, size : number,
                           tagId: undefined | string, categoryId : undefined | string,
                                  keyword : undefined | string) {
    let url = `/api/article/pagination/${current}/${size}`
    if(categoryId != undefined) {
        url = `${url}?categoryPid=${categoryId}`
    }
    if(tagId != undefined) {
        url = `${url}?tagPid=${tagId}`
    }
    if(keyword != undefined) {
        url = `${url}?keyword=${keyword}`
    }
    return request<ArticleDTOResult>({
        url : url,
        method : "get"
    })
}

export function getArticleByPid(pid : string) {
    return request<ArticleResult>({
        url: `/article/${pid}`,
        method: 'get'
    })
}
export function articleBackendPagination(current: number, size: number, search: string | undefined) {
    let url = `/api/admin/article/pagination/${current}/${size}`

    if(search != undefined) {
        url = `${url}?keyword=${search}`
    }

    return request<ArticleFormPage>({
        url: url,
        method: "get"
    })
}

export function fetchDeletedArticle(current : number, size : number, keyword : string | undefined) {

    let url = `/api/admin/bin/article/pagination/${current}/${size}`
    if(keyword !== undefined) {
        url = `${url}?keyword=${keyword}`
    }

    return request<ArticleFormPage>({
        url: url,
        method: 'get'
    })
}

export function updateArticle(data : ArticleFormData) {
    return request<RequestAPI<String>>({
        url: '/api/admin/article/edit',
        method: 'post',
        data : data
    })
}
export function saveArticle(data : ArticleFormData) {
    return request<RequestAPI<String>>({
        url: '/api/admin/article/save',
        method: 'post',
        data: data
    })
}

export function articleStatusHandler(pidList : string[]) {
    return request<RequestAPI<String>>({
        url: '/api/admin/article/status',
        method: 'post',
        data: pidList
    })
}
export function deleteArticle(pidList : string[]) {
    return request<RequestAPI<String>>({
        url: '/api/admin/article/delete',
        method: 'delete',
        data: pidList
    })
}
export function increaseViewCount(pid : string) {
    return request<String>({
        url: '/api/v1/article/view',
        method: 'post',
        data: pid
    })
}

export function updateArticleLikeStatus(pid: string, status : number) {
    return request<String>({
        url: `/api/v1/article/like?status=${status}`,
        method: 'post',
        data: pid
    })
}

export function recycleArticle(data : string[]) {
    return request<RequestAPI<String>>({
        url: '/api/admin/bin/article',
        method: 'post',
        data
    })
}
export function removeArticleFromDatabase(data : string[]) {
    return request<RequestAPI<String>>({
        url: '/api/admin/bin/article',
        method: 'delete',
        data
    })
}
