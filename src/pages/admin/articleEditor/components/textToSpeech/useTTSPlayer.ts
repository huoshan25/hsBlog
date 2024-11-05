// useTTS.ts
import { ref, onUnmounted } from 'vue'
import { Howl } from 'howler'
import { generateShortText, generateLongText, synthesizeSpeech, queryTaskStatus } from '~/api/blog/post'
import type { VoiceConfig } from './types/tts'
import { VOICE_CONFIGS } from './types/tts'

interface TTSState {
  isLoading: boolean
  isPlaying: boolean
  error: string | null
  progress: number
  shortAudioUrl: string | null  // 短文本音频
  longAudioUrl: string | null   // 长文本音频
  generatingProgress: number    // 生成进度
}

export function useTTS() {
  const state = ref<TTSState>({
    isLoading: false,
    isPlaying: false,
    error: null,
    progress: 0,
    shortAudioUrl: null,
    longAudioUrl: null,
    generatingProgress: 0
  })

  let sound: Howl | null = null
  let pollInterval: NodeJS.Timeout | null = null

  const clearSound = () => {
    if (sound) {
      sound.stop()
      sound.unload()
      sound = null
    }
  }

  /**
   * 轮询任务状态
   * @param taskIds
   */
  const pollTasksStatus = async (taskIds: string[]): Promise<string> => {
    return new Promise((resolve, reject) => {
      let attempts = 0
      const maxAttempts = 20
      let retryCount = 0
      const maxRetries = 3

      pollInterval = setInterval(async () => {
        try {
          const res = await queryTaskStatus(taskIds)
          if (res.code === 200) {
            const allTasksCompleted = res.data.tasks_info.every(
              (task: any) => task.task_status === 'Success'
            )

            if (allTasksCompleted) {
              clearInterval(pollInterval!)
              const urls = res.data.tasks_info.map(
                (task: any) => task.task_result.speech_url
              )
              resolve(urls)
              return
            }
          }

          attempts++
          if (attempts >= maxAttempts) {
            clearInterval(pollInterval!)
            reject(new Error('轮询超时'))
          }
        } catch (error) {
          retryCount++
          console.error(`轮询失败，第 ${retryCount} 次重试`)

          if (retryCount >= maxRetries) {
            clearInterval(pollInterval!)
            reject(error)
          }
        }
      }, 3000)
    })
  }

  /**
   * 处理长对话语音生成
   * @param dialogues 对话数组
   */
  const processLongDialogue = async (dialogues: Array<{ role: string; text: string }>) => {
    // 1. 生成所有语音合成任务
    const synthResults = await Promise.all(
      dialogues.map(dialogue =>
        synthesizeSpeech({
          text: dialogue.text,
          voiceConfig: dialogue.role === 'host' ? VOICE_CONFIGS.host : VOICE_CONFIGS.guest
        })
      )
    )

    // 2. 收集所有任务ID
    const taskIds = synthResults
      .filter(result => result.code === 201)
      .map(result => result.data.task_id)

    // 3. 轮询所有任务状态
    return await pollTasksStatus(taskIds)
  }

  /**
   * 过程的声音 (用于短文本)
   */
  const processVoice = async (text: string, voiceConfig: VoiceConfig) => {
    try {
      const synthRes = await synthesizeSpeech({ text, voiceConfig })
      if (synthRes.code !== 201) {
        throw new Error('语音合成失败')
      }

      const [audioUrl] = await pollTasksStatus([synthRes.data.task_id])
      state.value.shortAudioUrl = audioUrl
      return audioUrl
    } catch (error) {
      console.error('语音处理错误:', error)
      throw error
    }
  }

  /**
   * 播放简短的内容
   * @param content
   */
  const playShortContent = async (content: string) => {
    try {
      state.value.isLoading = true
      state.value.error = null
      state.value.shortAudioUrl = null

      // 1. 生成短文本
      const textRes = await generateShortText({ content })
      if (textRes.code !== 201) throw new Error('生成文本失败')

      // 2. 语音合成
      const audioUrl = await processVoice(textRes.data, VOICE_CONFIGS.host)
      state.value.shortAudioUrl = audioUrl

      // 3. 播放音频
      clearSound()
      sound = new Howl({
        src: [audioUrl],
        html5: true,
        onplay: () => state.value.isPlaying = true,
        onend: () => state.value.isPlaying = false,
        onloaderror: (id, err) => state.value.error = '加载音频失败'
      })

      sound.play()
    } catch (error: any) {
      state.value.error = error.message
    } finally {
      state.value.isLoading = false
    }
  }


  /**
   * 播放长内容
   * @param content
   */
  const playLongContent = async (content: string) => {
    try {
      state.value.isLoading = true
      state.value.error = null
      state.value.longAudioUrl = null
      state.value.generatingProgress = 0

      // 1. 生成对话文本
      const textRes = await generateLongText({ content })
      if (textRes.code !== 201) throw new Error('生成对话失败')

      // 2. 解析对话内容
      const dialogues = textRes.data.split('\n\n')
        .filter(Boolean)
        .map((dialogue: any) => {
          const isHost = dialogue.startsWith('火山：')
          return {
            role: isHost ? 'host' : 'guest',
            text: dialogue.substring(dialogue.indexOf('：') + 1).trim()
          }
        })

      // 3. 生成所有对话的语音并获取URL数组
      state.value.generatingProgress = 30
      const audioUrls = await processLongDialogue(dialogues)
      state.value.generatingProgress = 100

      // 4. 设置音频URL数组
      //@ts-ignore
      state.value.longAudioUrl = audioUrls.join(',')

      // 5. 播放音频
      clearSound()
      sound = new Howl({
        src: audioUrls,
        html5: true,
        onplay: () => state.value.isPlaying = true,
        onend: () => state.value.isPlaying = false,
        onloaderror: (id, err) => state.value.error = '加载音频失败'
      })

      sound.play()
    } catch (error: any) {
      state.value.error = error.message
    } finally {
      state.value.isLoading = false
    }
  }


  const stop = () => {
    clearSound()
    state.value.isPlaying = false
  }

  onUnmounted(() => {
    clearSound()
    if (pollInterval) clearInterval(pollInterval)
  })

  return {
    state,
    playShortContent,
    playLongContent,
    stop
  }
}