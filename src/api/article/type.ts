/**文章状态*/
export enum ArticleStatus {
  /**草稿*/
  DRAFT = 1,
  /**发布*/
  PUBLISH = 2,
  /**删除*/
  DELETE = 3,
}

export interface ArticleReq {
  /**标题*/
  title: string
  /**内容*/
  content: string
  /**发布状态*/
  status: ArticleStatus
}