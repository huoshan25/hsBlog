<template>
  <div class="markdown-body" v-html="renderedContent"></div>
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
  if(props.markdown) {
    return $markdown.render(props.markdown)
  } else {
    return ''
  }
})
</script>

<style>
.markdown-body {
}

</style>