<script setup lang="ts">
import type {CommentDTO} from "@/api/comment";
import {onActivated, onMounted, reactive, ref, watch} from "vue";
import {commentPagination, updateLikeStatus} from "@/api/comment";
import {format} from "date-fns";
import Nprogress from "nprogress";
import {getUserLikes, updateUserLikes} from "@/utils/local-storage";
import CommentSubmitCard from "@/components/CommentSubmitCard.vue";
import {useAppStore} from "@/stores/app";
import markdownIt from "@/utils/markdown-it";

const replyComments : CommentDTO[] = reactive([])
const page_conf = reactive({
    size : 5,
    current : 1,
    total : 0,
    expand : false
})
const appStore = useAppStore()

const props = defineProps({
    article_pid : String,
    root_id : String,
})

function paginationCurrentChange(current : number){
    page_conf.current = current
    rootCommentDataInit()
}

function likeComment(item : CommentDTO){
    console.log(item)
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

onMounted(()=>{
    rootCommentDataInit()
})
watch(appStore.getCurrentPage, ()=>{
    page_conf.expand = false
    page_conf.current = 1
    rootCommentDataInit()
})
watch(appStore.getCommentChildKey, ()=>{
    rootCommentDataInit()
})


function rootCommentDataInit(){
    commentPagination(page_conf.size, page_conf.current, <string>props['article_pid'], <string>props['root_id'], "create-time").then((res)=>{
        const data = res.data
        replyComments.length = 0
        page_conf.total = data.total
        for(let i in data.records){
            const base_info:CommentDTO = data.records[i]
            page_conf.total = data.total
            base_info.content = markdownIt.render(base_info.content)
            base_info.is_liked = getUserLikes("comment", base_info.commentId)
            base_info.feature = base_info.createTime
            base_info.createTime = format(base_info.createTime, "yyyy-MM-dd hh:mm")
            replyComments.push(base_info)
        }
        if(!page_conf.expand && replyComments.length > 3){
            replyComments.length = 3
        }
    })
    Nprogress.done()
}

</script>

<template>
    <div>
        <div v-for="item in replyComments">
            <div class="comment-card-container reply-box">
                <div class="comment-avatar">
                    <el-avatar class="avatar-box" :size="30" :src="item.avatar"></el-avatar>
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
                                <el-icon :size="15"
                                         :color="item.is_liked?'lightpink':'white'"
                                         @click="likeComment(item)"
                                         class="like-btn bx bx-like"
                                />
                                {{item.likeCount}}
                            </div>
                            <div
                                @click="appStore.changeReplyToCommentId(item.commentId)"
                                class="reply"
                                :style="appStore.replyToCommentId === item.commentId ?'color:lightskyblue':'color:white'"
                            >
                                回复
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="reply-submit-box" v-if="appStore.replyToCommentId === item.commentId">
                <comment-submit-card
                    :root-id="props['root_id']"
                    :to_id="item.commentId"
                    :article-pid="item.articlePid"
                />
            </div>
        </div>
        <el-pagination
            layout="total, prev, pager, next,jumper"
            v-model:current-page="page_conf.current"
            v-model:page-size="page_conf.size"
            v-if="page_conf.total > 5 && (page_conf.expand)"
            @currentChange="paginationCurrentChange"
            style="display: flex;flex-wrap: wrap;justify-content: center;overflow-wrap: normal;"
            :total="page_conf.total"
            class="pagination"
            small
            :background="true"
        />
        <div class="msg" @click="page_conf.expand = true;rootCommentDataInit()" v-if="page_conf.total > 3 && !page_conf.expand">
            共有{{page_conf.total}}条评论，点击查看
        </div>
    </div>
</template>

<style scoped>
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
.main-warp{
    width: calc(100% - 48px);
}
.ip-address:hover{
    opacity: 0.8;
    background-color: rgba(255,255,255,0.3);
}
.comment-avatar{
    margin-right: 6px;
}
.comment-content{
    text-indent: 18px;
    font-size: 14px;
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
.comment-lower-wrap{
    width: fit-content;
}
.time{
    font-size: 14px;
    color: rgba(255,255,255,0.5);
    margin: 7px 0 7px 0;
    width: fit-content;
}
.nickname{
    font-size: 15px;
    font-weight: bold;
    margin-right: 5%;
}
.comment-btn{
    margin-top: 5px;
    display: flex;
    align-items: center;
}
.comment-content{
    display: block;
}
.like-box{
    padding: 5px;
    align-items: center;
    display: flex;
    margin-right: 10px;
    font-size: 15px;
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
    font-size: 8px;
    color: white !important;
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
    font-size: 10px;
    display: flex;
    align-items: center;
}
.reply:hover{
    cursor: pointer;
    background-color: rgba(255,255,255,.4);
}
.reply-box{
    margin-left: 5%;
}
.msg{
    font-size: 10px;
    color: darkgrey;

}
.msg:hover{
    cursor: pointer;
    color: lightpink;
}
.reply-submit-box{
    margin-left: 3%;
}
</style>