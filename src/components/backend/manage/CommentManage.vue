<script setup lang="ts">

import {Delete} from "@element-plus/icons-vue";
import {onMounted, reactive, ref} from "vue";
import type {CommentQueryDTO,} from "@/api";
import {
    acceptComment, deleteComment,
    queryCommentExaminePage,
} from "@/api";
import {ElMessage, ElMessageBox, ElTable} from "element-plus";
import {emailVerify} from "@/api/user";
const loading = ref(false)
const msg = ref<undefined | string>(undefined)
const dialogVisible = ref(false)
const status = ref<undefined | number>()
const page_conf = reactive({
    current : 1,
    size : 10,
    total : 0
})

//section utils

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<CommentQueryDTO[]>([])
const multipleSelectionId = ref<string[]>([])
const is_judging = ref(new Set<String>)
const toggleSelection = (rows?: CommentQueryDTO[]) => {
    if (rows) {
        rows.forEach((row) => {
            // TODO: improvement typing when refactor table
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            multipleTableRef.value!.toggleRowSelection(row, undefined)
        })
    } else {
        multipleTableRef.value!.clearSelection()
    }
}
const handleSelectionChange = (val: CommentQueryDTO[]) => {
    multipleSelection.value = val
    multipleSelectionId.value.length = 0
    for(let i in val) {
        multipleSelectionId.value.push(val[i].commentId)
    }
}

//end

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
function rejudge(row : CommentQueryDTO) {
    console.log(row)
    is_judging.value.add(row.commentId)
    emailVerify(row.user.email, row.user.userId).then((res)=>{
        ElMessage.success(<string>res.data)
    }).finally(()=>{
        setTimeout(()=>{
            queryComments()
            is_judging.value.delete(row.commentId)
            ElMessage.success("数据可能更新成功")
        }, 5000)
    })
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
                    <el-button type="primary" :icon="Delete" @click="handleAccept(multipleSelectionId)">批量通过</el-button>
                    <el-button type="danger" :icon="Delete" @click="handleDelete(multipleSelectionId)">批量删除</el-button>
                </div>
                <el-table
                    :data="commentInfo"
                    ref="multipleTableRef"
                    @selectionChange="handleSelectionChange"
                    style="font-weight: bold; overflow-x: hidden; margin-top: 20px">
                    <el-table-column type="selection" maxwidth="50" align="center"/>
                    <el-table-column :align="'center'" prop="user.nickname" fixed label="nickname"/>
                    <el-table-column align="center" prop="user.email" fixed label="email"/>
                    <el-table-column align="center" fixed label="emailStatus">
                        <template #default="scope">
                            <el-tag type="warning" v-if="is_judging.has(scope.row.commentId)">审核中</el-tag>
                            <el-tag type="success" v-else-if="scope.row.user.emailStatus === 0">已验证</el-tag>
                            <el-tag type="warning" v-else-if="scope.row.user.emailStatus === 1" style="cursor: pointer" @click="rejudge(scope.row)">未验证</el-tag>
                            <el-tag type="danger" v-else style="cursor: pointer" @click="rejudge(scope.row)">邮箱状态异常，点击后rejudge</el-tag>
                        </template>
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
                            <el-button type="text" @click="handleAccept([scope.row.commentId])">accept</el-button>
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