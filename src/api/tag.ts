import type {RequestAPI} from "@/api/RequestAPI";
import {request} from "@/utils/request";
import type {Page} from "@/api/article";
import type {CategoryQueryRequestData} from "@/api/category";

export interface Tag {
    id: string,
    name: string,
    pid: string,
}

export interface TagDTO {
    tag : Tag,
    articleCount : string
}

export interface TagQueryDTO {
    id: string,
    name: string,
    pid: string,
    status: number,
}
export type TagDTOResult = RequestAPI<TagDTO>
export type TagPageResult = RequestAPI<Page<TagQueryDTO>>

export function getTags() {
    return request<TagDTOResult>({
        url: '/api/tags',
        method : 'get'
    })
}

export function queryTagPagination(current: number, size: number, keyword : string | undefined) {
    let url = `/api/admin/tag/pagination/${current}/${size}`
    if(keyword !== undefined) {
        url = `${url}?keyword=${keyword}`
    }
    return request<TagPageResult>({
        url: url,
        method: 'get'
    })
}
export function tagStatusHandler(idList: string[]) {
    return request<RequestAPI<String>>({
        url: '/api/admin/tag/status',
        method: "post",
        data: idList
    })
}
export function addTad(tag : TagQueryDTO) {
    return request<RequestAPI<String>>({
        url: '/api/admin/tag/save',
        method: 'post',
        data: tag
    })
}
export function updateTag(tag: TagQueryDTO) {
    return request<RequestAPI<String>>({
        url: '/api/admin/tag/edit',
        method: 'post',
        data: tag
    })
}
export function deleteTag(idList: string[]) {
    return request<RequestAPI<String>>({
        url: '/api/admin/tag',
        method: 'delete',
        data: idList
    })
}

export function fetchDeletedTag(current : number, size : number, keyword : string | undefined) {
    let url = `/api/admin/bin/tag/pagination/${current}/${size}`
    if(keyword !== undefined) {
        url = `${url}?keyword=${keyword}`
    }
    return request<TagPageResult>({
        url: url,
        method: "get"
    })
}

export function recycleTag(data : string[]) {
    return request<RequestAPI<String>>({
        url: '/api/admin/bin/tag',
        method: 'post',
        data
    })
}
export function removeTagFromDatabase(data : string[]) {
    return request<RequestAPI<String>>({
        url: '/api/admin/bin/tag',
        method: 'delete',
        data
    })
}