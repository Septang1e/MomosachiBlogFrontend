<script lang="ts" setup>
import Header from "@/components/Header.vue";
</script>

<template>
    <Header/>
    <div id="tools-nav">
        <div class="main-wrap">
            <router-view/>
        </div>
    </div>
</template>

<style scoped>
#tools-nav{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.main-wrap{
    width: 100%;
    max-width: 1200px;
    height: 100vh;
    border-radius: 12px;
}
</style>