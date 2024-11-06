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
import {toolbarsConfig} from "~/pages/admin/articleEditor/detail/components/config/toolbarsConfig";
import {computed} from "vue";
import {pictureUpload} from "~/api/admin/oss";
import SpeechSynthesis from "~/pages/admin/articleEditor/components/textToSpeech/index.vue";

const props = defineProps(['currentRow']);
const message = useMessage()
const emits = defineEmits(['close']);

/**markdown内容*/
const content = ref<string>('')

const formRef = ref()

const rules = {
  title: {required: true, message: '请输入文章标题', trigger: 'blur'},
  description: {required: true, message: '请输入文章描述', trigger: 'blur'},
  category_id: {required: true, message: '请选择文章分类', trigger: 'blur'},
}

const form = ref({
  title: '',
  category_id: '',
  articleUUID: '',
  description: '',
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

const aiPodcastShow = ref(false)

/*获取标签*/
const getTags = async () => {
  const res = await getTagsList()
  if (res.code === HttpStatus.OK) {
    tagList.value = res.data.tag_list
  }
}

/*删除图片*/
const handleEditorImgDel = async (pos: any) => {
  const res = await deletePicture({path: pos[0]})
  if (res.code === HttpStatus.OK) {
    message.success(res.message)
  }
}

/*图片上传*/
const handleImageUpload = async (pos: any, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('articleUUID', form.value.articleUUID)

  const res = await pictureUpload(formData)
  if (res.code === HttpStatus.CREATED) {
    message.success(res.message)
    if (res.data.fileUrl) {
      editorRef.value.$img2Url(pos, res.data.fileUrl)
    }
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
  if (!content.value) return message.warning('未填写文章内容')

  await formRef.value?.validate
  const commonParams = {
    title: form.value.title,
    category_id: form.value.category_id,
    content: content.value,
    status,
    tagNames: selectedTags.value,
    description: form.value.description,
  }

  const res = props.currentRow.type === 'edit'
      ? await updateArticle({...commonParams, id: props.currentRow.id})
      : await createArticle({...commonParams, articleUUID: form.value.articleUUID,})
  if (res.code === HttpStatus.OK || res.code === HttpStatus.CREATED) {
    message.success(res.message)
    emits('close')
  }
}

const handleAiPodcast = async () => {
  aiPodcastShow.value = true
}

const speech = ref<SpeechType | null>(null)

interface SpeechType {
  saveContent: () => Promise<void>
}

const onPositiveClick = async () => {
  await speech.value?.saveContent()
  aiPodcastShow.value = false
}

const onNegativeClick = async () => {
  aiPodcastShow.value = false
}

onMounted(async () => {
  if (props.currentRow.type === 'edit') {
    const res = await getArticleDetails({id: props.currentRow.id})
    if (res.code === HttpStatus.OK) {
      form.value.title = res.data.title
      form.value.category_id = res.data.category_id
      form.value.description = res.data.description
      content.value = res.data.content
      selectedTags.value = res.data.tags.map((item: Tag) => item.name)
      form.value.articleUUID = props.currentRow.id
    }
  } else if (props.currentRow.type === 'add') {
    const {generateUUID} = useUUID();
    form.value.articleUUID = generateUUID();
    form.value.category_id = props.currentRow.categoryOption?.at(-1).value;
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
          <n-input v-model:value="form.title" placeholder="请输入标题" maxlength="50" show-count clearable/>
        </n-form-item>
        <n-form-item label="分类">
          <n-select
              w-130
              filterable
              placeholder="请选择"
              v-model:value="form.category_id"
              :options="props.currentRow.categoryOption?.slice(1)"
          />
        </n-form-item>
      </div>
      <n-form-item label="文章描述" path="description">
        <n-input v-model:value="form.description" placeholder="请输入文章描述" maxlength="100" show-count clearable/>
      </n-form-item>

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

      <n-form-item v-if="props.currentRow.type === 'edit'">
        <n-button @click="handleAiPodcast()" class="aiPodcast">
          AI播客
        </n-button>
      </n-form-item>

      <n-form-item>
        <n-button type="primary" @click="handlePublish(ArticleStatus.PUBLISH)" class="mr10">
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

    <n-modal
        v-model:show="aiPodcastShow"
        width="600px"
        height="600px"
        preset="dialog"
        :mask-closable="false"
        @positive-click="onPositiveClick"
        @negative-click="onNegativeClick"
        title="AI播客"
        positive-text="保存"
        negative-text="取消">
      <speech-synthesis
          ref="speech"
          :markdown="content"
          :articleId="props.currentRow.id"
      />
    </n-modal>


  </div>
</template>

<style scoped lang="scss">
.aiPodcast {
  background: radial-gradient(495.98% 195.09% at 144.79% 10.71%, #ff8a01 0, #b051b9 22.37%, #672bff 45.54%, #06f 99.99%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>