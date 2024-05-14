import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import type {TocAst} from "markdown-it-toc-done-right";

export const useTocStore = defineStore('toc',()=>{
    let tocAst : TocAst[] = reactive([])
    function initTocAst() {
        tocAst.length = 0
    }
    function getTocAst() {
        return tocAst
    }
    function setTocAst(ast : TocAst[]) {
        for(let i = 0; i < ast.length; i++) {
            tocAst.push(ast[i])
        }
    }
    return {initTocAst, getTocAst, setTocAst}
})