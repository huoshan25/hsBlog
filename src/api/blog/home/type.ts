import {ArticleStatus} from "~/api/admin/article/type";

export interface ArticleReq {
  search?: string | null,
  page?: number,
  limit?: number,
  /**标题*/
  title?: string
  /**内容*/
  content?: string
  /**发布状态*/
  status?: ArticleStatus | null
  /**分类id*/
  categoryId?: number | null
}