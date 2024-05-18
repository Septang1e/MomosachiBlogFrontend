<script setup lang="ts">
import {onActivated, onMounted, reactive, ref, watch} from "vue";
import type {CommentDTO} from "@/api/comment";
import {commentPagination, updateLikeStatus} from "@/api/comment";
import {format} from "date-fns"
import ReplyCard from "@/components/ReplyCard.vue";
import {getUserLikes, updateUserLikes} from "@/utils/local-storage";
import CommentSubmitCard from "@/components/CommentSubmitCard.vue";
import {useAppStore} from "@/stores/app";
import markdownIt from "@/utils/markdown-it";

const base_page_conf = reactive({
    size : 5,
    current : 1,
    total : 0
})
const order = ref("create-time")
const appStore = useAppStore()
const rootComments : CommentDTO[] = reactive([])

const props = defineProps({
    articlePid : String
})
function paginationCurrentChange(current : number){
    base_page_conf.current = current
    rootCommentDataInit()
}

watch(appStore.getCommentRootKey, ()=>{
    rootCommentDataInit()
})

//用于初始化
function rootCommentDataInit(){
     console.log(articleId)
     commentPagination(base_page_conf.size, base_page_conf.current, articlePid.value, "-1",order.value).then((res)=>{
         const data = res.data
         base_page_conf.total = data.total
         appStore.setCurrentPage(`${articlePid}-${base_page_conf.current}`)
         rootComments.length = 0
         for(let i in data.records){
             const base_info:CommentDTO = data.records[i]

             base_page_conf.total = data.total
             base_info.feature = base_info.createTime
             base_info.content = markdownIt.render(base_info.content)
             base_info.is_liked = getUserLikes("comment", base_info.commentId)
             base_info.createTime = format(base_info.createTime, "yyyy-MM-dd hh:mm")
             rootComments.push(base_info)
             articleId.value = base_info.articlePid
         }
     })
}
const articleId = ref("")

function likeComment(item : CommentDTO){
    if(item.is_liked){
        item.likeCount--
        updateLikeStatus(item.commentId, "decrease")
    }else{
        item.likeCount++
        updateLikeStatus(item.commentId, "increase")
    }
    updateUserLikes("comment", item.commentId)
    item.is_liked = !item.is_liked
}
const articlePid = ref("")
onMounted(()=>{
    articlePid.value = <string>props['articlePid']
    appStore.commentCntInit(<string>props['articlePid'])
    rootCommentDataInit()
    appStore.changeReplyToCommentId("root")
})
</script>

<template>
    <div class="comment-card">
        <div class="comment-card-title">
            <h2>评论</h2>
            <div class="comment-cnt">
                {{appStore.getCommentCnt()}}
            </div>
        </div>
        <div class="reply-submit-box-main" v-if="appStore.replyToCommentId === 'root'">
            <comment-submit-card
                :to_id="'-1'"
                root_id = "-1"
                :article-pid="articlePid"
            />
        </div>
        <div v-if="base_page_conf.total > 0">
        <div v-for="item in rootComments" class="comment-card-container" :id="item.feature">
            <div class="comment-avatar">
                <el-avatar class="avatar-box" :size="50" :src="item.avatar"></el-avatar>
            </div>
            <div class="main-warp">
                <div class="comment-upper-wrap">
                    <div class="nickname">{{item.nickname}}</div>
                    <div class="ip-address">IP属地: {{item.ipAddress}}</div>
                </div>
                <div class="comment-lower-wrap">
                    <div class="time">{{item.createTime}}</div>
                    <div class="comment-content">
                        <div v-html="item.content"></div>
                    </div>
                    <div class="comment-btn">
                        <div class="like-box">
                            <el-icon
                                :color="item.is_liked?'lightpink':'white'"
                                @click="likeComment(item)"
                                :size="20"
                                class="like-btn bx bx-like"/>
                            {{item.likeCount}}
                        </div>
                        <div
                            class="reply"
                            @click="appStore.changeReplyToCommentId(item.commentId)"
                            :style="appStore.replyToCommentId === item.commentId ?'color:lightskyblue':'color:white'"
                        >
                            回复
                        </div>
                    </div>
                    <div class="reply-submit-box" v-if="appStore.replyToCommentId === item.commentId">
                        <comment-submit-card
                            :to_id="item.commentId"
                            :root-id=item.commentId
                            :article-pid="articlePid"
                        />
                    </div>
                    <div class="reply-box">
                        <reply-card
                            :article_pid="props['articlePid']"
                            :root_id="item.commentId"
                        />
                    </div>
                </div>
                <el-divider style="margin-top: 10px;opacity: 50%"/>
            </div>
        </div>
        <el-pagination
            layout="total, prev, pager, next,jumper"
            v-model:current-page="base_page_conf.current"
            v-model:page-size="base_page_conf.size"
            v-if="base_page_conf.total > 5"
            @currentChange="paginationCurrentChange"
            style="display: flex;align-items: center;justify-content: center;"
            :total="base_page_conf.total"
            class="pagination"
            :background="true"
        />
    </div>
    </div>
