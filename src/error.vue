<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue'
import type {NuxtError} from "#app";

interface CustomError extends NuxtError {
  stack?: string
}

const props = defineProps<{
  error: CustomError
}>()

const errorComponent = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return defineAsyncComponent(() => import('~/components/error/404.vue'))
    case 403:
      return defineAsyncComponent(() => import('~/components/error/403.vue'))
    default:
      return defineAsyncComponent(() => import('~/pages/blog/[[alias]].vue'))
  }
})

const handleRetry = () => {
  // clearError({ redirect: '/blog' })
}
</script>

<template>
  <div>
    <component :is="errorComponent" :error="error" @retry="handleRetry" />
  </div>
</template>