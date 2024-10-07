import type {HttpRes} from "~/api/type";
import type {ArticleReq, CreateArticleReq, UpdateArticle, ArticleStatus} from "~/api/admin/article/type";
import {fetchRequest} from "~/composables/http/useFetchRequest";

/**
 * 文章查询
 * @param params
 */
export async function getArticle(params?: ArticleReq) {
  return await fetchRequest.get<any>('/admin/article/list', params);
}

/**
 * 文章详情
 * @param params
 */
export async function getArticleDetails(params?: { id: number }) {
  return await fetchRequest.get<any>('/admin/article/details', params);
}

/**
 * 创建文章
 * @param params
 */
export async function createArticle(params?: CreateArticleReq) {
  return await fetchRequest.post<any>('/admin/article', params);
}

/**
 * 删除文章
 * @param params
 */
export async function deleteArticle(params?: { id: number }) {
  return await fetchRequest.delete<any>('/admin/article', params);
}

/**
 * 更改文章状态
 * @param params
 */
export async function editArticleStatus(params?: { ids: number[], status: ArticleStatus }) {
  return await fetchRequest.put<any>('/admin/article/status', params);
}

/**
 * 更新文章信息
 * @param params
 */
export async function updateArticle(params?: UpdateArticle) {
  return await fetchRequest.put<any>('/admin/article', params);
}

/**
 * 文章标签
 */
export async function getTagsList() {
  return await fetchRequest.get<any>('/admin/article/tags');
}

/**
 * 删除图片
 */
export async function deletePicture(params: any) {
  return await fetchRequest.delete<any>('/oss/ali/article-img', params);
}