export const useProfileSEO = () => {
  const config = useRuntimeConfig()
  const route = useRoute()

  useHead({
    title: '关于火山 - Web前端开发工程师',
    titleTemplate: (titleChunk) => `${titleChunk} - 火山博客`,
    meta: [
      { name: 'description', content: '火山，Web前端开发工程师。专注全栈开发，擅长Vue.js、Nuxt.js、TypeScript、React.js、Next.js等前端技术，同时具备Nest.js、FastAPI等后端开发经验。热爱技术，持续学习成长中。' },
      { name: 'keywords', content: '火山,前端开发,全栈开发,Vue.js,Nuxt.js,TypeScript,React,Next.js,Nest.js,FastAPI' },

      { property: 'og:type', content: 'profile' },
      { property: 'og:title', content: '关于火山 - Web前端开发工程师' },
      { property: 'og:description', content: '火山，Web前端开发工程师。专注全栈开发，擅长Vue.js、Nuxt.js、TypeScript等技术栈。' },
      { property: 'og:url', content: 'https://your-domain.com/about' },
      { property: 'profile:first_name', content: '火山' },

      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: '关于火山 - Web前端开发工程师' },
      { name: 'twitter:description', content: '火山，Web前端开发工程师。专注全栈开发，擅长Vue.js、Nuxt.js、TypeScript等技术栈。' },
    ],
    link: [
      // TODO: 当前页面url暂时空着
      // { rel: 'canonical', href: '' }
    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          mainEntity: {
            '@type': 'Person',
            name: '火山',
            jobTitle: 'Web前端开发工程师',
            description: '建立广泛的知识储备，专注深耕前端技术栈，热爱技术，热爱开源，持续学习中...',
            // TODO: 当前页面url暂时空着
            url: '',
            sameAs: [
              'https://github.com/huoshan25',
              'https://juejin.cn/user/46604556441571'
            ],
            knowsAbout: [
              'Vue.js', 'Nuxt.js', 'TypeScript', 'React.js', 'Next.js',
              'Nest.js', 'FastAPI', 'MySQL'
            ],
            email: '1726941245@qq.com'
          },
          publisher: {
            '@type': 'Organization',
            name: '火山博客',
            logo: {
              '@type': 'ImageObject',
              // TODO: 域名暂时空着
              // url: 'https://.com/logo.png'
            }
          },
          // TODO: 当前页面url暂时空着
          // url: ''
        })
      }
    ]
  })
}