/**
 * 查询全部标签
 */
export async function getTagsAll() {
  return await fetchRequest.get<any>('/blog/tag');
}

/**
 * 标签查询文章
 */
export async function getArticle(params?: any) {
  return await fetchRequest.get<any>('/blog/tag/articles', params);
}