<script setup lang="ts">

import {CirclePlus, Delete} from "@element-plus/icons-vue";
import {onMounted, reactive, ref} from "vue";
import type {Tag, TagQueryDTO} from "@/api";
import {addTad, deleteTag, queryTagPagination, tagStatusHandler, updateTag} from "@/api";
import {ElMessage, ElMessageBox, ElTable} from "element-plus";
import {autocompleteOnQueryTag, autocompleteOnSearch} from "@/api/elasticsearch";
import {pidGenerator} from "@/api/generator";
const loading = ref(false)
const tagData : Tag[] = reactive([])
const keyword = ref("")
const dialogVisible = ref(false)
const tagRow = ref<undefined | number>(undefined)
const page_conf = reactive({
    current : 1,
    size : 10,
    total : 0
})
const tagFormData : TagQueryDTO = reactive({
    id : '',
    name: '',
    pid: '',
    status: 0
})
const tagEditData : TagQueryDTO = reactive(Object.assign({}, tagFormData))
function paginationCurrentChange(current : number) {
    page_conf.current = current
    queryTags()
}

//section utils

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<TagQueryDTO[]>([])
const multipleSelectionId = ref<string[]>([])
const toggleSelection = (rows?: TagQueryDTO[]) => {
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
const handleSelectionChange = (val: TagQueryDTO[]) => {
    multipleSelection.value = val
    multipleSelectionId.value.length = 0
    for(let i in val) {
        multipleSelectionId.value.push(val[i].id)
    }
}

//end

function queryTags() {
    loading.value = true
    queryTagPagination(page_conf.current, page_conf.size, keyword.value === "" ? undefined : keyword.value)
        .then((res)=>{
            const data = res.data
            page_conf.total = data.total
            tagData.length = 0
            const copyData : Tag[] = []

            Object.assign(copyData, data.records)
            Object.assign(tagData, copyData)
            loading.value = false
        })
}
function handleStatus(idList: string[], row : TagQueryDTO[]) {
    tagStatusHandler(idList).then((res)=>{
        if(res.code === 1) {
            ElMessage.success(<string>res.data)
            for(let i in row) {
                row[i].status = row[i].status === 0 ? 1 : 0
            }
        }
    })
}

function handleSelect(item : string) {
    keyword.value = item
}
const querySearch = (queryString: string, cb: (arg: any) => void) => {
    let results : String[] = []
    if(queryString === '') {
        cb(results)
        return
    }
    autocompleteOnQueryTag(queryString).then((res)=> {
        for(let i in res.data) {
            results.push(res.data[i])
        }
        cb(results)
    })
}
function onSearch() {
    keyword.value = keyword.value.trim()
    queryTags()
}
function handleAdd() {
    dialogVisible.value = true
    if(tagRow.value !== undefined) {
        const copyData = Object.assign({}, tagFormData)
        Object.assign(tagEditData, copyData)
        tagRow.value = undefined
    }
}

function handleEdit(row : number) {
    tagRow.value = row
    dialogVisible.value = true
    const copyData = Object.assign({}, tagData[row])
    Object.assign(tagEditData, copyData)
}
function handleCancel() {
    dialogVisible.value = false
}
function handleSaveAsDraft() {
    tagEditData.status = 1
    handleSave()
}
function handleSave() {

    if(tagEditData.name === '') {
        ElMessage.error("标签名称不能为空")
        return
    }

    if(tagRow.value !== undefined) {
        updateTag(tagEditData).then((res)=>{
            ElMessage.success(<string>res.data)
        }).finally(()=>{
            afterOperate()
        })
    }else{
        console.log(tagEditData);
        addTad(tagEditData).then((res)=>{
            ElMessage.success(<string>res.data)
        }).finally(()=>{
            afterOperate()
        })
    }
}
function handleDelete(idList: string[]) {
    ElMessageBox.confirm(`真的要删除吗`,'提示', {
        distinguishCancelAndClose: true,
        cancelButtonText: 'cancel',
        confirmButtonText: 'Yes',
    }).then(()=>{
        deleteTag(idList).then((res)=>{
            ElMessage.success(<string>res.data)
        }).finally(()=>{
            afterOperate()
        })
    }).catch(()=>{})
}
function handlePidGenerate() {
    pidGenerator().then((res)=>{
        tagEditData.pid = res.data
    })
}
function afterOperate() {
    queryTags()
}

onMounted(()=>{
    queryTags()
})

</script>

<template>
    <div class="tag-uploader-container">
        <div class="table-wrap">
            <el-card>
                <el-autocomplete
                    :fetch-suggestions="querySearch"
                    v-model="keyword" @select="handleSelect">
                    <template #default="{ item }">
                        <div class="value">{{item}}</div>
                    </template>
                </el-autocomplete>
                <el-button type="primary" class="search-btn" @click="onSearch">搜索</el-button>
            </el-card>
            <el-card
                style="margin-top: 20px"
                v-loading="loading"
            >
                <div class="toolbar-wrapper">
                    <el-button type="primary" @click="handleAdd" :icon="CirclePlus">添加标签</el-button>
                    <el-button type="danger" :icon="Delete" @click="handleDelete(multipleSelectionId)">批量删除</el-button>
                </div>
                <el-table
                    ref="multipleTableRef"
                    @selectionChange="handleSelectionChange"
                    :data="tagData"
                    style="font-weight: bold; overflow-x: hidden; margin-top: 20px">
                    <el-table-column type="selection" width="50" align="center"/>
                    <el-table-column :align="'center'" prop="id" fixed label="id"/>
                    <el-table-column align="center" prop="pid" fixed label="pid"/>
                    <el-table-column align="center" prop="name" fixed label="name"/>

                    <el-table-column align="center" prop="status" label="status">
                        <template #default="scope">
                            <el-tag
                                v-if="scope.row.status === 0"
                                type="success" style="cursor: pointer"
                                @click="handleStatus([scope.row.id], [scope.row])"
                            >
                                启用
                            </el-tag>
                            <el-tag type="danger" v-else style="cursor: pointer"
                                    @click="handleStatus([scope.row.id], [scope.row])">
                                停用
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="operate">
                        <template #default="scope">
                            <el-button type="text" @click="handleEdit(scope.$index)">edit</el-button>
                            <el-button type="text" @click="handleDelete([scope.row.id])"> delete </el-button>
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
        </div>
        <el-dialog
            v-model="dialogVisible"
            width="30%"
            :title="tagRow === undefined ? '新增标签' : '编辑标签'"
            style="overflow: auto"
        >
            <el-form
                v-model="tagEditData"
                label-position="left"
            >
                <el-form-item required label="名称">
                    <el-input v-model="tagEditData.name"/>
                </el-form-item>
                <el-form-item required label="pid">
                    <div class="pid-wrap">
                        <el-input style="margin-left: 6px;" v-model="tagEditData.pid" disabled/>
                        <el-button type="primary" @click="handlePidGenerate" disabled>重新生成</el-button>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="submit-line">
                        <el-button type="text" @click="handleCancel"> 取消 </el-button>
                        <div class="submit">
                            <el-button type="primary" @click="handleSave"> 保存 </el-button>
                            <el-button type="primary" @click="handleSaveAsDraft"> 保存为草稿 </el-button>
                        </div>
                    </div>
                </el-form-item>
            </el-form>

        </el-dialog>
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