<script setup lang="ts">
import {getArticleDetails} from "~/api/blog/post";
import License from "./components/license.vue"
import {useArticleSEO} from "~/pages/blog/post/components/useArticleSEO";
import AuthorInfo from "~/pages/blog/post/components/authorInfo.vue";
import {HttpStatus} from "~/enums/httpStatus";

definePageMeta({
  layout: 'blog',
})

const {scrollY} = useScrollWatcher()

const headings = ref([])
const route = useRoute()

const isNavbarVisible = computed(() => {
  return scrollY.value === 0
})
const {data: articleData} = await useAsyncData('post', () => getArticleDetails({id: Number(route.params.id)}), {
  default() {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        data: []
      }
  },
})
useArticleSEO(articleData.value)
const updateHeadings = (newHeadings: any) => {
  headings.value = newHeadings
}

</script>

<template>
  <div class="main">
    <div class="content">
      <h1 class="text-[40px] font-600 line-height-1.31">{{ articleData.data.title }}</h1>
      <author-info :articleData="articleData.data"/>
      <markdown-renderer :markdown="articleData.data.content" @headings-updated="updateHeadings"/>
      <client-only>
        <!--许可证-->
        <div class="flex justify-center">
          <license/>
        </div>
      </client-only>
    </div>
    <div class="content-right" :class="{ 'header-hidden': !isNavbarVisible }">
      <markdown-anchor class="w-[330px]" :content="articleData.data.content"/>
    </div>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  justify-content: center;
}

.content {
  margin-top: 15px;
  background-color: white;
  padding: 25px 30px;
  width: 900px;
  display: flex;
  flex-direction: column;
  margin-right: 24px;
}

.content-right {
  width: 330px;
  position: relative;
  transition: top 0.2s ease-in-out;
  top: 15px;

  &.header-hidden {
    top: -60px;
  }
}

</style>