<script setup lang="ts">
import {getLogin} from "~/api/user/indexFetch";
import type {loginReq} from "~/api/user/type";
import {NIcon} from "naive-ui";
import {HttpStatus} from "~/enums/httpStatus";
import {
  EyeOutline,
  ThumbsUpOutline
} from '@vicons/ionicons5'
import {addDays} from "date-fns";
import CategoryList from "~/components/pc/categoryList.vue";

definePageMeta({
  layout: 'pc',
  middleware: async (to, from) => {
    const data = [
      {
        id: '1',
        cateName: '',
        alias: '/blog',
        img: '/svg/nest.svg',
      },
      {
        id: '2',
        cateName: '测试',
        alias: '/blog/test2',
        img: '/svg/nuxt.svg',
      }
    ]

    const getCategoryByAlias = (alias: string) =>
        data.find((category) => category.alias === alias)?.cateName ?? undefined
    useHead({
      title: `${ getCategoryByAlias(to.path) }`,
      titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} - 文章 - 火山博客` : '火山博客'
      }
    })
  }
});


onMounted(() => {
  /**默认当前时间*/
  calendar.value = new Date().getTime();
  /**防止水合报错，在客户端时打开面板*/
  panel.value = true
})

const showModal = ref(false);

const form = ref<loginReq>({
  username: '',
  password: ''
});

const rules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }
};

const handleSubmit = async () => {
  const res = await getLogin(form.value);
  if (res.code === HttpStatus.OK) {
  }
};

const navTbsIndex = ref('1')

/**类目信息*/
const entryInfo = reactive({
  title: '记录nuxt的知识点',
  content: '住在我心里孤独的 孤独的海怪 痛苦之王 开始厌倦 深海的光 停滞的海浪',
  tags: ['ssr', 'vue3']
})

/**个人模块信息*/
const personal = reactive({
  name: 'volcano',
  avatar: '/img/avatar.jpg',
  avatarBackgroundImage: 'https://cdn.duanx.cn/static/Cuteen/img/center-bg.svg',
  description: '“风很温柔 花很浪漫 你很特别 我很喜欢”',
  numberOfArticles: 22,
  classification: 23,
  numberOfLabels: 22,
})
/**文章分类*/
const entryClassification = ref('nuxt')
const numberOfViews = ref(22)
const numberOfLikes = ref(22)

/**当前日历日期*/
const calendar = ref<null | number>(null)

const panel = ref(false)

/** 选中日期的回调，month 从 1 开始*/
const handleUpdateValue = (_: number, { year, month, date }: { year: number; month: number; date: number }) => {
  console.log(`${year}-${month}-${date}`, '日历')
}

</script>

<template>
  <main class="main">
    <category-list/>
    <div v-show="false">屏幕小的导航栏</div>
    <!-- 类目内容 -->
    <div class="contents">
      <div class="contents-left">
<!--        <n-tabs-->
<!--            v-model:value="navTbsIndex"-->
<!--            type="line"-->
<!--            size="large"-->
<!--            :tabs-padding="20"-->
<!--        >-->
<!--          <n-tab name="1" tab="最新"/>-->
<!--          <n-tab name="2" tab="推荐"/>-->
<!--        </n-tabs>-->

        <div class="entry-list-wrap">
          <div class="entry-list" v-for="(item, index) in 10" :key="index">
            <n-ellipsis class="entry-list-title" :tooltip="false">
              {{entryInfo.title}}
            </n-ellipsis>
            <n-ellipsis class="entry-list-content" :tooltip="false">
              {{entryInfo.content }}
            </n-ellipsis>
            <div class="entry-list-bottom">
              <div class="entry-list-bottom-left">
                {{ entryClassification }}
                <n-divider vertical/>
                <div class="entry-list-bottom-left-item">
                  <n-icon size="15" style="margin-right: 4px" color="#8a919f" :component="EyeOutline" />{{numberOfViews}}
                </div>
                <div style="margin-left: 15px" class="entry-list-bottom-left-item">
                  <n-icon size="15" style="margin-right: 4px" color="#8a919f" :component="ThumbsUpOutline" />{{numberOfLikes}}
                </div>
              </div>
              <div class="entry-list-bottom-right">
                <n-tag :bordered="false" style="margin-left: 6px" size="small" v-for="(item, index) in entryInfo.tags" :key="index">
                  {{item}}
                </n-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="contents-right">
        <!-- 个人 -->
        <div class="personal">
          <div class="personal-contents">
            <div class="top-backgroundImage" :style="{backgroundImage: `url(${personal.avatarBackgroundImage})`}"></div>
            <div class="personal-introduced">
              <img class="personal-introduced-avatar" :src="personal.avatar" alt="avatar">
            </div>
            <div class="personal-introduced-name">{{personal.name}}</div>
            <div class="personal-introduced-description">{{personal.description}}</div>
          </div>
          <div class="personal-bottom">
            <div class="personal-bottom-item">
              <div style="text-align: center; font-weight: 600; font-size: 16px">文章</div>
              <div style="text-align: center; color: #212529;">
                <n-number-animation ref="numberAnimationInstRef" :from="0" :to="personal.numberOfArticles" />
              </div>
            </div>
            <div class="personal-bottom-item">
              <div style="text-align: center; font-weight: 600; font-size: 16px">分类</div>
              <div style="text-align: center">
                <n-number-animation ref="numberAnimationInstRef" :from="0" :to="personal.classification" />
              </div>
            </div>
            <div class="personal-bottom-item">
              <div style="text-align: center; font-weight: 600; font-size: 16px">标签</div>
              <div style="text-align: center">
                <n-number-animation ref="numberAnimationInstRef" :from="0" :to="personal.numberOfLabels" />
              </div>
            </div>
          </div>
        </div>
        <!-- 博客日历 -->
        <div class="blog-calendar-wrap">
          <div class="blog-calendar-wrap-title">博客日历</div>
          <div class="blog-calendar-wrap-contents">
            <n-date-picker
                v-model:value="calendar"
                type="date"
                :panel="panel"
                format="yyyy-MM-dd"
                @update:value="handleUpdateValue"
            />
          </div>
        </div>
      </div>
    </div>
  </main>

  <n-back-top :right="100" />

  <n-button @click="showModal = !showModal">
    来吧
  </n-button>
  <n-modal v-model:show="showModal" :auto-focus="false">
    <n-card
        style="width: 400px"
        title="登录"
        :bordered="false"
        size="huge"
        require-mark-placement="right-hanging"
        role="dialog"
        aria-modal="true"
        :style="{
            maxWidth: '640px'
          }"
    >
      <n-form
          ref="formRef"
          :inline="false"
          label-placement="left"
          :model="form"
          :rules="rules"
          size="small"
      >
        <n-form-item label="姓名" path="username">
          <n-input v-model:value="form.username" placeholder="请输入账户"/>
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input v-model:value="form.password" placeholder="请输入密码" show-password-on="click" type="password"
                   @keydown.enter.prevent/>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="handleSubmit()">
            提交
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </n-modal>
</template>

<style scoped lang="scss">
.nav-left {
  border: 1px solid red;
  width: 164px;
  margin-right: 20px;
}

.main {
  padding: 0 4vw;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

//主要内容
.contents {
  width: 100%;
  &-left {
    box-shadow: 0 6px 10px 0 rgba(234, 234, 234, 0.8);
    background-color: white;
    display: flex;
    flex-direction: column;
    margin-right: 20px;
    //border: 1px solid #dee2e6;
    border-radius: 0 6px 6px 6px;
    width: 720px;
  }

  &-right {
    display: flex;
    flex-direction: column;
    width: 300px;
  }
}

//类目模块
.entry-list {
  cursor: pointer;
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid rgba(228,230,235,0.5);

  &-title {
    font-weight: 700;
    font-size: 17px;
    line-height: 24px;
    width: 100%;
    margin-bottom: 3px;
  }

  &-content {
    width: 100%;
    font-size: 13px;
    line-height: 22px;
    margin-bottom: 4px;
    color: #8a919f;
  }

  &-bottom {
    width: 100%;
    display: flex;
    justify-content: space-between;
    &-left {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #8a919f;

      &-item  {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

@media (max-width: 1145px) {
  .contents-right {
    display: none;
  }
  .contents-left {
    width: 100%;
  }
}

//个人模块
.personal{
  background-color: white;
  //border: 1px solid #dee2e6;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: space-between;

  &-contents {
    width: 100%;
    flex-grow: 1;
    .top-backgroundImage{
      object-fit: cover;
      background-position-x: center;
      background-position-y: center;
      background-size: cover;
      min-height: 120px;
      width: 100%;
      overflow: hidden;
      border-top-right-radius: 6px;
      border-top-left-radius: 6px;
      position: relative;

      &:after {
        content: "";
        width: 100%;
        height: 40%;
        position: absolute;
        bottom: 0;
        left: 0;
        background: linear-gradient(to top, #fff, transparent)
      }
    }

    .personal-introduced{
      text-align: center;

      &-avatar {
        position: absolute;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        border: rgba(255, 255, 255, .4) 4px solid;
        width: 59px;
        height: 59px;
        border-radius: 50%
      }
    }

    .personal-introduced-name {
      font-size: 20px;
      font-weight: 900;
      color: #212529;
      margin-top: 40px;
      margin-bottom: 5px;
      text-align: center;
    }
    .personal-introduced-description {
      text-align: center;
      color: #a6a5a5;
      padding: 0 25px;
      margin-bottom: 10px;
    }
  }

  &-bottom {
    display: flex;
    justify-content: center;
    border-top: 1px solid #dee2e6;
    &-item {
      padding: 9px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
}

//博客日历模块
.blog-calendar-wrap {
  background-color: white;
  margin-top: 15px;
  //border: 1px solid #dee2e6;
  padding: 0;
  border-radius: 6px;

  &-title {
    padding: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #212529;
    border-bottom: 1px solid rgba(228,230,235,0.5);
  }

  &-contents {
    display: flex;
  }
}
</style>