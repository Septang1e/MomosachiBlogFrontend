import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import axios from "axios";
import {getCommentCount} from "@/api/comment";

interface SideBar{
    opened : boolean
}

interface Header{
    element_drawer : boolean
    hide : boolean
    drawer : boolean
}

class Configuration{
    static readonly sideBarStatus : number = 760
    static readonly headerStatus : number = 400
}


function handleSideBarStatus(conf : number){
    const scale = window.devicePixelRatio
    return window.innerWidth > conf * scale
}

export const useAppStore = defineStore("app",()=>{
    const current_page = ref("")
    const replyToCommentId = ref("")
    const commentCnt = ref(0)
    const ipAddressLocation = ref("")
    const sideBar : SideBar = reactive({
        opened : handleSideBarStatus(Configuration.headerStatus)
    })
    const header : Header = reactive({
        element_drawer : handleSideBarStatus(Configuration.headerStatus),//根据分辨率动态地处理元素样式
        hide : true,//用于class的切换
        drawer : false//用于按钮的点击
    })
    const toc = ref(handleSideBarStatus(Configuration.sideBarStatus))//用于处理toc

    const commentCardKey = ref(0)
    function commentHandleUpdate() {
        commentCardKey.value++
    }
    function getCommentCardKey(){
        return commentCardKey.value
    }
    function tocHandler() {
        toc.value = handleSideBarStatus(Configuration.sideBarStatus)
    }
    function getTocStatus() {
        return toc.value
    }

    const previousScrollY = ref(1200)
    function sideBarHandler(){
        sideBar.opened = handleSideBarStatus(Configuration.headerStatus)
    }
    function elementDrawerHandler(){
        header.element_drawer = handleSideBarStatus(Configuration.headerStatus)
        if(header.element_drawer) {
            header.drawer = false
        }
    }
    function drawerHandler(){
        header.drawer = !header.drawer
    }
    function hideStatusHandler(){
        const scrollY = window.scrollY
        header.hide = (scrollY - previousScrollY.value > 0 && scrollY != 0);
        previousScrollY.value = scrollY
    }
    function changeReplyToCommentId(id : string){
        if(id === replyToCommentId.value){
            replyToCommentId.value = "root"
            console.log(replyToCommentId.value)
            return
        }
        replyToCommentId.value = id
    }
    function getCommentCnt(){
        return commentCnt.value
    }
    function commentCntInit(commentId : string){
        getCommentCount(commentId).then((res) => {
            commentCnt.value = res.data
        })
    }
    function commentCntDecrease(val : number){
        commentCnt.value -= val
    }
    function getIpAddressLocation(){
        return ipAddressLocation.value
    }
    function setIpAddressLocation(){

        //axios.get('http://ip-api.com/json?lang=zh-CN')
         //   .then((response) => {
         //       ipAddressLocation.value = `${response.data.country} ${response.data.regionName} ${response.data.city}`
         //   })

    }
    function getCurrentPage(){
        return current_page.value
    }
    function setCurrentPage(current : string){
        current_page.value = current
    }
    return {
        header, sideBar, elementDrawerHandler,
        drawerHandler, hideStatusHandler, sideBarHandler,
        replyToCommentId, changeReplyToCommentId, getCommentCnt,
        commentCntInit, commentCntDecrease,
        setIpAddressLocation, getIpAddressLocation,
        getCurrentPage, setCurrentPage,
        getCommentCardKey, commentHandleUpdate,
        tocHandler, getTocStatus
    }
})