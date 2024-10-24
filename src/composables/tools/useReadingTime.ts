/**
 * 阅读时长计算
 */
export const useReadingTime = () => {
  const minutes = ref(0)
  const startTime = ref(0)
  const totalTime = ref(0)
  const isReading = ref(false)
  let idleTimer: NodeJS.Timeout

  // 开始阅读
  const startReading = () => {
    if (!isReading.value) {
      startTime.value = Date.now()
      isReading.value = true
    }
  }

  // 暂停阅读
  const pauseReading = () => {
    if (isReading.value) {
      totalTime.value += Date.now() - startTime.value
      isReading.value = false
      updateMinutes()
    }
  }

  // 更新分钟数
  const updateMinutes = () => {
    minutes.value = Math.floor(totalTime.value / 60000)
  }

  // 重置空闲计时器
  const resetIdleTimer = () => {
    clearTimeout(idleTimer)
    idleTimer = setTimeout(() => {
      pauseReading()
    }, 30000) // 30秒无操作暂停计时
  }

  // 页面可见性变化处理
  const handleVisibility = () => {
    if (document.hidden) {
      pauseReading()
    } else {
      startReading()
    }
  }

  // 用户交互处理
  const handleInteraction = () => {
    startReading()
    resetIdleTimer()
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibility)
    document.addEventListener('scroll', handleInteraction)
    document.addEventListener('mousemove', handleInteraction)
    startReading() // 初始化时开始计时
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibility)
    document.removeEventListener('scroll', handleInteraction)
    document.removeEventListener('mousemove', handleInteraction)
    clearTimeout(idleTimer)
    pauseReading()
  })

  return {
    minutes: readonly(minutes)
  }
}