<script lang="ts" setup>

import Header from "@/components/Header.vue"
import {onBeforeUnmount, onMounted, reactive, ref, watch} from "vue";
import AdminCard from "@/components/AdminCard.vue";
import CategoryCard from "@/components/CategoryCard.vue";
import {useAppStore} from "@/stores/app";
import CommentCard from "@/components/CommentPage.vue";
import ArticleCard from "@/components/ArticleCard.vue";
import {useRoute} from "vue-router";
import type {ArticleDTO} from "@/api/article";
import {getArticleByPid, increaseViewCount, updateArticleLikeStatus} from "@/api/article";
import markdownIt, {tocAst, tocHtml} from "@/utils/markdown-it";
import TagsCard from "@/components/TagsCard.vue";
import ClipboardJS from "clipboard";
import {ElMessage} from "element-plus";
import {timeTransform} from "@/utils/time-utils";


//svg
import LikeUrl from "@/assets/icons/view.svg"
import {getUserLikes, getUserViewStatus, updateUserLikes, updateUserViewStatus} from "@/utils/local-storage";
import {tocGenerator} from "@/utils/common";
import type {TocAst} from "markdown-it-toc-done-right";
import {useTocStore} from "@/stores/toc";
import TocCard from "@/components/TocCard.vue";

const appStore = useAppStore()
const windowStyle = ref("")
const tocStore = useTocStore()
const loading = ref(true)

const route = useRoute()
const PID = <string>route.params["id"]
const is_liked = ref(false)
const msgType = "article"

const article : ArticleDTO = reactive({
    title : "",
    content : "",
    tags : [],
    pid : "",
    category : "",
    categoryPid: '',
    description : "",
    //缩略图
    thumbnail : '',
    isComment : 0,
    viewCount : 0,
    createTime : '',
    updateTime : '',
    updateUser : '',
    createUser : '',
    likeCount: 0,
})


onMounted(()=>{

    getArticleInfo()
    adjustWindowSize()
    //addEventListener('click', handleClick)
    addEventListener('resize',adjustWindowSize)
    addEventListener('scroll', handleSideBarTransition)
})
onBeforeUnmount(()=>{
    removeEventListener('resize',adjustWindowSize)
    clipboard.destroy()
})
const toc : TocAst[] = reactive([])
const toc_status = ref(appStore.getTocStatus())
const adjustWindowSize = (()=>{
    windowStyle.value = `max-width:${window.innerWidth - 40}px;`
    appStore.tocHandler()
    toc_status.value = appStore.getTocStatus()
})

/**
watch(() => route.fullPath, ()=>{
    let path = route.fullPath
    const id = '#' + path.substring(path.indexOf('#'))
    const ele = document.querySelector(id)
    if(ele) {
        ele.scrollIntoView({
            behavior: 'smooth'
        })
    }
})
 **/


function getArticleInfo() {

    loading.value = true
    getArticleByPid(<string>PID).then((res)=>{
        Object.assign(article, res.data)
        is_liked.value = getUserLikes(msgType, article.pid)

        //generate Tokens

        tocAst.length = 0
        tocHtml.value = ""
        article.content = markdownIt.render(article.content)
        toc.length = 0
        Object.assign(toc, tocAst)
        console.log("toc is ", toc)
        tocStore.initTocAst()
        tocStore.setTocAst(toc)

        //end

        article.updateTime = timeTransform(article.updateTime)
        article.createTime = timeTransform(article.createTime)
        const is_viewed = getUserViewStatus(msgType, article.pid)


        if(!is_viewed) {
            updateUserViewStatus(msgType, article.pid)
            increaseViewCount(article.pid)
            article.viewCount++
        }
        loading.value = false
    })
}
const transition_sidebar = ref("")
function handleSideBarTransition() {
    const scrollY = window.scrollY
    const upperStatus = 400
    const mid_content_height = ref(0)
    const element = document.querySelector('.bottom-content')
    if(element) {
        mid_content_height.value = element.clientHeight
    }
    if(scrollY > upperStatus) {
        transition_sidebar.value = `transform: translateY(${Math.min(scrollY - upperStatus, mid_content_height.value - upperStatus)}px)`
    }else{
        transition_sidebar.value = ""
    }
}

const clipboard = new ClipboardJS('.copy-btn')
clipboard.on('success',(e)=>{
    ElMessage.success("复制成功")
})
clipboard.on('error',(e)=>{
    ElMessage.error("复制失败")
})


function scrollInToView() {
    const ele = document.querySelector('.bottom-content')
    if(ele) {
        ele.scrollIntoView({behavior:'smooth'})
    }
}
function likeArticle() {
    if(is_liked.value) {
        article.likeCount--
        updateUserLikes(msgType, article.pid)
        updateArticleLikeStatus(article.pid, 1).then((res)=>{

        })
    }else{
        article.likeCount++
        updateUserLikes(msgType, article.pid)
        updateArticleLikeStatus(article.pid, 0).then((res)=>{

        })
    }
    is_liked.value = !is_liked.value
}

