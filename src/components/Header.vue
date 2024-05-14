<script setup lang="ts">
import {defineComponent, onMounted, reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {useAppStore} from "@/stores/app";
import {autocompleteOnSearch} from "@/api/elasticsearch";
import {CircleClose} from "@element-plus/icons-vue"
import AdminSideBar from "@/components/AdminSideBar.vue";

defineComponent({
    name : "Header"
})

interface HeaderElement {
    name : string,
    icon: string,
    url : string
}
const headerElement : HeaderElement[] = reactive([
    {
        name:'首页', icon:'bx bxs-home-circle',url:'/'
    },
    {
        name:'工具',icon:'bx bxs-cog tool-box',url:'/tool'
    },
    {
        name:'归档',icon:'bx bxs-archive',url:'/archive'
    }
])
const appStore = useAppStore()
const router = useRouter()
const on_focus_input = ref(true)
function onFocus() {
    on_focus_input.value = true
}
function onBlur() {
    on_focus_input.value = false
}

function redirect(){
    router.replace({path:'/'})
}
const headerLayoutAdjustment = ref("")
function headerLayout() {
    headerLayoutAdjustment.value = ""
    if (window.scrollY > 0) {
        headerLayoutAdjustment.value += 'static '
        if (appStore.header.hide) headerLayoutAdjustment.value += 'hide '
    }
}
const search_info = ref("")
onMounted(()=>{
    headerLayout()
    addEventListener('scroll', headerLayout)
})
watch(()=>search_info.value,()=>{
    if(search_info.value.length != 0 && on_focus_input.value) {
        autoComplete()
        return
    }
    autoCompleteInfo.length = 0
})
const autoCompleteInfo = reactive([])
function autoComplete() {
    autocompleteOnSearch(search_info.value).then((res)=>{
        if(res.data.length > 10) res.data.length = 10
        Object.assign(autoCompleteInfo, res.data)
        autoCompleteInfo.length = res.data.length
    })
}
function changeData(val: string) {
    search_info.value = val
}
function onSearch() {
    if(search_info.value === "") {
        router.replace("/")
        return
    }
    router.replace(`/search?keyword=${search_info.value}`)
}


</script>

<template>
    <div class="header-box dark">
        <div class="header" :class="headerLayoutAdjustment">
            <div class="text" @click="redirect">
                MomosachiのBlog
            </div>
            <div class="elements" style="align-items: center">

                <div class="search-box-wrap" v-if="appStore.header.element_drawer">
                    <div class="search-box">

                        <input class="input-wrap"
                               @focus="onFocus"
                               @blur="onBlur"
                               v-model="search_info"/>
                        <el-icon class="bx bx-search search-btn"
                                 color="white"
                                 @click="onSearch"
                        />
                    </div>
                    <div class="auto-complete-wrap" v-if="autoCompleteInfo.length > 0">
                        <div class="auto-complete-box">
                            <div class="auto-complete-item"
                                 v-for="item in autoCompleteInfo"
                                 @click="changeData(item)"
                            >
                                {{item}}
                            </div>

                        </div>
                    </div>
                </div>

                <div v-for="item in headerElement">

                    <div class="element-box" v-if="appStore.header.element_drawer">
                        <router-link :to="item.url">
                            <div class="element">
                                <div class="icon">
                                    <el-icon :size="16" :class="item.icon" />
                                </div>

                                <div class="name">
                                    {{item.name}}
                                </div>

                            </div>
                            </router-link>
                        </div>
                </div>
                <el-icon
                    style="padding: 0;text-shadow: lightskyblue 0 0 10px"
                    class="menu-btn bx bx-menu"
                    @click="appStore.drawerHandler()"
                    :size="25"
                    color="lightskyblue"
                    v-if="!appStore.header.element_drawer"/>
            </div>
        </div>
    </div>
    <el-drawer
        v-model="appStore.header.drawer"
        direction="ltr"
        size="70%"
        :show-close="false"
        :with-header="false"
        style="overflow-y: auto"
    >
        <admin-side-bar/>
    </el-drawer>
</template>

<style scoped>
.cover{
    width: 100%;
    height: 100%;
    backdrop-filter: blur(26px);
}
.header-box{
    width: 100%;
    height: 40px;
}
a{
    text-decoration: none;
}
.menu-btn:hover{
    cursor: pointer;
}
.static{
    position: fixed;
    z-index: 10;
    top: 0;
    background-color: rgba(26,26,26,0.5);
    backdrop-filter: blur(25px);
}
.hide{
    transform: translateY(-60px);
    opacity: 0;
}
.header{
    display: flex;
    flex-wrap: wrap;
    width: calc(100% - 20px);
    padding: 10px;
    animation: fadeInUp ease-in-out 0.8s;
    justify-content: space-evenly;
    transition: all ease-in-out 0.4s;
}
.element-box:before{
    background-color: white;
}
.elements{
    display: flex;
    justify-content: space-between;
}
.name{
    font-size: 15px;
    color: pink;
    transition: all ease-in 0.8s;
    display: flex;
    align-items: center;
}
.element{
    display: flex;
    text-shadow: lightpink 0 0 15px;
    align-items: center;
    margin-right: 25px;
}

.icon{
    color: lightpink;
    align-items: center;
    display: flex;
    transition: all ease-in-out 0.8s;
    margin-right: 5px;
}
.icon:hover{
        animation: linear infinite rotate;
}
@keyframes rotate {
    0%{
        transform: rotateZ(0);
    }
    100%{
        transform: rotateZ(360deg);
    }
}
.text{
    color: lightskyblue;
    font-size: 20px;
    font-weight: bold;
    align-items: center;
    display: flex;
    text-shadow: lightpink 0 1px 0, lightskyblue 0 0 15px;
    transition: all ease-in-out 0.8s;
    animation: fadeInUp ease-in-out 0.8s;
}

.search-box{
    background-color: rgba(30,30,30,0.7);
    border-radius: 3px;
    padding: 3px;
    display: flex;
    align-items: center;
}
.search-box-wrap{
    margin-right: 10px;
}
.clear-box{
    width: 15px;
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    color: white;
}
.auto-complete-wrap {
    position: fixed;
    color: darkgrey;
    font-weight: bold;
    background-color: rgba(30,30,30,0.7);
    border-radius: 6px;
    padding: 4px 0;
    width: 200px;
    margin-top: 12px;
    height: fit-content;
    z-index: 1;
}
.auto-complete-box{
    margin-left: 2px;
    margin-right: 2px;
}
.auto-complete-item{
    display: flex;
    border-radius: 6px;
    padding-left: 4px;
    padding-right: 4px;
    align-items: center;
    cursor: pointer;
}
.auto-complete-item:hover{
    background-color: rgba(120,120,120,0.8);
}
.input-wrap{
    outline: none;
    border: none;
    border-radius: 3px;
    background-color: transparent;
    padding: 4px;
    margin-right: 6px;
    color: white;
}

input:focus{

}
.search-btn{
    cursor: pointer;
}

.text:hover{
    cursor: pointer;
    text-shadow: lightpink 0 1px 0, lightskyblue 0 0 25px;
}
@keyframes fadeInUp {
    0%{
        opacity: 0;
        transform: translateY(-50px);
    }
    100%{
        opacity: 1;
        transform: translateY(0);
    }
}
</style>