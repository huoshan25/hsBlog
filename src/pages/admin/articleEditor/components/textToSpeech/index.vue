<!-- src/pages/admin/articleEditor/components/textToSpeech/index.vue -->
<script setup lang="ts">
import { generateLongText, generateShortText } from "~/api/blog/post";
import { useTTS } from "./useTTS";
import {HttpStatus} from "~/enums/httpStatus";

const props = defineProps({
  markdown: {
    type: String,
    required: true
  },
});

const generatedContent = ref('');
const contentType = ref<'short' | 'long'>('short');
const isGenerating = ref(false);
const {
  playText,
  stopPlaying,
  pausePlaying,
  resumePlaying,
  isPlaying,
  isLoading,
  error,
  progress
} = useTTS();

const generateContent = async (type: 'short' | 'long') => {
  try {
    isGenerating.value = true;
    contentType.value = type;

    const response = await (type === 'short'
        ? generateShortText({ content: props.markdown })
        : generateLongText({ content: props.markdown }));

    if (response.code === HttpStatus.CREATED) {
      generatedContent.value = response.data;
    }
  } catch (err) {
    console.error('Content generation error:', err);
  } finally {
    isGenerating.value = false;
  }
};

const handlePlay = async () => {
  if (isPlaying.value) {
    pausePlaying();
  } else if (progress.value > 0) {
    resumePlaying();
  } else {
    await playText(
        generatedContent.value,
        contentType.value === 'long' ? 'dialogue' : 'normal'
    );
  }
};

const handleStop = () => {
  stopPlaying();
};
</script>

<template>
  <div class="tts-container">
    <div class="controls-section">
      <n-button
          :loading="isGenerating"
          @click="generateContent('short')"
          class="mb-2">
        生成简短摘要
      </n-button>

      <n-button
          :loading="isGenerating"
          @click="generateContent('long')"
          class="mb-2">
        生成播客对话
      </n-button>
    </div>

    <div v-if="generatedContent" class="content-section">
      <n-card :title="contentType === 'short' ? '文章摘要' : '播客对话'">
        <n-scrollbar style="max-height: 300px">
          <div class="generated-text">
            {{ generatedContent }}
          </div>
        </n-scrollbar>

        <div class="audio-controls">
          <n-button-group>
            <n-button
                @click="handlePlay"
                :loading="isLoading"
                :disabled="!generatedContent">
              {{ isPlaying ? '暂停' : '播放' }}
            </n-button>
            <n-button
                @click="handleStop"
                :disabled="!isPlaying">
              停止
            </n-button>
          </n-button-group>

          <n-progress
              v-if="progress > 0"
              type="line"
              :percentage="progress"
              :show-indicator="false"
              :height="2"
              class="mt-2"/>
        </div>
      </n-card>
    </div>

    <n-alert
        v-if="error"
        type="error"
        :show-icon="true"
        class="mt-4">
      {{ error }}
    </n-alert>
  </div>
</template>

<style scoped lang="scss">
.tts-container {
  width: 100%;
  padding: 1rem;
}

.controls-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.content-section {
  margin-top: 1rem;
}

.generated-text {
  white-space: pre-wrap;
  line-height: 1.6;
}

.audio-controls {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>