import type {RouterConfig} from '@nuxt/schema';

/*自定义路由*/
export default <RouterConfig>{
  routes: _routes => {
    let routesDirectory: string | null = null;
    const path = useState('path', () => '')

    if (process.server) {
      path.value = useDeviceType().type
      routesDirectory = path.value === "pc" ? 'pc' : 'mobile'
    }

    /*清除未使用的目录的功能*/
    function isUnderDirectory(route: any, directory: any) {
      const path = route?.path
      return path === '/' + directory || path.startsWith('/' + directory + '/')
    }

    /**过滤组件路由 */
    let newRoutes: any = _routes.filter(route => !/\b\/components\b/.test(route.path))

    /* 过滤组件文件夹*/
    if (routesDirectory) {
      newRoutes = _routes.filter((route: any) => {
        const toRemove = routesDirectory === 'pc' ? 'mobile' : 'pc'
        return !isUnderDirectory(route, toRemove)
      }).map((route) => {
        if (route) {
          return {
            ...route,
            path: route?.path.replace(`/${routesDirectory}`, '/'),
            name: route.name || 'index'
          }
        }
      })
      console.log(newRoutes, 'newRoutes')
      return newRoutes
    }
  }
};
