<script setup lang="ts">
import avatarUrl from "@/assets/avatar.png"
import {useUserStore} from "@/stores/user";
import {reactive} from "vue";
import {useRoute, useRouter} from "vue-router";
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()


const nav_data = reactive([
    {
        id: 0, name: '首页', url: '/', icons: ['bx', 'bxs-home-circle']
    },
    {
        id: 1, name: '工具', url: '/tool', icons: ['bx','bxs-cog'],
    },
    {
        id: 2, name: '归档', url: '/archive', icons: ['bx', 'bxs-archive'],
    },
])
function router_change(url : string) {
    router.replace(url)
}
</script>

<template>
    <div class="admin-side-bar-wrap">
        <div class="admin-wrap">
            <div class="avatar">
                <el-avatar :size="100" :src="avatarUrl"/>
            </div>
            <div class="admin-name">
                Septangle
            </div>
            <div class="description">
                {{'Ciallo～(∠・ω< )⌒☆'}}
            </div>
        </div>
        <div class="blog-details-menu">
            <div class="item-cnt">
                <el-icon class="bx bx-book icon"/>主人积累撰写了<p>{{userStore.getAdminInfo().article_count}}</p>篇文章
            </div>
            <div class="item-cnt">
                <el-icon class="bx bx-purchase-tag icon"/>主人积累创建了<p>{{userStore.getAdminInfo().tag_count}}</p>标签
            </div>
            <div class="item-cnt">
                <el-icon class="bx bx-category-alt icon"/>主人积累创建了<p>{{userStore.getAdminInfo().category_count}}</p>个分类
            </div>
        </div>
        <div class="nav-menu">
            导航
            <div class="nav-wrap">
                <div
                    v-for="item in nav_data" class="nav-item"
                    @click="router_change(item.url)"
                    :style="item.url === route.path ? 'color: lightpink;text-shadow: lightpink 0 0 15px;' : ''"
                >
                    <el-icon :class="item.icons" />{{item.name}}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.admin-side-bar-wrap{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
}
.admin-wrap{
    width: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
}
.admin-name{
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: pointer;
    font-size: 15px;
}
.description{
    margin-top: 5px;
    color: darkgrey;
    font-size: 10px;
}
.blog-details-menu{
    background: rgba(35, 35, 35);
    width: calc(100% - 40px);
    margin-top: 15px;
    padding: 10px 20px;
    border-radius: 12px;
    box-shadow: rgba(10, 10, 10) 2px 4px 5px;
    .item-cnt{
        font-weight: bold;
        display: flex;
        .icon{
            margin-right: 2px;
        }
        color: darkgrey;
        align-items: center;
        font-size: 12px;
        margin: 4px 2px;
        p{

            margin: 0 5px;
            color: lightpink;
            text-shadow: lightpink 0 0 15px;
        }
    }
}
.nav-menu{
    margin-top: 15px;
    padding: 10px 20px;
    border-radius: 12px;
    width: calc(100% - 40px);
    background: rgba(35, 35, 35);
    box-shadow: rgba(10, 10, 10) 2px 4px 5px;
    color: darkgrey;
    font-size: 12px;
    font-weight: bold;
}
.nav-wrap {
    
}
.nav-item {
    cursor: pointer;
}
.nav-item {
    margin: 5px 10px;
    display: flex;
    align-items: center;
    transition: color ease-in-out 0.7s,text-shadow ease-in-out 0.4s;
}
.nav-item:hover{
    color: lightskyblue !important;
    text-shadow: lightskyblue 0 0 15px !important;
}
</style>