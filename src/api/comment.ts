import {request} from "@/utils/request";
import axios from "axios";
import type {RequestAPI} from "@/api/RequestAPI";

export interface UploadCommentInterface{
    nickname : string
    email : string,
    website : string,
    avatar : string,
    content : string,
    articleId : string,
    fatherId : string,
    pid : string,
    rootParentId : string,
    ipAddress : string,
    avatarRandom : string,
}

export interface CommentDTO{
    fatherId : string,
    rootParentId : string,
    articleId : string,
    content : string,
    nickname : string,
    feature : string
    email : string,
    website : string,
    avatar : string,
    createTime : string
    commentId : string
    floor : string
    replyToFeature : string
    replyTo : string
    ipAddress : string
    likeCount : number
    is_liked : boolean
    canModify : boolean
}
export function addComment(comment : UploadCommentInterface){
    return request<{code : number,data : string}>({
        url : '/api/comment/add',
        data : comment,
        method : 'post'
    })
}
export function getCommentWithArticlePid(pageSize : number, current : number, articlePid : string){
    return request<any>({
        url : `/api/comment/get?articlePid=${articlePid}&pageSize=${pageSize}&pageNum=${current}`,
        method : 'get'
    })
}
export function getCommentWithArticleId(pageSize : number, current : number, articleId : string, rootParentId : string){
    return request<any>({
        url : `/api/comment/get?articleId=${articleId}&pageSize=${pageSize}&pageNum=${current}&rootParentId=${rootParentId}`,
        method : 'get'
    })
}
export function updateLikeStatus(commentId : string, operationName : string){
    if(operationName === 'increase' || operationName === 'decrease'){
        return request<any>({
            url : `api/comment/${operationName}/${commentId}`,
            method : 'post'
        })
    }else{
        console.error("invalidUrl")
    }
}
export function getCommentCount(articleId : string) {
    return request<RequestAPI<number>>({
        url : `api/comment/count/${articleId}`,
        method : 'get',
    })
}