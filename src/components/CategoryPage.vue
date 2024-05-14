<script setup lang="ts">
import type {Category, CategoryDTO} from "@/api/category";
import {onMounted, reactive} from "vue";
import {getAllCategory} from "@/api/category";

const categoryInfo : CategoryDTO[] = reactive([])
function getCategoriesInfo() {
    getAllCategory().then((res)=>{
        Object.assign(categoryInfo, res.data);
        console.log(res.data)
        console.log(categoryInfo);
    })
}
onMounted(()=>{
    getCategoriesInfo()
})

</script>

<template>
    <div class="category-page-container">
        <div v-for="item in categoryInfo">
            <router-link :to="`/category/${item.category.pid}`" style="text-decoration: none;">
                <div class="category-card">
                    <div class="name">
                      {{ item.category.name }}
                    </div>
                    <div class="count">
                        {{item.articleCount}}
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
.category-page-container{
    margin: 24px;
    border-radius: 12px;
    width: 100%;
    padding: 20px;
    min-height: 1024px;
}
.dark .category-page-container{
    transition: all ease-in-out 0.7s;
    backdrop-filter: blur(2px);
    background: rgba(26, 26, 26, 0.8);
    box-shadow: rgba(26, 26, 26, 0.9) 4px 4px 12px;
}
.colorful .category-page-container{
    background: rgb(121,9,34);
    background: linear-gradient(98deg, rgba(125,25,70,0.33) 39%, rgba(103,101,215,0.5) 100%, rgba(250,187,233,0.37) 100%);
}

.category-page-container:hover{
    backdrop-filter: blur(12px);
}
.category-card:hover{
    backdrop-filter: contrast(120%) brightness(200%);
    color: white;
}
.dark .category-card{
    color: rgba(255,255,255,0.7);
}
.category-card{
    display: flex;
    padding: 5px 10px;
    font-weight: bold;
    border-radius: 10px;
    justify-content: space-between;
}
</style>