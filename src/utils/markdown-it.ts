import MarkdownIt from "markdown-it"
import type {Token} from "markdown-it"
import highLightJS from "highlight.js"
import "highlight.js/styles/tomorrow-night-bright.css"
import container from "markdown-it-container"
import toc from "markdown-it-toc-done-right"
import type {TocAst} from "markdown-it-toc-done-right"
import ins from "markdown-it-ins"
import abbr from "markdown-it-abbr"
import anchor from "markdown-it-anchor"
import sub from "markdown-it-sub"
import sup from "markdown-it-sup"
import taskList from "markdown-it-task-lists"
import footnote from "markdown-it-footnote"
import mark from "markdown-it-mark"
import katex from "markdown-it-katex"
//import mermaid from "markdown-it-mermaid"
import deflist from "markdown-it-deflist"

//
import bash from 'highlight.js/lib/languages/bash'
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import java from 'highlight.js/lib/languages/java';
import sql from 'highlight.js/lib/languages/sql';
import nginx from 'highlight.js/lib/languages/nginx';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import xml from 'highlight.js/lib/languages/xml';
//import htmlbars from 'highlight.js/lib/languages/htmlbars'
import shell from 'highlight.js/lib/languages/shell'
import {useTocStore} from "@/stores/toc";
import {reactive, ref} from "vue";

highLightJS.registerLanguage('bash', bash)
highLightJS.registerLanguage('javascript', javascript);
highLightJS.registerLanguage('typescript', typescript);
highLightJS.registerLanguage('java', java);
highLightJS.registerLanguage('sql', sql);
highLightJS.registerLanguage('nginx', nginx);
highLightJS.registerLanguage('json', json);
highLightJS.registerLanguage('yaml', yaml);
highLightJS.registerLanguage('xml', xml);
//highLightJS.registerLanguage('htmlbars', htmlbars);
highLightJS.registerLanguage('shell', shell);

export const tocAst : TocAst[] = reactive([])
export const tocHtml = ref("")

const markdownIt = new MarkdownIt({
    html: true,
    xhtmlOut: false,
    breaks: true,
    langPrefix: 'lang-',
    linkify: false,
    typographer: true,
    quotes: '“”‘’',
    highlight: function (str : string, lang : string) {
        const codeIndex = parseInt(String(Date.now())) + Math.floor(Math.random() * 100000)
        let html = `<button class="copy-btn" type="button" data-clipboard-action="copy" data-clipboard-target="#copy${codeIndex}"><el-icon class="bx bxs-copy"/></button>`
        const lineLength = str.split(/\n/).length - 1
        let lineNum = '<span aria-hidden="true" class="line-numbers-rows">'
        for(let idx = 0; idx < lineLength; idx++){
            lineNum = lineNum + '<span></span>'
        }
        lineNum+='</span>'

        if (lang && highLightJS.getLanguage(lang)) {
            try {
                // highlight.js 高亮代码
                const preCode = highLightJS.highlight(lang, str, true).value
                html = html + preCode
                if (lineLength) {
                    html += '<b class="name">' + lang + '</b>'
                }
                // 将代码包裹在 textarea 中，由于防止textarea渲染出现问题，这里将 "<" 用 "&lt;" 代替，不影响复制功能
                return `<pre><code>${html}</code>${lineNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeIndex}">${str.replace(/<\/textarea>/g, '&lt;/textarea>')}</textarea>`
            } catch (error) {
                console.log(error)
            }
        }

        const preCode = markdownIt.utils.escapeHtml(str)
        html = html + preCode
        return `<pre><code>${html}</code>${lineNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeIndex}">${str.replace(/<\/textarea>/g, '&lt;/textarea>')}</textarea>`
    }
})

markdownIt.use(container)
    .use(katex, {
        "throwOnError" : false,
        "errorColor" : " #cc0000",
        "display-mode" : true,
        mhchem: true,

        globalOptions: {
            //... Define globally applied KaTeX options here
        }
    })
    .use(toc, {
        containerClass: 'toc-content',
        //containerId: 'toc',
        listType: 'ul',
        listClass: 'menu-list',
        itemClass: 'menu-item',
        linkClass: 'link',
        includeLevel: [1, 2, 3],
        callback: function (html, ast) {
            if(ast.c.length != 0) {
                tocAst.push(ast)
                tocHtml.value += decodeURIComponent(html) + "\n"
            }
        }
    })
    .use(ins)
    .use(abbr)
    .use(sub)
    .use(sup)
    .use(taskList)
    .use(anchor, {
        slugify: function (header) {
            // 自定义slugify函数，解码URI并返回
            return decodeURIComponent(header);
        },
        //permalink: anchor.permalink.headerLink({safariReaderFix: true}),
        //permalinkSymbol: "",

    })
    .use(footnote)
    .use(mark)
//    .use(mermaid)
    .use(deflist)

/**
 *
 *         if (lang && highLightJS.getLanguage(lang)) {
 *             try {
 *                 return (
 *                     '<pre><code>' +
 *                     highLightJS.highlight(lang, str, true).value +
 *                     "</code>" +
 *                     "</pre>"
 *                 );
 *             } catch (__) {
 *             }
 *         }
 *
 *         return (
 *             '<pre><code>' +
 *             markdownIt.utils.escapeHtml(str) +
 *             "</code></pre>"
 *         );
 */
export default markdownIt