<script setup lang="ts">
import {NIcon} from "naive-ui";
import {
  EyeOutline,
  ThumbsUpOutline
} from '@vicons/ionicons5'
import CategoryList, {type ICategory} from "~/components/pc/categoryList.vue";
import {getArticle, getTagsList} from "~/api/article";
import {HttpStatus} from "~/enums/httpStatus";
import {getAllCategories} from "~/api/categories";
import {ArticleStatus} from "~/api/article/type";

const route = useRoute()

definePageMeta({
  layout: 'pc',
});

/**文章分类*/
const categoryList = ref()
/**文章列表骨架屏*/
const entryListSkeleton = ref(false)

interface EntryInfo {
  title: string;
  content: string;
  category_name: string;
  tags: { id: number; name: string }[];
}

/**类目信息*/
const entryInfo = ref<EntryInfo[]>([])

/**个人模块信息*/
const personal = reactive({
  name: 'volcano',
  avatar: '/img/avatar.jpg',
  avatarBackgroundImage: 'https://cdn.duanx.cn/static/Cuteen/img/center-bg.svg',
  description: '“风很温柔 花很浪漫 你很特别 我很喜欢”',
  articlesTotal: 0,
  categoriesTotal: 0,
  tagTotal: 0,
})

const numberOfViews = ref(22)
const numberOfLikes = ref(22)

/**当前日历日期*/
const calendar = ref<null | number>(null)

/**当前分类数据*/
const aliasList = ref<ICategory>({})

/** 选中日期的回调，month 从 1 开始*/
const handleUpdateValue = () => {
}

/**列表*/
const getList = async () => {
  entryListSkeleton.value = true
  const params = {
    categoryId: aliasList.value?.id,
    status: ArticleStatus.PUBLISH
  }
  const res = await getArticle(params)
  if (res.code === HttpStatus.OK) {
    entryInfo.value = res.data.list.map((item: EntryInfo) => {
      return {
        title: item.title,
        category_name: item.category_name,
        content: item.content,
        tags: item.tags
      }
    })
    entryListSkeleton.value = false
  }
}

onMounted(async () => {
  const tagsRes = await getTagsList()
  if (tagsRes.code === HttpStatus.OK) {
    personal.tagTotal = tagsRes.data.tagTotal
    personal.articlesTotal = tagsRes.data.articleTotal
  }
  const categoryRes = await getAllCategories()
  if (categoryRes.code === HttpStatus.OK) {
    categoryList.value = categoryRes.data.map((item: ICategory) => {
      return {
        id: item.id,
        alias: `/blog/${item.alias}`,
        name: item.name,
        icon: item.icon,
      }
    })
    personal.categoriesTotal = categoryRes.data.length
  }
  aliasList.value = categoryList.value.find((item: ICategory) => item.alias === `/blog/${route?.params?.alias}`)
  if(!aliasList.value) {
    navigateTo('/blog');
  }
  useHead({
      title: aliasList.value?.name,
      titleTemplate: (titleChunk) => titleChunk == '火山博客' ? '' : `${titleChunk} - 火山博客`
    })
  await getList()
})
</script>

<template>
  <main class="main">
    <category-list :currentRow="categoryList" @toCategoryl=""/>
    <div v-show="false">屏幕小的导航栏</div>
    <!-- 类目内容 -->
    <div class="contents">
      <div class="contents-left">
        <div class="entry-list-wrap">
          <n-space v-show="entryListSkeleton" p15 vertical>
            <n-skeleton height="15px" width="40%" />
            <n-skeleton height="15px" width="100%" />
            <n-skeleton height="15px" width="70%"/>
            <n-skeleton height="15px" width="50%"/>
          </n-space>
          <div v-show="!entryListSkeleton" class="entry-list" v-for="(item, index) in entryInfo" :key="index">
            <n-ellipsis class="entry-list-title" :tooltip="false">
              {{ item.title }}
            </n-ellipsis>
            <n-ellipsis class="entry-list-content" :tooltip="false">
              {{ item.content }}
            </n-ellipsis>
            <div class="entry-list-bottom">
              <div class="entry-list-bottom-left">
                {{ item.category_name }}
                <n-divider vertical/>
                <div class="entry-list-bottom-left-item">
                  <n-icon size="15" style="margin-right: 4px" color="#8a919f" :component="EyeOutline"/>
                  {{ numberOfViews }}
                </div>
                <div style="margin-left: 15px" class="entry-list-bottom-left-item">
                  <n-icon size="15" style="margin-right: 4px" color="#8a919f" :component="ThumbsUpOutline"/>
                  {{ numberOfLikes }}
                </div>
              </div>
              <div class="entry-list-bottom-right">
                <n-tag :bordered="false" style="margin-left: 6px" size="small" v-for="tag in item.tags" :key="index">
                  {{ tag }}
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
            <div class="personal-introduced-name">{{ personal.name }}</div>
            <div class="personal-introduced-description">{{ personal.description }}</div>
          </div>
          <div class="personal-bottom">
            <div class="personal-bottom-item">
              <div style="text-align: center; font-weight: 600; font-size: 16px">文章</div>
              <div style="text-align: center; color: #212529;">
                <n-number-animation ref="numberAnimationInstRef" :from="0" :to="personal.articlesTotal"/>
              </div>
            </div>
            <div class="personal-bottom-item">
              <div style="text-align: center; font-weight: 600; font-size: 16px">分类</div>
              <div style="text-align: center">
                <n-number-animation ref="numberAnimationInstRef" :from="0" :to="personal.categoriesTotal"/>
              </div>
            </div>
            <div class="personal-bottom-item">
              <div style="text-align: center; font-weight: 600; font-size: 16px">标签</div>
              <div style="text-align: center">
                <n-number-animation ref="numberAnimationInstRef" :from="0" :to="personal.tagTotal"/>
              </div>
            </div>
          </div>
        </div>
        <!-- 博客日历 -->
        <ClientOnly>
          <div class="blog-calendar-wrap">
            <div class="blog-calendar-wrap-title">博客日历</div>
            <div class="blog-calendar-wrap-contents">
              <n-date-picker
                  clearable
                  v-model:value="calendar"
                  type="date"
                  :panel="true"
                  format="yyyy-MM-dd"
                  @update:value="handleUpdateValue"
              />
            </div>
          </div>
        </ClientOnly>
      </div>
    </div>
  </main>

  <n-back-top :right="100"/>
</template>

<style scoped lang="scss">
.main {
  padding: 0 4vw;
  display: flex;
  justify-content: center;
}

//主要内容
.contents {
  &-left {
    display: flex;
    flex-direction: column;
    width: 720px;
    min-height: 100vh;
  }

  &-right {
    display: flex;
    flex-direction: column;
    width: 300px;
    margin-left: 20px;
  }
}

.entry-list-wrap {
  flex-grow: 1;
  background-color: white;
  border-radius: 0 6px 6px 6px;
  box-shadow: 0 6px 10px 0 rgba(234, 234, 234, 0.8);
}

//类目模块
.entry-list {
  cursor: pointer;
  padding: 17px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid rgba(228, 230, 235, 0.5);

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

      &-item {
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
.personal {
  background-color: white;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: space-between;

  &-contents {
    width: 100%;
    flex-grow: 1;

    .top-backgroundImage {
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

    .personal-introduced {
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
  padding: 0;
  border-radius: 6px;

  &-title {
    padding: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #212529;
    border-bottom: 1px solid rgba(228, 230, 235, 0.5);
  }

  &-contents {
    display: flex;
  }
}
</style>