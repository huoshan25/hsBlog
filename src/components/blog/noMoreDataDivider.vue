<script setup lang="ts">

</script>

<template>
  <div class="no-data-container">
    <div class="dashed-line"></div>
    <div class="content">
      <slot>没有更多数据</slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.no-data-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px 0;
}

.dashed-line {
  width: 100%;
  border-top: 1px dashed #ccc;
  margin-bottom: 10px;
}

.content {
  color: #999;
  font-size: 14px;
}
</style>