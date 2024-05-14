import {defineStore} from "pinia";
import {reactive, ref} from "vue";

interface MainRouterViewAnimation{
    show : boolean
    animation : string
}

export const useAnimationStore = defineStore("animation",()=>{
    const routerViewAnimation : MainRouterViewAnimation = reactive({
        show : true,
        animation : ""
    })

    const backgroundURI = ref('/src/assets/109700542_p0.jpg')

    function getBackgroundURI() {
        return backgroundURI.value
    }
    function setBackgroundURI(uri : string) {
        backgroundURI.value = uri
    }

    function setRouterViewAnimation(animation : string) {
        routerViewAnimation.animation = animation
    }
    function setRouterViewAnimationStatus(show : boolean) {
        routerViewAnimation.show = show
    }
    function toggleRouterViewAnimation() {
        routerViewAnimation.show = !routerViewAnimation.show
    }
    function getRouterViewAnimationStatus() {
        return routerViewAnimation.show
    }
    function getRouterViewAnimation() {
        return routerViewAnimation.animation
    }
    return {
        setRouterViewAnimation,setRouterViewAnimationStatus,toggleRouterViewAnimation,
        getRouterViewAnimationStatus,getRouterViewAnimation,
        getBackgroundURI, setBackgroundURI
    }
})