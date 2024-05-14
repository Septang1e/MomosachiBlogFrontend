import {cacheKey} from "@/constant/cache-key";

class constant{
    static readonly IS_LIKED = "is-liked"
    static readonly IS_VIEWED = "is-viewed"
    static readonly IS_REMEMBERED = "is-remembered"
}

export function getUserLikes(msgType : string, msgID : string) : boolean{
    const item: string | null = localStorage.getItem(`${cacheKey.USER_LIKE_STATUS}-${msgType}-${msgID}`)
    return item != null && item === constant.IS_LIKED
}

export function updateUserLikes(msgType : string, msgID : string){
    const is_liked : boolean = getUserLikes(msgType, msgID)
    if(is_liked){
        localStorage.removeItem(`${cacheKey.USER_LIKE_STATUS}-${msgType}-${msgID}`)
    }else{
        localStorage.setItem(`${cacheKey.USER_LIKE_STATUS}-${msgType}-${msgID}`,constant.IS_LIKED)
    }
}

export function getUserViewStatus(msgType : string, msgID : string) : boolean{
    const itemID = `${cacheKey.USER_VIEW_STATUS}-${msgType}-${msgID}`
    const item :string | null = localStorage.getItem(itemID)
    return item != null && item === constant.IS_VIEWED
}

export function updateUserViewStatus(msgType : string, msgID : string){
    const itemID = `${cacheKey.USER_VIEW_STATUS}-${msgType}-${msgID}`
    const is_viewed = getUserViewStatus(msgType, msgID)
    if(!is_viewed){
        localStorage.setItem(itemID, constant.IS_VIEWED)
    }
}

export function setToken(token : string) {
    localStorage.setItem("token", token)
}
export function getToken() {
    return localStorage.getItem("token")
}
export function removeToken() {
    localStorage.removeItem("token")
}

export function setIsRememberedStatus(val : boolean) {
    const key = cacheKey.IS_REMEMBERED_STATUS;
    localStorage.setItem(key, val.toString())
}
export function getIsRememberedStatus() {
    const key = cacheKey.IS_REMEMBERED_STATUS
    return Boolean(localStorage.getItem(key))
}