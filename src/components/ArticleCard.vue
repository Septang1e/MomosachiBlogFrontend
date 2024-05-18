<script setup lang="ts">

import {onBeforeUnmount, onMounted, reactive, ref} from "vue";
import markdownIt from "@/utils/markdown-it";

import {getArticleByPid} from "@/api/article";
import type {ArticleDTO} from "@/api/article"

const windowStyle = ref("")
const props = defineProps({
    content : String
})
function adjustWindowSize() {

}

onMounted(()=>{
    console.log(props['content']);
    adjustWindowSize()
    addEventListener('resize', adjustWindowSize)
})
onBeforeUnmount(()=>{
    removeEventListener('resize', adjustWindowSize)
})

</script>

<template>
    <div class="article-card-container" :style="windowStyle">
        <div v-html="content"/>
    </div>
</template>

<style scoped>


</style>
<style>
pre:before {
    content: "";
    display: block;
    background: url(@/assets/images/codeBlock.png) no-repeat rgba(26, 26, 26, 0) 10px 10px;
    height: 32px;
    background-size: 40px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
.article-card-container{
    font-size: 1rem;
    font-weight: bold;
    &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 5px;
        height: 1px;
    }

    &::-webkit-scrollbar-thumb {
        /*滚动条里面的滑块*/
        border-radius: 5px;
        background: #cccccc;
    }

    li,p{
      font-weight: normal;
    }

    &::-webkit-scrollbar-track {
        /*滚动条里面轨道背景*/
        border-radius: 5px;
        background: #fff;
    }
    code {
        background-color: rgba(255,182,193,0.5);
        border-radius: 4px;
        font-weight: normal;
        margin: 0 5px;
        padding: 0 2px;
        font-family: "Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace;
    }
    p{
        img{
            width: calc(100% - 48px);
            transition: all ease-in-out 0.8s;
        }
        img:hover{
            cursor: pointer;
            transform: translateY(-10px);
        }
    }
    figure{
        overflow: clip;
        align-content: center;
        img{
            width: 100%;
        }
    }
    h1,
    h2,
    h3,
    h4,
    h5{
        transition: all 0.8s ease-in-out;
        width: fit-content;
        text-decoration: none !important;
    }
    h1:hover,
    h2:hover,
    h3:hover,
    h4:hover,
    h5:hover{
        transform: translateX(20px);
        cursor: pointer;
    }
    code:hover{
        cursor: pointer;
    }
}
pre{
    font-family: source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace;
    background: rgba(26, 26, 26, 0.7);
    border-radius:5px;
    width: 100%;
    padding: 0 2px 12px 40px !important;;
    position: relative;
    box-sizing: border-box;
    overflow-x: auto;
    :is(code) {
        display: block;
        font-family:  "Fira Code","Fira Mono",Menlo,Consolas,"DejaVu Sans Mono",monospace;
        margin: 0 10px;
        overflow-x: auto;
        background-color: transparent !important;
        font-style: normal !important;
        cursor: text !important;
    }
}
.line-numbers-rows {
    position: absolute;
    pointer-events: none;
    top: 35px;
    bottom: 12px;
    left: 0;
    font-size: 100%;
    width: 40px;
    text-align: center;
    letter-spacing: -1px;
    border-right: 1px solid rgba(0, 0, 0, .66);
    user-select: none;
    counter-reset: linenumber;
    span {
        pointer-events: none;
        display: block;
        counter-increment: linenumber;
            &:before {
            content: counter(linenumber);
            color: #999;
            display: block;
            text-align: center;
        }
    }
}
b.name {
    position: absolute;
    top: 7px;
    right: 50px;
    z-index: 0;
    color: #999;
    pointer-events: none;
}
.copy-btn {
    position: absolute;
    top: 10px;
    right: 4px;
    z-index: 0;
    color: #999;
    cursor: pointer;
    background-color: transparent;
    border: 0;
    border-radius: 2px;
}
a{
    text-decoration: none;
    color: white;
}

</style>