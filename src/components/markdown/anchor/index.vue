<script setup lang="ts">
import {ChevronUp, ChevronDownSharp} from '@vicons/ionicons5'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const collapsed = ref(false)

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

</script>

<template>
  <div class="nav-container" v-if="hasHeadings">
    <n-card hoverable>
      <template #header>
        <div class="card-header">
          <span>目录</span>
          <n-button icon-placement="right" text @click="collapsed = !collapsed">
            {{ collapsed ? '展开' : '收起' }}
            <template #icon>
              <ChevronDownSharp v-if="collapsed"/>
              <ChevronUp v-else/>
            </template>
          </n-button>
        </div>
      </template>

      <n-collapse-transition :show="!collapsed">
        <div class="anchor-wrapper">
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
      </n-collapse-transition>
    </n-card>
  </div>
</template>

<style scoped>
.nav-container {
  position: fixed;
  background-color: white;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.anchor-wrapper {
  max-height: 420px;
  overflow-x: hidden;
}

:deep(.n-anchor-link__title) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>