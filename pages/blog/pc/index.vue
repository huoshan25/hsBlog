<script setup lang="ts">

definePageMeta({
  layout: 'pc'
});
import {ref} from 'vue';

const myBox = ref(null);

const onReachBottom = () => {
  console.log('触底了')
}

const onReachTop = () => {
  console.log('触顶了')
}

const onScroll = () => {
  console.log('我滚动了')
}

const {isScrolled, currentPosition } = useScrollListener(myBox, {
  onReachBottom,
  onReachTop,
  onScroll
});




</script>

<template>

  <div ref="myBox" class="test">
    <!-- 这里是你的滚动内容 -->
    <div style="height: 1300px">222</div>
    <p v-if="isScrolled">盒子已被滚动！</p>
  </div>

</template>

<style scoped lang="scss">
.test {
  height: 600px;
  overflow-y: auto;
  border: 1px solid red;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>