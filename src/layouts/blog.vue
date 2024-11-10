<script setup lang="ts">
import {zhCN, dateZhCN} from 'naive-ui'
import {consoleLogInfo} from "~/composables/logInfo";

/*主题色覆盖*/
const {themeOverrides} = useThemeOverrides()

onMounted(() => {
  consoleLogInfo()
})
</script>
<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <n-notification-provider>
      <n-message-provider>
        <n-modal-provider>
          <div class="flex flex-col h-[100vh]">
            <blog-navbar/>
            <div class="mt-[70px] flex-auto">
              <slot></slot>
            </div>
            <blog-footer/>
          </div>
        </n-modal-provider>
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style scoped>

</style>