import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import hljs from 'highlight.js'
// import 'highlight.js/styles/hybrid.css'
import 'highlight.js/styles/vs2015.css'

export default defineNuxtPlugin(() => {
  const languageAliases: Record<string, string> = {
    'ts': 'typescript',
    'js': 'javascript',
    'py': 'python',
    'rb': 'ruby',
    'yml': 'yaml',
    'sh': 'bash',
    'rs': 'rust'
  }

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang): string {
      const actualLang = languageAliases[lang] || lang

      if (actualLang && hljs.getLanguage(actualLang)) {
        try {
          return `<pre class="hljs p-[15px]"><code>${hljs.highlight(str, {
            language: actualLang,
            ignoreIllegals: true
          }).value}</code></pre>`
        } catch (__) {
        }
      }
      return `<pre class="hljs p-[15px]"><code>${md.utils.escapeHtml(str)}</code></pre>`
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

  return {
    provide: {
      markdown: md
    }
  }
})