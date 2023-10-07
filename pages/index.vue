<script setup lang='ts'>
import { reactive, toRefs, ref, computed } from 'vue'
import moment from 'moment';
// import { allCategoryItem } from '@/server/models/category';
import { IResp } from '@/types';
import { IPost, ICategory, ISetting } from '@/types/schema';
// import { Context } from '@nuxt/types/index';
// import 'highlight.js/styles/tomorrow.css';
// import { settings as storeSettings, setSettings, nuxtServerInit } from '@/store';
// import axios from 'axios';

// 设置响应式数据
const inputComp = ref('' as any);
const categories = ref([]);
const category = ref({} as ICategory);
// 获取全局状态
// const settings = ref(storeSettings.value);
const posts = ref([] as Array<IPost>);
const isLoading = ref(false);
const hasNext = ref(false);
const count = ref(0);
const sortBy = ref('date');
const keyword = ref('' as Array<string> | string);
const filterType = ref('text' as ('text' | 'title' | 'tag' | 'date'));
const inputTxt = ref('');
const inputDateMoment = ref([] as Array<moment.Moment>);
const page = ref(1);
// 获取全局状态
// const pageSize = ref(storeSettings.value.postPageSize);
const alertShow = ref(false);
const defaultRange = ref([moment().subtract(30, 'days'), moment()]);
const rangeDate = ref({
  今天: [moment(), moment()],
  昨天: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  最近一周: [moment().subtract(7, 'days'), moment()],
  最近一个月: [moment().subtract(30, 'days'), moment()],
  最近一年: [moment().subtract(365, 'days'), moment()]
});

// 设置响应式数据end

// const  asyncData  = async ({ $axios, params, error }: Context) => {
//     try {
//       const [resp1, resp2]: Array<IResp> = await Promise.all([$axios.$get('/api/categories'), $axios.$get('/api/settings')]);
//       if (resp1.code === 1 && resp2.code === 1) {
//         const categories = resp1.data || [];
//         categories.unshift(allCategoryItem);
//         const alias = params.category || '';
//         const category = categories.find((item:any )=> item.alias === alias);
//         if (category) {
//           const { code, data }: IResp = await $axios.$get('/api/posts', {
//             params: {
//               category: category._id,
//               pageIndex: 1,
//               pageSize: resp2.data.settings.postPageSize,
//               filterType: 'text',
//               keyword: '',
//               sortBy: 'date'
//             }
//           });
//           if (code === 1) {
//             return {
//               categories,
//               category,
//               posts: data.postList,
//               hasNext: data.hasNext,
//               count: data.count
//             };
//           }
//           error({
//             statusCode: 500,
//             message: '内部服务器错误'
//           });
//         } else {
//           error({
//             statusCode: 404,
//             message: '未找到该页面'
//           });
//         }
//       } else {
//         error({
//           statusCode: 500,
//           message: '内部服务器错误'
//         });
//       }
//     } catch (err:unknown) {
//       error({
//         statusCode: 500,
//         message: '内部服务器错误'
//       });
//     }
//   }



//使用计算属性
const searchPhd = computed((): string => {
  let placeholder = '';
      switch (filterType.value) {
        case 'text':
          placeholder = '全文关键字';
          break;
        case 'title':
          placeholder = '标题关键字';
          break;
        case 'tag':
          placeholder = '标签关键字';
          break;
        default:
      }
      return placeholder;
})

const inputDate = computed((): Array<string> => {
      const range = inputDateMoment.value;
      if (!range.length) {
        return [];
      }
      return [
        range[0].startOf('day').toString(),
        range[1].endOf('day').toString()
      ];
    })

//使用计算属性end

//methods开始
const disabledDate = (date:any) => {
  return date && date > moment().endOf('day');
}

const getPosts = async() => {
  isLoading.value = true;
  // const { code, data }: IResp = await $axios.$get('/api/posts', {
  //   params: {
  //     category: category.value._id,
  //     pageIndex: page.value,
  //     pageSize: pageSize.value,
  //     filterType: filterType.value,
  //     keyword: keyword.value,
  //     sortBy: sortBy.value
  //   }
  // });

  // if (code === 1) {
  //   posts.value.push(...data.postList);
  //   hasNext.value = data.hasNext;
  //   count.value = data.count;
  // }
  isLoading.value = false;
}

