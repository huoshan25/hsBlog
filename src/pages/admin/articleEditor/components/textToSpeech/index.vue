<script setup lang="ts">
import {generateLongText, generateShortText, getBaiduToken, queryTaskStatus, synthesizeSpeech} from "~/api/blog/post";
import {VOICE_CONFIGS} from "~/pages/admin/articleEditor/components/textToSpeech/types/tts";
import {HttpStatus} from "~/enums/httpStatus";
import {useTTS} from "~/pages/admin/articleEditor/components/textToSpeech/useTTSPlayer";

const props = defineProps({
  markdown: {
    type: String,
    required: true
  },
})

const handleSpeech = async () => {
  // speechSynthesis.speak(new SpeechSynthesisUtterance('你好，哈哈哈，我很好'))
  const res = await generateShortText({content: props.markdown})
  console.log(res, 'res')
}

const handleSpeech2 = async () => {
  const res = await generateLongText({content: props.markdown})
}

const longText = '安娜：欢迎收听《技术前沿》播客，今天我们很荣幸邀请到张教授，一位在数据库和后端开发领域有着深厚造诣的专家。张教授，您好！\\n\\n张教授：安娜，您好！很高兴能参与今天的讨论。\\n\\n安娜：今天我们将深入探讨TypeORM中的Join类型及其应用。张教授，您能否先为我们简单介绍一下TypeORM以及我们今天要讨论的Join类型？\\n\\n张教授：当然可以。TypeORM是一个非常流行的Node.js ORM框架，它允许开发者使用面向对象的方式来操作数据库。今天我们将重点讨论TypeORM中的几种主要Join类型，包括innerJoin、leftJoin、leftJoinAndSelect、innerJoinAndSelect、rightJoin和rightJoinAndSelect。这些Join类型在处理数据库查询时非常有用，能够帮助我们更高效地获取所需数据。\\n\\n安娜：听起来非常实用。那么，张教授，您能否详细解析一下这些Join类型的核心观点？比如，它们各自的特点和适用场景是什么？\\n\\n张教授：好的。首先，innerJoin（内连接）只返回两个表中都有匹配的记录。这在需要确保数据完整性时非常有用。例如，如果我们只想获取有文章发布的用户，就可以使用innerJoin。\\n\\n接下来是leftJoin（左连接），它会返回左表的所有记录，即使右表没有匹配的记录。这在需要获取所有用户信息，包括那些没有发表文章的用户时非常有用。\\n\\nleftJoinAndSelect则更进一步，不仅执行左连接，还会选择并加载关联的实体。这在需要获取用户及其所有文章的详细信息时非常有用。\\n\\n安娜：明白了。那么innerJoinAndSelect和rightJoin、rightJoinAndSelect呢？\\n\\n张教授：innerJoinAndSelect类似于leftJoinAndSelect，但它只返回两个表中都有匹配的记录，并加载关联的实体。这在需要确保数据完整性并获取详细信息时非常有用。\\n\\n至于rightJoin和rightJoinAndSelect，它们与leftJoin类似，但返回的是右表的所有记录。这在从右表开始查询并需要获取所有记录时非常有用。\\n\\n安娜：非常详细的解析。那么在实际应用中，这些Join类型是如何被使用的呢？您能否举一个行业案例或真实场景？\\n\\n张教授：当然可以。假设我们正在开发一个博客平台，我们需要获取所有用户的文章列表。使用leftJoinAndSelect就可以轻松实现这一点，因为它会返回所有用户及其文章的详细信息，即使某些用户没有发表文章。\\n\\n另一个例子是，如果我们只想获取有文章发布的用户，可以使用innerJoin。这在用户管理或数据分析时非常有用。\\n\\n安娜：非常实用的案例。那么，张教授，您对这些Join类型有什么延伸思考或未来发展方向的看法吗？\\n\\n张教授：我认为，随着数据量的增加和业务需求的复杂化，Join类型的优化和性能提升将变得越来越重要。未来，我们可能会看到更多针对大数据和高并发场景的优化Join算法。此外，随着NoSQL数据库的普及，如何在非关系型数据库中实现类似Join的功能也是一个值得探讨的方向。\\n\\n安娜：非常前瞻性的思考。感谢张教授今天的精彩分享。听众朋友们，如果您对TypeORM或数据库开发有更多问题，欢迎在评论区留言。我们下期节目再见！\\n\\n张教授：谢谢安娜，也感谢大家的收听。再见'
const test2 = '你好，我真的很好啦！'

const getBaiduSignature = async () => {
  const res = await getBaiduToken()
  console.log(res, 'res')
}

/**
 * 创建语音合成
 */
const createVoice = async () => {
  const params = {
    text: test2,
    voiceConfig: VOICE_CONFIGS.guest
  }

  /**
   * 创建语音合成（这里需要轮询这个接口，两秒一次，轮询十次）
   */
  const res = await synthesizeSpeech(params)
  if (res.code === HttpStatus.CREATED) {
    task_id.value = res.data.task_id
  }
}

const task_id = ref('')

interface TaskStatusRes {
  status: string,
  audio: string
}

/**
 * 获取任务id
 */
const queryTaskId = async () => {
  const res = await queryTaskStatus(task_id.value)
  if (res.code === HttpStatus.OK && res.data.status === 'Success') {
    console.log(res.data.audio, 'audio')
  }
}

const { state, playShortContent, playLongContent, stop } = useTTS()

const handleShortContent = async () => {
  await playShortContent(props.markdown)
}

const handleLongContent = async () => {
  await playLongContent(props.markdown)
}
</script>

<template>
  <div class="flex flex-col">
    <n-button @click="handleSpeech()">根据文章生成文本内容 - 短文本。</n-button>
    <n-button @click="handleSpeech2()">根据文章生成文本内容 - 长文本。</n-button>

    <n-button @click="getBaiduSignature()">获取百度语音签名</n-button>

    <n-button @click="createVoice()">创建语音合成</n-button>

    <n-button @click="queryTaskId()">查询任务id</n-button>

    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <n-button
            :loading="state.isLoading"
            :disabled="state.isPlaying"
            @click="handleShortContent"
        >
          生成短文本语音
        </n-button>

        <n-button
            :loading="state.isLoading"
            :disabled="state.isPlaying"
            @click="handleLongContent"
        >
          生成对话语音
        </n-button>
      </div>

      <!-- 短文本音频播放器 -->
      <audio
          v-if="state.shortAudioUrl"
          :src="state.shortAudioUrl"
          controls
          class="w-full"
      >
        您的浏览器不支持音频播放
      </audio>

      <!-- 长文本对话生成进度 -->
      <div v-if="state.isLoading && state.generatingProgress > 0">
        <n-progress
            type="line"
            :percentage="state.generatingProgress"
            :indicator-placement="'inside'"
        >
          正在生成对话音频...
        </n-progress>
      </div>

      <!-- 长文本音频播放器 -->
      <audio
          v-if="state.longAudioUrl"
          :src="state.longAudioUrl"
          controls
          class="w-full"
      >
        您的浏览器不支持音频播放
      </audio>

      <div v-if="state.error" class="text-red-500">
        {{ state.error }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>