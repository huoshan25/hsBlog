// https://nuxt.com/docs/api/configuration/nuxt-config
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {NaiveUiResolver} from 'unplugin-vue-components/resolvers'

export default defineNuxtConfig({
  devServer: {
    host: '127.0.0.1', // 项目运行的ip
    port: 8800 // 项目运行的端口号
  },

  app: {
    head: {
      title: '火山博客',
      meta: [
        { charset: 'utf-8' },
        { name: 'description', content: '火山博客 - 欢迎来到我的技术学习笔记，这里记录了一名前端开发的成长之旅。从编程基础到最新技术趋势，分享实用的代码片段、个人项目经验和学习资源。无论你是刚入门的新手，还是希望持续学习的同行，都能在这里找到共鸣和帮助。让我们一起探索技术的乐趣，共同进步！' },
        { name: 'keywords', content: '火山博客,稀土,Vue.js,前端面试题,node,ReactNative,Python,'},
        { name: 'viewport', content: 'width=device-width, initial-scale=1'},
        { name: 'renderer', content: 'webkit' },
        { name: 'author', content: '2633057734@qq.com' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/svg/logo.svg' }]
    }
  },

  routeRules: {
    // 主页在构建时预渲染
    '/blog': { prerender: true },
    // 产品页面按需生成，后台自动重新验证
    // '/products/**': { swr: 3600 },
    // 博客文章按需生成，直到下一次部署前持续有效
    '/blog/post/**': { isr: true },
    // 管理仪表板仅在客户端渲染
    '/admin/**': { ssr: false },
    // 在API路由上添加cors头
    '/api/**': { cors: true },
    // 跳转旧的URL
    // '/old-page': { redirect: '/new-page' }
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

  modules: ['nuxtjs-naive-ui', '@varlet/nuxt', '@vueuse/nuxt', '@unocss/nuxt', '@nuxt/image', '@unocss/nuxt', '@nuxt/content'],

  content: {
    // ... options
    highlight: {
      langs: ['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml']
    }
  },

  plugins: [
  ],

  css: [
    '~/assets/style/default.scss',
    'highlight.js/styles/atom-one-dark.css',
    'mavon-editor/dist/css/index.css',
  ],

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