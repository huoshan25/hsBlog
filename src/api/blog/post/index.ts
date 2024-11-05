import {useStorage} from '@vueuse/core';
import type {AnalyzeCodeReq} from "~/api/blog/post/type";
import type {VoiceConfig} from "~/pages/admin/articleEditor/components/textToSpeech/types/tts";

/**
 * 文章详情
 * @param params
 */
export async function getArticleDetails(params: { id: number }) {
  return await fetchRequest.get<any>('/blog/article/details', params);
}

/**
 * 代码分析
 * @param params
 */
export async function analyzeCode (params: AnalyzeCodeReq) {
  return await fetch(`${useRuntimeConfig().public.apiBaseUrl}/openai/analyze-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${useStorage('token', '').value}`
    },
    body: JSON.stringify({
      code: params.code,
      language: params.language
    }),
    signal: params.signal
  });
}

/**
 * 获取百度语音合成token
 */
export async function getBaiduToken() {
  return await fetchRequest.get<any>('/tts/token');
}

/**
 * 语音合成
 */
export async function synthesizeSpeech(params: { text: string, voiceConfig: VoiceConfig }) {
  return await fetchRequest.post<any>('/tts/synthesize', params);
}

/**
 * 生成短文本
 * @param params
 */
export async function generateShortText(params: { content: string }) {
  return await fetchRequest.post<any>('/openai/generate-short-content', params);
}

/**
 * 查询任务状态
 */
export function queryTaskStatus(taskId: string) {
  return fetchRequest.get<any>(`/tts/query/${taskId}`);
}

/**
 * 生成长文本
 * @param params
 */
export async function generateLongText(params: { content: string }) {
  return await fetchRequest.post<any>('/openai/generate-long-content', params);
}