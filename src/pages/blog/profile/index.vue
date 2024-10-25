<script setup lang="ts">
definePageMeta({
  layout: 'blog',
})

useHead({
  title: '关于',
  titleTemplate: (titleChunk) => `${titleChunk} - 火山博客`
})

const personalInfo = {
  name: '火山',
  title: '独立开发者',
  description: '热爱技术，热爱开源，持续学习中...',
  bio: [
    '👨‍💻 目前专注于全栈开发，特别是 Vue 生态系统',
    '🌱 正在学习 Rust 和 后端开发',
    '🎯 2024年目标：为开源项目贡献代码，写 100 篇技术博客',
    '🎸 业余时间喜欢运动和阅读技术书籍'
  ],
  skills: [
    {
      name: 'Frontend',
      items: [
        { name: 'Vue.js', level: 90 },
        { name: 'Nuxt.js', level: 85 },
        { name: 'TypeScript', level: 80 },
        { name: 'Tailwind CSS', level: 70 }
      ]
    },
    {
      name: 'Backend',
      items: [
        { name: 'Node.js', level: 85 },
        { name: 'Python', level: 75 },
        { name: 'MySQL', level: 80 }
      ]
    },
    {
      name: 'Tools',
      items: [
        { name: 'Git', level: 85 },
        { name: 'Docker', level: 75 },
        { name: 'WebStorm', level: 90 }
      ]
    }
  ],
  projects: [
    {
      name: '个人博客系统',
      description: '基于 Nuxt3 + NaiveUI 构建的现代化个人博客系统（前后台）',
      tech: ['Vue3', 'Nuxt3', 'TypeScript', 'NaiveUI'],
      link: 'https://github.com/yourproject'
    },
    {
      name: '博客后端API服务',
      description: '使用 Nest.js 构建的RESTful API服务，实现博客核心功能，包含用户认证、文章管理、对象存储等模块',
      tech: ['Nest.js', 'TypeScript', 'TypeORM', 'MySQL', 'JWT', 'Ali-OSS'],
      link: 'https://github.com/yourproject-api'
    },
  ],
  contacts: [
    { platform: 'GitHub', link: 'https://github.com/huoshan25', icon: '/svg/github.svg' },
    { platform: 'Email', link: 'mailto:1726941245@qq.com', icon: '/svg/icon_email.svg' },
    { platform: '掘金', link: 'https://juejin.cn/user/46604556441571', icon: '/svg/juejin.svg' }
  ]
}

const message = useMessage()

const copyEmail = () => {
  navigator.clipboard.writeText('1726941245@qq.com')
  message.success('邮箱已复制到剪贴板')
}
</script>

