// import MarkdownIt from 'markdown-it'
// import anchor from 'markdown-it-anchor'
// import hljs from 'highlight.js'
// import 'highlight.js/styles/vs2015.css'
//
// export default defineNuxtPlugin(() => {
//   const languageAliases: Record<string, string> = {
//     'ts': 'typescript',
//     'js': 'javascript',
//     'py': 'python',
//     'rb': 'ruby',
//     'yml': 'yaml',
//     'sh': 'bash',
//     'rs': 'rust'
//   }
//
//   // 添加复制功能的客户端函数
//   const copyToClipboard = `
//     function copyCode(button) {
//       const pre = button.closest('.code-card').querySelector('pre');
//       const code = pre.querySelector('code').innerText;
//       navigator.clipboard.writeText(code).then(() => {
//         button.textContent = '已复制';
//         setTimeout(() => {
//           button.textContent = '复制代码3';
//         }, 2000);
//       });
//     }
//   `
//
//   // 添加展开/收起功能
//   const toggleCode = `
//     function toggleCode(button) {
//       const card = button.closest('.code-card');
//       const pre = card.querySelector('pre');
//       const isCollapsed = pre.style.display === 'none';
//       pre.style.display = isCollapsed ? 'block' : 'none';
//       button.innerHTML = isCollapsed ? '收起' : '展开';
//     }
//   `
//
//   const md = new MarkdownIt({
//     html: true,
//     linkify: true,
//     typographer: true,
//     highlight: function (str, lang): string {
//       const actualLang = languageAliases[lang] || lang
//       let languageDisplay = actualLang ? actualLang.charAt(0).toUpperCase() + actualLang.slice(1) : 'Text'
//
//       if (actualLang && hljs.getLanguage(actualLang)) {
//         try {
//           const highlighted = hljs.highlight(str, {
//             language: actualLang,
//             ignoreIllegals: true
//           }).value
//
//           return `
//             <div class="code-card n-card">
//               <div class="code-header">
//                 <div class="language-tag">${languageDisplay}</div>
//                 <div class="code-actions">
//                   <button onclick="toggleCode(this)" class="toggle-btn">收起</button>
//                   <button onclick="copyCode(this)" class="copy-btn">复制代码</button>
//                 </div>
//               </div>
//               <pre class="hljs p-[15px]"><code>${highlighted}</code></pre>
//             </div>
//             <style>
//               .code-card {
//                 margin: 16px 0;
//                 border: 1px solid #e0e0e0;
//                 border-radius: 8px;
//                 overflow: hidden;
//               }
//               .code-header {
//                 display: flex;
//                 justify-content: space-between;
//                 align-items: center;
//                 padding: 8px 16px;
//                 background: #f5f5f5;
//                 border-bottom: 1px solid #e0e0e0;
//               }
//               .language-tag {
//                 font-size: 14px;
//                 color: #666;
//               }
//               .code-actions {
//                 display: flex;
//                 gap: 8px;
//               }
//               .copy-btn, .toggle-btn {
//                 padding: 4px 8px;
//                 font-size: 12px;
//                 border: 1px solid #d9d9d9;
//                 border-radius: 4px;
//                 background: white;
//                 cursor: pointer;
//                 transition: all 0.3s;
//               }
//               .copy-btn:hover, .toggle-btn:hover {
//                 border-color: #2080f0;
//                 color: #2080f0;
//               }
//             </style>
//             <script>
//               ${copyToClipboard}
//               ${toggleCode}
//             </script>
//           `
//         } catch (__) {}
//       }
//       return `<pre class="hljs p-[15px]"><code>${md.utils.escapeHtml(str)}</code></pre>`
//     }
//   })
//
//   let headingIndex = 0
//   md.use(anchor, {
//     permalink: anchor.permalink.ariaHidden({
//       placement: 'after',
//       symbol: '#',
//     }),
//     level: [1, 2, 3, 4, 5, 6],
//     slugify: () => `heading-${headingIndex++}`
//   })
//
//   return {
//     provide: {
//       markdown: md
//     }
//   }
// })