const loadNext = () => {
  page.value++;
  getPosts();
}

const filterTypeChange = () => {
  if (filterType.value !== 'date') {
      (inputComp.value as any).focus();
  }
}

const search = async (checkKeyword = true) => {
  let input: Array<string> | string;
  if (filterType.value === 'date') {
    input = inputDate.value;
    if (checkKeyword && !input[0] && !input[1]) {
      return;
    }
  } else {
    input = inputTxt.value;
    if (checkKeyword && !input) {
      // 使用 $refs 绑定的方法，请确保组件中有对应的 ref 名称，例如：ref="inputComp"
      nextTick(()=>{
        inputComp.value.focus();
      })
      return;
    }
  }
  alertShow.value = false;
  posts.value = [];
  page.value = 1;
  hasNext.value = false;
  keyword.value = input;
  await getPosts();
  if (input) {
    alertShow.value = true;
  }
};

const clearSearch = () => {
  alertShow.value = false;
  posts.value = [];
  page.value = 1;
  hasNext.value = false;
  keyword.value = '';
  inputTxt.value = '';
  inputDateMoment.value = [];
  getPosts();
}

const sortList = (sortBy:any)  => {
  if (sortBy === sortBy) {
    return;
  }
  sortBy = sortBy;
  search(false);
};

const selectCalendar = (newInputDateMoment: [moment.Moment, moment.Moment]) => {
  filterType.value = 'date';
  inputDateMoment.value = newInputDateMoment;
  search();
}

const selectLabel = (tag:string) => {
  filterType.value = 'tag';
  inputTxt.value = tag;
  search();
}
// ​head​ 是一个可选的配置项，用于定义页面的头部信息，例如页面的标题、meta 标签等。
// const head = () => {
//     const settings = this.$store.state.settings as ISetting;
//     const suffix = ` - ${settings.blogName}`;
//     return {
//       title: category.value.cateName + suffix,
//       meta: [
//         {
//           hid: 'description',
//           name: 'description',
//           content: settings.blogIntro || settings.blogName
//         },
//         { name: 'keywords', content: settings.blogName }
//       ]
//     };
//   }




</script>

<template>
  <div>
    <category-list :categories="categories" />
    <div class="post-wrap">
      <div class="post-left">
        <div class="post-top">
          <div class="post-top-left">
            <a :class="{ active: sortBy === 'date' }" @click="sortList('date')"
              >日期</a
            >
            <a
              :class="{ active: sortBy === 'title' }"
              @click="sortList('title')"
              >标题</a
            >
          </div>
          <div class="post-top-right">
            <a-input-group compact>
              <a-select
                v-model="filterType"
                style="width: 75px"
                @change="filterTypeChange"
              >
                <a-select-option value="text"> 全文 </a-select-option>
                <a-select-option value="title"> 标题 </a-select-option>
                <a-select-option value="tag"> 标签 </a-select-option>
                <a-select-option value="date"> 日期 </a-select-option>
              </a-select>
              <a-input
                v-if="filterType !== 'date'"
                ref="inputComp"
                v-model="inputTxt"
                style="width: 250px"
                :placeholder="searchPhd"
                allow-clear
                @keyup.enter="search"
              />
              <a-range-picker
                v-if="filterType === 'date'"
                ref="dateComp"
                v-model="inputDateMoment"
                :disabled-date="disabledDate"
                :ranges="rangeDate"
                :default-picker-value="defaultRange"
                style="width: 250px"
              />
              <a-button @click="search"> 搜索 </a-button>
            </a-input-group>
          </div>
        </div>
        <ul class="post-list">
          <li v-show="alertShow" class="filter-li">
            <div class="alert-filter">
              <div>
                共有<span>{{ count }}</span
                >条筛选结果
              </div>
              <a @click="clearSearch">清除搜索</a>
            </div>
          </li>
          <li v-for="item in posts" :key="item._id">
            <!-- <post-item :post="item" /> -->
          </li>
          <li class="last-li">
            <div v-if="isLoading" class="dot-loading">
              <!-- <div /> -->
              <!-- <div /> -->
              <!-- <div /> -->
            </div>
            <template v-else>
              <template v-if="posts.length">
                <a-button
                  v-if="hasNext"
                  class="btn-load"
                  size="large"
                  :loading="isLoading"
                  @click="loadNext"
                >
                  下一页
                </a-button>
                <div v-else class="no-more">没有更多数据</div>
              </template>
              <div v-else class="no-data">
                <a-empty>
                  <!-- <span slot="description">暂无内容</span> -->
                </a-empty>
              </div>
            </template>
          </li>
        </ul>
      </div>
      <div class="post-right">
        <!-- <blog-intro v-if="settings.showBlogIntro" /> -->
        <article-calendar @selectCalendar="selectCalendar" />
        <pop-articles />
        <pop-labels @selectLabel="selectLabel" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-wrap {
  padding: 25px 20px 0 265px;
  display: flex;
}

