import { AiMarkdownExtension } from '~/hsMarkdown/aiMarkdown'

export default defineNuxtPlugin(() => {
  const aiMarkdownExt = new AiMarkdownExtension()

  return {
    provide: {
      aiMarkdown: aiMarkdownExt.getInstance()
    }
  }
})