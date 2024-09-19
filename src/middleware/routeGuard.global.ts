import {useStorage} from "@vueuse/core";

export default defineNuxtRouteMiddleware((to, from) => {
  const token = useStorage('token', '')

  /*检查路由是否存在*/
  const matchedRoute = to.matched.length > 0

  if (!matchedRoute) {
    showError({ statusCode: 404 })
  }

  if(to.path.startsWith('/admin')) {
    if(!token.value) {
      showError({ statusCode: 403 })
    }
  }

})