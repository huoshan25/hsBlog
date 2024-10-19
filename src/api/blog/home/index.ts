
/**
 * 文章模糊查询
 * @param params
 */
export async function getArticleQuery(params?: any) {
  return await fetchRequest.get<any>('/blog/article/search', params);
}

/**
 * 文章模糊查询
 * @param params
 */
export async function getUserInfo(params?: any) {
  return await fetchRequest.get<any>('/blog/user', params);
}