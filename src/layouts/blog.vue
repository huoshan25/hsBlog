<script setup lang="ts">
import {type GlobalThemeOverrides} from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
import {consoleLogInfo} from "~/composables/logInfo";

/**获取主题颜色*/
const { themeColor} = useThemeColor()

/*主题覆盖*/
const themeOverrides: GlobalThemeOverrides = useThemeOverrides(themeColor);

onMounted(() => {
  consoleLogInfo()
})
</script>
<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <n-notification-provider>
      <n-message-provider>
        <n-modal-provider>
          <blog-navbar/>
          <div class="mt-[70px]">
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