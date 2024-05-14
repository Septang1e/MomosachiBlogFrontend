<script setup lang="ts">
import {onBeforeMount, reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import type {User} from "@/api/user";
import {adminLogin, authorization} from "@/api/user";
import {setToken} from "@/utils/local-storage";
import {useRouter} from "vue-router";
import Header from "@/components/Header.vue";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore()
const adminFormData : User = reactive({
    username : '',
    password : '',
})
const rememberMe = ref(false)
const router = useRouter()
function loginHandler() {
    adminFormData.username.trim()
    adminFormData.password.trim()
    if(adminFormData.username === '') {
        ElMessage.error("用户名不能为空")
        return
    }
    if(adminFormData.password === '') {
        ElMessage.error("密码不能为空")
        return
    }
    adminLogin(adminFormData).then((res)=> {
        if(res.code === 1) {
            setToken(res.data)
            userStore.setRememberMe(rememberMe.value)
            ElMessage.success("登录成功")
            router.replace("/admin-backend/index")
        }
    })
}
function backToIndex() {
    router.replace("/")
}

</script>

<template>
    <div class="login-page-container">
        <div class="cover-msg">
            <h1>
                Momosachi
            </h1>
            <h1>
                の
            </h1>
            <h1>
                Backend
            </h1>
        </div>
        <div class="login-card-container">
            <div class="icons">
                <h1>
                    Login
                </h1>
            </div>
            <el-form
                class="type-area" v-model="adminFormData">
                <div class="username">
                    <el-icon class="icon bx bxs-user" :size="20"></el-icon>
                    <el-input :size="'large'" placeholder="username" type="text" style="font-size: 15px;" v-model="adminFormData.username"/>
                </div>
                <div class="password">
                    <el-icon class="icon bx bxs-lock" :size="20"></el-icon>
                    <el-input
                        :size="'large'" placeholder="password"
                        type="password" v-model="adminFormData.password"
                    />
                </div>
                <el-checkbox style="color: white;margin-top: 5px" v-model="rememberMe" >记住我</el-checkbox>
            </el-form>
            <div class="login-btn-container">
                <el-button type="primary" @click="loginHandler" class="login-btn">登录</el-button>
            </div>
            <div class="bottom-msg">
                ❓欢迎来到MomosachiBackend，点击
                <p @click="backToIndex">
                    首页
                </p>
                可以返回首页喵
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-page-container{
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}
.login-card-container{
    margin: 10px;
    width: 420px;
    height: 440px;
    backdrop-filter: blur(5px);
    padding: 20px;
    border-radius: 12px;
    transition: all ease-in-out 0.7s;
    box-shadow: lightpink 0 0 4px;
}
.cover-msg{
    display: flex;
    color: lightskyblue;
    width: fit-content;
    h1{
        font-size: 40px;
        width: fit-content;
        text-shadow: 1px 1px lightpink, 0 0 15px lightpink;
        cursor: pointer;
        transition: text-shadow 0.6s ease-in-out;
    }
    h1:hover{
        text-shadow: 1px 1px lightpink, 0 0 25px lightpink;;
    }
}
.input-box{
    width: 100%;
    border: 0;
    height: 30px;

}
.input-box:focus{
    outline: darkgrey 5px;
}
.login-card-container:hover{
    backdrop-filter: blur(20px);
    box-shadow: lightpink 0 0 15px;
}
.icons{
    font-weight: bold;
    align-items: center;
    justify-content: center;
    display: flex;
    h1{
        font-size: 60px;
        width: fit-content;
        cursor: pointer;
    }
}


.dark .icons{
    color: white;
}

.type-area{
    margin: 0 20px;
}
.username{
    margin-top: 20px;
    display: flex;
    align-items: center;
    .icon{
        position: absolute;
        right: 45px;
        z-index: 1;
        color: darkgrey;
    }
}
.password{
    margin-top: 20px;
    display: flex;
    align-items: center;
    .icon{
        position: absolute;
        right: 45px;
        z-index: 1;
        color: darkgrey;
    }
}
.login-btn-container{
    margin-top: 30px;
    align-items: center;
    display: flex;
    justify-content: center;
}
.login-btn{
    width: 80%;
    height: 40px;
    border: 0;
    border-radius: 18px;
    cursor: pointer;
    font-weight: bold;
    font-size: 18px;
}

.dark .login-card-container{
    background: rgba(26, 26, 26, 0.8);
    box-shadow: rgba(26, 26, 26, 0.9) 4px 4px 12px;
}
.colorful .login-card-container{
    background: rgb(121,9,34);
    background: linear-gradient(120deg, rgba(121,7,5,0.45) 27%, rgba(103,101,215,0.5) 100%, rgba(250,187,233,0.37) 100%);
}
.bottom-msg{
    font-size: 15px;
    margin-top: 10px;
    color: white;
    display: flex;
    align-items: center;
    p{
        margin: 0 5px;
        font-weight: bold;
        cursor: pointer;
    }
}
</style>
