// // utils/markdown/highlight.ts
// import hljs from 'highlight.js'
// import { copyToClipboard, toggleCode } from './code-scripts'
// import { codeStyles } from './code-styles'
// import {languageAliases} from "~/hsMarkdown/components/codeBlock";
//
// export function highlightCode(str: string, lang: string, md: any): string {
//   const actualLang = languageAliases[lang] || lang
//   let languageDisplay = actualLang ? actualLang.charAt(0).toUpperCase() + actualLang.slice(1) : 'Text'
//
//   if (actualLang && hljs.getLanguage(actualLang)) {
//     try {
//       const highlighted = hljs.highlight(str, {
//         language: actualLang,
//         ignoreIllegals: true
//       }).value
//
//       return `
//         <div class="code-card n-card">
//           <div class="code-header">
//             <div class="language-tag">${languageDisplay}</div>
//             <div class="code-actions">
//               <button onclick="toggleCode(this)" class="toggle-btn">收起</button>
//               <button onclick="copyCode(this)" class="copy-btn">复制代码1</button>
//             </div>
//           </div>
//           <pre class="hljs p-[15px]"><code>${highlighted}</code></pre>
//         </div>
//         <style>${codeStyles}</style>
//         <script>
//           ${copyToClipboard}
//           ${toggleCode}
//         </script>
//       `
//     } catch (__) {}
//   }
//   return `<pre class="hljs p-[15px]"><code>${md.utils.escapeHtml(str)}</code></pre>`
// }