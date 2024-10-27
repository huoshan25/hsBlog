<script setup lang="ts">
import {EyeOutline, ThumbsUpOutline} from "@vicons/ionicons5";
import {getArticle} from "~/api/blog/home";
import type {ICategory} from "~/components/blog/categoryList.vue";
import {HttpStatus} from "~/enums/httpStatus";
import type {ArticleItem, ArticleResponse} from "~/api/blog/home/type";

const props = defineProps({
  categoryList: {
    type: Object,
    default() {
      return [];
    },
  },
});

const initialLoading = ref(true);
const route = useRoute();

const loading = ref(false);
const cursor = ref<number | null>(null);
const hasMore = ref(true);
const articles = ref<ArticleItem[]>([]);
const aliasList = ref<ICategory>({});

const numberOfViews = ref(22);
const numberOfLikes = ref(22);

/*虚拟列表*/
const virtualListRef = ref();

aliasList.value = props.categoryList.find(
    (item: ICategory) => {
      if(route.params.alias === '') {
        return props.categoryList[0]
      } else {
        return item.alias === `/blog/${route?.params?.alias}`
      }
    }
);

/*加载文章列表*/
const loadArticles = async () => {
  if (loading.value || !hasMore.value || !aliasList.value.id) return;

  loading.value = true;
  try {
    const res = await getArticle({
      //@ts-ignore
      categoryId: aliasList.value.id,
      cursor: cursor.value,
      limit: 10
    });

    if (res.code === HttpStatus.OK) {
      const response = res.data as ArticleResponse;
      articles.value.push(...response.list);
      cursor.value = response.cursor;
      hasMore.value = response.hasMore;
    }
  } finally {
    loading.value = false;
    initialLoading.value = false;
  }
}

/**文章详情*/
const goDetails = (id: number) => {
  navigateTo(`/blog/post/${id}`);
};

/*标签页*/
const goTabs = (tab: string) => {
  navigateTo(`/blog/tag/${tab}`);
};

/*处理滚动到底部*/
const handleScroll = async () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (documentHeight - (scrollTop + windowHeight) < 100 && !loading.value && hasMore.value) {
    await loadArticles();
  }
};

onMounted(async () => {
  if (!aliasList.value) {
    navigateTo('/blog');
    return;
  }
  await loadArticles();
  // 添加全局滚动监听
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="entry-list-wrap">
    <n-scrollbar @scroll="handleScroll">
      <template v-if="initialLoading">
        <div v-for="i in 3" :key="i + 'initialLoading'" class="entry-list">
          <n-skeleton text :repeat="2" />
          <div class="entry-list-bottom">
            <n-space>
              <n-skeleton text style="width: 60px" />
              <n-skeleton text style="width: 40px" />
              <n-skeleton text style="width: 40px" />
            </n-space>
            <n-space>
              <n-skeleton text style="width: 40px" />
              <n-skeleton text style="width: 40px" />
            </n-space>
          </div>
        </div>
      </template>

      <template v-else>
        <n-virtual-list
            ref="virtualListRef"
            :items="articles"
            :item-size="120"
            item-resizable
        >
          <template #default="{ item }">
            <div class="entry-list" @click="goDetails(item.id)">
              <n-ellipsis class="entry-list-title" :tooltip="false">
                {{ item.title }}
              </n-ellipsis>
              <n-ellipsis class="entry-list-content" :tooltip="false">
                {{ item.content }}
              </n-ellipsis>
              <div class="entry-list-bottom">
                <div class="entry-list-bottom-left">
                  {{ item.category_name }}
                  <n-divider vertical/>
                  <div class="entry-list-bottom-left-item">
                    <n-icon size="15" style="margin-right: 4px" color="#8a919f" :component="EyeOutline"/>
                    {{ numberOfViews }}
                  </div>
                  <div style="margin-left: 15px" class="entry-list-bottom-left-item">
                    <n-icon size="15" style="margin-right: 4px" color="#8a919f" :component="ThumbsUpOutline"/>
                    {{ numberOfLikes }}
                  </div>
                </div>
                <div class="entry-list-bottom-right">
                  <n-tag
                      v-for="tag in item.tags"
                      :key="tag.id + 'tag'"
                      :bordered="false"
                      style="margin-left: 6px"
                      size="small"
                      @click.stop="goTabs(tag.name)"
                      class="hover:(text-[#1e80ff] cursor-pointer)"
                  >
                    {{ tag.name }}
                  </n-tag>
                </div>
              </div>
            </div>
          </template>
        </n-virtual-list>
      </template>
      <blog-no-more-data-divider :hasMore="hasMore"/>
    </n-scrollbar>
  </div>
</template>

<style scoped lang="scss">
.entry-list-wrap {
  background-color: white;
  border-radius: 0 6px 6px 6px;
  box-shadow: 0 6px 10px 0 rgba(234, 234, 234, 0.8);
}

/*类目模块*/
.entry-list {
  cursor: pointer;
  padding: 17px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid rgba(228, 230, 235, 0.5);

  &:hover {
    background-color: #F7F8FA;
  }

  &-title {
    font-weight: 700;
    font-size: 17px;
    line-height: 24px;
    width: 100%;
    margin-bottom: 3px;
  }

  &-content {
    width: 100%;
    font-size: 13px;
    line-height: 22px;
    margin-bottom: 4px;
    color: #8a919f;
  }

  &-bottom {
    width: 100%;
    display: flex;
    justify-content: space-between;

    &-left {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #8a919f;

      &-item {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>