import type { HttpRes } from "~/api/type";

export default defineSitemapEventHandler(async () => {
  try {
    const { apiBaseUrl } = useRuntimeConfig().public;
    const res = await $fetch<HttpRes<number[]>>("/blog/article/article-id-list", {
      baseURL: apiBaseUrl,
      method: "GET"
    });

    const data = res.data;

    const routeList = data.map(id => {
      return { loc: `/blog/post/${id}` };
    });

    return routeList ?? [];
  } catch (error) {
    console.error("获取sitemap失败", error);
    return [];
  }
});
