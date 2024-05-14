<script setup lang="ts">
import avatarUrl from "@/assets/avatar.png"
import {useUserStore} from "@/stores/user";
import {useRouter} from "vue-router";
const userStore = useUserStore()
const router = useRouter()
function routerChange(url : string) {
    router.replace(url)
}

</script>

<template>
        <div class="container">
            <div class="avatar">
                <el-avatar class="avatar-animation"  :size="120" :src="avatarUrl"></el-avatar>
            </div>
            <div id="admin-name">
                Septangle
            </div>
            <div class="blog-count-info">
                <div class="article" @click="routerChange('/')">
                    <div class="item-name">
                        文章
                    </div>
                    <div class="cnt">
                        {{userStore.getAdminInfo().article_count}}
                    </div>
                </div>
                <div class="tag" @click="routerChange('/tags')">
                    <div class="item-name">
                    标签
                    </div>
                    <div class="cnt">
                        {{userStore.getAdminInfo().tag_count}}
                    </div>
                </div>
                <div class="category" @click="routerChange('/categories')">
                    <div class="item-name">
                        分类
                    </div>
                    <div class="cnt">
                        {{userStore.getAdminInfo().category_count}}
                    </div>
                </div>
            </div>
            <div class="media-urls">
                <div class="github media-url" @click="routerChange('')">
                    <el-icon class="bx bxl-github"/>
                </div>
                <div class="qq media-url" @click="routerChange('')">
                    <el-icon class="bx bxs-tennis-ball"/>
                </div>
                <div class="steam media-url" @click="routerChange('')">
                    <el-icon class="bx bxl-steam"/>
                </div>
                <div class="email media-url" @click="routerChange('')">
                    <el-icon class="bx bxl-gmail"/>
                </div>
            </div>
        </div>
</template>

<style scoped>

.container{
    background-color: rgba(26,26,26,0.8);
    padding: 20px;
    height: 280px;
    width: 90%;
    border-radius: 8px;
    transition: all ease-in-out 0.8s;
}

.dark .container{
    background: rgba(26, 26, 26, 0.8);
    box-shadow: rgba(26, 26, 26, 0.9) 4px 4px 12px;
}

.colorful .container{
    background: rgb(121,9,34);
    background: linear-gradient(300deg, rgba(121,7,5,0.45) 27%, rgba(103,101,215,0.5) 100%, rgba(250,187,233,0.37) 100%);
}
.container{
    backdrop-filter: blur(2px);
}
.container:hover{
    backdrop-filter: blur(12px);
}

.avatar{
    display: flex;
    justify-content: center;
}
.avatar-animation{
    width: 120px;
    height: 120px;
    transition: all ease-in-out 1.2s;
}
.avatar-animation:hover{
    transform: rotateZ(360deg);
}

.item-name:hover,
.cnt:hover{
    cursor: pointer;
}

#admin-name{
    display: flex;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    margin-bottom: 20px;
}
.blog-count-info{
    justify-content: space-between;
    display: flex;
    color: rgba(255,255,255,0.8);
    font-size: 14px;
}
.cnt{
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    padding-top: 10px;
}
.media-urls{
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
}
.dark .media-url:hover{
    backdrop-filter: brightness(130%) contrast(150%);
    cursor: pointer;
    transition: all ease-in-out 0.6s;
}
.media-url{
    background-color: transparent;
    color: white;
    padding: 3px 15px;
    border-radius: 8px;
}
</style>