<script setup lang="ts">
definePageMeta({
  layout: 'blog',
})

useHead({
  title: '关于',
  titleTemplate: (titleChunk) => `${titleChunk} - 火山博客`
})


</script>

<template>
  <main class="wrap">
    <div class="wrap-container">
      <img src="https://ghchart.rshah.org/1E80FF/cbh24kcs"/>
    </div>
  </main>
</template>

<style scoped lang="scss">
.wrap {
  padding: 0 4vw;

  &-container {
    padding: 12px 20px;
    height: 100vh;
    background-color: white;
  }
}
</style>