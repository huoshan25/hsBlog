<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info'
  }
});
</script>

<template>
  <n-alert :title=title type='info'>
    <slot/>
  </n-alert>
</template>

<style scoped>

</style>