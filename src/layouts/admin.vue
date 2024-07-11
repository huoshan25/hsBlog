<script setup lang="ts">
import type {Component} from 'vue'
import {NIcon} from 'naive-ui'
import type {MenuOption} from 'naive-ui'
import {CreateOutline, SpeedometerOutline} from "@vicons/ionicons5";
const img = useImage()

onMounted( () => {
  renewalCrumbs(menuOptions, activeKey.value)
})

/**转换图标*/
const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, {default: () => h(icon)})
}

/**选中菜单项*/
const activeKey = ref<string>('instrumentPanel')

/**菜单是否折叠*/
const collapsed = ref(false)

/**菜单项*/
const menuOptions: MenuOption[] = [
  {
    label: '仪表盘',
    key: 'instrumentPanel',
    icon: renderIcon(SpeedometerOutline),
  },
  {
    label: '文章管理',
    key: 'article',
    icon: renderIcon(CreateOutline),
    children: [
      {
        label: '文章管理-二级菜单',
        key: 'article2-1',
      },
      {
        label: '文章管理-二级菜单2',
        key: 'article2-2',
      },
    ]
  },
]

/**菜单折叠事件*/
const handleFoldMenu = () => {
  collapsed.value = !collapsed.value
}

/**面包屑路径*/
const breadcrumbList = ref<string[]>([])

/**用于存储菜单树结构的扁平化数组 - 面包屑菜单*/
const dropdownOptions = ref<Record<number, MenuOption[]>>({})

/**
 * 处理菜单项选中事件
 * @param key 菜单项
 * @param item 菜单项原始数据
 */
const handleUpdateMenu = (key: string, item: MenuOption) => {
  activeKey.value = key
  renewalCrumbs(menuOptions, key)
}

/**
 * 更新面包屑和下拉菜单选项
 * @param menuOptions 菜单数据
 * @param key 菜单项
 */
const renewalCrumbs = (menuOptions: MenuOption[], key: string) => {
  const path = findMenuPath(menuOptions, key)
  if (path) {
    breadcrumbList.value = path
    dropdownOptions.value = findDropdownOptions(menuOptions, path)
  }
}

/**
 * 递归查找菜单项的路径
 * @param options - 当前菜单项数组
 * @param key - 需要查找的菜单项的 key
 * @param path - 当前路径
 * @returns 路径数组或 null
 */
const findMenuPath = (options: MenuOption[], key: string, path: string[] = []): string[] | null => {
  for (const option of options) {
    const newPath = [...path, option.label as string]
    if (option.key === key) {
      return newPath
    }
    if (option.children) {
      const childPath = findMenuPath(option.children, key, newPath)
      if (childPath) {
        return childPath
      }
    }
  }
  return null
}

/**
 * 查找面包屑项的下拉菜单选项
 * @param options - 当前菜单项数组
 * @param path - 当前路径
 * @returns 各层级的下拉菜单选项
 */
const findDropdownOptions = (options: MenuOption[], path: string[]): Record<number, MenuOption[]> => {
  const dropdowns: Record<number, MenuOption[]> = {}
  const findOptions = (opts: MenuOption[], p: string[], depth: number) => {
    const label = p[depth]
    for (const option of opts) {
      if (option.label === label) {
        if (option.children) {
          dropdowns[depth] = option.children
          findOptions(option.children, p, depth + 1)
        }
        break
      }
    }
  }
  findOptions(options, path, 0)
  return dropdowns
}

/**面包屑首页数据 - 一级菜单*/
const homeDropdownOptions: MenuOption[] = menuOptions.map((option) => ({
  label: option.label as string,
  key: option.key as number | string,
}))

</script>

<template>

  <n-layout has-sider class="layout">
    <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="220"
        :collapsed="collapsed"
    >
      <div class="wrap-title">
        <nuxt-img src="/svg/logo.svg" h-40 :placeholder="img(`/svg/logo.svg`, { h: 10, f: 'png', blur: 2, q: 50 })"/>
        <div v-show="!collapsed" class="text">后台管理</div>
      </div>
      <n-menu
          @update:value="handleUpdateMenu"
          v-model:value="activeKey"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
      />
    </n-layout-sider>
    <div class="wrap scrollBar">
      <div class="header">
        <nuxt-img v-show="!collapsed" style="cursor: pointer" src="/svg/shrink.svg" height="20" @click="handleFoldMenu"/>
        <nuxt-img v-show="collapsed" style="cursor: pointer" src="/svg/unfold.svg" height="20" @click="handleFoldMenu"/>

        <n-breadcrumb m-l-7>
          <n-breadcrumb-item>
            <n-dropdown :options="homeDropdownOptions">
              <div class="trigger">
                首页
              </div>
            </n-dropdown>
          </n-breadcrumb-item>
          <n-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
            <n-dropdown v-if="dropdownOptions[index]" :options="dropdownOptions[index]">
              <div class="trigger">
                {{ item }}
              </div>
            </n-dropdown>
            <template v-else>
              {{ item }}
            </template>
          </n-breadcrumb-item>
        </n-breadcrumb>
      </div>
      <main class="content">
        <n-card border-rd-7>
          <div h-600></div>
          <slot></slot>
        </n-card>
      </main>
    </div>
  </n-layout>
</template>

<style scoped lang="scss">
.layout {
  height: 100vh;

  .wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: #F5F5F5;

    .header {
      display: flex;
      align-items: center;
      padding: 16px 12px;
      background-color: white;
    }

    .content {
      overflow-y: auto;
      padding: 20px 14px 0
    }
  }
}

.wrap-title {
  display: flex;
  padding: 14px 14px;
  align-content: center;
  white-space: nowrap;

  .text {
    margin-left: 10px;
    font-size: 24px;
    font-weight: 600;
  }
}


</style>