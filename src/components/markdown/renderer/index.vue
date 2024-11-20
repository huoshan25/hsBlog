<template>
  <div class="markdown-body px-[15px]" v-html="renderedContent"></div>
</template>

<script setup>
const props = defineProps({
  markdown: {
    type: String,
    required: true
  }
})

const {$markdown} = useNuxtApp()

const renderedContent = computed(() => {
  if (!props.markdown) return ''

  let content = $markdown.render(props.markdown)
  let headingIndex = 0

  // 处理标题的锚点
  return content.replace(/<h([1-6])>(.*?)<\/h\1>/g, (match, level, text) => {
    const id = `heading-${headingIndex++}`
    return `<h${level} id="${id}">${text}<a class="header-anchor" href="#${id}"></a></h${level}>`
  })
})
</script>

<style>

</style>