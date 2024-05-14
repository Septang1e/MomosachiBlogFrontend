import {request} from "@/utils/request";
import type {RequestAPI} from "@/api/RequestAPI";

export function pidGenerator() {
    return request<RequestAPI<string>>({
        url: '/api/admin/generator/pid',
        method: 'get'
    })
}