<template>
  <div class="nav-container" v-if="hasHeadings">
    <n-anchor
        :show-rail="true"
        :bound="100"
        :offset="100"
        :top="88"
        style="z-index: 1"
        :ignore-gap="true"
    >
      <template v-for="heading in headings" :key="heading.id">
        <n-anchor-link
            :title="heading.title"
            :href="`#${heading.id}`"
        >
          <template v-for="subHeading in heading.children" :key="subHeading.id">
            <n-anchor-link
                :title="subHeading.title"
                :href="`#${subHeading.id}`"
            />
          </template>
        </n-anchor-link>
      </template>
    </n-anchor>
  </div>
</template>

<script setup>
import slugify from 'slugify'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const hasHeadings = computed(() => {
  return headings.value.length > 0
})

// 使用与markdown-it-anchor相同的slugify方法生成id
const headings = computed(() => {
  const lines = props.content.split('\n')
  const result = []
  const stack = [{ level: 0, children: result }]

  lines.forEach(line => {
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const title = match[2].trim()
      const id = slugify(title, { lower: true, strict: true }) // 使用相同的slugify方法

      while (stack[stack.length - 1].level >= level) {
        stack.pop()
      }

      const heading = {
        level,
        title,
        id,
        children: []
      }

      stack[stack.length - 1].children.push(heading)
      stack.push(heading)
    }
  })

  return result
})
</script>

<style scoped>
.nav-container {
  padding: 20px;
  background-color: white;
  position: fixed;
}
</style>