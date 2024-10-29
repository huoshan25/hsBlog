export interface MarkdownComponent {
  name: string
  render: (str: string, lang: string) => string
}

export interface MarkdownOptions {
  html?: boolean
  linkify?: boolean
  typographer?: boolean
}