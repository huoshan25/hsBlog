<script setup lang="ts">
import {SearchOutline} from "@vicons/ionicons5";

/**搜索长度*/
const inputWidth = ref('150px')
/**默认首页路径*/
const currentPath = ref('/blog')
</script>

<template>
  <header class="header">
    <div class="header-container">
      <div style="display: flex; align-items: center">
        <div class="header-container-logo">
          <img class="logo_img" src="/svg/logo.svg" alt="logo">
          <div style="margin-left: 5px; font-size: 21px; font-weight: 550;">火山博客</div>
        </div>
        <div class="header-container-item">
          <nuxt-link to="/blog" @click="currentPath = '/blog'" :class="{ active: currentPath === '/blog'}">首页</nuxt-link>
        </div>
        <div class="header-container-item">
          <nuxt-link to="/blog/friendChains" @click="currentPath = '/blog/friendChains'" :class="{ active: currentPath === '/blog/friendChains'}">友链</nuxt-link>
        </div>
      </div>
      <div style="display: flex; align-items: center">
        <n-input-group>
          <n-input
              :on-focus="() => inputWidth = '300px'"
              :on-blur="() => inputWidth = '150px'"
              :style="{ width: inputWidth , transition: 'width 0.2s ease-in-out' }"
              placeholder="搜索火山博客"
          />
          <n-button color="#f2f3f5">
            <template #icon>
              <n-icon color="black"><SearchOutline /></n-icon>
            </template>
          </n-button>
        </n-input-group>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  width: 100%;
  padding: 0 3vw;
  background-color: white;
  display: flex;
  justify-content: center;
  position: sticky;
  box-sizing: border-box;
  z-index: 999;
  top: 0;

  &-container {
    width: 1440px;
    display: flex;
    justify-content: space-between;
    &-logo {
      display: flex;
      align-items: center;
      padding: 10px 0;
      margin-right: 5px;
    }

    &-item .active {
      color: #1e80ff;
    }

    &-item {
      padding: 15px;
      font-size: 16px;
      position: relative;
      &:hover {
        a {
          color: black;
          &::after {
            content: "";
            position: absolute;
            top: auto;
            right: 0;
            bottom: -4px;
            left: 1rem;
            height: 2px;
            background-color: #1e80ff;
            width: calc(100% - 2rem);
          }
        }
      }
    }
  }
}

.logo_img {
  width: 40px;
  height: 40px;
}
</style>