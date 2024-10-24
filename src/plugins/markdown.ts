import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'

export default defineNuxtPlugin(() => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang): string {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code>${hljs.highlight(str, {
            language: lang,
            ignoreIllegals: true
          }).value}</code></pre>`
        } catch (__) {
        }
      }
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
  })

  let headingIndex = 0
  md.use(anchor, {
    permalink: anchor.permalink.ariaHidden({
      placement: 'after',
      symbol: '#',
    }),
    level: [1, 2, 3, 4, 5, 6],
    slugify: () => `heading-${headingIndex++}` // 自动生成 heading-0, heading-1 等
  })

  return {
    provide: {
      markdown: md
    }
  }
})