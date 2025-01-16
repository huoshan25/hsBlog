import type { HttpRes } from "~/api/type";

export default defineSitemapEventHandler(async () => {
  try {
    const { apiBaseUrl } = useRuntimeConfig().public;
    const res: HttpRes<number[]> = await $fetch("/blog/article/article-id-list", {
      baseURL: apiBaseUrl,
      method: "GET"
    });

    const routeList = res.data.map(id => {
      return { loc: `/blog/post/${id}` };
    });

    return routeList ?? [];
  } catch (error) {
    console.error("获取sitemap失败", error);
    return [];
  }
});
