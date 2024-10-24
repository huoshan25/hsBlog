<script setup lang="ts">

const postLink = computed(() => {
  return location.protocol + '//' + location.host + location.pathname

})

const website = computed(() => {
  return location.protocol + '//' + location.host;
})
</script>

<template>
  <div class="license-wrap">
    <span>【END】</span>
    <p>本文链接：{{ postLink }}</p>
    <p>
      <span>版权声明：本博客所有文章除声明转载外，均采用</span>
      <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0"
          target="_blank"
          class="color-#1e80ff mx-[4px]"
      >CC-BY-NC-SA 4.0</a>
      <span>许可协议。转载请注明来自</span>
      <a :href="website" class="color-#1e80ff ml-[4px]">火山博客</a>。
    </p>
  </div>
</template>

<style scoped lang="scss">
.license-wrap {
  position: relative;
  border: 1px dashed #ccc;
  border-radius: 5px;
  padding: 13px 16px 8px;
  margin: 50px 0 20px;
  font-size: 14px;
  width: 90%;
}

.license-wrap > span,
.end-wrap span {
  position: absolute;
  left: 50%;
  top: -12px;
  transform: translate(-50%, 0);
  display: block;
  background: #fff;
  font-weight: 500;
  user-select: none;
}

.license-wrap > p {
  margin-bottom: 5px;
}
</style>