<template>
  <div class="tabs">
    <div class="tabs-header">
      <button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="{ active: currentTab === index }"
          @click="currentTab = index"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tabs-content">
      <div v-for="(tab, index) in tabs" :key="index" v-show="currentTab === index">
        <slot :name="tab.slot"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  tabs: {
    type: Array,
    required: true
  }
});

const currentTab = ref(0);
</script>

<style>
.tabs {
  border: 1px solid #e1e4e8;
  border-radius: 6px;
}

.tabs-header {
  display: flex;
  background: #f6f8fa;
  border-bottom: 1px solid #e1e4e8;
}

.tabs-header button {
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  cursor: pointer;
}

.tabs-header button.active {
  font-weight: bold;
  border-bottom: 2px solid #2da44e;
}

.tabs-content {
  padding: 10px;
}

.tabs-content > div {
  display: none;
}

.tabs-content > div[v-show="true"] {
  display: block;
}
</style>
