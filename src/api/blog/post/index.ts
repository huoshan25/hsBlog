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
