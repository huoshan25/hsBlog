<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {useNavigationMenu} from "~/components/blog/navbar/hook/useNavigationMenu";
import SearchComponent from "~/components/blog/navbar/searchComponent.vue";

const router = useRouter()

/**默认首页路径*/
const currentPath = ref('')

const { getMenuOptions } = useNavigationMenu()

onMounted(() => {
  currentPath.value = router.currentRoute.value.path === '/blog' ? '/blog/all' : router.currentRoute.value.path
})
</script>

<template>
  <header class="header">
    <div class="header-container">
      <div flex items-center>
        <div class="header-container-logo">
          <img class="logo_img" src="~/assets/svg/logo.svg" alt="logo">
          <div m-l-5 text-size-21 font-550>火山博客</div>
        </div>
        <div class="header-container-item" v-for="{title, url} in getMenuOptions" :key="url">
          <nuxt-link :to="url" @click="currentPath = url" :class="{ active: currentPath === url}">
            {{ title }}
          </nuxt-link>
        </div>
      </div>
      <SearchComponent />
    </div>
  </header>
</template>

<style scoped lang="scss">
@import url(./style.scss);
</style>