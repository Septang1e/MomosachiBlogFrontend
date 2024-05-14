<script setup lang="ts">

import {CirclePlus, Delete} from "@element-plus/icons-vue";
import {onMounted, reactive, ref} from "vue";
import type {CategoryQueryDTO, Tag, TagQueryDTO} from "@/api";
import {
    addCategory,
    deleteCategory,
    queryTagPagination,
    tagStatusHandler,
    updateCategory,
    autocompleteOnQueryCategory, queryCategoryPagination, categoryStatusHandler
} from "@/api";
import {ElMessage, ElMessageBox} from "element-plus";
import {pidGenerator} from "@/api/generator";
const loading = ref(false)
const categoryData : Tag[] = reactive([])
const keyword = ref("")
const dialogVisible = ref(false)
const categoryRow = ref<undefined | number>(undefined)
const page_conf = reactive({
    current : 1,
    size : 10,
    total : 0
})
const categoryFormData : CategoryQueryDTO = reactive({
    id : '',
    name: '',
    pid: '',
    status: 0
})
const categoryEditData : CategoryQueryDTO = reactive(Object.assign({}, categoryFormData))
function paginationCurrentChange(current : number) {
    page_conf.current = current
    queryCategories()
}
function queryCategories() {
    loading.value = true
    queryCategoryPagination(page_conf.current, page_conf.size, keyword.value === "" ? undefined : keyword.value)
        .then((res)=>{
            const data = res.data
            page_conf.total = data.total
            categoryData.length = 0
            const copyData : Tag[] = []

            Object.assign(copyData, data.records)
            Object.assign(categoryData, copyData)
            loading.value = false
        })
}
function handleStatus(idList: string[], row : TagQueryDTO[]) {
    categoryStatusHandler(idList).then((res)=>{
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
    autocompleteOnQueryCategory(queryString).then((res)=> {
        for(let i in res.data) {
            results.push(res.data[i])
        }
        cb(results)
    })
}
function onSearch() {
    keyword.value = keyword.value.trim()
    queryCategories()
}
function handleAdd() {
    dialogVisible.value = true
    if(categoryRow.value !== undefined) {
        const copyData = Object.assign({}, categoryFormData)
        Object.assign(categoryEditData, copyData)
        categoryRow.value = undefined
    }
}

function handleEdit(row : number) {
    categoryRow.value = row
    dialogVisible.value = true
    const copyData = Object.assign({}, categoryData[row])
    Object.assign(categoryEditData, copyData)
}
function handleCancel() {
    dialogVisible.value = false
}
function handleSaveAsDraft() {
    categoryEditData.status = 1
    handleSave()
}
function handleSave() {

    if(categoryEditData.name === '') {
        ElMessage.error("标签名称不能为空")
        return
    }

    if(categoryRow.value !== undefined) {
        updateCategory(categoryEditData).then((res)=>{
            ElMessage.success(<string>res.data)
        }).finally(()=>{
            afterOperate()
        })
    }else{
        addCategory(categoryEditData).then((res)=>{
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
        deleteCategory(idList).then((res)=>{
            ElMessage.success(<string>res.data)
        }).finally(()=>{
            afterOperate()
        })
    }).catch(()=>{})
}
function handlePidGenerate() {
    pidGenerator().then((res)=>{
        categoryEditData.pid = res.data
    })
}
function afterOperate() {
    queryCategories()
}

onMounted(()=>{
    queryCategories()
})

</script>

<template>
    <div class="category-uploader-container">
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
                    <el-button type="danger" :icon="Delete">批量删除</el-button>
                </div>
                <el-table
                    :data="categoryData"
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
            :title="categoryRow === undefined ? '新增标签' : '编辑标签'"
            style="overflow: auto"
        >
            <el-form
                v-model="categoryEditData"
                label-position="left"
            >
                <el-form-item required label="名称">
                    <el-input v-model="categoryEditData.name"/>
                </el-form-item>
                <el-form-item required label="pid">
                    <div class="pid-wrap">
                        <el-input style="margin-left: 6px;" v-model="categoryEditData.pid" disabled/>
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
.category-uploader-container{
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