import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'
import slugify from 'slugify'

export default defineNuxtPlugin(() => {
    const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang): string {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
                } catch (__) {}
            }
            return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
        }
    })

    md.use(anchor, {
        permalink: anchor.permalink.ariaHidden({
            placement: 'after',
            symbol: '#',
        }),
        level: [1, 2, 3, 4, 5, 6],
        slugify: (s) => slugify(s, { lower: true, strict: true })
    })

    return {
        provide: {
            markdown: md
        }
    }
})