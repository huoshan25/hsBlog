<script setup lang="ts">
import {SearchOutline} from "@vicons/ionicons5";

const router = useRouter()

onMounted(() => {
  currentPath.value = router.currentRoute.value.path
})

/**搜索样式*/
const inputStyle = ref({
  width: '150px',
  btColor: '#f2f3f5',
  iconColor: '#515767'
})

/**默认首页路径*/
const currentPath = ref('')

/**聚焦*/
const onFocusInput = () => {
  inputStyle.value.width = '300px'
  inputStyle.value.btColor = '#e8f0fd'
  inputStyle.value.iconColor = '#1e80ff'
}

/**失焦*/
const onBlurInput = () => {
  inputStyle.value.width = '150px'
  inputStyle.value.btColor = '#f2f3f5'
  inputStyle.value.iconColor = '#515767'
}

/**输入框事件*/
const handleInput = () => {
  console.log(222)
}

/**键盘事件*/
const handleKeyUp = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    console.log(111)
  }
}

/**搜索*/
const handleSearch = () => {
}

type NavigationMenu = Array<{
  title: string
  url: string
}>

/**导航栏菜单项*/
const navigationMenu = ref<NavigationMenu>([
  {
    title: '首页',
    url: '/blog'
  },
  {
    title: '关于',
    url: '/blog/profile'
  },
  {
    title: '友链',
    url: '/blog/friendChains'
  },
])
</script>

<template>
  <header class="header">
    <div class="header-container">
      <div flex items-center>
        <div class="header-container-logo">
          <img class="logo_img" src="/svg/logo.svg" alt="logo">
          <div m-l-5 text-size-21 font-550>火山博客</div>
        </div>
        <div class="header-container-item" v-for="{title, url} in navigationMenu" :key="url">
          <nuxt-link :to="url" @click="currentPath = url" :class="{ active: currentPath === url}">
            {{ title }}
          </nuxt-link>
        </div>
      </div>
      <div flex items-center>
        <n-input-group>
          <n-input
              maxlength="64"
              :on-focus="onFocusInput"
              :on-blur="onBlurInput"
              :style="{ width: inputStyle.width , transition: 'width .1s linear 0s' }"
              placeholder="搜索火山博客"
              @input="handleInput"
              @keyup="handleKeyUp"
          />
          <n-button :color="inputStyle.btColor" @click="handleSearch">
            <template #icon>
              <n-icon :color="inputStyle.iconColor"><SearchOutline /></n-icon>
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