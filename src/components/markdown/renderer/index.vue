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
  return $markdown.render(props.markdown)
})
</script>

<style>
.markdown-body {
  padding: 20px;
  overflow-x: hidden;
}

</style>