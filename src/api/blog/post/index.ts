import {useStorage} from '@vueuse/core';
import type {AnalyzeCodeReq} from "~/api/blog/post/type";

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
 * 语音合成
 */
export async function synthesizeSpeech(params: {
  text: string,
  type?: 'normal' | 'dialogue'
}) {
  return await fetchRequest.post<{
    success: boolean;
    data: string;
    message: string;
  }>('/tts/convert', params);
}

/**
 * 生成简短文本
 */
export async function generateShortText(params: { content: string }) {
  return await fetchRequest.post<{
    code: number
    data: string;
  }>('/openai/generate-short-content', params);
}

/**
 * 生成长文本(对话)
 */
export async function generateLongText(params: { content: string }) {
  return await fetchRequest.post<{
    code: number
    data: string;
    type: 'dialogue';
  }>('/openai/generate-long-content', params);
}

/**
 * 上传音频文件
 */
export async function uploadAudio(params: {
  buffer: string;
  articleId: string;
  type: 'short' | 'long';
}) {
  return await fetchRequest.post<{
    code: number;
    message: string;
    data: {
      url: string;
    }
  }>('/admin/oss/ali/upload-audio', params);
}