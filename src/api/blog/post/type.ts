import { ArticleStatus, ArticleType } from "~/api/admin/article/type";

export interface AnalyzeCodeReq {
  code: string;
  language: string;
  signal?: AbortSignal;
}

/*文章详情*/
export interface ArticleDetails {
  /*分类图标*/
  category_icon: string;
  /*分类id*/
  category_id: number;
  /*分类名称*/
  category_name: string;
  /*文章内容*/
  content: string;
  /*创建时间*/
  create_time: string;
  /*文章描述*/
  description: string;
  /*文章id*/
  id: number;
  /*转载文章url地址*/
  link_url: string;
  /*长音频对话url地址*/
  long_audio_url: null;
  /*长音频文本内容*/
  long_content: null;
  /*发布时间*/
  publish_time: string;
  /*文章简介音频url地址*/
  short_audio_url: null;
  /*短音频文本内容*/
  short_content: null;
  /*文章状态*/
  status: ArticleStatus;
  /*文章标签*/
  tags: { id: number; name: string}[];
  /*文章标题*/
  title: string;
  /*文章类型*/
  type: ArticleType;
  /*更新时间*/
  update_time: string;
  /*文章浏览量*/
  view_count: number;
}
