import {MarkdownExtension} from "~/hsMarkdown/core";

export default defineNuxtPlugin(() => {
  const markdownExt = new MarkdownExtension()

  return {
    provide: {
      markdown: markdownExt.getInstance()
    }
  }
})