<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {onBeforeUnmount, onMounted, reactive, ref, watch} from "vue";
import type {ArticleDTO, ArticleDTOResult} from "@/api/article";
import {articlePagination} from "@/api/article";
import {format} from "date-fns"
import {timeTransform} from "@/utils/time-utils";
import Nprogress from "nprogress";

const route = useRoute()
const router = useRouter()
const name = ref("")
const pagination_card_class = ref("left-and-right-layout")
const max_width = ref("")
function pagination_card_adjustment() {
    const scale = window.devicePixelRatio
    if(window.innerWidth > 240 * scale) {
        pagination_card_class.value = "left-and-right-layout"
    }else {
        pagination_card_class.value = "up-and-down-layout"
    }
    max_width.value = `${window.innerWidth}px`
}



onMounted(()=>{
    pagination_card_adjustment()
    getArticlePage()
    addEventListener('resize', pagination_card_adjustment)
})

onBeforeUnmount(()=>{
    removeEventListener('resize', pagination_card_adjustment)
})

const articleInfo : ArticleDTO[] = reactive([])
const pageInfo = reactive({
    size : 5,
    total : 0,
    current : 1
})
const msg = ref("none-msg")


watch(() => route.fullPath, ()=>{
    getArticlePage()
})

function getArticlePage() {
    Nprogress.start()
    articleInfo.length = 0
    name.value = <string>route.name

    let tagID : string | undefined = undefined
    let categoryID : string | undefined = undefined
    let search : string | undefined = undefined

    if(name.value === "search") {
        search = <string>route.query.keyword
    }else if(name.value === "categoryPagination"){
        categoryID = <string>route.params["id"]
    }else if(name.value === "tagPagination") {
        tagID = <string>route.params["id"]
    }


    articlePagination(pageInfo.current, pageInfo.size, tagID, categoryID, search)
        ?.then((res) => {
            pageInfo.total = res.data.total
            msg.value = res.message
            for (let i in res.data.records) {
                articleInfo.push(res.data.records[i])
                if(articleInfo[i].tags.length > 3) articleInfo[i].tags.length = 3
                articleInfo[i].createTime = timeTransform(articleInfo[i].createTime)
                articleInfo[i].updateTime = timeTransform(articleInfo[i].updateTime)
            }
        })
    Nprogress.done()
}

function paginationCurrentChange(val : number) {
    pageInfo.current = val
    getArticlePage()
}
</script>

<template>
    <div id="main-wrap"
         :style="max_width" :class="pagination_card_class">
        <div class="message" v-if="msg != 'none-msg'" v-html="msg"></div>
        <div v-for="item in articleInfo">
            <router-link :to="`/article/${item.pid}`" class="pagination-wrap">
                <div class="left-wrap">
                    <div class="thumbnails">
                        <el-image fit="fill" :src="item.thumbnail"/>
                    </div>
                </div>
                <div class="right-wrap">
                    <div class="right-container">
                        <div id="title">
                            {{item.title}}
                        </div>
                        <div class="time-container">
                            <div class="create-time">
                                <el-icon :size="15" class="bx bx-calendar" />{{item.createTime}}
                            </div>
                            <div class="update-time">
                                <el-icon class="bx bx-history" :size="15"/>{{item.updateTime}}
                            </div>
                        </div>
                        <div class="description" v-if="pagination_card_class === 'left-and-right-layout'">
                            {{item.description}}
                        </div>
                        <div class="tags">
                            <div v-for="tag in item.tags">
                                <router-link :to="`/tag/${tag.tag.pid}`" style="text-decoration: none;">
                                    <div class="tag-container">
                                        <div class="symbol">
                                            #
                                        </div>
                                        {{tag.tag.name}}
                                    </div>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </router-link>
        </div>
        <el-pagination
            layout="total, prev, pager, next,jumper"
            v-model:current-page="pageInfo.current"
            v-model:page-size="pageInfo.size"
            v-if="pageInfo.total > pageInfo.size"
            @currentChange="paginationCurrentChange"
            style="display: flex;align-items: center;justify-content: center;width: 100%;"
            :total="pageInfo.total"
            class="pagination"
            :background="true"
        />
    </div>
</template>

