<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'
import {analyzeCode} from "~/api/blog/post";
import {CalendarClearOutline, CloseOutline} from '@vicons/ionicons5'

const {$aiMarkdown} = useNuxtApp()

const isOpen = ref(false)
const isLoading = ref(false)
const error = ref('')
const content = ref('')

const abortController = ref<AbortController | null>(null)

// 使用计算属性来渲染markdown
const analysis = computed(() => {
  return content.value ? $aiMarkdown.render(content.value) : ''
})

/*处理代码分析*/
const handleAnalyzeCode = async (event: CustomEvent) => {
  const { code, language } = event.detail
  isOpen.value = true
  isLoading.value = true
  error.value = ''
  content.value = ''

  abortController.value = new AbortController()

  try {
    const response = await analyzeCode({
      code,
      language,
      signal: abortController.value.signal
    })

    if (!response.ok) {
      throw new Error(`HTTP错误!状态: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('无法获取响应流')
    }

    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk
          .split('\n')
          .filter(line => line.trim().startsWith('data: '))
          .map(line => line.replace('data: ', ''))

      for (const line of lines) {
        if (line.trim() === '[DONE]') continue
        try {
          const { content: newContent } = JSON.parse(line)
          if (newContent) {
            content.value += newContent
          }
        } catch (e) {
          console.error('解析流数据错误:', e)
        }
      }
    }
  } catch (err) {
    console.error('分析错误:', err)
    error.value = '代码分析失败，请稍后重试'
  } finally {
    isLoading.value = false
    abortController.value = null
  }
}


const close = () => {
  if (abortController.value) {
    abortController.value.abort()
    abortController.value = null
  }
  isOpen.value = false
}

const clearContent = () => {
  content.value = ''
}

watch(isOpen, (newValue) => {
  if (!newValue) {
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
    }
    setTimeout(() => {
      content.value = ''
      error.value = ''
    }, 300)
  }
})

onMounted(() => {
  window.addEventListener('analyze-code', handleAnalyzeCode as any)
})

onUnmounted(() => {
  if (abortController.value) {
    abortController.value.abort()
  }
  window.removeEventListener('analyze-code', handleAnalyzeCode as any)
})
</script>

<template>
  <Transition name="slide">
    <div v-if="isOpen" class="ai-analyzer">
      <div class="ai-analyzer-header">
        <h3 class="flex items-center gap-3">
          AI代码解读 -
          <nuxt-img class="ml-[2px]" src="/svg/deepseek.svg" size="40" alt="Deepseek Logo"/>
          deepseek
        </h3>
        <div class="flex">
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button text @click="clearContent">
                <template #icon>
                  <n-icon size="10">
                    <CalendarClearOutline/>
                  </n-icon>
                </template>
              </n-button>
            </template>
            清空内容
          </n-tooltip>
          <n-button class="ml-[10px]" text @click="close">
            <template #icon>
              <n-icon>
                <CloseOutline/>
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
      <div class="bg-#F7F9FD h-[100%] overflow-auto">

        <n-back-top :right="100" />
        <div class="ai-analyzer-content">
          <div v-if="isLoading && !content" class="loading">
            <n-spin size="medium"/>
            <span>AI正在分析代码...</span>
          </div>
          <div v-else-if="error" class="error">
            {{ error }}
          </div>
          <div v-else-if="content" class="analysis markdown-body" v-html="analysis"></div>
          <div v-else class="placeholder">
            点击代码块中的"代码解读"按钮开始分析
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.ai-analyzer {
  position: fixed;
  right: 20px;
  top: 45px;
  width: 31%;
  height: calc(100vh - 100px);
  background-image: url(//lf-web-assets.juejin.cn/obj/juejin-web/xitu_juejin_web/086a891….svg), url(//lf-web-assets.juejin.cn/obj/juejin-web/xitu_juejin_web/img/bgc2.1e5526a.png), linear-gradient(173deg, #f4f9ff -24.94%, #edf1f9 103.15%);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transition: right 0.3s;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  padding: 15px;
}

.ai-analyzer-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-analyzer-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.error {
  color: red;
  text-align: center;
}

.analysis {
  white-space: pre-wrap;
}
/*

/* 过渡动画 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
}

:deep(#ai-code-box) {
  display: none;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: #2b76d9;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/*打字机效果*/
.analysis {
  white-space: pre-wrap;
  animation: typing 0.05s;
}

@keyframes typing {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>