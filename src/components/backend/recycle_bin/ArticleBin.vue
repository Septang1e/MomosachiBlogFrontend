<script setup lang="ts">

import {onMounted, reactive, ref} from "vue";
import {
    autocompleteOnQueryTag, autocompleteOnSearch, deleteTag,
    fetchDeletedArticle,
    recycleArticle,
    removeArticleFromDatabase
} from "@/api";
import type {ArticleFormData} from "@/api"
import {CirclePlus, Delete} from "@element-plus/icons-vue";
import {ElMessage, ElMessageBox} from "element-plus";

const keyword = ref<string>("")
const articleData : ArticleFormData[] = reactive([])
const loading = ref(false)
const page_conf = {
    current: 1,
    size: 10,
    total: 0
}

function queryArticle() {
    loading.value = true
    fetchDeletedArticle(page_conf.current, page_conf.size,
        keyword.value === '' ? undefined : keyword.value).then((res)=>{
        articleData.length = 0
        page_conf.total = res.data.total
        Object.assign(articleData, res.data.records)
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
    queryArticle()
}

function paginationCurrentChange(val : number) {
    page_conf.current = val
    queryArticle()
}

function handleRecover(idList : string[]) {
    recycleArticle(idList).then((res)=>{
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
        removeArticleFromDatabase(idList).then((res)=>{
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
    queryArticle()
}

onMounted(()=>{
    queryArticle()
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
                <el-button type="primary" :icon="CirclePlus">批量恢复</el-button>
                <el-button type="danger" :icon="Delete">批量删除</el-button>
            </div>
            <el-table
                style="margin-top: 20px;font-weight: bold;overflow-x: hidden"
                :data="articleData"
            >
                <el-table-column type="selection"/>
                <el-table-column label="id" prop="id" align="center"/>
                <el-table-column label="pid" prop="pid" align="center"/>
                <el-table-column label="title" prop="title" align="center"/>
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