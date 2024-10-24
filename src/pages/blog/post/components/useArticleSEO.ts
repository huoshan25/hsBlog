/**
 * 设置文章的 SEO优化
 * @param article
 */
export const useArticleSEO = (article: any) => {
  const config = useRuntimeConfig()
  const route = useRoute()

  useHead({
    title: article.title,
    titleTemplate: (title) => `${title} - 你的博客名称`,

    meta: [
      {
        'data-n-head': 'ssr',
        name: 'description',
        content: article.description || article.summary || `${article.title} - 你的博客名称`
      },
      {
        'data-n-head': 'ssr',
        name: 'keywords',
        content: [article.tags, '博客', '技术文章'].flat().filter(Boolean).join(',')
      },
      {
        'data-n-head': 'ssr',
        name: 'author',
        content: article.author || '火山'
      },

      // {
      // 'data-n-head': 'ssr',
      //   name: 'robots',
      // 是否允许搜索引擎收录此文章
      //   content: article.isPublished ? 'index, follow' : 'noindex, nofollow'
      // },

      // Open Graph 协议 (Facebook、领英等)
      {
        'data-n-head': 'ssr',
        property: 'og:type',
        content: 'article'
      },
      {
        'data-n-head': 'ssr',
        property: 'og:title',
        content: article.title
      },
      {
        'data-n-head': 'ssr',
        property: 'og:description',
        content: article.description || article.summary
      },
      {
        'data-n-head': 'ssr',
        property: 'og:url',
        content: `${config.public.siteUrl}${route.path}`
      },
      {
        'data-n-head': 'ssr',
        property: 'og:site_name',
        content: '火山博客'
      },
      {
        'data-n-head': 'ssr',
        property: 'article:published_time',
        content: article.createTime
      },
      {
        'data-n-head': 'ssr',
        property: 'article:modified_time',
        content: article.updateTime
      },
      {
        'data-n-head': 'ssr',
        property: 'article:author',
        content: article.author || '火山'
      },
      // 如果有封面图
      article.cover && {
        'data-n-head': 'ssr',
        property: 'og:image',
        content: article.cover
      },

      /*Twitter*/
      // {
      //   name: 'twitter:card',
      //   content: 'summary_large_image'
      // },
      // {
      //   name: 'twitter:title',
      //   content: article.title
      // },
      // {
      //   name: 'twitter:description',
      //   content: article.description || article.summary
      // },
      // 如果有封面图
      article.cover && {
        'data-n-head': 'ssr',
        name: 'twitter:image',
        content: article.cover
      }
    ].filter(Boolean), // 过滤掉 undefined 的项

    // 添加规范链接
    link: [
      {
        'data-n-head': 'ssr',
        rel: 'canonical',
        href: `${config.public.siteUrl}${route.path}`
      },
      {
        'data-n-head': 'ssr',
        rel: 'canonical',
        href: `https://juejin.cn/post/${route.params.id}`
      }
    ],

    // 添加结构化数据
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.description || article.summary,
          author: {
            '@type': 'Person',
            name: article.author || '火山'
          },
          datePublished: article.createTime,
          dateModified: article.updateTime,
          publisher: {
            '@type': 'Organization',
            name: '火山博客',
            logo: {
              '@type': 'ImageObject',
              url: `${config.public.siteUrl}/logo.png`
            }
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${config.public.siteUrl}${route.path}`
          },
          // 如果有封面图
          ...(article.cover && {
            image: {
              '@type': 'ImageObject',
              url: article.cover
            }
          })
        })
      }
    ]
  })
}