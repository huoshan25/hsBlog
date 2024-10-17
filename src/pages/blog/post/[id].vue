<script setup lang="ts">
import {getArticleDetails} from "~/api/admin/article";

const route = useRoute()
definePageMeta({
  layout: 'blog',
})

const {data} = await getArticleDetails({id: route.params.id as any})
console.log(data, 'data')
</script>

<template>
  <div class="main">
    <div class="main-content">
      <h1>{{ data.title }}</h1>
    </div>

    <div class="main-info">
      <n-card
          title="分类"
      >
        卡片内容
        当前分类的所有文章{{data.category_article_count}}
      </n-card>
    </div>

  </div>
</template>

<style scoped>
.main {
  width: 100%;
  padding: 0 4vw;
  display: flex;
  justify-content: center;

  &-content {
    background-color: white;
  }

  &-info {
    background-color: white;
  }
}
</style>