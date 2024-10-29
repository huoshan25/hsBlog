// composables/useMarkdown.ts
import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'
import { h } from 'vue'
import {languageAliases} from "~/hsMarkdown/components/codeBlock";
import {MarkdownCode} from "~/components/markdown/markdownCode";

export const useMarkdown = () => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (str, lang) => {
      const actualLang = languageAliases[lang] || lang

      // 先进行高亮处理
      let highlightedCode = str
      if (actualLang && hljs.getLanguage(actualLang)) {
        try {
          highlightedCode = hljs.highlight(str, {
            language: actualLang,
            ignoreIllegals: true
          }).value
        } catch (e) {}
      }

      // 返回特殊标记，包含高亮后的代码
      return `<!----code-block-start-${actualLang}---->${highlightedCode}<!----code-block-end---->`
    }
  })

  let headingIndex = 0
  md.use(anchor, {
    permalink: anchor.permalink.ariaHidden({
      placement: 'after',
      symbol: '#',
    }),
    level: [1, 2, 3, 4, 5, 6],
    slugify: () => `heading-${headingIndex++}`
  })

  const renderToVNode = (content: string) => {
    const html = md.render(content)

    // 解析并替换代码块
    const parts = html.split(/<!----code-block-start-(.+?)---->([\s\S]+?)<!----code-block-end---->/)
    const nodes = []

    for (let i = 0; i < parts.length; i += 3) {
      // 添加普通的 HTML 内容
      if (parts[i]) {
        nodes.push(h('div', { innerHTML: parts[i] }))
      }

      // 添加代码块组件
      if (i + 2 < parts.length) {
        const language = parts[i + 1]
        const highlightedCode = parts[i + 2]
        nodes.push(h(MarkdownCode, {
          code: highlightedCode,
          language,
          highlighted: true // 标记代码已经过高亮处理
        }))
      }
    }

    return h('div', { class: 'markdown-content' }, nodes)
  }

  return {
    renderToVNode
  }
}