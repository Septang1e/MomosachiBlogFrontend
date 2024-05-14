<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

onMounted(()=>{
    addEventListener('resize', adjustWindowSize)
})
const router = useRouter()

const windowStyle = ref("")
function adjustWindowSize() {
    windowStyle.value = `max-width: ${window.innerWidth - 50}px`
}
function changeRouter(path: string) {
    router.replace({path})
}
const tools = reactive([{
    name: '流量管理', url: '/tool/traffic_monitoring', icons:["bx","bx-search"]
}])
</script>

<template>
    <div class="nav-wrap">
        <div id="title">
            Momosachiの工具站
        </div>
        <div class="description">

        </div>
        <div class="items">
            <div v-for="item in tools" class="tool-box" @click="changeRouter(item.url)">
                <div id="name">
                    <el-icon :class="item.icons"/>{{item.name}}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.nav-wrap{
    margin: 24px;
    overflow-x: clip;
    flex-wrap: wrap;
    display: flex;
    flex-direction: column;
    min-height: 1200px;
    padding: 24px;
    border-radius: 8px;
    align-items: center;
}
#title{
    font-size: 24px;
    font-weight: bold;
    align-items: center;
    display: flex;
    color: darkgrey;
    width: fit-content;
    cursor: pointer;
}
.items{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
}
.tool-box{
    margin-top: 40px;
    padding: 10px 20px;
    width: 250px;
    min-width: 120px;
    height: 100px;
    background-color: rgba(26, 26, 26, 0.5);
    border-radius: 8px;
    cursor: pointer;
    backdrop-filter: blur(8px);
    justify-content: center;
    display: flex;
    align-items: center;
    transition: backdrop-filter ease-in-out 0.8s;
}
.tool-box:hover{
    backdrop-filter: blur(20px);
}
#name{
    font-weight: bold;
    color: darkgrey;
    font-size: 20px;
    display: flex;
    align-items: center;
}
.description{
    margin-top: 40px;
    width: 100%;
    border-radius: 8px;
    height: 120px;
    justify-content: center;
    display: flex;
    align-items: center;
    background-color: rgba(26, 26, 26, 0.7);
    transition: backdrop-filter ease-in-out 0.8s;
}
.description:hover{
    backdrop-filter: blur(12px);
}
</style>