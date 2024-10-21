<script setup lang="ts">
import {getArticle, getTagsAll} from "~/api/blog/tag";
import {HttpStatus} from "~/enums/httpStatus";
import {SearchDimension} from "~/pages/blog/search/components/enum";
import ArticleList from "./components/articleList.vue";

definePageMeta({
  layout: 'blog',
  middleware: async (to) => {
    const {data: tagsData} = await useAsyncData('getTagsList', getTagsAll);
    useState('tagsInfo', () => tagsData.value)
    const tagName = to.params.tagName as string;
    if (tagsData.value && !tagsData.value.data.list.some((tag: any) => tag.name === tagName)) {
      return showError({statusCode: HttpStatus.FORBIDDEN})
    }
  }
})

const route = useRoute()
const router = useRouter()
const tagsInfo = useState<any>('tagsInfo')

const articleList = ref()

/**
 * tabs更新回调
 * @param tabSValue
 */
const handleUpdateValue = (tabSValue: SearchDimension) => {
  const newQuery = {
    ...route.query,
    type: tabSValue
  }
  router.push({
    path: `/blog/tag/${route.params?.tagName}`,
    query: newQuery
  })
}

const getArticleList = async () => {
  const params = {
    tagName: route.params?.tagName,
    limit: 10,
    page: 1,
  }
  const res = await getArticle(params)
  if (res.code === HttpStatus.OK) {
    articleList.value = res.data
  }
}

watchEffect(() => {
  console.log(tagsInfo.value, 'tagsInfo')
})

onMounted(() => {
  getArticleList()
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-[40px] bg-[#f8f9fa] color-#666">
    <h1 class="m-[0]"> {{ $route.params?.tagName }}</h1>
    <div>{{ tagsInfo.data.total }} 文章</div>
  </div>

  <div class="flex">
    <div class="flex flex-col items-center justify-center w-[100vw] h-[100%] mt-[20px]">
      <div class="tabs p-[5px] w-[950px] bg-white">
        <n-tabs class="p-[15px]" type="line" animated @update:value="handleUpdateValue">
          <n-tab-pane :name="SearchDimension.SYNTHESIS" tab="综合"/>
          <n-tab-pane :name="SearchDimension.ARTICLE" tab="热门"/>
          <n-tab-pane :name="SearchDimension.TAG" tab="最新"/>
        </n-tabs>
      </div>
      <!-- 文章列表 -->
      <article-list class="w-[960px] mt-[10px]" :articleList="articleList"/>
    </div>
  </div>


</template>

<style scoped lang="scss">
:deep(.n-tabs .n-tabs-nav.n-tabs-nav--line-type.n-tabs-nav--top .n-tabs-nav-scroll-content) {
  border-bottom: none;
}

:deep(.n-tab-pane),
:deep(.n-tabs-bar) {
  display: none;
}

.tabs {
  box-shadow: inset 0 7px 8px -6px rgba(234, 232, 232, 0.9);
}

</style>