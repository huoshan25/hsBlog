/**
 * @description
 * 定义全局变量
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.globalProperties.$errorPage = null
})