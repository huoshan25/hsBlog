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
   * @param taskId
   */
  const pollTaskStatus = async (taskId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      let attempts = 0
      const maxAttempts = 20
      let retryCount = 0
      const maxRetries = 3

      pollInterval = setInterval(async () => {
        try {
          const res = await queryTaskStatus(taskId)
          if (res.code === 200 && res.data.status === 'Success') {
            clearInterval(pollInterval!)
            resolve(res.data.audio)
            return
          }

          // 如果状态不是Success但是是正常响应，继续轮询
          attempts++
          if (attempts >= maxAttempts) {
            clearInterval(pollInterval!)
            reject(new Error('轮询超时'))
          }
        } catch (error) {
          // 错误重试逻辑
          retryCount++
          console.error(`轮询失败，第 ${retryCount} 次重试`)

          if (retryCount >= maxRetries) {
            console.error('重试次数达到上限，轮询终止')
            clearInterval(pollInterval!)
            reject(error)
          }
          // 如果未达到最大重试次数，继续轮询
        }
      }, 3000)
    })
  }

  /**
   * 过程的声音
   * @param text
   * @param voiceConfig
   */
  const processVoice = async (text: string, voiceConfig: VoiceConfig) => {
    try {
      // 1. 调用语音合成接口
      const synthRes = await synthesizeSpeech({ text, voiceConfig })
      if (synthRes.code !== 201) {
        throw new Error('语音合成失败')
      }

      // 2. 轮询获取合成结果
      const audioUrl = await pollTaskStatus(synthRes.data.task_id)

      // 3. 根据文本类型设置不同的音频URL
      if (voiceConfig === VOICE_CONFIGS.host) {
        state.value.shortAudioUrl = audioUrl
      } else {
        // 长文本对话的情况，先不设置URL，等待合并
        console.log('单段对话音频生成完成:', audioUrl)
      }

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

      // 3. 串行生成每段对话的语音
      const audioUrls: string[] = []
      const totalDialogues = dialogues.length

      for (let i = 0; i < dialogues.length; i++) {
        const dialogue = dialogues[i]
        const voiceConfig = dialogue.role === 'host' ? VOICE_CONFIGS.host : VOICE_CONFIGS.guest

        // 更新生成进度
        state.value.generatingProgress = Math.round((i / totalDialogues) * 100)

        // 等待当前对话的语音生成完成
        const audioUrl = await processVoice(dialogue.text, voiceConfig)
        audioUrls.push(audioUrl)
      }

      // 4. 所有语音生成完成，这里应该调用后端接口合并音频
      // TODO: 调用后端合并音频的接口
      // const mergedAudioUrl = await mergeAudios(audioUrls)
      // state.value.longAudioUrl = mergedAudioUrl

      // 临时处理：使用第一段音频
      state.value.longAudioUrl = audioUrls[0]
      state.value.generatingProgress = 100

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