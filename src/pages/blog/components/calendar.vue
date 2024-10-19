<script setup lang="ts">
/**当前日历日期*/
const calendar = ref<null | number>(null)

/** 选中日期的回调，month 从 1 开始*/
const handleUpdateValue = () => {
}
</script>

<template>
  <div class="blog-calendar-wrap">
    <div class="blog-calendar-wrap-title">博客日历</div>
    <div class="blog-calendar-wrap-contents">
      <n-date-picker
          clearable
          v-model:value="calendar"
          type="date"
          :panel="true"
          format="yyyy-MM-dd"
          @update:value="handleUpdateValue"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
//博客日历模块
.blog-calendar-wrap {
  background-color: white;
  margin-top: 15px;
  padding: 0;
  border-radius: 6px;

  &-title {
    padding: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #212529;
    border-bottom: 1px solid rgba(228, 230, 235, 0.5);
  }

  &-contents {
    display: flex;
  }
}
</style>