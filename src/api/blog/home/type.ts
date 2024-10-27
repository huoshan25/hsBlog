export interface ArticleReq {
  cursor: number | null,
  limit: number,
  categoryId: number
}

export interface ArticleItem {
  id: number;
  title: string;
  content: string;
  category_name: string;
  tags: { id: number; name: string }[];
}

export interface ArticleResponse {
  list: ArticleItem[];
  cursor: number;
  hasMore: boolean;
}
