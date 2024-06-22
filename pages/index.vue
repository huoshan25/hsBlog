<script setup lang="ts">
import {useDeviceType} from "~/composables/useDeviceType";

const deviceType = useDeviceType();
</script>

<template>
  <div>{{ deviceType }}</div>
</template>

<style scoped>

</style>