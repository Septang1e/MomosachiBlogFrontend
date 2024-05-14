import {defineStore} from "pinia";
import Cookie from "vue-cookies"
import {reactive, ref} from "vue";

export const useUserStore = defineStore("user", ()=>{

    const rememberMe = ref(true)
    const adminInfo = reactive({
        article_count : 0,
        tag_count: 0,
        category_count : 0
    })
    function setRememberMe(val : boolean) {
        rememberMe.value = val
    }
    function isRemembered() {
        return rememberMe.value
    }
    function initAdminInfo(article_cnt : number, tag_cnt : number, category_cnt : number) {
        adminInfo.article_count = article_cnt
        adminInfo.category_count = category_cnt
        adminInfo.tag_count = tag_cnt
    }
    function setArticleCount(cnt : number) {
        adminInfo.article_count = cnt
    }
    function setTagCount(cnt : number) {
        adminInfo.tag_count = cnt
    }
    function setCategoryCount(cnt : number) {
        adminInfo.category_count = cnt
    }
    function getAdminInfo() {
        return adminInfo
    }

    return {isRemembered, setRememberMe,
        initAdminInfo, setArticleCount, setTagCount, setCategoryCount, getAdminInfo
    }
})