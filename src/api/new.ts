import type {HttpOption} from "~/composables/http/useHttp";

enum API {
  NEWS = '/news',
}

interface NewsDetailModel {
  content: string
  createAt: string
  id: number
  language: string
  summary: string
  title: string
  titleUrl: string
  updateAt: string
  url: string | null
}

export interface NewsListParams {
  _limit?: number
  _page?: number
}

interface PaginationMeta {
  count: number
  limit: number
  page: number
}

interface NewsListResponse {
  items: NewsDetailModel[]
  meta: PaginationMeta
}

export async function getNewsList(params?: NewsListParams, option?: HttpOption<NewsListResponse>) {
  return useHttp.get<NewsListResponse>(API.NEWS, params, {...option});
}