<script setup lang="ts">
import type {ArticleDTO, ArticleFormData} from "@/api/article";
import {onMounted, reactive, ref, watch} from "vue";
import {
    articleBackendPagination,
    articlePagination,
    articleStatusHandler,
    deleteArticle,
    saveArticle, updateArticle
} from "@/api/article";
import {ElMessage, ElMessageBox, ElTable} from "element-plus";
import markdownIt from "@/utils/markdown-it";
import ArticleCard from "@/components/ArticleCard.vue";
import {CirclePlus, Delete} from "@element-plus/icons-vue";
import type {Tag, TagDTO} from "@/api";
import {autocompleteOnSearch} from "@/api/elasticsearch";



const articleInfo : ArticleDTO[] = reactive([])
const page_conf = reactive({
    size: 10,
    total: 0,
    current: 1,
})
const tag_name = ref("")
const loading = ref(true)
let duplicateTagChecker = new Set<String>
//dialog
const dialogVisible = ref(false)

//section utils

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<ArticleFormData[]>([])
const multipleSelectionId = ref<string[]>([])
const toggleSelection = (rows?: ArticleFormData[]) => {
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
const handleSelectionChange = (val: ArticleFormData[]) => {
    multipleSelection.value = val
    multipleSelectionId.value.length = 0
    for(let i in val) {
        multipleSelectionId.value.push(val[i].id)
    }
    console.log(multipleSelectionId)
}

//end


const articleRow = ref<undefined | number>()
const articleFormData: ArticleFormData = reactive({
    title: '',
    content: '',
    tags: [],
    pid: '-1',
    thumbnail: '',
    isComment: 0,
    status: 0,
    category: '',
    categoryPid: '',
    description: '',
    id: '',
})
const articleEditData : ArticleFormData = reactive(Object.assign({}, articleFormData))
const previewData = ref("")
const ifPreview = ref(false)
const query_search = ref("")

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
function onSearch() {
    console.log(query_search.value.trim())
    getArticleInfo()
}

function getArticleInfo() {
    loading.value = true

    articleBackendPagination(page_conf.current, page_conf.size,
        query_search.value.trim().length === 0 ? undefined : query_search.value.trim()
    ).then((res)=>{
        articleInfo.length = 0
        page_conf.total = res.data.total
        Object.assign(articleInfo, res.data.records)
    }).finally(()=> {
        loading.value = false
    })
}

const names = ref<String[]>([])

function handleResetEditData() {
    const cloned_data = Object.assign({}, articleFormData)
    Object.assign(articleEditData, cloned_data)
}

function handleDelete(pidList : string[]) {
    ElMessageBox.confirm(`真的要删除吗`,'提示', {
        distinguishCancelAndClose: true,
        cancelButtonText: 'cancel',
        confirmButtonText: 'Yes',
    }).then(()=>{
        deleteArticle(pidList).then((res)=>{
            if(res.code == 0) {
                ElMessage.error(<string>res.message)
            }else{
                ElMessage.success(<string>res.data)
                getArticleInfo()
            }
        })
    }).catch(()=>{})
}
function handleSelect(item : string) {
    query_search.value = item
}
function handleEdit(row : number) {
    articleRow.value = row
    dialogVisible.value = true
    const clonedData = Object.assign({}, articleInfo[row])
    Object.assign(articleEditData, clonedData)
    imageUrl.value = articleEditData.thumbnail
    duplicateTagChecker.clear()
    for(let i in articleEditData.tags) {
        duplicateTagChecker.add(articleEditData.tags[i].name)
    }
}
function handleArticleAdd() {
    dialogVisible.value = true
    if(articleRow.value != undefined) {
        const copyData = Object.assign({}, articleFormData)
        Object.assign(articleEditData, copyData)
        imageUrl.value = ""
        articleRow.value = undefined
    }
}
function handleCancel() {
    const tempData = Object.assign({}, articleFormData)
    Object.assign(articleEditData, tempData)
    articleRow.value = undefined
    dialogVisible.value = false
    ifPreview.value = false
    getArticleInfo()
}
function handleStatus(pidList : string[]) {
    articleStatusHandler(pidList).then((res)=>{
        ElMessage.success(<string>res.data)
        getArticleInfo()
    })
}
function handleTagAdd() {   
    if(tag_name.value == "") {
        ElMessage.error("名称不能为空")
        return
    }
    if(duplicateTagChecker.has(tag_name.value)) {
        ElMessage.error(`标签${tag_name.value}已存在`)
    }

    const tagDTOData : Tag = reactive({
        id: "",
        name: tag_name.value,
        pid: ""
    })

    articleEditData.tags.push(tagDTOData)
    ElMessage.success("添加成功")
    duplicateTagChecker.add(tag_name.value)
    tag_name.value = ""
}
function handleTagDelete(name : string) {
    ElMessageBox.confirm(`真的要删除吗`,'提示', {
        distinguishCancelAndClose: true,
        cancelButtonText: 'cancel',
        confirmButtonText: 'Yes',
    }).then(()=>{
        let tags : Tag[] = []
        for(let i = 0; i < articleEditData.tags.length; ++i) {
            const tag = articleEditData.tags[i]
            if(tag.name !== name) {
                tags.push(tag)
            }
        }
        articleEditData.tags = tags
    }).catch(()=>{})

}

onMounted(()=>{
    getArticleInfo()
})
function saveAsDraft() {
    articleEditData.status = 1
    save()
}
function save() {

    if(articleEditData.title === "") {
        ElMessage.error("标题不能为空哦")
        return
    }
    if(articleEditData.content === "") {
        ElMessage.error("内容不能为空哦")
        return
    }
    if(articleEditData.category === "") {
        ElMessage.error("不能没有分类哦")
        return
    }

    console.log(articleRow)

    if(articleRow.value === undefined) {
        saveArticle(articleEditData).then((res) => {
            ElMessage.success(<string>res.data)
        })
        return
    }
    updateArticle(articleEditData).then((res) => {
        ElMessage.success(<string>res.data)
    })
}
function paginationCurrentChange(current : number) {
    page_conf.current = current
    getArticleInfo()
}
watch(()=>articleEditData.content,()=>{
    previewData.value = markdownIt.render(articleEditData.content)
})

const imageUrl = ref("")
function handleAvatarSuccess() {

}
function beforeAvatarUpload() {

}
const modelTest = ref(true)

</script>

<template>
    <div class="article-uploader-container">
        <div class="table-wrap">
            <el-card
                shadow="false">
                <div class="search-box">
                    <el-autocomplete
                        v-model="query_search"
                        :fetch-suggestions="querySearch"
                        style="margin-right: 10px;"
                        @select="handleSelect"
                    >
                        <template #default="{ item }">
                            <div class="value">{{item}}</div>
                        </template>
                    </el-autocomplete>
                    <el-button type="primary" @click="onSearch">搜索</el-button>
                </div>
            </el-card>
            <el-card
                style="margin-top: 20px"
                v-loading="loading"
                shadow="never"
            >
                <div class="toolbar-wrapper">
                    <el-button type="primary" @click="handleArticleAdd" :icon="CirclePlus" size="default">添加文章</el-button>
                    <el-button type="danger" :icon="Delete" @click="handleDelete(multipleSelectionId)">批量删除</el-button>
                </div>
                <el-table
                    style="font-weight: bold;border-radius: 8px;"
                    ref="multipleTableRef"
                    @selectionChange="handleSelectionChange"
                    :data="articleInfo">
                    <el-table-column type="selection" width="50" align="center" />
                    <el-table-column fixed prop="id" label="Id" max-width="150" align="center"/>
                    <el-table-column fixed prop="pid" label="Pid" max-width="150" align="center"/>
                    <el-table-column fixed prop="title" label="Title" max-width="150" align="center"/>
                    <el-table-column fixed prop="category" label="Category" max-width="150" align="center"/>
                    <el-table-column fixed label="Status" width="150" align="center">
                        <template #default="scope">
                            <el-tag style="cursor: pointer"
                                    @click="handleStatus([scope.row.id])" v-if="scope.row.status == 0"
                                    effect="plain" type="success">启用</el-tag>
                            <el-tag style="cursor: pointer"
                                    @click="handleStatus([scope.row.id])" v-else
                                    type="danger">草稿</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column fixed prop="pid" label="Tags" max-width="150" align="center">
                        <template #default="scope">
                            <div class="tag-container">
                                <div v-for="item in scope.row.tags" >
                                    <el-tag type="info" style="margin: 5px 5px 5px 0">{{item.name}}</el-tag>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="operate" max-width="150" align="center">
                        <template #default="scope">
                            <el-button type="text" @click="handleEdit(scope.$index)">edit</el-button>
                            <el-button type="text" @click="handleDelete([scope.row.id])">delete</el-button>
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
            :title="articleRow === undefined ? '新增文章' : '编辑文章'"
            width="50%"
            style="overflow: clip"
        >
            <el-form
                label-position="left"
                style="font-weight: bold; width: 100%"
                v-model="articleEditData">
                <el-form-item
                    label="封面"
                    style="margin-left: 10px"
                >
                    <el-upload
                        class="avatar-uploader"
                        action="#"
                        style="max-width: 100%"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                    >
                        <el-image v-if="imageUrl" :src="imageUrl" fit="cover" style="width: 600px; height: 180px;"/>
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item required label="标题">
                    <el-input v-model="articleEditData.title"/>
                </el-form-item>
                <el-form-item style="margin-left: 10px" label="简介">
                    <el-input type="textarea" v-model="articleEditData.description"/>
                </el-form-item>
                <el-form-item required label="分类">
                    <el-input v-model="articleEditData.category"/>
                </el-form-item>
                <el-form-item required label="标签">
                    <div class="tag-edit-box">
                        <div v-for="item in articleEditData.tags">
                            <el-tag style="margin-right: 5px; cursor: pointer"
                                    effect="plain" type="primary"
                                    @click="handleTagDelete(item.name)">{{item.name}}</el-tag>
                        </div>
                    </div>
                    <div class="tag-add-box">
                        <el-input placeholder="按回车添加标签，点击标签可以删除标签喵~" v-model="tag_name" @keyup.enter="handleTagAdd"/>
                        <el-button type="primary" @click="handleTagAdd">添加</el-button>
                    </div>
                </el-form-item>
                <el-form-item required label="内容">
                    <div class="preview-wrap">
                        <el-input type="textarea" v-model="articleEditData.content" :autosize="{ minRows: 5}"/>
                        <ArticleCard v-if="ifPreview" style="color: skyblue !important;" :content="previewData"/>
                    </div>b
                    <el-button style="margin-top: 10px" type="primary" @click="ifPreview = !ifPreview">预览</el-button>
                </el-form-item>
                <el-form-item style="align-items: end;justify-content: end;display: flex">
                    <div class="submit-line">
                        <el-button type="text" @click="handleCancel"> 取消 </el-button>
                        <div class="submit">
                            <el-button type="primary" @click="save"> 保存 </el-button>
                            <el-button type="primary" @click="saveAsDraft"> 保存为草稿 </el-button>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<style scoped>
.search-box{
    display: flex;
    height: fit-content;
}

.article-uploader-container{
    padding: 20px;
}
.toolbar-wrapper{
    display: flex;
    margin-bottom: 20px;
}
.preview-wrap{
    display: flex;
    width: 100%;
    overflow: clip;
    justify-content: space-between;
}
.tag-container{
    display: flex;
    width: 100%;
    flex-wrap: wrap;
}
.tag-edit-box{
    display: flex;
    width: 100%;
    flex-wrap: wrap;
}
.tag-add-box{
    width: 100%;
    display: flex;
}
.avatar-uploader .avatar {
    width: 600px;
    height: 178px;
    z-index: 5;
    display: block;
}
</style>
<style>
.article-uploader-container{
    ::-webkit-scrollbar{
        width: 0.3vw;
        border-radius: 8px;
    }
    ::-webkit-scrollbar-thumb {
        background: pink;
        border-radius: 5px;
    }
}
.submit-line{
    width: 100%;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
}
.el-table__header-wrapper{
    background-color: darkgrey !important;
}
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 600px;
    height: 178px;
    text-align: center;
}
</style>