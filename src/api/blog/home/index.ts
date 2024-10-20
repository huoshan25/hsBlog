/**
 * 文章模糊查询
 * @param params
 */
export async function getArticleQuerySelect(params?: any) {
  return await fetchRequest.get<any>('/blog/article/search-select', params);
}

/**
 * 用户信息
 * @param params
 */
export async function getUserInfo(params?: any) {
  return await fetchRequest.get<any>('/blog/user', params);
}