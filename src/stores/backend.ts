import {defineStore} from "pinia";
import {ref} from "vue";

export const useBackendStore = defineStore('backend',()=>{
    const collapseStatus = ref(false)
    function getCollapseStatus() {
        return collapseStatus.value
    }
    function toggleCollapseStatus() {
        collapseStatus.value = !collapseStatus.value
    }
    function initCollapseStatus() {
        collapseStatus.value = false
    }
    return {getCollapseStatus, initCollapseStatus, toggleCollapseStatus}
})