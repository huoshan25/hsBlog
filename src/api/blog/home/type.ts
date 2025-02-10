import type {ArticleType} from "~/api/admin/article/type";

export interface ArticleReq {
  cursor: number | null,
  limit: number,
  categoryId: number
  date: string | null
}

export interface ArticleItem {
  id: number;
  title: string;
  content: string;
  category_name: string;
  tags: { id: number; name: string }[];
  create_time: string;
  update_time: string;
  /*文章类型*/
  type: ArticleType;
  /*转载文章url*/
  link_url: string;
  /*文章浏览量*/
  view_count: number;
}

export interface ArticleRes {
  list: ArticleItem[];
  cursor: number;
  hasMore: boolean;
}

export interface UrlPreview {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName?: string;
  favicon?: string;
}