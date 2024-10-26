<script setup lang="ts">
import CategoryList, {type ICategory} from "~/components/blog/categoryList.vue";
import {HttpStatus} from "~/enums/httpStatus";
import {getAllCategories} from "~/api/blog/home";
import Personal from "~/pages/blog/components/personal.vue";
import ArticleList from "~/pages/blog/components/articleList.vue";
import calender from "./components/calendar.vue"

const route = useRoute()

definePageMeta({
  layout: 'blog',
});

/**文章分类*/
const categoryList = ref()

const titleName = ref()

const {data: categoryData} = await useAsyncData('categories', () => getAllCategories(), {
  default: () => {
    return {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      data: []
    }
  }
})

if (categoryData.value?.code === HttpStatus.OK) {
  categoryList.value = categoryData.value.data.map((item: ICategory) => {
    return {
      id: item.id,
      alias: `/blog/${item.alias}`,
      name: item.name,
      icon: item.icon,
    }
  })

  titleName.value = categoryList.value?.find((item: ICategory) => item.alias === `/blog/${route?.params?.alias}`)
}


useHead({
  title: titleName.value?.name,
  titleTemplate: (titleChunk) => titleChunk == '火山博客' ? '' : `${titleChunk} - 火山博客`
})

onMounted(() => {

})

</script>

<template>
  <main class="main">
    <category-list :categoryList="categoryList" @toCategoryl=""/>
    <div v-show="false">屏幕小的导航栏</div>
    <!-- 类目内容 -->
    <div class="contents">
      <div class="contents-left">
        <!-- 文章列表 -->
        <article-list :categoryList="categoryList"/>
      </div>
      <div class="contents-right">
        <!-- 个人 -->
        <personal :categoryList="categoryList"/>
        <!-- 博客日历 -->
        <ClientOnly>
          <calender/>
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

/*主要内容*/
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


@media (max-width: 1145px) {
  .contents-right {
    display: none;
  }
  .contents-left {
    width: 100%;
  }
}
</style>