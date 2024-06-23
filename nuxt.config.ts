// https://nuxt.com/docs/api/configuration/nuxt-config
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {NaiveUiResolver} from 'unplugin-vue-components/resolvers'

export default defineNuxtConfig({
  app: {
    head: {
      title: '火山博客',
      meta: [
        { charset: 'utf-8' },
        { name: 'description', content: '个人博客, 技术分享' },
        { name: 'keywords', content: '前端, 后端, vue, react'}
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },

  /*构建时启用类型检查*/
  typescript: {
    typeCheck: true
  },

  devtools: {enabled: true},

  modules: ['nuxtjs-naive-ui', '@varlet/nuxt', '@vueuse/nuxt'],

  css: ['~/assets/style/default.scss'],

  vite: {
    plugins: [
      AutoImport({
        imports: [
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar'
            ]
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "~/assets/style/global.scss";'
        }
      }
    }
  }
})