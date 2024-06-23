<script setup lang="ts">
import {type GlobalThemeOverrides} from 'naive-ui'

/*定义一个主色*/
const primaryColor = ref('#409eff')

/*主题覆盖*/
const themeOverrides: GlobalThemeOverrides = useThemeOverrides(primaryColor)

</script>
<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <slot></slot>
  </n-config-provider>
</template>

<style scoped>

</style>