<script setup lang="ts">
import {useBackendStore} from "@/stores/backend";
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import {logout} from "@/api/user";
const backendStore = useBackendStore()
const route = useRoute()
const router = useRouter()
const routeName = ref(<string>route.name)
function Logout() {
    logout()
    router.replace('/admin-backend/login');
}
</script>

<template>
<div class="admin-index-container">
    <div class="up-side-bar">
        <div class="msg">{{route.name}}</div>
    </div>
    <div class="index-content">
        <RouterView/>
        <el-button
            type="primary"
            style="margin-left: 20px"
            @click="Logout()"
        >logout</el-button>
    </div>

</div>
</template>

<style scoped>
.admin-index-container{
    width: 100%;
    height: 100%;
}
.up-side-bar{
    padding: 20px;
    display: flex;
    align-items: center;
}
.msg{
    font-weight: bold;
    font-size: 20px;
    margin-left: 10px;
}
.dark .msg{
    color: white;
}
.index-content {
    width: 100%;
    height: calc(100% - 72px);
}
</style>