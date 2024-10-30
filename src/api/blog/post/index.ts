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
export async function analyzeCode (params: { code: string; language: string }) {
  return await fetchRequest.post<any>('/openai/analyze-code', params);
}
