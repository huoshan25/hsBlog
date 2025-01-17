// https://nuxt.com/docs/api/configuration/nuxt-config
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

export default defineNuxtConfig({
  site: {
    url: "https://hs-blog.top"
  },

  devServer: {
    host: "127.0.0.1", // 项目运行的ip
    port: 8800 // 项目运行的端口号
  },

  experimental: {},

  app: {
    head: {
      /*避免组件膳所*/
      htmlAttrs: {
        lang: "zh-CN"
      },
      title: "火山博客",
      meta: [
        { charset: "utf-8" },
        {
          name: "description",
          content:
            "火山博客 - 欢迎来到我的技术学习笔记，这里记录了一名前端开发的成长之旅。从编程基础到最新技术趋势，分享实用的代码片段、个人项目经验和学习资源。无论你是刚入门的新手，还是希望持续学习的同行，都能在这里找到共鸣和帮助。让我们一起探索技术的乐趣，共同进步！"
        },
        { name: "keywords", content: "火山博客,稀土,Vue.js,前端面试题,node,ReactNative,Python," },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "renderer", content: "webkit" },
        { name: "author", content: "2633057734@qq.com" }
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/logo.ico" },
        { rel: "stylesheet", href: "https://chinese-fonts-cdn.deno.dev/packages/syst/dist/SourceHanSerifCN/result.css" }
      ],
      script: [
        {
          /*百度统计*/
          innerHTML: `
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?73dfc38c6cae731310bcde2dff1708d7";
              var s = document.getElementsByTagName("script")[0]; 
              s.parentNode.insertBefore(hm, s);
            })();
          `
        }
      ]
    }
  },

  routeRules: {
    "/": { redirect: "/blog" },
    // 主页在构建时预渲染
    // '/blog': {prerender: true},
    // 产品页面按需生成，后台自动重新验证
    // '/products/**': { swr: 3600 },
    // 博客文章按需生成，直到下一次部署前持续有效
    "/blog/post/**": { isr: true },
    // 管理仪表板仅在客户端渲染
    "/admin/**": { ssr: false },
    // 在API路由上添加cors头
    "/api/**": { cors: true }
    // 跳转旧的URL
    // '/old-page': { redirect: '/new-page' }
  },

  imports: {
    dirs: [
      // 扫描顶级模块
      "composables",
      // ... 或扫描带有特定名称和文件扩展名的一级嵌套模块
      "composables/*/index.{ts,js,mjs,mts}",
      // ... 或扫描给定目录中的所有模块
      "composables/**"
    ]
  },

  runtimeConfig: {
    /**私有密钥仅在服务器端可用*/
    apiSecret: "",

    /**对客户端暴露的公共密钥*/
    public: {
      apiBaseUrl: "",
      /*网站域名*/
      siteUrl: ""
      // gtagId: G-XXXXXX,
    }
  },

  /*构建时启用类型检查*/
  typescript: {
    typeCheck: true
  },

  devtools: { enabled: true },

  modules: [
    "nuxtjs-naive-ui",
    "@varlet/nuxt",
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@nuxt/image",
    "@unocss/nuxt",
    "@nuxt/content",
    "@nuxtjs/seo",
    "nuxt-gtag"
  ],

  nitro: {
    /*接口代理配置*/
    routeRules: {
      "/api/proxy/**": {
        proxy: "https://hs-blog.top/api/**"
      }
    },

    /*生成robots.txt*/
    prerender: {
      routes: ["/robots.txt"]
    }
  },

  /*robots.txt过滤配置*/
  robots: {
    disallow: ["/admin"]
  },

  /*站点地图配置*/
  sitemap: {
    sources: ["/api/sitemap"],
    /*6小时缓存*/
    cacheMaxAgeSeconds: 6 * 60 * 60,
    /*用于爬虫抓取*/
    autoLastmod: true,
    /*过滤，支持正则*/
    exclude: ["/admin/**", new RegExp("components")],
    /*包含的url，支持正则*/
    include: [new RegExp("^/blog(/.*)?$")]
  },

  /*谷歌分析*/
  gtag: {
    id: "G-EZRWZ4VQK3",
    config: {
      page_path: true // 自动跟踪路由变化
    }
  },

  content: {
    highlight: {
      langs: ["json", "js", "ts", "html", "css", "vue", "shell", "mdc", "md", "yaml", "typescript", "javascript"]
    }
  },

  plugins: [],

  css: ["~/assets/style/default.scss", "highlight.js/styles/atom-one-dark.css", "mavon-editor/dist/css/index.css"],

  srcDir: "src/",

  build: {
    transpile:
      process.env.NODE_ENV === "production"
        ? ["naive-ui", "vueuc", "@css-render/vue3-ssr", "@juggle/resize-observer"]
        : ["@juggle/resize-observer"]
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/style/variables.scss" as *;'
        }
      }
    },
    plugins: [
      AutoImport({
        imports: [
          {
            "naive-ui": ["useDialog", "useMessage", "useNotification", "useLoadingBar"]
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      })
    ]
  },

  compatibilityDate: "2024-07-06"
});
