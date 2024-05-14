<script lang="ts" setup>

import Header from "@/components/Header.vue"
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import AdminCard from "@/components/AdminCard.vue";
import CategoryCard from "@/components/CategoryCard.vue";
import {useAppStore} from "@/stores/app";
import CommentCard from "@/components/CommentPage.vue";
import ArticleCard from "@/components/ArticleCard.vue";
import TagsCard from "@/components/TagsCard.vue";
const appStore = useAppStore()
const windowStyle = ref("")


onMounted(()=>{
    adjustWindowSize()
    addEventListener('resize',adjustWindowSize)
})
onBeforeUnmount(()=>{
    removeEventListener('resize',adjustWindowSize)
})
const adjustWindowSize = (()=>{
    windowStyle.value = `max-width:${window.innerWidth - 50}px`
})
</script>

<template>
    <Header/>
        <div id="home">
            <div class="side-bar" v-if="appStore.sideBar.opened">
                <AdminCard/>
                <CategoryCard style="margin-top: 20px;"/>
                <TagsCard style="margin-top: 20px"/>
            </div>
            <div class="main-content">
                <router-view/>
            </div>
        </div>
</template>

<style scoped>
    #home{
        justify-content: center;
        margin-top: 24px;
        display: flex;
        flex-direction: row;
    }
    .side-bar{
        display: flex;
        margin: 24px;
        transition: all ease-in-out 0.4s;
        flex-direction: column;
        width: 250px;
    }
    .main-content{
        height: fit-content;
        display: flex;
        color: white;
        width: 100%;
        max-width: 1050px;
        flex-wrap: wrap;
        z-index: 0;
    }
</style>