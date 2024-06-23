import type {RouterConfig} from '@nuxt/schema';
import type {RouteRecordRaw, RouterOptions} from "vue-router";

/*自定义路由*/
export default <RouterConfig>{
  routes: (_routes: RouterOptions["routes"]) => {
    let routesDirectory: string | null = null;
    const path = useState('path', () => '')

    if (import.meta.server) {
      path.value = useDeviceType().type
      routesDirectory = path.value === "pc" ? 'pc' : 'mobile'
    }

    if (import.meta.client) {
      routesDirectory = path.value === "pc" ? 'pc' : 'mobile'
    }

    /**
     * 清除未使用的目录的功能
     * @param route 路由
     * @param directory 需要删除的目录
     * @returns 是否在目录下
     */
    function isUnderDirectory(route: any, directory: any) {
      const path = route?.path
      return path === '/' + directory || path.startsWith('/' + directory + '/')
    }

    /**过滤组件路由 */
    let newRoutes: RouteRecordRaw[] = _routes.filter(route => !/\b\/components\b/.test(route.path))

    /* 过滤非admin目录和blog目录下的pc和mobile目录*/
    if (routesDirectory) {
      newRoutes = _routes.filter((route: any) => {
        const toRemove = routesDirectory === 'pc' ? 'mobile' : 'pc'
        /*保留admin目录和blog目录下的路由，并过滤掉blog下的另一个设备目录*/
        return (isUnderDirectory(route, 'admin') || isUnderDirectory(route, 'blog')) && !isUnderDirectory(route, `blog/${toRemove}`)
      }).map((route) => {
        /*修改blog目录下的路径*/
        if (isUnderDirectory(route, 'blog')) {
          return {
            ...route,
            path: route?.path.replace(`/blog/${routesDirectory}`, '/blog'),
            name: route.name || 'index'
          }
        }
        return route
      })
      return newRoutes
    }
  }
};