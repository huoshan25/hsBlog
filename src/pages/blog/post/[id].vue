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

</script>

<template>
  <div class="main">
    <div class="content">
      <h1 class="text-[40px] font-600 line-height-1.31">{{ articleData.data.title }}</h1>
      <author-info :articleData="articleData.data"/>
      <markdown-renderer :markdown="articleData.data.content"/>
      <client-only>
        <!--许可证-->
        <div class="flex justify-center">
          <license/>
        </div>
        <template #fallback>
          <div class="p-[15px]">
            <common-skeleton text width="50%"/>
            <common-skeleton text width="100%"/>
          </div>
        </template>
      </client-only>
    </div>
    <div class="content-right" :class="{ 'header-hidden': !isNavbarVisible }">
      <div v-if="articleData.data.short_audio_url || articleData.data.long_audio_url" class="bg-white p-[15px] mb-[20px]">
        <div v-if="articleData.data.short_audio_url" class="mb-[10px]">
          <div class="mb-[5px] aiPodcast">文章概要</div>
          <audio
              :src="articleData.data.short_audio_url"
              controls
              class="w-full mt-2"
          >
            您的浏览器不支持音频播放
          </audio>
        </div>

        <div v-if="articleData.data.long_audio_url">
          <div class="mb-[5px] aiPodcast">AI播客</div>
          <audio
              :src="articleData.data.long_audio_url"
              controls
              class="w-full mt-2"
          >
            您的浏览器不支持音频播放
          </audio>
        </div>
      </div>
      <markdown-anchor class="w-[330px]" :content="articleData.data.content"/>
      <markdown-ai-analyzer/>
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

.aiPodcast {
  background: radial-gradient(495.98% 195.09% at 144.79% 10.71%, #ff8a01 0, #b051b9 22.37%, #672bff 45.54%, #06f 99.99%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>