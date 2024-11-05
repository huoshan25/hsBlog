import {getBaiduToken} from "~/api/blog/post";

export const useTTS = () => {
  const config = useRuntimeConfig();
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 获取token
  const getToken = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await getBaiduToken()
      const data = await response.json();
      token.value = data.token;
      return data.token;
    } catch (err) {
      error.value = '获取token失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 文本转语音
  const textToSpeech = async (text: string, voiceConfig = {
    voice: 0,  // 发音人
    speed: 5,  // 语速
    pitch: 5,  // 音调
    volume: 5  // 音量
  }) => {
    try {
      // 如果没有token，先获取token
      const currentToken = token.value || await getToken();

      const response = await fetch(
        `https://aip.baidubce.com/rpc/2.0/tts/v1/create?access_token=${currentToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text,
            format: 'mp3-16k',
            voice: voiceConfig.voice,
            lang: 'zh',
            speed: voiceConfig.speed,
            pitch: voiceConfig.pitch,
            volume: voiceConfig.volume,
            enable_subtitle: 0
          })
        }
      );

      const result = await response.json();

      if (result.error_code) {
        throw new Error(result.error_msg);
      }

      // 转换base64为Blob
      const audioBlob = new Blob(
        [Buffer.from(result.data, 'base64')],
        { type: 'audio/mp3' }
      );
      return URL.createObjectURL(audioBlob);
    } catch (err) {
      error.value = '语音合成失败';
      throw err;
    }
  };

  return {
    token,
    loading,
    error,
    getToken,
    textToSpeech
  };
};