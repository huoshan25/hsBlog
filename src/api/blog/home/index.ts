import type { ArticleReq, ArticleRes, UrlPreview } from "~/api/blog/home/type";
import type { HttpRes } from "~/api/type";

/**
 * 文章模糊查询
 * @param params
 */
export async function getArticleQuerySelect(params?: any) {
  return await fetchRequest.get<any>("/blog/article/search-select", params);
}

/**
 * 用户信息
 * @param params
 */
export async function getUserInfo(params?: any) {
  return await fetchRequest.get<any>("/blog/user", params);
}

/**
 * 文章查询
 * @param params
 */
export async function getArticle(params: ArticleReq) {
  return await fetchRequest.get<ArticleRes>("/blog/article/list", params);
}

/**
 * 获取所有分类
 */
export async function getAllCategories(params?: any) {
  return await fetchRequest.get<any>("/blog/category", params);
}

/**
 * url浏览
 */
export async function getArticleByUrl(params: { url: string }) {
  return await fetchRequest.get<UrlPreview>("/blog/url-preview", params);
}
