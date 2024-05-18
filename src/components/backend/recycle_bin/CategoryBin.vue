<script setup lang="ts">

import {onMounted, reactive, ref} from "vue";
import {
    autocompleteOnSearch,
    fetchDeletedCategory, recycleCategory,
    removeCategoryFromDatabase
} from "@/api";
import type {CategoryQueryDTO} from "@/api"

import {CirclePlus, Delete} from "@element-plus/icons-vue";
import {ElMessage, ElMessageBox, ElTable} from "element-plus";

const keyword = ref<string>("")
const categoryData : CategoryQueryDTO[] = reactive([])
const loading = ref(false)
const page_conf = {
    current: 1,
    size: 10,
    total: 0
}

//section utils

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<CategoryQueryDTO[]>([])
const multipleSelectionId = ref<string[]>([])
const toggleSelection = (rows?: CategoryQueryDTO[]) => {
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
const handleSelectionChange = (val: CategoryQueryDTO[]) => {
    multipleSelection.value = val
    multipleSelectionId.value.length = 0
    for(let i in val) {
        multipleSelectionId.value.push(val[i].id)
    }
}

//end

function queryCategory() {
    loading.value = true
    fetchDeletedCategory(page_conf.current, page_conf.size,
        keyword.value === '' ? undefined : keyword.value).then((res)=>{
        categoryData.length = 0
        page_conf.total = res.data.total
        Object.assign(categoryData, res.data.records)
    }).finally(()=>{
        loading.value = false
    })
}

const querySearch = (queryString: string, cb: (arg: any) => void) => {
    let results : String[] = []
    if(queryString === '') {
        cb(results)
        return
    }
    autocompleteOnSearch(queryString).then((res)=> {
        for(let i in res.data) {
            results.push(res.data[i])
        }
        cb(results)
    })
}

function handleSearch() {
    queryCategory()
}

function paginationCurrentChange(val : number) {
    page_conf.current = val
    queryCategory()
}

function handleRecover(idList : string[]) {
    recycleCategory(idList).then((res)=>{
        ElMessage.success(<string>res.data)
    }).finally(()=>{
        afterOperate()
    })
}
function handleDelete(idList: string[]) {
    ElMessageBox.confirm(`真的要删除吗`,'提示', {
        distinguishCancelAndClose: true,
        cancelButtonText: 'cancel',
        confirmButtonText: 'Yes',
    }).then(()=>{
        removeCategoryFromDatabase(idList).then((res)=>{
            ElMessage.success(<string>res.data)
        }).finally(()=>{
            afterOperate()
        })
    }).catch(()=>{})
}

function handleSelect(item : string) {
    keyword.value = item
}

function afterOperate() {
    queryCategory()
}

onMounted(()=>{
    queryCategory()
})


</script>

<template>

    <div class="article-bin-container">
        <el-card>
            <el-autocomplete
                :fetch-suggestions="querySearch"
                v-model="keyword" @select="handleSelect"
            >
                <template #default="{ item }">
                    {{item}}
                </template>
            </el-autocomplete>
            <el-button style="margin-left: 10px"  @click = "handleSearch"
                       type="primary">搜索</el-button>
        </el-card>

        <el-card
            style="margin-top: 20px">
            <div class="toolbar-wrapper">
                <el-button type="primary" :icon="CirclePlus" @click="handleRecover(multipleSelectionId)">批量恢复</el-button>
                <el-button type="danger" :icon="Delete" @click="handleDelete(multipleSelectionId)">批量删除</el-button>
            </div>
            <el-table
                ref="multipleTableRef"
                @selectionChange="handleSelectionChange"
                style="margin-top: 20px;font-weight: bold;overflow-x: hidden"
                :data="categoryData"
            >
                <el-table-column type="selection"/>
                <el-table-column label="id" prop="id" align="center"/>
                <el-table-column label="pid" prop="pid" align="center"/>
                <el-table-column label="name" prop="name" align="center"/>
                <el-table-column label="status" prop="status" align="center">
                    <template #default="scope">
                        <el-tag type="success" v-if="scope.row.status === 0">启用</el-tag>
                        <el-tag type="danger" v-if="scope.row.status === 1">草稿</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="operate" align="center">
                    <template #default="scope">
                        <el-button type="text" @click="handleRecover([scope.row.id])">recover</el-button>
                        <el-button type="text" @click="handleDelete">delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                layout="total, prev, pager, next,jumper"
                v-model:current-page="page_conf.current"
                v-model:page-size="page_conf.size"
                @currentChange="paginationCurrentChange"
                style="margin-top: 10px;display: flex;align-items: center;justify-content: center;"
                :total="page_conf.total"
                class="pagination"
                :background="true"
            />
        </el-card>


    </div>

</template>

<style scoped>
.article-bin-container{
    padding: 20px;
}

.search-btn{
    margin-left: 10px;
}
.pid-wrap{
    display: flex;
    width: 100%;
}
</style>