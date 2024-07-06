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
        { name: 'description', content: '火山博客, 技术分享' },
        { name: 'keywords', content: '火山博客, 后端, vue, react, 技术分享'},
        { name: 'viewport', content: 'width=device-width, initial-scale=1'},
        { name: 'renderer', content: 'webkit' },
        { name: 'author', content: '2633057734@qq.com' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },

  imports: {
    dirs: [
      // 扫描顶级模块
      'composables',
      // ... 或扫描带有特定名称和文件扩展名的一级嵌套模块
      'composables/*/index.{ts,js,mjs,mts}',
      // ... 或扫描给定目录中的所有模块
      'composables/**'
    ]
  },

  runtimeConfig: {
    /**私有密钥仅在服务器端可用*/
    apiSecret: '',

    /**对客户端暴露的公共密钥*/
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1/',
      // gtagId: G-XXXXXX,
    }
  },

  /*构建时启用类型检查*/
  typescript: {
    typeCheck: true
  },

  devtools: {enabled: true},
  modules: ['nuxtjs-naive-ui', '@varlet/nuxt', '@vueuse/nuxt', '@unocss/nuxt'],

  css: ['~/assets/style/default.scss'],

  srcDir: 'src/',

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
  },

  compatibilityDate: '2024-07-06'
})