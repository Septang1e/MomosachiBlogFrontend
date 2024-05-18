import {request} from "@/utils/request";
import axios from "axios";
import type {RequestAPI} from "@/api/RequestAPI";
import type {Page} from "@/api/article";
import type {UserQueryDTO} from "@/api/user";

export interface UploadCommentInterface{
    nickname : string
    email : string,
    website : string,
    avatar : string,
    content : string,
    articlePid : string,
    toId : string,
    rootId : string,
    ipAddress : string,
    avatarRandom : string,
}

export interface CommentDTO{
    toId : string,
    rootId : string,
    articlePid : string,
    commentId : string
    toName: string
    content : string,
    nickname : string,
    feature : string
    email : string,
    website : string,
    avatar : string,
    createTime : string
    floor : string
    ipAddress : string
    likeCount : number
    is_liked : boolean
    canModify : boolean
}




export interface CommentQueryDTO{
    userQueryDTO: UserQueryDTO
    commentId: string
    articleTitle: string
    content: string
    status: number
}

export type CommentPage = Page<CommentDTO>
export type CommentExaminePage = Page<CommentQueryDTO>

export function addComment(comment : UploadCommentInterface){
    return request<{code : number,data : string}>({
        url : '/api/comment/',
        data : comment,
        method : 'post'
    })
}

export function commentPagination(size : number, current : number,
                                  articlePid : string, rootId : string, sort: string
){
    return request<RequestAPI<CommentPage>>({
        url : `/api/comment/pagination/${current}/${size}?articlePid=${articlePid}&rootId=${rootId}&sort=${sort}`,
        method : 'get'
    })
}
export function updateLikeStatus(commentId : string, operationName : string){
    return request<any>({
        url : `/api/comment/like/${commentId}?status=${operationName === 'increase' ? '0' : '1'}`,
        method : 'post'
    })
}
export function getCommentCount(articleId : string) {
    return request<RequestAPI<number>>({
        url : `/api/comment/count/${articleId}`,
        method : 'get',
    })
}

export function queryCommentExaminePage(current: number, size: number, status : number | undefined, is_deleted: number | undefined) {
    let url = `/api/admin/comment/pagination/${current}/${size}`
    if(status !== undefined && is_deleted !== undefined) {
        url = `${url}?status=${status}&is_deleted=${is_deleted}`
    }else if(is_deleted !== undefined) {
        url = `${url}?is_deleted=${is_deleted}`
    }else if(status !== undefined) {
        url = `${url}?status=${status}`
    }


    return request<RequestAPI<CommentExaminePage>>({
        url: url,
        method: 'get',
    })
}
export function acceptComment(idList: string[], msg: string | undefined) {
    let url = '/api/admin/comment/accept'
    if(msg !== undefined) {
        url = `${url}?msg=${msg}`
    }
    return request<RequestAPI<String>>({
        url: url,
        method: 'post',
        data: idList
    })
}
export function deleteComment(idList: string[], msg: string | undefined) {
    let url = '/api/admin/comment'
    if(msg !== undefined) {
        url = `${url}?msg=${msg}`
    }
    return request<RequestAPI<String>>({
        url: url,
        method: 'delete',
        data: idList
    })
}
export function removeCommentFromDatabase(data: string[]) {
    return request<RequestAPI<String>>({
        url: '/api/admin/bin/comment',
        method: "delete",
        data
    })
}
export function recoverComment(data: string[]) {
    return request<RequestAPI<String>>({
        url: '/api/admin/bin/comment',
        method: "post",
        data
    })
}