.post-left {
  border-radius: 0 5px 5px 0;
  overflow: hidden;
  flex: 1;
}

.post-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  height: 59px;
  padding: 20px;
}

.post-top-left a {
  font-size: 16px;
  color: #999;
  cursor: pointer;
}

.post-top-left a.active {
  color: #555;
}

.post-top-right {
  display: flex;
}

.post-list {
  background: #fff;
  min-height: 100%;
  padding: 20px 20px 0;
  margin-bottom: 0;
}

.btn-load {
  width: 100%;
  margin-bottom: 20px;
  font-size: 15px;
}

.no-more {
  text-align: center;
  color: #888;
  font-size: 14px;
  padding: 10px;
  user-select: none;
}

.no-data {
  text-align: center;
  color: #888;
  font-size: 14px;
  margin: 20px 0;
  user-select: none;
}

@keyframes dot-loading {
  0% {
    transform: scale(1, 1);
    opacity: 0.5;
  }

  33.33% {
    transform: scale(1.667, 1.667);
    opacity: 1;
  }

  66.66% {
    transform: scale(1, 1);
    opacity: 0.5;
  }

  100% {
    transform: scale(1, 1);
    opacity: 0.5;
  }
}

.dot-loading {
  transform: translate(-50%, 0);
  position: absolute;
  left: 50%;
  width: 70px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}

.post-list li.last-li:first-of-type .dot-loading {
  margin-top: 10px;
}

.dot-loading > div {
  width: 6px;
  height: 6px;
  border-radius: 100%;
  opacity: 0.5;
  animation: dot-loading 1.2s linear infinite;
}

.dot-loading > div:nth-child(1) {
  background: #1890ff;
}

.dot-loading > div:nth-child(2) {
  background: #1890ff;
  animation-delay: 0.4s;
}

.dot-loading > div:nth-child(3) {
  background: #1890ff;
  animation-delay: 0.8s;
}

.last-li {
  position: relative;
  height: 60px;
}

.alert-filter {
  display: flex;
  justify-content: space-between;
  border: 1px solid #abdcff;
  background-color: #f0faff;
  padding: 10px 12px;
  font-size: 14px;
  position: relative;
  border-radius: 4px;
  margin-bottom: 20px;
  color: #555;
  line-height: 1.5;
}

.alert-filter span {
  margin: 0 2px;
  font-weight: 500;
}

.post-right {
  width: 300px;
  margin-left: 20px;
}

.post-right .widget-container:last-child {
  margin-bottom: 0;
}

@media (max-width: 1160px) {
  .post-right {
    display: none;
  }

  .post-list {
    min-height: 100vh;
  }
}

@media (max-width: 840px) {
  .post-wrap {
    padding: 15px 0 0 0;
  }

  .post-left {
    border-radius: 5px;
  }
}

@media (max-width: 576px) {
  .post-top-right {
    display: none;
  }

  .post-left {
    border-radius: 0;
  }
}
</style>