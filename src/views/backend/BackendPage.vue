<script setup lang="ts">
import {onBeforeMount, onBeforeUnmount, onMounted} from "vue";
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from "vue-router";
import {authorization} from "@/api/user";
import {useAnimationStore} from "@/stores/animation";

const router = useRouter()
const animationStore = useAnimationStore()
const route = useRoute()

function authorizationHandler() {
    authorization().then((res)=>{
        if(res.code == 2) {
            router.replace("login")
        }else{
            if(route.path === '/admin-backend/' || route.path === '/admin-backend') {
                router.replace("/admin-backend/index")
            }
        }
    })
}
onMounted(()=>{
    console.log(route.path)
})

onBeforeMount(()=>{
    authorizationHandler()
})

</script>

<template>
    <RouterView/>
</template>

<style scoped>
</style>