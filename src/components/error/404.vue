<script setup lang="ts">

const emit = defineEmits(['retry'])

const emitRetry = () => {
  emit('retry')
}

</script>

<template>
  <div class="flex justify-center h80vh items-center">
    <n-result status="404" title="404 资源不存在" description="生活总归带点荒谬">
      <template #footer>
        <n-button @click="emitRetry">找点乐子吧</n-button>
      </template>
    </n-result>

  </div>
</template>

<style scoped lang="scss">
</style>