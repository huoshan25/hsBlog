export default defineNuxtPlugin((nuxt) => {
    /*设置 Vue 应用级别的错误处理程序*/
    nuxt.vueApp.config.errorHandler = (error: unknown, context: any) => {
        console.error('错误内容',context)
    };

    /*vue层级错误*/
    nuxt.hook('vue:error', (error: unknown, context: any) => {
        console.error('vue层级错误:', context);
    });
});