</script>

<template>
    <Header/>
    <div id="home">
        <div class="bottom-content">
            <div class="side-bar" v-if="appStore.sideBar.opened">
                <div class="inner-side" :style="transition_sidebar">
                    <AdminCard/>
                    <CategoryCard style="margin-top: 20px;"/>
                    <tags-card style="margin-top: 20px"/>
                </div>
            </div>
            <div class="main-content">
                <div class="article-page-container" :style="loading ? 'min-height: 100vh': ''" v-loading="loading">
                    <div id="title">
                        {{article.title}}
                    </div>
                    <div class="basic-info">
                        <div class="create-time">
                            <el-icon :size="15" class="bx bx-calendar" />{{article.createTime}}
                        </div>
                        <div class="update-time">
                            <el-icon class="bx bx-history" :size="15"/>{{article.updateTime}}
                        </div>
                        <div class="view-count">
                            <el-icon class="bx view-count-icon" style="margin-right: 1px" :size="18"></el-icon>
                            {{article.viewCount}}
                        </div>
                        <div class="like-count">
                            <el-icon class="bx bx-like" style="margin-right: 1px" :size="15"/>
                            {{article.likeCount}}
                        </div>
                    </div>
                    <el-divider border-style="dashed" style="margin-top: 0"/>
                    <article-card
                        :content="article.content"
                    />
                    <div class="like-btn-wrap" v-if="!loading">
                        <div class="like-btn" @click="likeArticle()" :style="is_liked?'background-color:rgba(135,206,250,0.5);color:white;':'currentColor'">
                            <el-icon class="bx bx-like"
                                     :size="18"
                                     style="margin-right: 15%"
                            />
                            <div class="like-text">
                                赞
                                {{article.likeCount}}
                            </div>
                        </div>
                        <div class="btn-info">
                            如果喜欢的话，不妨点个赞支持一下吧
                        </div>
                    </div>
                </div>
                <CommentCard
                    :article-pid="<string>PID"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.bottom-content{
    justify-content: center;
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: row;
    overflow-x: hidden;
}
.inner-side{
    height: fit-content;
}
#home{
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    overflow-x: hidden;
    margin-top: 25px;
}
.side-bar{
    display: flex;
    margin: 24px;
    flex-direction: column;
    width: 33%;
    max-width: 250px;
}
.main-content{
    height: fit-content;
    display: flex;
    color: white;
    justify-content: center;
    max-width: 1050px;
    width: calc(100% - 6px);
    flex-wrap: wrap;
    z-index: 0;
}
.create-time{
    margin-right: 2%;
    align-items: center;
    display: flex;
}
.update-time{
    margin-right: 2%;
    align-items: center;
    display: flex;
}
.view-count-icon{
    mask-image: url("@/assets/icons/view.svg");
    color: white;
    background-color: currentColor;
}
.view-count{
    margin-right: 2%;
    align-items: center;
    display: flex;
}
.like-count{
    margin-right: 2%;
    align-items: center;
    display: flex;
}
.like-btn-wrap{
    margin-top: 30px;
    width: 100%;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.like-btn{
    width: 65px;
    height: 20px;
    padding: 10px;
    border-radius: 15px;
    align-items: center;
    color: rgba(215,215,215);
    display: flex;
    cursor: pointer;
    background-color: rgba(26,26,26,0.5);
}
.like-btn:hover{
    backdrop-filter: blur(2px) contrast(80%) brightness(200%);
}
.like-text{
    align-items: center;
    align-content: center;
    font-size: 15px;
}
.btn-info{
    margin-top: 5px;
    cursor: default;
    font-weight: bold;
    color: rgba(255,255,255,0.7);
}
.light #title{
    color: black;
}

.dark #title{
    color: white;
}
#title{
    font-weight: bold;
    font-size: 30px;
    cursor: pointer;
    width: fit-content;
}
.theme-test{
    background: 100% !important;
}
.dark .article-page-container{
    background: rgba(26, 26, 26, 0.8);
    box-shadow: rgba(26, 26, 26, 0.9) 4px 4px 12px;
}
.colorful .article-page-container{
    background: rgb(121,9,34);
    background: linear-gradient(98deg, rgba(125,25,70,0.33) 39%, rgba(103,101,215,0.5) 100%, rgba(250,187,233,0.37) 100%);
}
.article-page-container{
    backdrop-filter: blur(2px);
    transition: all ease-in-out 0.7s;
}
.article-page-container:hover{
    backdrop-filter: blur(12px);
}
.dark #icon{
    fill: white !important;
}

.basic-info{
    margin-top: 25px;
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    overflow-x: clip;
    align-items: center;
}
.article-page-container{
    margin: 24px;
    border-radius: 12px;
    width: calc(100% - 48px);
    padding: 20px;
    height: fit-content;
}
.toc-card-wrap{
    width: 30%;
    margin: 24px;
    max-width: 250px;
}
</style>