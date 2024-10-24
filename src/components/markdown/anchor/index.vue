<script setup lang="ts">
const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const hasHeadings = computed(() => {
  return headings.value.length > 0
})

const headings = computed(() => {
  const lines = props.content.split('\n')
  const result: any = []
  let index = 0

  lines.forEach(line => {
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const title = match[2].trim()
      const id = `heading-${index++}`

      result.push({
        level,
        title,
        id
      })
    }
  })

  return result
})

const handleScrollTo = (href: string, el: HTMLElement) => {
  const targetOffset = el.getBoundingClientRect().top + window.pageYOffset - 3000
  window.scrollTo({
    top: targetOffset,
    behavior: 'smooth'
  })
}
</script>

<template>
  <div class="nav-container" v-if="hasHeadings">
    <n-anchor
        :bound="150"
        :top="88"
        style="z-index: 1"
        :ignore-gap="true"
    >
      <template v-for="heading in headings" :key="heading.id">
        <n-anchor-link
            :title="heading.title"
            :href="`#${heading.id}`"
        />
      </template>
    </n-anchor>
  </div>
</template>

<style scoped>
.nav-container {
  padding: 20px;
  background-color: white;
  position: fixed;
}
</style>