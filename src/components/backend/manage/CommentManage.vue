<script setup lang="ts">

import {Delete} from "@element-plus/icons-vue";
import {onMounted, reactive, ref} from "vue";
import type {CommentQueryDTO,} from "@/api";
import {
    acceptComment, deleteComment,
    queryCommentExaminePage,
} from "@/api";
import {ElMessage, ElMessageBox} from "element-plus";
const loading = ref(false)
const msg = ref<undefined | string>(undefined)
const dialogVisible = ref(false)
const status = ref<undefined | number>()
const page_conf = reactive({
    current : 1,
    size : 10,
    total : 0
})
const commentInfo: CommentQueryDTO[] = reactive([])
const content = ref("")

function paginationCurrentChange(current : number) {
    page_conf.current = current
    queryComments()
}
function queryComments() {
    loading.value = true
    queryCommentExaminePage(page_conf.current, page_conf.size, status.value, 0)
        .then((res)=>{
            const data = res.data
            page_conf.total = data.total
            commentInfo.length = 0
            const copyData : CommentQueryDTO[] = []

            Object.assign(copyData, data.records)
            Object.assign(commentInfo, copyData)
            loading.value = false
        })
}
function handleAccept(idList: string[]) {
    acceptComment(idList, msg.value).then((res)=>{
        ElMessage.success(<string>res.data)
    }).finally(()=>{
        afterOperate()
    })
}



function handleCancel() {
    dialogVisible.value = false
}
function handleFilter() {
    status.value = status.value === undefined ? 1 : undefined
    afterOperate()
}

function handleDelete(idList: string[]) {
    ElMessageBox.confirm(`真的要删除吗`,'提示', {
        distinguishCancelAndClose: true,
        cancelButtonText: 'cancel',
        confirmButtonText: 'Yes',
    }).then(()=>{
        deleteComment(idList, msg.value).then((res)=>{
            ElMessage.success(<string>res.data)
        }).finally(()=>{
            afterOperate()
        })
    }).catch(()=>{})
}
function afterOperate() {
    queryComments()
}

onMounted(()=>{
    queryComments()
})

</script>

<template>
    <div class="tag-uploader-container">
        <div class="table-wrap">
            <el-card>
                <div
                    style="width: 120px"
                >
                    <el-tag v-if="status" style="cursor: pointer; width: 100%" @click="handleFilter">仅查看待审核评论</el-tag>
                    <el-tag v-else style="cursor: pointer; width: 100%" @click="handleFilter">查看所有评论</el-tag>
                </div>
            </el-card>
            <el-card
                style="margin-top: 20px"
                v-loading="loading"
            >
                <div class="toolbar-wrapper">
                    <el-button type="primary" :icon="Delete">批量通过</el-button>
                    <el-button type="danger" :icon="Delete">批量删除</el-button>
                </div>
                <el-table
                    :data="commentInfo"
                    style="font-weight: bold; overflow-x: hidden; margin-top: 20px">
                    <el-table-column type="selection" maxwidth="50" align="center"/>
                    <el-table-column :align="'center'" prop="user.nickname" fixed label="nickname"/>
                    <el-table-column align="center" prop="user.email" fixed label="email"/>
                    <el-table-column align="center" fixed label="emailStatus">
                        <el-tag type="danger">状态异常，点击后rejudge</el-tag>
                    </el-table-column>
                    <el-table-column align="center" prop="articleTitle" fixed label="title"/>
                    <el-table-column align="center" fixed label="content" style="max-height: 100px; display: flex; overflow: clip">
                        <template #default="scope">
                            <el-button type="primary" @click="()=>{
                                content = scope.row.content
                                dialogVisible = true
                            }"
                                style="font-weight: bold"
                            >
                                点击查看内容
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="status" label="status">
                        <template #default="scope">
                            <el-tag
                                v-if="scope.row.status === 0"
                                type="success" style="cursor: pointer"
                            >
                                审核已通过
                            </el-tag>
                            <el-tag type="danger" v-else style="cursor: pointer">
                                待审核
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="operate">
                        <template #default="scope">
                            <el-button type="text" @click="handleAccept([scope.$index])">accept</el-button>
                            <el-button type="text" @click="handleDelete([scope.row.commentId])"> pass </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    layout="total, prev, pager, next, jumper"
                    v-model:current-page="page_conf.current"
                    v-model:page-size="page_conf.size"
                    :total="page_conf.total"
                    style="align-items: center; justify-content: center; margin-top: 10px;"
                    @currentChange="paginationCurrentChange"
                    :background="true"
                />
            </el-card>
            <el-dialog
                v-model="dialogVisible">
                <el-input disabled v-model="content" type="textarea"/>
            </el-dialog>
        </div>
    </div>
</template>

<style scoped>
.tag-uploader-container{
    padding: 20px;
}
.table-wrap{

}
.search-btn{
    margin-left: 10px;
}
.pid-wrap{
    display: flex;
    width: 100%;
}
</style>