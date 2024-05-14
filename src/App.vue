<script setup lang="ts">
import {RouterLink, RouterView, useRoute, useRouter} from 'vue-router'
import {onBeforeMount, onBeforeUnmount, onMounted, ref, watch} from "vue";
import Header from "@/components/Header.vue";
import NProgress from "nprogress";
import {useAppStore} from "@/stores/app";
import {request} from "@/utils/request";
import {useAnimationStore} from "@/stores/animation";
import {useUserStore} from "@/stores/user";
import {getAdminCountInfo, logout} from "@/api/user";
import {getIsRememberedStatus, setIsRememberedStatus} from "@/utils/local-storage";
const windowStyle = ref("")
const appStore = useAppStore()
const userStore = useUserStore()
const rightSideBarStatus = ref("")
const route = useRoute()


watch(() => route.fullPath, () => {
    scrollTo({
        top: 0,
        behavior: 'smooth'
    })
})

function listenerOfResize(){
    appStore.sideBarHandler()
    adjustWindowSize()
    appStore.elementDrawerHandler()

}
function listenerOfScroll(){
    appStore.hideStatusHandler()
    toolboxStatusHandler()
}

function toolboxStatusHandler(){
    rightSideBarStatus.value = ""
    if(appStore.header.hide){
        rightSideBarStatus.value = "hide-sidebar"
    }
}
onBeforeMount(()=>{
    getAdminCountInfo().then((res)=>{
        if(res.code == 1) {
            const data = res.data
            userStore.initAdminInfo(data.article_count, data.tag_count, data.category_count)
        }
    })
})

onMounted(()=>{
    appStore.setIpAddressLocation()
    listenerOfResize()
    listenerOfScroll()
    addEventListener('resize',listenerOfResize)
    addEventListener('scroll',listenerOfScroll)

    const load_time = new Date().getTime()
    const unload_time = Number(localStorage.getItem('unload-time'))
    if(!getIsRememberedStatus() && unload_time != null && load_time - unload_time >= 5000) {
        logout()
    }

    window.onbeforeunload = ()=>{
        setIsRememberedStatus(userStore.isRemembered())
        localStorage.setItem('unload-time', new Date().getTime().toString())
    }
})
onBeforeUnmount(()=>{
    removeEventListener('resize',listenerOfResize)
    removeEventListener('scroll',listenerOfScroll)
})
const adjustWindowSize = (()=>{
    windowStyle.value = `max-width:${window.innerWidth}px;min-height:${window.innerHeight}px`
    const body = document.getElementById('body')
    if(body){
        body.style.maxWidth = `${window.innerWidth}px`
    }
})

function backToTop(){
    scrollTo({
        top: 0,
        behavior:'smooth',
    })
}
const transitionName = ref("")
const router = useRouter()
const animationStore = useAnimationStore()


</script>

<template>
    <div :style="windowStyle" class="dark bg">
            <RouterView/>
        <div class="right-sidebar-tool-box" :class="rightSideBarStatus">
            <div class="back-to-top" @click="backToTop">
                <el-icon :size="40" class="bx bx-up-arrow-alt"></el-icon>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
<style>
.right-sidebar-tool-box{
    position: fixed;
    right: 10px;
    top: 70%;
    z-index: 255;
    transition: all ease-in-out 0.4s;
}
.hide-sidebar{
    opacity: 0;
    transform: translateX(60px);
}
.back-to-top{
    background-color: rgba(255,182,193,0.7);
    border-radius: 8px;
    transition: all ease-in-out 0.4s;
    color: rgba(255,255,255,0.5);
}
.back-to-top:hover{
    cursor: pointer;
    box-shadow: lightpink 0 0 6px;
    color: rgba(255,255,255,0.7);
}
</style>