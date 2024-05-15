import {request} from "@/utils/request";
import axios from "axios";
import type {RequestAPI} from "@/api/RequestAPI";
import type {Page} from "@/api/article";

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

export type CommentPage = Page<CommentDTO>

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