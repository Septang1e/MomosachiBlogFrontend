<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import type {CategoryDTO} from "@/api/category";
import {getAllCategory} from "@/api/category";

onMounted(()=>{
    getAllCategory().then((res)=>{
        Object.assign(categoryInfo, res.data)
    })
    if(categoryInfo.length > 10) {
        categoryInfo.length = 10
    }
})


const categoryInfo: CategoryDTO[] = reactive([])
</script>

<template>
    <div class="card-box">
        <div class="header">
            <div class="name-box">分类
            </div>
            <router-link to="/categories" class="header-icon"><el-icon :size="20" class="bx bx-menu"/></router-link>
        </div>
        <el-divider border-style="dashed" style="margin-top: 0;margin-bottom: 10px;" />
        <div class="main-items">
            <div v-for="item in categoryInfo">
                <router-link :to="`/category/${item.category.pid}`" style="text-decoration: none">
                    <div class="item">
                        <div class="category-name">
                          {{ item.category.name }}
                        </div>
                        <div class="article-count">
                            {{item.articleCount}}
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-box{
    padding: 20px;
    width: 90%;
    border-radius: 8px;
    transition: all ease-in-out 0.8s;
    height: 280px;
}
.card-box:hover{
    backdrop-filter: blur(12px);
}
.dark .card-box{
    background: rgba(26, 26, 26, 0.8);
    box-shadow: rgba(26, 26, 26, 0.9) 6px 6px 12px;
}
.colorful .card-box{
    background: rgb(121,9,34);
    background: linear-gradient(270deg, rgba(121,7,5,0.45) 27%, rgba(103,101,215,0.5) 100%, rgba(250,187,233,0.37) 100%);
}
.card-box{
    backdrop-filter: blur(2px);
}
.header{
    display: flex;
    justify-content: space-between;
    color: white;
    font-weight: bold;
}
.dark .header-icon{
    color: white;
}
.dark .header-icon:hover{
    cursor: pointer;
    color: lightskyblue;
}
.item{
    width: calc(100% - 14px);
    padding: 5px 7px;
    display: flex;
    font-weight: bold;
    align-items: center;
    align-content: center;
    border-radius: 8px;
    justify-content: space-between;
}
.item:hover{
    cursor: pointer;
}

.dark .item {
    color: darkgrey;
}
.dark .item:hover{
    background: rgba(90, 90, 90);
    color: white;
}
</style>