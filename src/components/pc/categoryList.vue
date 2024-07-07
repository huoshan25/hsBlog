<script setup lang="ts">

 interface ICategory {
   id: string;
  /**分类名称*/
  cateName: string;
  /**分类Alias*/
  alias: string;
  /**分类图片*/
  img: string;
}

const categories = ref<ICategory[]>([
  {
    id: '1',
    cateName: '首页',
    alias: '/blog',
    img: '/svg/nest.svg',
  },
  {
    id: '2',
    cateName: '友链',
    alias: '/blog/friendChains',
    img: '/svg/nuxt.svg',
  }
])
</script>

<template>
  <div class="category-wrap">
    <ul class="category-list">
      <li v-for="item in categories" :key="item.id">
        <nuxt-link :to="item.alias" exact active-class="active">
          <img :src="item.img" alt="category">
          <span>{{ item.cateName }}</span>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.category-wrap {
  width: 200px;
  top: 0;
  left: 0;
  bottom: 0;
  position: relative;
  z-index: 1;
}

.category-list li a {
  padding-left: 40px;
  font-size: 15px;
  height: 54px;
  position: relative;
  display: flex;
  align-items: center;
  color: #4F6174;
  font-weight: 500;
  margin-bottom: 5px;
  border-radius: 5px 0 0 5px;
  transition: background .3s;
}

.category-list li a.active,
.category-list li a:hover {
  background: #fff;
  box-shadow: 0 6px 10px 0 rgba(234, 234, 234, 0.8);
}

.category-list li a.active img,
.category-list li a.active span,
.category-list li a:hover img,
.category-list li a:hover span {
  transform: translateX(-2px);
}

.category-list li a.active img,
.category-list li a:hover img {
  filter: grayscale(0);
}

.category-list li a img {
  max-width: 25px;
  max-height: 25px;
  filter: grayscale(1);
  transition: all .3s;
}

.category-list li a span {
  padding-left: 8px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  transition: transform .3s;
}

@media (max-width: 840px) {
  .category-wrap {
    display: none;
  }
}
</style>