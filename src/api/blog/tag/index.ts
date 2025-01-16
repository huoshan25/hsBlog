export interface TagsList {
  id: number;
  name: string;
  articleCount: number;
}

/**
 * 查询全部标签
 */
export async function getTagsAll() {
  return await fetchRequest.get<any>("/blog/tag");
}

/**
 * 文章标签(获取发布文章数量)
 */
export async function getTagsList() {
  return await fetchRequest.get<any>("/blog/article/tags");
}

/**
 * 标签查询文章
 */
export async function getArticle(params?: any) {
  return await fetchRequest.get<any>("/blog/tag/articles", params);
}

/**
 * 模糊搜索标签列表
 */
export async function getTagsQuery(params: { keyword: string }) {
  return await fetchRequest.get<TagsList[]>("/blog/tag/search", params);
}
