import hljs from 'highlight.js'
import type {MarkdownComponent} from "~/hsMarkdown/types";
import {codeBlockStyles} from "~/hsMarkdown/components/codeBlock/code-block";
import {copyToClipboard, toggleCode} from "~/hsMarkdown/components/codeBlock/codeActions";
import {createDiscreteApi} from "naive-ui";

export const languageAliases: Record<string, string> = {
  'ts': 'typescript',
  'js': 'javascript',
  'py': 'python',
  'rb': 'ruby',
  'yml': 'yaml',
  'sh': 'bash',
  'rs': 'rust'
}

const {message} = createDiscreteApi(['message'])

declare global {
  interface Window {
    showCopySuccess: (text: string) => void;
  }
}

if(import.meta.client) {
  window.showCopySuccess = (text: string) => {
    message.success(text)
  }
}

export const codeBlock: MarkdownComponent = {
  name: 'code-block',
  render: (str: string, lang: string): string => {
    // 处理语言字符串，移除前后空格
    const cleanLang = (lang || '').trim()
    const actualLang = languageAliases[cleanLang] || cleanLang
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
              <div class="header-left">
                <button onclick="toggleCode(this)" class="toggle-btn" aria-label="Toggle code">
                  <span class="arrow-icon">▼</span>
                </button>
                <span class="language-tag">${languageDisplay}</span>
              </div>
              <div class="code-actions">
                <button onclick="copyCode(this)" class="copy-btn">复制代码</button>
              </div>
            </div>
            <pre class="hljs p-[15px] my-[0px] mx-[0px]"><code>${highlighted}</code></pre>
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