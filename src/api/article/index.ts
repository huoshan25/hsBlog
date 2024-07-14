import type {HttpRes} from "~/api/type";
import type {ArticleReq} from "~/api/article/type";
import {fetchRequest} from "~/composables/http/useFetchRequest";

enum API {
  ADD_ARTICLE = '/post/add_article',
  GET_ARTICLE = '/post/get_article',
}

/**
 * 添加文章
 * @param params
 */
export async function getAddArticle(params?: ArticleReq) {
  return await fetchRequest.post<HttpRes>(API.ADD_ARTICLE, params);
}

/**
 * 查询文章
 * @param params
 */
export async function getArticleList(params?: { id: number }) {
  return await fetchRequest.get<HttpRes>(API.GET_ARTICLE, params);
}