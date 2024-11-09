/**
 * 获取文章发布趋势
 */
export async function getArticleTrend() {
  return await fetchRequest.get<any>('/admin/article/stats/trend');
}

/**
 * 获取文章分类统计
 */
export async function getArticleCategory() {
  return await fetchRequest.get<any>('/admin/article/stats/category');
}

/**
 * 获取文章时间分布
 */
export async function getArticleTimeDistribution() {
  return await fetchRequest.get<any>('/admin/article/stats/time-distribution');
}

/**
 * 获取文章概览
 */
export async function getArticleOverview() {
  return await fetchRequest.get<any>('/admin/article/stats/overview');
}

/**
 * 获取文章字数统计
 */
export async function getArticleWords() {
  return await fetchRequest.get<any>('/admin/article/stats/words');
}

/**
 * 获取标签统计
 */
export async function getTagStats() {
  return await fetchRequest.get<any>('/admin/tag/stats');
}

/**
 * 获取标签趋势
 */
export async function getTagTrend() {
  return await fetchRequest.get<any>('/admin/tag/trend');
}