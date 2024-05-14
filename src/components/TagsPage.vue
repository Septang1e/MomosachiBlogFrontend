<script setup lang="ts">
import type {TagDTO} from "@/api/tag";
import {onMounted, reactive} from "vue";
import {getTags} from "@/api/tag";

const tagsInfo : TagDTO[] = reactive([])
onMounted(()=>{
    getTags().then((res)=>{
        Object.assign(tagsInfo, res.data)
    })
})

</script>

<template>
    <div class="tags-page-container">
        <div v-for="item in tagsInfo" style="height: fit-content">
            <router-link :to="`/tag/${item.tag.pid}`" style="text-decoration: none;">
                <div class="tag-box">
                    <div class="tag-name">
                        {{item.tag.name}}
                    </div>
                    <div class="article-count">
                        {{item.articleCount}}
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
    .tags-page-container{
        padding: 20px;
        margin: 24px;
        width: 100%;
        border-radius: 12px;
        display: flex;
        flex-wrap: wrap;

    }
    .tag-box{
        display: flex;
        padding: 5px 10px;
        border-radius: 8px;
        margin: 10px 10px 10px 10px;
        width: fit-content;
        height: fit-content;
        font-weight: bold;
    }
    .tag-name{
        margin-right: 10px;
    }
    .dark .tags-page-container{
        background: rgba(26, 26, 26, 0.8);
        box-shadow: rgba(26, 26, 26, 0.9) 4px 4px 12px;
        transition: all ease-in-out 0.7s;
        backdrop-filter: blur(2px);
    }
    .colorful .tags-page-container{
        background: rgb(121,9,34);
        background: linear-gradient(120deg, rgba(121,7,5,0.45) 27%, rgba(103,101,215,0.5) 100%, rgba(250,187,233,0.37) 100%);
    }
    .tags-page-container:hover{
        backdrop-filter: blur(12px);
    }
    .tag-box{
        color: rgba(255,255,255,0.7);
        backdrop-filter: brightness(70%) contrast(80%);
    }
    .dark .tag-box:hover{
        backdrop-filter: brightness(200%) contrast(120%);
        color: white;
    }
</style>