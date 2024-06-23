<script setup lang="ts">

</script>

<template>
 <header class="header">
    <div>
      <img class="logo_img" src="~/assets/images/blogIcon.png" alt="">
      <div>hsBlog</div>
    </div>
 </header>
</template>

<style scoped lang="scss">
@include ajust-width('header');

.header{
  background-color: white;
}
.logo_img{
  width: 40px;
  height: 40px;
}
</style>