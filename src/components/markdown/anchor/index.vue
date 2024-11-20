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
  const lines = props.content?.split('\n')
  const result: any = []
  let index = 0

  lines?.forEach(line => {
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
  <div class="bg-white" v-if="hasHeadings">
    <client-only>
      <n-card hoverable>
        <template #header>
          <div class="flex justify-between items-center">
            <span>目录</span>
            <n-button icon-placement="right" text @click.stop="collapsed = !collapsed">
              {{ collapsed ? '展开' : '收起' }}
              <template #icon>
                <ChevronDownSharp v-if="collapsed"/>
                <ChevronUp v-else/>
              </template>
            </n-button>
          </div>
        </template>

        <div class="anchor-wrapper" :class="{ 'anchor-collapsed': collapsed }">
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
      </n-card>
      <template #fallback>
        <div class="p-[15px]">
          <common-skeleton text width="100%"/>
          <common-skeleton text width="100%"/>
          <common-skeleton text width="100%"/>
        </div>
      </template>
    </client-only>
  </div>
</template>

<style scoped lang="scss">
.anchor-wrapper {
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease-in-out;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #989b9f;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}

.anchor-wrapper.anchor-collapsed {
  max-height: 0;
  visibility: hidden;
  opacity: 0;
  transform: translateY(-10px);
}

:deep(.n-anchor-link__title) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>