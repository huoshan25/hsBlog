<script setup lang="ts">
import {type GlobalThemeOverrides} from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'

/**获取主题颜色*/
const { themeColor} = useThemeColor()

/*主题覆盖*/
const themeOverrides: GlobalThemeOverrides = useThemeOverrides(themeColor);
</script>
<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <n-notification-provider>
      <n-message-provider>
        <n-modal-provider>
          <blog-navbar/>
          <div>
            <slot></slot>
          </div>
          <blog-footer/>
        </n-modal-provider>
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style scoped>

</style>