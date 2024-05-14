<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import type {TagDTO, TagDTOResult} from "@/api/tag";
import {getTags} from "@/api/tag";
const tags : TagDTO[] = reactive([])
function tagsDataHandler() {
    tags.length = 0
    getTags().then((res)=>{
        for(let i in res.data) {
            const data = res.data[i]
            tags.push(data)
        }
    })
}
onMounted(()=>{
    tagsDataHandler()
})
</script>

<template>
    <div class="tags-card-container">
        <div class="header">
            <div class="name-box">标签</div>
            <router-link to="/tags"><el-icon :size="20" class="bx bx-menu more-info-icon"/></router-link>
        </div>
        <el-divider border-style="dashed" style="margin: 5px 0"/>
        <div class="tags">
            <div class="tag-box" v-for="item in tags">
                <router-link style="text-decoration: none" :to="`/tag/${item.tag.pid}`">
                    <div class="tag-wrap">
                        <div class="tag-name">{{item.tag.name}}</div>
                        <div class="tag-count">{{item.articleCount}}</div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .tags-card-container{
        width: 90%;
        padding: 20px;
        min-height: 270px;
        border-radius: 8px;
        transition: backdrop-filter ease-in-out 0.7s;
    }
    .dark .tags-card-container{
        background: rgba(26, 26, 26, 0.8);
        box-shadow: rgba(26, 26, 26, 0.9) 4px 4px 12px;
    }
    .colorful .tags-card-container{
      background: rgb(121,9,34);
      background: linear-gradient(234deg, rgba(121,9,34,0.5690651260504201) 23%, rgba(103,101,215,0.5) 100%, rgba(148,187,233,1) 100%);
    }
    .tags-card-container:hover{
        backdrop-filter: blur(12px);
    }
    .dark .more-info-icon{
        color: white;
    }
    .tag-wrap{
        font-weight: bold;
    }
    .dark .tag-wrap{
        color: rgba(255,255,255,0.9);
    }
    .dark .tag-box{
        background: rgba(70, 70, 70);
    }
    .dark .tag-box:hover{
        .tag-wrap{
            color: rgba(255,255,255,1);
        }
        background: rgba(80, 80, 80);
    }
    .dark .more-info-icon:hover{
        color: lightskyblue;
    }
    .dark .name-box{
        color: white;
    }

    .name-box{
        font-weight: bold;
    }
    .header{
        display: flex;
        justify-content: space-between;
    }
    .more-info-icon{
        cursor: pointer;
    }
    .tags{
        display: flex;
        flex-wrap: wrap;
    }
    .tag-box{
        margin: 5px;
        border-radius: 5px;
        padding: 2px 5px;
    }
    .tag-wrap{
        display: flex;
        width: fit-content;
        font-size: 13px;
        align-items: center;
        justify-content: center;
    }
    .tag-box:hover{
        cursor: pointer;
    }
    .tag-name{
        margin-right: 5px;
        padding: 2px;
        align-items: center;
    }
    .tag-count{
        align-items: center;
        display: flex;
        padding: 0 5px 0 0;
    }
</style>