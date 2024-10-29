// markdown/core.ts
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
      highlight: (str, lang) => {
        return this.components.get('code-block')?.render(str, lang) || str
      }
    })

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
    return this.md
  }
}