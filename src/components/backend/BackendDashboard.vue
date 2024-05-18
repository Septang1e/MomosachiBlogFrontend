<script setup lang="ts">
import {useBackendStore} from "@/stores/backend";
import {onMounted, reactive, ref, watch} from "vue";
import FormatPage from "@/components/backend/format/FormatPage.vue";
import test from "@/assets/images/test.jpg"
import Header from "@/components/Header.vue";
import {useRoute} from "vue-router";
const backendStore = useBackendStore()
const menu_height = ref(window.innerHeight)
const main_wrap_width = ref(window.innerWidth)
const main_content_width = ref("width: calc(100% - 300px)")
const route = useRoute()
function menuHeightHandler() {
    main_wrap_width.value = window.innerWidth
    const main_content = document.querySelector('.main-content')
    const side_bar_menu = document.querySelector('.side-bar-menu')
    if(main_content) {
        menu_height.value = window.innerHeight
    }

    if(side_bar_menu) {
        main_content_width.value = `width : calc(100% - ${side_bar_menu.clientWidth}px)`
    }
}

const defaultOpenUri = reactive([
    '/admin-backend/bin/category',
    '/admin-backend/bin/article',
    '/admin-backend/bin/tag'
])

/**
 * .dark .el-menu-item.is-active {
 *     background-color: rgba(45,45,45);
 *     color: lightpink !important;
 *     text-shadow: lightpink 0 0 25px;
 *     box-shadow: rgba(0,0,0) 4px 4px 25px;
 * }
 */


onMounted(()=>{
    menuHeightHandler()
    addEventListener('resize', menuHeightHandler)

})
watch(()=>backendStore.getCollapseStatus(), ()=>{
    const side_bar = document.querySelector('.el-menu')
    if(side_bar) {
        main_content_width.value = `width : calc(100% - 30px)`
    }
})
</script>

<template>
    <div class="main-wrap" :style="`max-width:${main_wrap_width}px`">
        <div class="side-bar">
            <!-- 用于折叠 -->

            <el-menu
                background-color="transparent"
                class="side-bar-menu"
                :collapse="backendStore.getCollapseStatus()"
                text-color="white"
                router
                >

                <div class="logo">
                </div>
                <el-menu-item
                    index="4-1" route="/admin-backend/index"
                    class="menu-item"
                    :class="route.name === '文章' ? 'menu-is-active' : '' "
                >
                    <span>文章</span>
                </el-menu-item>
                <el-menu-item
                    index="4-2" route="/admin-backend/tag"
                    class="menu-item"
                    :class="route.name === '标签' ? 'menu-is-active' : '' "
                >
                    <span>标签</span>
                </el-menu-item>
                <el-menu-item
                    index="4-3" route="/admin-backend/category"
                    class="menu-item"
                    :class="route.name === '分类' ? 'menu-is-active' : '' "
                >
                    <span>分类</span>
                </el-menu-item>
                <el-menu-item
                    index="4-4" route="/admin-backend/comment"
                    class="menu-item"
                    :class="route.name === '评论' ? 'menu-is-active' : '' "
                >
                    <span>评论</span>
                </el-menu-item>
                <el-sub-menu
                    index="1">
                    <template #title>
                        <span
                            style="font-weight: bold; color: darkgrey; font-size: 15px;border-radius: 20px;margin: 0 8px;">回收站</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item
                            class="sub-menu-item"
                            route="/admin-backend/bin/article"
                            :class="route.name === 'bin_article' ? 'menu-is-active' : '' "
                            index="1-1">
                            <span>文章</span>
                        </el-menu-item>
                        <el-menu-item
                            route="/admin-backend/bin/tag"
                            class="sub-menu-item"
                            :class="route.name === 'bin_tag' ? 'menu-is-active' : '' "
                            index="1-2">
                            <span>标签</span>
                        </el-menu-item>
                        <el-menu-item
                            route="/admin-backend/bin/category"
                            class="sub-menu-item"
                            :class="route.name === 'bin_category' ? 'menu-is-active' : '' "
                            index="1-3">
                            <span>分类</span>
                        </el-menu-item>
                        <el-menu-item
                            route="/admin-backend/bin/comment"
                            class="sub-menu-item"
                            :class="route.name === 'bin_comment' ? 'menu-is-active' : '' "
                            index="1-4">
                            <span>评论</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
            </el-menu>
        </div>
        <div class="main-content" :style="main_content_width">
            <FormatPage/>
        </div>
    </div>
</template>

<style scoped>
.main-wrap{
    min-height: 100%;
    display: flex;
}
.img-wrap{
    margin-bottom: 0;
}
.side-bar{
    color: white;
    max-width: 250px;
    width: 30%;
    overflow-y: auto;
    transition: width ease-in-out 0.7s, backdrop-filter ease-in-out 0.7s;
}
.side-bar-menu{
    border: 0;
    font-weight: bold;
    transition: width ease-in-out 0.7s, backdrop-filter ease-in-out 0.7s;
}
.bottom-content{
    height: 5vh;
}
.dark .side-bar{
    background: rgba(26, 26, 26, 0.8);
    box-shadow: rgba(26, 26, 26, 0.9) 4px 8px 12px;
}
.colorful .side-bar-menu{
    backdrop-filter: blur(5px);
    background: rgb(121,9,34);
    background: linear-gradient(98deg, rgba(125,25,70,0.33) 39%, rgba(103,101,215,0.5) 100%, rgba(250,187,233,0.37) 100%);
}
.dark .side-bar:hover{
    backdrop-filter: blur(12px);
}
.bottom-content{
    display: flex;
    .logout {
        width: 50%;
    }
    .backToIndex{
        width: 50%;
    }
}
.dark .el-menu-item {
    color: darkgrey;
        border-radius: 20px;
        margin: 0 8px;
}

.dark .menu-is-active{
    background-color: rgba(45,45,45);
    color: lightpink !important;
    text-shadow: lightpink 0 0 25px;
    box-shadow: rgba(26,26,26) 4px 4px 25px;
}
.menu-item{
    font-size: 18px;
}
.sub-menu-item{
    font-size: 15px;
}
.main-content{
    height: 100vh;
    backdrop-filter: blur(2px) brightness(70%);
    overflow-y: auto;
}
</style>