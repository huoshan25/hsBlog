import { useStorage } from "@vueuse/core";
import type { AnalyzeCodeReq, ArticleDetails } from "~/api/blog/post/type";

/**
 * 文章详情
 * @param params
 */
export async function getArticleDetails(params: { id: number }) {
  return await fetchRequest.get<ArticleDetails>("/blog/article/details", params);
}

/**
 * 代码分析
 * @param params
 */
export async function analyzeCode(params: AnalyzeCodeReq) {
  return await fetch(`${useRuntimeConfig().public.apiBaseUrl}/openai/analyze-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useStorage("token", "").value}`
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
export async function synthesizeSpeech(params: { text: string; type?: "normal" | "dialogue" }) {
  return await fetchRequest.post<{
    code: number;
    success: boolean;
    data: string;
    message: string;
  }>("/tts/convert", params);
}

/**
 * 生成简短文本
 */
export async function generateShortText(params: { content: string }) {
  return await fetchRequest.post<{
    code: number;
    data: string;
  }>("/openai/generate-short-content", params);
}

/**
 * 生成长文本(对话)
 */
export async function generateLongText(params: { content: string }) {
  return await fetchRequest.post<{
    code: number;
    data: string;
    type: "dialogue";
  }>("/openai/generate-long-content", params);
}

/**
 * 生成短文本音频
 */
export async function generateShortAudio(params: { content: string; articleUUID: number }) {
  return await fetchRequest.post<{
    url: string;
    content: string;
  }>("/openai/generate-short-audio", params);
}

/**
 * 生成对话音频
 */
export async function generateLongAudio(params: { content: string; articleUUID: number }) {
  return await fetchRequest.post<{
    url: string;
    content: string;
  }>("/openai/generate-long-audio", params);
}

/*文章浏览量+1*/
export async function addArticleViewCount(params: { id: number }) {
  return await fetchRequest.get("/blog/article/view-count", params);
}

