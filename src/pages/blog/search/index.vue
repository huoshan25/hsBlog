<script setup lang="ts">
import {SearchDimension} from "~/pages/blog/search/components/enum";
import ArticleList from "./components/articleList.vue";

definePageMeta({
  layout: 'blog',
});

const route = useRoute()
const router = useRouter()

const { scrollY } = useScrollWatcher()

const isNavbarVisible = computed(() => {
  return scrollY.value === 0
})

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
    path: '/blog/search',
    query: newQuery
  })
}

onMounted(() => {

})
</script>

<template>
  <div class="main">
    <header class="w-[100vw] header-container" :class="{ 'header-hidden': !isNavbarVisible }">
      <div class="w-[900px] p-[5px]">
        <n-tabs type="line" animated @update:value="handleUpdateValue">
          <n-tab-pane :name="SearchDimension.SYNTHESIS" tab="综合"/>
          <n-tab-pane :name="SearchDimension.ARTICLE" tab="文章"/>
          <n-tab-pane :name="SearchDimension.TAG" tab="标签"/>
        </n-tabs>
      </div>
    </header>

    <div class="contents">
      <!-- 文章列表 -->
      <article-List/>
    </div>
  </div>

</template>

<style scoped lang="scss">
.main {
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100%;
}

.header-container {
  padding: 0 3vw;
  background-color: white;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 60px;
  box-shadow: inset 0 7px 8px -6px rgba(234, 232, 232, 0.9);
  transition: top 0.2s ease-in-out;

  &.header-hidden {
    top: 0;
  }
}

.contents {
  width: 920px;
  display: flex;
  background-color: white;
  flex-direction: column;
  margin-top: 50px;
}

:deep(.n-tabs .n-tabs-nav.n-tabs-nav--line-type.n-tabs-nav--top .n-tabs-nav-scroll-content) {
  border-bottom: none;
}

:deep(.n-tab-pane),
:deep(.n-tabs-bar) {
  display: none;
}

</style>