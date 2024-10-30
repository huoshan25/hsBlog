import MarkdownIt from 'markdown-it'
import 'highlight.js/styles/vs2015.css'
import { codeBlock } from './components/codeBlock'
import type { MarkdownComponent } from './types'

export class AiMarkdownExtension {
  private readonly md: MarkdownIt
  private components: Map<string, MarkdownComponent> = new Map()

  constructor(options: any = {}) {
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

    this.registerDefaultComponents()
  }

  registerComponent(component: MarkdownComponent) {
    this.components.set(component.name, component)
  }

  private registerDefaultComponents() {
    this.registerComponent(codeBlock)
  }

  getInstance() {
    return {
      render: (content: string) => {
        const html = this.md.render(content)
        return html.replace(
          /<!--CODE_BLOCK_START (\w+)-->([\s\S]*?)<!--CODE_BLOCK_END-->/g,
          (_, lang, code) => this.components.get('code-block')?.render(code, lang) || code
        )
      }
    }
  }
}