<template>
  <main class="wrap">
    <section class="intro">
      <div class="avatar-container">
        <n-avatar
            round
            :size="120"
            src="/img/avatar.jpg"
            fallback-src="/default-avatar.png"
        />
      </div>
      <h1 class="title">{{ personalInfo.name }}</h1>
      <h2 class="subtitle color-white">{{ personalInfo.title }}</h2>
      <p class="description color-white">{{ personalInfo.description }}</p>
      <div class="bio-list">
        <p v-for="(item, index) in personalInfo.bio"
           :key="index"
           class="bio-item color-white">
          {{ item }}
        </p>
      </div>
    </section>

    <div class="wrap-container">

      <section class="github-stats">
        <h2 class="section-title">GitHub statistics</h2>
        <div class="stats-container">
          <img
              src="https://ghchart.rshah.org/1E80FF/huoshan25"
              alt="GitHub Contribution Graph"
              class="github-chart"
          />
          <div class="github-metrics">
            <img
                src="https://github-readme-stats.vercel.app/api?username=huoshan25&show_icons=true&theme=vue"
                alt="GitHub Stats"
                class="github-stats-card"
            />
            <img
                src="https://github-readme-stats.vercel.app/api/top-langs/?username=huoshan25&layout=compact&theme=vue"
                alt="Most Used Languages"
                class="github-langs-card"
            />
          </div>
        </div>
      </section>

      <section class="skills">
        <h2 class="section-title">技能栈</h2>
        <div class="skills-container">
          <div v-for="(category, index) in personalInfo.skills"
               :key="index"
               class="skill-category">
            <h3 class="category-title">{{ category.name }}</h3>
            <div class="skill-list">
              <div v-for="(skill, skillIndex) in category.items"
                   :key="skillIndex"
                   class="skill-item">
                <span class="skill-name">{{ skill.name }}</span>
                <client-only>
                  <n-progress
                      processing
                      type="line"
                      :percentage="skill.level"
                      :height="6"
                      :border-radius="4"
                      :color="'#1E80FF'"
                  />
                </client-only>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="projects">
        <h2 class="section-title">个人项目</h2>
        <div class="projects-grid">
          <n-card
              v-for="(project, index) in personalInfo.projects"
              :key="index"
              class="project-card"
              hoverable
          >
            <template #header>
              <div class="project-header">
                <h3>{{ project.name }}</h3>
                <n-button
                    text
                    type="primary"
                    :href="project.link"
                    target="_blank"
                >
                  查看项目
                </n-button>
              </div>
            </template>
            <p>{{ project.description }}</p>
            <div class="project-tech">
              <n-tag
                  v-for="(tech, techIndex) in project.tech"
                  :key="techIndex"
                  size="small"
                  class="tech-tag"
              >
                {{ tech }}
              </n-tag>
            </div>
          </n-card>
        </div>
      </section>

      <section class="contact">
        <h2 class="section-title">联系方式</h2>
        <div class="contact-links">
          <n-button
              v-for="(contact, index) in personalInfo.contacts"
              :key="index"
              tag="a"
              class="contact-btn"
              :href="contact.link"
              target="_blank"
              rel="noopener noreferrer"
          >
            <template #icon>
              <nuxt-img class="h-[22px]" :src="contact.icon"/>
            </template>
            {{ contact.platform }}
          </n-button>
          <n-button @click="copyEmail" class="contact-btn">
            <template #icon>
              <nuxt-img class="h-[20px]" src="/svg/copy.svg"/>
            </template>
            复制邮箱
          </n-button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  background-color: #f5f5f5;

  &-container {
    width: 860px;
    max-width: 100%;
    padding: 40px 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}

.intro {
  width: 900px;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(-90deg,#00BCD4 0,#1890ff 100%);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 30px;
  padding-bottom: 15px;
  margin-top: 100px;
  text-align: center;

  .avatar-container {
    margin-bottom: 20px;
    position: absolute;
    left: calc(50% - 60px);
    top: 85px;
    width: 120px;
    height: 120px;
    padding: 4px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    & > img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .title {
    padding-top: 20px;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .subtitle {
    font-size: 1.5rem;
    font-weight: 500;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    margin-bottom: 16px;
  }

  .description {
    font-size: 1.1rem;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .bio-list {
    text-align: left;
    max-width: 600px;
    margin: 0 auto;

    .bio-item {
      margin: 8px 0;
      color: white;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      font-size: 1rem;
      line-height: 1.6;
    }
  }
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 24px;
  color: #2c3e50;
  position: relative;
  padding-bottom: 8px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: #1E80FF;
  }
}

.github-stats {
  margin-bottom: 48px;

  .stats-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .github-chart {
    width: 100%;
    height: auto;
    border-radius: 8px;
    background-color: white;
  }

  .github-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;

    img {
      width: 100%;
      height: auto;
      border-radius: 8px;
    }
  }
}

.skills {
  margin-bottom: 48px;

  .skills-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }

  .skill-category {
    .category-title {
      font-size: 1.2rem;
      margin-bottom: 16px;
      color: #444;
    }

    .skill-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .skill-item {
      .skill-name {
        display: block;
        margin-bottom: 8px;
        color: #666;
      }
    }
  }
}

.projects {
  margin-bottom: 48px;

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  .project-card {
    height: 100%;

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        color: #2c3e50;
      }
    }

    .project-tech {
      margin-top: 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
}

.contact {
  .contact-links {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .contact-btn {
    min-width: 120px;
  }
}

@media (max-width: 768px) {
  .wrap-container {
    padding: 20px 16px;
  }

  .intro {
    .title {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1.2rem;
    }
  }

  .skills-container {
    grid-template-columns: 1fr;
  }

  .github-metrics {
    grid-template-columns: 1fr;
  }

  .contact-links {
    justify-content: center;
  }
}
</style>