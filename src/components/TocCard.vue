<script setup lang="ts">
import type {TocAst} from "markdown-it-toc-done-right";
import {useTocStore} from "@/stores/toc";
import {onMounted, reactive} from "vue";
import {tocHtml} from "@/utils/markdown-it";
const tocStore = useTocStore()
const toc : TocAst[] = reactive([])
onMounted(()=>{
    Object.assign(toc, [])
    Object.assign(toc, tocStore.getTocAst())
})

</script>

<template>
    <div class="main-wrap">
        <div id="title">
            目录
        </div>
        <el-divider border-style="dashed" style="margin: 5px 0"/>
        <div v-html="tocHtml"/>
    </div>
</template>

<style scoped>
.main-wrap{
    width: 100%;
    min-height: 100px;
    border-radius: 12px;
    padding: 20px;
}
#title{
    color: white;
    font-weight: bold;
    font-size: 18px;
    align-items: center;
    display: flex;
}
.dark .main-wrap{
    background: rgb(121,9,34);
    background: linear-gradient(300deg, rgba(121,7,5,0.45) 26%, rgba(103,101,215,0.5) 100%, rgba(250,187,233,0.37) 100%);
    backdrop-filter: blur(2px);
    transition: backdrop-filter ease-in-out 0.7s;
}
.main-wrap:hover{
    backdrop-filter: blur(12px);
}

</style>