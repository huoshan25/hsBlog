// markdown/components/CodeBlock.ts
import hljs from 'highlight.js'
import { copyToClipboard, toggleCode } from '../scripts/codeActions'
import type { MarkdownComponent } from '../types'
import {codeBlockStyles} from "~/hsMarkdown/scripts/code-block";

export const languageAliases: Record<string, string> = {
  'ts': 'typescript',
  'js': 'javascript',
  'py': 'python',
  'rb': 'ruby',
  'yml': 'yaml',
  'sh': 'bash',
  'rs': 'rust'
}

export const CodeBlock: MarkdownComponent = {
  name: 'code-block',
  render: (str: string, lang: string): string => {
    const actualLang = languageAliases[lang] || lang
    let languageDisplay = actualLang ? actualLang.charAt(0).toUpperCase() + actualLang.slice(1) : 'Text'

    if (actualLang && hljs.getLanguage(actualLang)) {
      try {
        const highlighted = hljs.highlight(str, {
          language: actualLang,
          ignoreIllegals: true
        }).value

        return `
          <div class="code-card n-card">
            <div class="code-header">
              <div class="language-tag">${languageDisplay}</div>
              <div class="code-actions">
                <button onclick="toggleCode(this)" class="toggle-btn">收起</button>
                <button onclick="copyCode(this)" class="copy-btn">复制代码</button>
              </div>
            </div>
            <pre class="hljs p-[15px]"><code>${highlighted}</code></pre>
          </div>
          <style>
               ${codeBlockStyles}
            </style>
          <script>
            ${copyToClipboard}
            ${toggleCode}
          </script>
        `
      } catch (__) {}
    }
    return `<pre class="hljs p-[15px]"><code>${str}</code></pre>`
  }
}