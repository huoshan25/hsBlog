import type {RouterConfig} from '@nuxt/schema';
import type {RouteRecordRaw, RouterOptions} from "vue-router";

/*自定义路由*/
export default <RouterConfig>{
  routes: (_routes: RouterOptions["routes"]) => {
    let routesDirectory: string | null = null;
    const path = useState<string>('path', () => '')

    if (import.meta.server) {
      path.value = useDeviceType().type
      routesDirectory = path.value === "pc" ? 'pc' : 'mobile'
    }

    if (import.meta.client) {
      routesDirectory = path.value === "pc" ? 'pc' : 'mobile'
    }

    /**
     * @param route 路由
     * @param directory 需要删除的目录
     * @returns 是否在目录下
     */
    function isUnderDirectory(route: RouteRecordRaw, directory: string) {
      const path = route?.path
      return path === '/' + directory || path.startsWith('/' + directory + '/')
    }

    /**过滤组件路由 */
    let newRoutes: RouteRecordRaw[] = _routes.filter(route => !/\b\/components\b/.test(route.path))

    /* 过滤非admin目录和blog目录下的pc和mobile目录*/
    if (routesDirectory) {
      const toRemove = routesDirectory === 'pc' ? 'mobile' : 'pc';

      /*是否博客目录*/
      const isBlogDirectory = (route: RouteRecordRaw) => isUnderDirectory(route, 'blog');
      /*过滤blog目录下另一个设备目录*/
      const isUnderBlogToRemove = (route: RouteRecordRaw) => isUnderDirectory(route, `blog/${toRemove}`);

      newRoutes = _routes
        .filter(route => !isUnderBlogToRemove(route))
        .map(route => {
          if (isBlogDirectory(route)) {
            return {
              ...route,
              path: route.path.replace(`/blog/${routesDirectory}`, '/blog'),
              name: route.name || 'index'
            };
          }
          return route;
        });

      return newRoutes;
    }
  }
};