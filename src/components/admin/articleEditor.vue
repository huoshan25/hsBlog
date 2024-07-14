<script setup lang="ts">
import {getAddArticle, getArticleList} from "~/api/article";
import {type ArticleReq, ArticleStatus} from "~/api/article/type";
import {HttpStatus} from "~/enums/httpStatus";
import {SaveOutline, ReturnDownBackOutline} from '@vicons/ionicons5'
const props = defineProps({
  visible: Boolean,
  type: String,
});

const emits = defineEmits(['close']);

/**markdown内容*/
const mdContent = defineModel({ type: String })

/**markdown工具栏配置*/
const toolbarsConfig = {
  // ... toolbars config
  bold: true, // 粗体
  italic: true, // 斜体
  header: true, // 标题
  underline: true, // 下划线
  strikethrough: true, // 中划线
  mark: true, // 标记
  superscript: true, // 上角标
  subscript: true, // 下角标
  quote: true, // 引用
  ol: true, // 有序列表
  ul: true, // 无序列表
  link: true, // 链接
  imagelink: true, // 图片链接
  code: true, // code
  table: true, // 表格
  fullscreen: true, // 全屏编辑
  readmodel: true, // 沉浸式阅读
  htmlcode: true, // 展示html源码
  help: true, // 帮助
  /* 1.3.5 */
  undo: true, // 上一步
  redo: true, // 下一步
  trash: true, // 清空
  save: true, // 保存（触发events中的save事件）
  /* 1.4.2 */
  navigation: true, // 导航目录
  /* 2.1.8 */
  alignleft: true, // 左对齐
  aligncenter: true, // 居中
  alignright: true, // 右对齐
  /* 2.2.1 */
  subfield: true, // 单双栏模式
  preview: true, // 预览
}

/**发布文章*/
const handlePublish = async () => {
  await formRef.value?.validate

  const params:ArticleReq = {
    title: form.value.title,
    content: mdContent.value as any,
    status: ArticleStatus.PUBLISH
  }

  console.log(params,'params')
  const res = await getAddArticle(params)
  if(res.code === HttpStatus.OK) {
    console.log(res,'res')
  }
}

const formRef = ref()

const rules = {

}

const form = ref({
  title: '',
})

/**
 * 文章查询
 */
const handleRequer = async () => {
  const res = await getArticleList({id: 1})
  if(res.code === HttpStatus.OK) {
    console.log(res,'res')
  }
}

/**存为草稿*/
const handleDraft = () => {

}

</script>

<template>
  <div>
    <n-form
        ref="formRef"
        inline
        label-placement="left"
        label-align="left"
        :model="form"
        :rules="rules"
        size="small"
    >
      <n-form-item label="标题" path="title">
        <n-input v-model:value="form.title" placeholder="请输入标题" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="handlePublish" m-r-10>
          <template #icon>
            <nuxt-img src="/svg/publish.svg" h-15></nuxt-img>
          </template>
          发布文章
        </n-button>
        <n-button strong type="tertiary" @click="handleDraft" m-r-10>
          <template #icon>
            <n-icon><SaveOutline/></n-icon>
          </template>
          存为草稿
        </n-button>
        <n-button strong type="tertiary" @click="emits('close')">
          <template #icon>
            <n-icon><ReturnDownBackOutline/></n-icon>
          </template>
          返回
        </n-button>
      </n-form-item>
    </n-form>


    <ClientOnly>
      <mavon-editor v-model="mdContent" w-full h-730px :toolbars="toolbarsConfig"/>
    </ClientOnly>
  </div>
</template>

<style scoped lang="scss">
</style>