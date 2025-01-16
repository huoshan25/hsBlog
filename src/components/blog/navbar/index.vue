<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useNavigationMenu } from "~/components/blog/navbar/hook/useNavigationMenu";
import SearchComponent from "~/components/blog/navbar/searchComponent.vue";
import { useDark, useStorage, useToggle } from "@vueuse/core";
import { ReorderFour } from "@vicons/ionicons5";

const router = useRouter();

/**默认首页路径*/
const currentPath = ref("");

const { getMenuOptions, isActiveRoute } = useNavigationMenu();

const { scrollY } = useScrollWatcher();

const isNavbarVisible = computed(() => {
  return scrollY.value === 0;
});
const storage: Storage = {
  length: 0,
  key(index: number): string | null {
    if (process.client) {
      return localStorage.key(index);
    }
    return null;
  },
  getItem(key: string): string | null {
    if (import.meta.client) {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem(key: string, value: string): void {
    if (import.meta.client) {
      localStorage.setItem(key, value);
    }
  },
  removeItem(key: string): void {
    if (import.meta.client) {
      localStorage.removeItem(key);
    }
  },
  clear(): void {
    if (import.meta.client) {
      localStorage.clear();
    }
  }
};

// 使用安全的storage对象
const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "",
  storage,
  storageKey: "blog-color-scheme"
});

const themeSwitch = ref();
const toggleDark = useToggle(isDark);
const handleUpdateTheme = () => {
  setTimeout(() => {
    toggleDark();
  }, 190);
};

onMounted(() => {
  themeSwitch.value = isDark.value;
});

const dropdownOptions = computed(() => {
  return getMenuOptions.value.map(item => ({
    label: item.title,
    key: item.url
  }));
});

/*获取当前页面对应的菜单标题*/
const getCurrentMenuTitle = computed(() => {
  const current = getMenuOptions.value.find(item => item.url === currentPath.value);
  return current?.title || "导航";
});

const handleSelect = (key: string) => {
  navigateTo(key);
};
</script>

<template>
  <header class="header bg-white dark:bg-black" :class="{ 'header-hidden': !isNavbarVisible }">
    <div class="header-container">
      <div class="flex items-center c-black dark:c-white">
        <div class="flex items-center py-[10px] mr-[5px] cursor-pointer" @click="router.push('/blog')">
          <nuxt-img height="25px" width="25px" src="svg/logo.svg" alt="logo" />
          <div class="logo-name m-l-5 text-size-21 font-550">火山博客</div>
        </div>
        <div class="header-container-item hover:color-black" v-for="{ title, url } in getMenuOptions" :key="url">
          <nuxt-link :to="url" :class="{ active: isActiveRoute(url) }" class="cursor-pointer c-black dark:c-white">
            {{ title }}
          </nuxt-link>
        </div>
        <n-dropdown trigger="click" :options="dropdownOptions" @select="handleSelect" :value="currentPath">
          <div class="mobile-dropdown mx-[2px] c-blue flex">
            <div>{{ getCurrentMenuTitle }}</div>
            <n-icon size="20">
              <ReorderFour />
            </n-icon>
          </div>
        </n-dropdown>
      </div>
      <div class="flex items-center">
        <common-theme-switch-button
          class="mr10px"
          size="small"
          :model-value="themeSwitch"
          @change="handleUpdateTheme"
        />
        <SearchComponent />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@import url(./style.scss);
</style>
