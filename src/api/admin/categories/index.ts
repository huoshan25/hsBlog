import { fetchRequest } from "~/composables/http/useFetchRequest";
import type { HttpRes } from "~/api/type";
import type {CategoryReq, UpdateCategoryReq} from "~/api/admin/categories/type";

enum API {
  CREATE_CATEGORY = '/categories',
  GET_ALL_CATEGORIES = '/categories',
  GET_CATEGORY = '/categories/',
  UPDATE_CATEGORY = '/categories/',
  DELETE_CATEGORY = '/categories/',
  GET_CATEGORY_ARTICLES = '/categories/',
}

/**
 * 创建分类
 * @param params
 */
export async function createCategory(params?: any) {
  return await fetchRequest.post<any>('/admin/category', params);
}

/**
 * 获取所有分类
 */
export async function getAllCategories(params?:any) {
  return await fetchRequest.get<any>('/admin/category', params);
}

/**
 * 获取指定分类
 * @param id
 */
export async function getCategory(id: number) {
  return await fetchRequest.get<any>(`${API.GET_CATEGORY}${id}`);
}

/**
 * 更新分类
 * @param params
 */
export async function updateCategory(params?: any) {
  return await fetchRequest.put<any>('', params);
}

/**
 * 删除分类
 */
export async function deleteCategory(ids: number[]) {
  return await fetchRequest.delete<any>('/admin/categories', ids);
}

/**
 * 获取分类下的文章
 * @param id
 */
export async function getCategoryArticles(id: number) {
  return await fetchRequest.get<any>(`${API.GET_CATEGORY_ARTICLES}${id}/articles`);
}
