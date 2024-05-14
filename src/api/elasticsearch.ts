import type {RequestAPI} from "@/api/RequestAPI";
import {request} from "@/utils/request";

export function autocompleteOnSearch(name : String) {
    return request<RequestAPI<String[]>>({
        url: '/api/v2/autocomplete',
        method: 'post',
        data: name
    })
}
export function autocompleteOnQueryTag(name : String) {
    return request<RequestAPI<String[]>>({
        url: '/api/v2/tag/autocomplete',
        method: 'post',
        data: name,
    })
}

export function autocompleteOnQueryCategory(name: string) {
    return request<RequestAPI<String[]>>({
        url: '/api/v2/category/autocomplete',
        method: 'post',
        data: name
    })
}