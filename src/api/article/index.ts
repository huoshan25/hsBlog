import type {HttpRes} from "~/api/type";
import type {ArticleReq, CreateArticleReq, UpdateArticle} from "~/api/article/type";
import {ArticleStatus} from "~/api/article/type";
import {fetchRequest} from "~/composables/http/useFetchRequest";

/**
 * 文章查询
 * @param params
 */
export async function getArticle(params?: ArticleReq) {
  return await fetchRequest.get<any>('/article/list', params);
}

/**
 * 文章详情
 * @param params
 */
export async function getArticleDetails(params?: { id: number }) {
  return await fetchRequest.get<any>('/article/details', params);
}

/**
 * 创建文章
 * @param params
 */
export async function createArticle(params?: CreateArticleReq) {
  return await fetchRequest.post<any>('/article', params);
}

/**
 * 删除文章
 * @param params
 */
export async function deleteArticle(params?: { id: number }) {
  return await fetchRequest.delete<any>('/article', params);
}

/**
 * 更改文章状态
 * @param params
 */
export async function editArticleStatus(params?: { ids: number[], status: ArticleStatus }) {
  return await fetchRequest.put<any>('/article/status', params);
}

/**
 * 更新文章信息
 * @param params
 */
export async function updateArticle(params?: UpdateArticle) {
  return await fetchRequest.put<any>('/article', params);
}

/**
 * 文章标签
 */
export async function getTagsList() {
  return await fetchRequest.get<any>('/article/tags');
}

/**
 * 删除图片
 */
export async function deletePicture(params: any) {
  return await fetchRequest.delete<any>('/oss/ali/article-img', params);
}