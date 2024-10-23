/**
 * 文章详情
 * @param params
 */
export async function getArticleDetails(params: { id: number }) {
  return await fetchRequest.get<any>('/blog/article/details', params);
}