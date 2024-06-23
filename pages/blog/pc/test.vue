<script lang="ts" setup>
definePageMeta({
  layout: 'pc'
});
</script>

<template>
    <n-card>
      <n-divider />
      <n-space>
        <n-space>
          <n-button>Default</n-button>
          <n-button type="primary"> Primary </n-button>
          <n-button strong secondary type="primary"> Primary </n-button>
          <n-button tertiary type="primary"> Primary </n-button>
          <n-button quaternary type="primary"> Primary </n-button>
          <n-button type="primary" ghost> Primary </n-button>
        </n-space>
      </n-space>
      <n-divider />
    </n-card>
</template>


