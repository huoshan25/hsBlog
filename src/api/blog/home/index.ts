
/**
 * 文章模糊查询
 * @param params
 */
export async function getArticleQuery(params?: any) {
  return await fetchRequest.get<any>('/blog/article/search', params);
}