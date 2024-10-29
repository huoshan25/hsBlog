import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'
import type { MarkdownComponent, MarkdownOptions } from './types'
import {CodeBlock} from "~/hsMarkdown/components/codeBlock";

export class MarkdownExtension {
  private readonly md: MarkdownIt
  private components: Map<string, MarkdownComponent> = new Map()

  constructor(options: MarkdownOptions = {}) {
    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      ...options,
    })

    this.md.renderer.rules.fence = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      const codeBlock = this.components.get('code-block')
      if (codeBlock) {
        return codeBlock.render(token.content, token.info)
      }
      return `<pre><code>${token.content}</code></pre>`
    }


    // 重写普通代码块渲染器
    this.md.renderer.rules.code_block = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      return this.components.get('code-block')?.render(token.content, '') || token.content
    }

    this.md.renderer.rules.fence = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      console.log('Fence token:', token)
      const result = this.components.get('code-block')?.render(token.content, token.info) || token.content
      console.log('Rendered result:', result)
      return result
    }


    this.registerDefaultComponents()
    this.setupAnchor()
  }

  private setupAnchor() {
    let headingIndex = 0
    this.md.use(anchor, {
      permalink: anchor.permalink.ariaHidden({
        placement: 'after',
        symbol: '#',
      }),
      level: [1, 2, 3, 4, 5, 6],
      slugify: () => `heading-${headingIndex++}`
    })
  }

  registerComponent(component: MarkdownComponent) {
    this.components.set(component.name, component)
  }

  private registerDefaultComponents() {
    this.registerComponent(CodeBlock)
  }

  getInstance() {
    return {
      render: (content: string) => {
        const html = this.md.render(content)
        // 处理代码块
        return html.replace(
          /<!--CODE_BLOCK_START (\w+)-->([\s\S]*?)<!--CODE_BLOCK_END-->/g,
          (_, lang, code) => this.components.get('code-block')?.render(code, lang) || code
        )
      }
    }
  }
}