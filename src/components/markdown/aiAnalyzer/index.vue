<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'
import {analyzeCode} from "~/api/blog/post";
import {CalendarClearOutline, CloseOutline} from '@vicons/ionicons5'

const {$aiMarkdown} = useNuxtApp()

const isOpen = ref(false)
const isLoading = ref(false)
const error = ref('')
const analysis = ref('')

/*处理代码分析*/
const handleAnalyzeCode = async (event: CustomEvent) => {
  const {code, language} = event.detail
  isOpen.value = true
  isLoading.value = true
  error.value = ''

  try {
    const res = await analyzeCode({code, language})
    analysis.value = $aiMarkdown.render(res.data)
  } catch (err) {
    error.value = '代码分析失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

const close = () => {
  isOpen.value = false
}

watch(isOpen, (newValue) => {
  if (!newValue) {
    // 当面板关闭时，延迟清除内容
    setTimeout(() => {
      analysis.value = ''
      error.value = ''
    }, 300) // 等待动画完成后再清除内容
  }
})

onMounted(() => {
  window.addEventListener('analyze-code', handleAnalyzeCode as any)
})

onUnmounted(() => {
  window.removeEventListener('analyze-code', handleAnalyzeCode as any)
})
</script>

<template>
  <Transition name="slide">
    <div v-if="isOpen" class="ai-analyzer">
      <div class="bg-#F7F9FD h-[100%] overflow-auto">
        <div class="ai-analyzer-header">
          <h3 class="flex items-center gap-3">
            AI代码解读 -
            <nuxt-img class="ml-[2px]" src="/svg/deepseek.svg" size="40" alt="Deepseek Logo"/>
            deepseek
          </h3>
          <div class="flex">
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button text quaternary @click="analysis = ''">
                  <template #icon>
                    <n-icon size="10">
                      <CalendarClearOutline/>
                    </n-icon>
                  </template>
                </n-button>
              </template>
              清空内容
            </n-tooltip>
            <n-button text @click="close">
              <template #icon>
                <n-icon>
                  <CloseOutline/>
                </n-icon>
              </template>
            </n-button>
          </div>
        </div>
        <div class="ai-analyzer-content">
          <div v-if="isLoading" class="loading">
            <n-spin size="medium"/>
            <span>AI正在分析代码...</span>
          </div>
          <div v-else-if="error" class="error">
            {{ error }}
          </div>
          <div v-else-if="analysis" class="analysis" v-html="analysis"></div>
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

/*.ai-analyzer-open {
  right: 0;
}*/

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

.placeholder {
  color: #666;
  text-align: center;
}

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
</style>