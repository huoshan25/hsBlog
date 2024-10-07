<script setup lang="ts">
import {
  createArticle,
  deletePicture,
  getArticleDetails,
  getTagsList,
  updateArticle
} from "~/api/admin/article";
import {ArticleStatus} from "~/api/admin/article/type";
import {HttpStatus} from "~/enums/httpStatus";
import {ReturnDownBackOutline, SaveOutline} from '@vicons/ionicons5'
import useMarkdownAbstract from "~/composables/tools/useMarkdownAbstract";
import {toolbarsConfig} from "~/components/admin/markdownEditor/config/toolbarsConfig";
import {computed} from "vue";

const props = defineProps(['currentRow']);
const message = useMessage()
const emits = defineEmits(['close']);

/**markdown内容*/
const content = ref<any>()

const formRef = ref()

const rules = {}

const form = ref({
  title: '',
  category_id: '',
  articleUUID: '',
})

const editorRef = ref()


interface Tag {
  id: number | string;
  name: string;
}

/*标签*/
const selectedTags = ref<string[]>([])
const tagList = ref<Tag[]>([])
const tagOptions = computed(() => {
  return tagList.value.map(tag => ({label: tag.name, value: tag.name}))
})

/*获取标签*/
const getTags = async () => {
  const res = await getTagsList()
  if (res.code === HttpStatus.OK) {
    tagList.value = res.data.tag_list
  }
}

/*删除图片*/
const handleEditorImgDel = async (pos:any) => {
  try {
    const res = await deletePicture({path: pos[0]})
    if(res.code === HttpStatus.OK) {
      message.error(res.message)
    }
  } catch (error) {
    console.error('删除图片失败：', error);
  }
}

/*图片上传*/
const handleImageUpload = async (pos: any, file: File) => {
  const fileUrl = await useUploadImage(file, form.value.articleUUID)
  if (fileUrl) {
    editorRef.value.$img2Url(pos, fileUrl)
  }
}

// let html = reactive<any>(null)
//
// /*编辑区发送变化的回调*/
const change = (value: any, render: any) => {
  // html = render;
}

/**发布文章*/
const handlePublish = async (status: ArticleStatus) => {
  await formRef.value?.validate
  const {briefContent} = useMarkdownAbstract(content.value)
  const commonParams = {
    title: form.value.title,
    category_id: form.value.category_id,
    content: content.value,
    status,
    tagNames: [],
    /**裁减摘要内容到指定长度（默认长度：255）*/
    brief_content: briefContent.value.substring(0, 255),
  }

  const res = props.currentRow.type === 'edit'
      ? await updateArticle({...commonParams , id: props.currentRow.id})
      : await createArticle({...commonParams , articleUUID: form.value.articleUUID,})
  if (res.code === HttpStatus.OK) {
    message.success(res.message)
    emits('close')
  }
}

onMounted(async () => {
  if (props.currentRow.type === 'edit') {
    const res = await getArticleDetails({id: props.currentRow.id})
    if (res.code === HttpStatus.OK) {
      form.value.title = res.data.title
      form.value.category_id = res.data.category_id
      content.value = res.data.content
      selectedTags.value = res.data.tags.map((item: Tag) => item.name)
    }
  } else if(props.currentRow.type === 'add') {
    const { generateUUID } = useUUID();
    form.value.articleUUID = generateUUID();
  }
  await getTags()

})
</script>

<template>
  <div>
    <n-form
        ref="formRef"
        label-placement="top"
        :model="form"
        :rules="rules"
        size="small"
    >
      <div class="flex">
        <n-form-item label="标题" path="title" class="mr10 w100%">
          <n-input v-model:value="form.title" placeholder="请输入标题"/>
        </n-form-item>
        <n-form-item label="分类">
          <n-select
              w-130
              filterable
              placeholder="请选择"
              v-model:value="form.category_id"
              :options="props.currentRow.categoryOption"
          />
        </n-form-item>
      </div>

      <ClientOnly>
        <mavon-editor
            ref="editorRef"
            v-model="content"
            class="w-full h-730px"
            :toolbars="toolbarsConfig"
            @imgAdd="handleImageUpload"
            @imgDel="handleEditorImgDel"
            @change="change"
        />
      </ClientOnly>

      <n-form-item>
        <n-select
            v-model:value="selectedTags"
            filterable
            multiple
            tag
            placeholder="回车新增"
            :options="tagOptions"
            :show-arrow="false"
        />
      </n-form-item>

      <n-form-item>
        <n-button type="primary" @click="handleEditorImgDel(1)" class="mr10">
          <template #icon>
            <nuxt-img src="/svg/publish.svg" class="h15"></nuxt-img>
          </template>
          发布文章
        </n-button>
        <n-button strong type="tertiary" @click="handlePublish(ArticleStatus.DRAFT)" class="mr10">
          <template #icon>
            <n-icon>
              <SaveOutline/>
            </n-icon>
          </template>
          存为草稿
        </n-button>
        <n-button strong type="tertiary" @click="emits('close')">
          <template #icon>
            <n-icon>
              <ReturnDownBackOutline/>
            </n-icon>
          </template>
          返回
        </n-button>
      </n-form-item>
    </n-form>



  </div>
</template>

<style scoped lang="scss">
</style>