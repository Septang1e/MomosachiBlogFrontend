<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {addComment} from "@/api/comment";
import type {UploadCommentInterface} from "@/api/comment";
import {ElMessage} from "element-plus";
import getRandomInt from "@/utils/calculation";
import {useAppStore} from "@/stores/app";
    const commentData = reactive({
        nickname : '',
        email : '',
        website : '',
        content: '',
        avatar : 'not-update'
    })

const appStore = useAppStore()

const props = defineProps({
    article_pid : String,
    to_id : String,
    root_id : String
})
function validateEmail(email: string): boolean {
    const pattern: RegExp = /(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/
    return !pattern.test(email)
}
    function submit(){
        if(commentData.nickname.trim() === ''){
            ElMessage.error("名称不能为空哦")
            return
        }
        const email = ref("");
        if((email.value = commentData.email.trim()) === ''){
            ElMessage.error("邮箱不能为空哦")
            return
        }
        if(validateEmail(email.value)) {
          ElMessage.error("邮箱格式不正确")
          return
        }
        if(commentData.content.trim() === ''){
            ElMessage.error("内容不能为空哦")
            return
        }
        commentData.content = commentData.content.trim()
        commentData.email = commentData.email.trim()
        commentData.website = commentData.website.trim()
        commentData.nickname = commentData.nickname.trim()
        const commentDTO : UploadCommentInterface = reactive({
            nickname : commentData.nickname,
            email : commentData.email,
            content : commentData.content,
            website : commentData.website,
            ipAddress : useAppStore().getIpAddressLocation(),
            articlePid : <string>props['article_pid'],
            avatar : commentData.avatar,
            toId : <string>props["to_id"],
            rootId : <string>props["root_id"],
            avatarRandom : `src/assets/avatar/momosachi_blog_basic_avatar_${getRandomInt(1, 2)}.png`
        })
        console.log(commentDTO)
        addComment(commentDTO).then((res)=>{
            if(res.code == 1) {
                ElMessage.success("发送成功")
                if(commentDTO.rootId === '-1' && commentDTO.toId === '-1') {
                    appStore.rootCommentUpdateHandler()
                }else{
                    appStore.childCommentUpdateHandler()
                }
            }else{
                ElMessage.error("发送失败")
            }
        })
    }
</script>

<template>
    <div class="comment-submit-card">
            <div class="user-info">
                <label>
                    用户名
                    <span style="color:pink">*</span>
                </label>
                <el-input
                    v-model="commentData.nickname"
                    placeholder="username"
                    :size="'default'">
                </el-input>
            </div>
            <div class="user-info">
                <label>
                    邮箱
                    <span style="color:pink">*</span>
                </label>
                <el-input v-model="commentData.email"
                          placeholder="email (将保密)"
                          :size="'default'"
                          slot="@"
                ></el-input>
            </div>
            <div class="user-info">
                <label>
                    网站或博客
                </label>
                <el-input :size="'default'" v-model="commentData.website"
                          placeholder="website"
                ></el-input>
            </div>
        <el-input
            type="textarea"
            class="text-area"
            v-model="commentData.content"
            :rows="2"
            :autosize="{ minRows: 2, maxRows: 6 }"
            placeholder="说点什么吧，支持markdown喵~"
        ></el-input>
    </div>
    <el-button class="submit-btn" type="primary" @click="submit">发表评论</el-button>
</template>

<style scoped>
    .comment-submit-card{
        height: 100%;
        width: calc(100% - 48px);
        display: flex;
        flex-wrap: wrap;
    }
    .user-info{
        padding: 2px 10px;
    }
    .box{
        display: flex;
    }
    label{
        font-size: 12px;
        color: darkgrey;
    }
    .text-area{
        padding: 2px 10px;
        width: calc(100% - 20px);
        margin-top: 5px;
    }
    .submit-btn{
        margin-left: 10px;
        margin-top: 5px;
        top: 100%;
        margin-bottom: 5px;
    }
</style>