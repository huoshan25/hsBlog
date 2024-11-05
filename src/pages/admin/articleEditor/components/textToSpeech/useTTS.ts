// src/pages/admin/articleEditor/components/textToSpeech/useTTS.ts
import { Howl } from 'howler';
import { synthesizeSpeech } from "~/api/blog/post";

export const useTTS = () => {
  const sound = ref<Howl | null>(null);
  const isPlaying = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const progress = ref(0);

  const playText = async (text: string, type: 'normal' | 'dialogue' = 'normal') => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await synthesizeSpeech({ text, type })

      if (!response.data) {
        throw new Error('Failed to get audio data');
      }

      if (sound.value) {
        sound.value.stop();
      }

      sound.value = new Howl({
        src: [`data:audio/mp3;base64,${response.data}`],
        format: ['mp3'],
        html5: true,
        onplay: () => {
          isPlaying.value = true;
        },
        onend: () => {
          isPlaying.value = false;
          progress.value = 0;
        },
        onloaderror: (id, err) => {
          error.value = 'Error loading audio';
          isPlaying.value = false;
        },
        onplayerror: (id, err) => {
          error.value = 'Error playing audio';
          isPlaying.value = false;
        },
      });

      // 添加进度监听
      sound.value.on('play', () => {
        const updateProgress = () => {
          if (sound.value && isPlaying.value) {
            progress.value = sound.value.seek() / sound.value.duration() * 100;
            requestAnimationFrame(updateProgress);
          }
        };
        updateProgress();
      });

      sound.value.play();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred';
    } finally {
      isLoading.value = false;
    }
  };

  const stopPlaying = () => {
    if (sound.value) {
      sound.value.stop();
      isPlaying.value = false;
      progress.value = 0;
    }
  };

  const pausePlaying = () => {
    if (sound.value) {
      sound.value.pause();
      isPlaying.value = false;
    }
  };

  const resumePlaying = () => {
    if (sound.value) {
      sound.value.play();
      isPlaying.value = true;
    }
  };

  return {
    playText,
    stopPlaying,
    pausePlaying,
    resumePlaying,
    isPlaying,
    isLoading,
    error,
    progress,
  };
};