</template>

<style scoped>
.title{
    color: white;
    font-size: 25px;
}
.reply-box{
    width: 100%;
}
.main-warp{
    width: 100%;
}
.comment-cnt{
    font-size: 15px;
    margin-left: 5px;
    color: darkgrey;
}
.comment-card-title{
    display: flex;
    align-items: center;
}
.reply-submit-box-main{
    margin-left: 2%;
}
.reply-submit-box{
    width: auto;
    height: auto;
}
.comment-card-container{
    display: flex;
    .ip-address{
        opacity: 0.8;
        transition: opacity ease-in-out 0.2s;
        font-size: 10px;
        padding: 2px;
        border-radius: 8px;
    }
}
.ip-address:hover{
    opacity: 0.8;
    background-color: rgba(255,255,255,0.3);
}
.comment-avatar{
    margin-right: 6px;
}
.comment-content{
    text-indent: 20px;
    font-size: 16px;
    color: rgba(255,255,255,0.8);
}
.avatar-box{
    transition: all ease-in-out 0.6s;
}
.avatar-box:hover{
    box-shadow: lightpink 0 0 10px;
}
.comment-upper-wrap{
    display: flex;
    align-items: center;
}
.time{
    font-size: 15px;
    color: rgba(255,255,255,0.5);
    margin: 10px 0 10px 0;
    width: fit-content;
}
.comment-lower-wrap{

}
.nickname{
    font-size: 18px;
    font-weight: bold;
    margin-right: 5%;
}
.comment-btn{
    margin-top: 5px;
    display: flex;
    align-items: center;
}
.comment-content{
    display: flex;
}
.like-box{
    padding: 5px;
    align-items: center;
    font-size: 15px;
    display: flex;
    margin-right: 10px;
}
.like-btn{
    padding: 5px;
    border-radius: 50px;
    transition: opacity ease-in-out 0.4s;
}
.like-btn:hover{
    background-color: rgba(255,255,255,.4);
    cursor: pointer;
}
.like-btn:after{
    opacity: 0;
    transition: all ease-in-out 0.4s;
}
.like-btn:hover:after {
    opacity: 1;
    content: "赞";
    color: white !important;
    font-size: 10px;
    z-index: 50;
    position: absolute; /* 将提示框设置为绝对定位，相对于父元素定位 */
    top: 130%; /* 将提示框的顶部与父元素底部对齐 */
    left: 50%; /* 将提示框水平居中 */
    transform: translateX(-50%); /* 使提示框水平居中 */
    background-color: rgba(46,46,46,0.9);
    padding: 4px 6px;
    border-radius: 4px;
}
.reply{
    border-radius: 12px;
    padding: 5px;
    font-size: 12px;
    display: flex;
    align-items: center;
}
.reply:hover{
    cursor: pointer;
    background-color: rgba(255,255,255,.4);
}
.comment-card{
    border-radius: 12px;
    transition: height ease-in-out 0.7s,backdrop-filter ease-in-out 0.7s;
    padding: 0 20px 20px 20px;
    margin: 24px;
    width: calc(100% - 48px);
    height: fit-content;
}
.dark .comment-card{
    background: rgba(26, 26, 26, 0.8);
    box-shadow: rgba(26, 26, 26, 0.9) 4px 4px 12px;
}
.colorful .comment-card{
    background: rgb(121,9,34);
    background: linear-gradient(234deg, rgba(121,9,34,0.5690651260504201) 23%, rgba(103,101,215,0.5) 100%, rgba(148,187,233,1) 100%);
}
.comment-card{
    backdrop-filter: blur(2px);
}
.comment-card:hover{
    backdrop-filter: blur(12px);
}
</style>
<style>
.el-pagination__total{
    color: darkgrey !important;
}
.el-pagination__jump{
    color: darkgrey !important;
}
</style>