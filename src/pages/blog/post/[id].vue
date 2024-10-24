<script setup lang="ts">
import {getArticleDetails} from "~/api/blog/post";
import License from "./components/license.vue"
import {useArticleSEO} from "~/pages/blog/post/components/useArticleSEO";

definePageMeta({
  layout: 'blog',
})
const {scrollY} = useScrollWatcher()
const isNavbarVisible = computed(() => {
  return scrollY.value === 0
})
const headings = ref([])
const route = useRoute()
const {data: articleData} = await useAsyncData('post', () => getArticleDetails({id: Number(route.params.id)}))
useArticleSEO(articleData.value)
const updateHeadings = (newHeadings: any) => {
  headings.value = newHeadings
}

</script>

<template>
  <div class="main">
    <div class="content">
      <h1>{{ articleData.data.title }}</h1>
      <markdown-renderer :markdown="articleData.data.content" @headings-updated="updateHeadings"/>
      <client-only>
        <license/>
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
  padding: 15px;
  width: 900px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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