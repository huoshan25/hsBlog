import type { HttpRes } from "~/api/type";

interface ArticleInfo {
  id: number;
  updateTime: string;
}

export default defineSitemapEventHandler(async () => {
  try {
    const { apiBaseUrl } = useRuntimeConfig().public;
    const res = await $fetch<HttpRes<ArticleInfo[]>>("/blog/article/sitemap-info", {
      baseURL: apiBaseUrl,
      method: "GET"
    });

    return res.data.map(({ id, updateTime }) => ({
      loc: `/blog/post/${id}`,
      lastmod: updateTime,
      changefreq: "weekly",
      priority: 0.8
    }));
  } catch (error) {
    console.error("获取sitemap失败", error);
    return [];
  }
});