<style scoped>
.pagination-wrap{
    text-decoration: none;
    color: white;
    width: 100%;
    overflow: clip;
    border-radius: 12px;
    margin-bottom: 25px;
    display: flex;
    transition: all ease-in-out 0.4s;
    box-sizing: border-box;
    position: relative;
}
.category-info{
    position: absolute;
    top: 10px;
    z-index: 1;
    border-radius: 4px;
    padding: 2px 5px;
    font-weight: bold;
    transition: all ease-in-out 0.7s;
    right: 10px;
}
.dark .category-info{
    color: rgba(255,255,255,0.7);
    backdrop-filter:  contrast(150%);
}
.dark .category-info:hover{
    color: white;
    backdrop-filter: blur(20px) contrast(500%);
}



.dark .pagination-wrap{
    background: rgba(26, 26, 26, 0.8);
    box-shadow: rgba(0, 0, 0, 0.9) 4px 4px 12px;
}
.dark .pagination-wrap:hover{
    box-shadow: lightpink 0px 0px 16px;
}
.colorful .pagination-wrap{
    background: rgb(121,9,34);
    background: linear-gradient(120deg, rgba(121,7,5,0.45) 27%, rgba(103,101,215,0.5) 100%, rgba(250,187,233,0.37) 100%);
}

.thumbnails{
    transition: all ease-in-out 0.9s;
}

.pagination-wrap:hover{
    .thumbnails{
        scale: 1.05;
    }
}

.message{
    color: lightpink;
    text-shadow: lightpink 0 0 10px;
    transition: all ease-in-out 0.4s;
    font-weight: bold;
}

#main-wrap{
    >>>.search-info-box{
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 25px;
    }
    >>>.search-inner-box{
        display: flex;
        cursor: pointer;
        align-items: center;
        width: fit-content;
        transition: all ease-in-out 0.4s;
    }
    >>>.search-inner-box:hover{
        text-shadow: lightpink 0 0 25px;
    }

    >>>.search_info{
        margin : 10px;
    }
}

.left-and-right-layout{
    margin: 24px;
    .pagination-wrap{
        height: 180px;
    }
    .thumbnails{
        height: 100%;
        width: 100%;
    }

    .left-wrap{
        width: 40%;
    }

    .right-wrap{
        width: 60%;
        margin-left: 15px;
        .time-container{
            margin-top: 15px;
        }
        #title{
            margin-top: 15px;
        }
        .description{
            margin-top: 15px;
        }
        .tags{
            margin-top: 15px;
        }
    }
}
.up-and-down-layout{
    margin: 24px;
    .thumbnails{
        max-height: 150px;
    }
    .pagination-wrap{
        flex-direction: column;
        height: 280px;
    }
    .left-wrap{
        width: 100%;
        height: 150px;
    }
    .time-container{
        margin-top: 10px;
    }
    .right-wrap{
        width: 100%;
    }
    .description{
        visibility: hidden;
    }
}

#title{
    color: white;
    font-weight: bold;
    display: flex;
    font-size: 25px;
    margin-top: 15px;
    transition: all ease-in-out 0.4s;
}
.pagination-wrap:hover {
    #title {
        color: pink;
        text-shadow: 0 0 25px lightpink;
    }
    backdrop-filter: blur(15px);
}
.symbol{
    color: darkgrey;
    font-size: 18px;
    font-weight: bold;
}
.description{
    color: darkgrey;
    font-size: 12px;
    font-weight: bold;
    display: flex;
    text-overflow: clip;
}

.pagination-wrap:hover{
    cursor: pointer;
}
#main-wrap{
    display: flex;
    flex-direction: column;
    height: fit-content;
    width: 100%;
    justify-items: center;
}
.left-wrap{
    background-color: white;
    overflow: clip;
}
.right-wrap{
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
}
.right-container{
    margin-left: 10px;
}
.time-container{
    display: flex;
    margin: 5px 0;
    width: 100%;
    font-size: 12px;
    flex-wrap: wrap;
    overflow-x: hidden;
}
.create-time{
    display: flex;
    align-items: center;
}
.update-time{
    display: flex;
    align-items: center;
}
.update-time{
    margin-left: 5%;
}
.description{
    text-wrap: normal;
    display: flex;
    font-size: 10px;
    height: 26px;
    text-overflow: ellipsis;
    text-indent: 8px;
    overflow: hidden;
}
.tag-container:hover{
    color: pink;text-shadow: lightpink 0 0 25px;
    .symbol{
        color: pink;
    }
}
.tag-container {
    display: flex;
    color: white;
    font-size: 14px;
    margin-right: 10px;
    align-items: center;
}
.tags{
    display: flex;
}
</style>
<style>
.el-pagination__total{
    color: white !important;
    font-weight: bold;
}
.el-pagination__goto{
    color: white;
    font-weight: bold;
}
</style>