<script setup lang="ts">
import {EyeOutline, TimeOutline} from "@vicons/ionicons5";
import {useTimeFormat} from "~/composables/tools/useTimeFormat";

const props = defineProps({
  articleData: {
    type: Object,
    default() {
      return {};
    },
  }
})

const {minutes} = useReadingTime()

/*阅读时间*/
const readingTime = computed(() =>
    props.articleData.publish_time ? useTimeFormat(props.articleData.publish_time).split(' ')[0] : ''
)
</script>

<template>
  <div class="color-#8a919f flex items-center mt-[20px]">
    <div class="mr-[15px]">{{ readingTime }}</div>
    <n-icon :component="EyeOutline" class="mr-[5px]"/>
    <span class="mr-[15px]">1,006</span>
    <n-icon :component="TimeOutline" class="mr-[5px]"/>
    <span>阅读时间{{ minutes }}分钟</span>
  </div>
</template>

<style scoped lang="scss">

</style>