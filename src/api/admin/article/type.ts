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

export interface CreateArticleReq {
  /**分类id*/
  category_id: number | null | string;
  /**内容*/
  content: string;
  /**状态*/
  status: ArticleStatus;
  /**文章的标签*/
  tagNames: string[];
  /**标题*/
  title: string;
  /**文章摘要*/
  brief_content: string;
  /*文章UUID*/
  articleUUID: string;
}

export interface UpdateArticle extends Omit<CreateArticleReq, 'articleUUID'> {
  /**文章id*/
  id: string;
}