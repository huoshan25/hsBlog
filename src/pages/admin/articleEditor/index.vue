<script setup lang="ts">
import ArticleEditor from "~/components/admin/articleEditor.vue";
import {Pencil, Search, TrashSharp, CloseSharp, Reload} from '@vicons/ionicons5'
import {type ArticleReq, ArticleStatus} from "~/api/article/type";
import {deleteArticle, editArticleStatus, getArticle} from "~/api/article";
import {getAllCategories} from "~/api/categories";
import {HttpStatus} from "~/enums/httpStatus";
import {useTimeFormat} from "~/composables/tools/useTimeFormat";

definePageMeta({
  layout: 'admin'
})
const message = useMessage()
const dialog = useDialog()
const {$popConfirm} = useNuxtApp();

/**是否新增或编辑文章*/
const articleEditorVisibility = ref(false)

const form = ref<ArticleReq>({
  page: 1,
  limit: 10,
  search: null,
  title: '',
  categoryId: null,
  status: null,
})

const handleQuery = () => {
  getList()
}

/**分类选项*/
const categoryOption = ref([])

/**文章状态选项*/
const statusOption = [
  {
    label: '草稿',
    value: ArticleStatus.DRAFT
  },
  {
    label: '发布',
    value: ArticleStatus.PUBLISH
  },
  {
    label: '删除',
    value: ArticleStatus.DELETE
  }
]

interface Row {
  id: number,
  status: number;
  category_name: string;
  title: string;
  create_time: string;
  update_time: string;
}

const loading = ref(false)
const rows = ref<Row[]>([]);

/**列表数据*/
const getList = async () => {
  loading.value = true
  const res = await getArticle()
  if (res.code === HttpStatus.OK) {
    rows.value = res.data.list
    loading.value = false
  }
}

/**存储每一行的选择状态*/
const selectedRows = ref<boolean[]>([false]);

/**选中的信息*/
const selectedData = ref()

/**是否全部选中*/
const isAllSelected = computed(() => selectedRows.value.every(Boolean));

/**部分选中*/
const indeterminate = computed(() => {
      return selectedRows.value.some(Boolean) && !selectedRows.value.every(Boolean)
    }
);

/**全选或取消全选操作*/
const handleCheckAll = (checked: boolean) => {
  selectedRows.value = rows.value.map(() => checked);
  updateSelectedInfo();
};

/**选择操作*/
const handleRowCheck = (index: number) => {
  updateSelectedInfo();
  return (checked: boolean) => {
    selectedRows.value[index] = checked;
  };
};

/**
 * 选中数据的回调
 * @return 选中的信息
 */
const updateSelectedInfo = () => {
  selectedData.value = rows.value.filter((_, index) => selectedRows.value[index])
};

/**删除文章*/
const handleDeleteModal = async () => {
  deleteModal.value = true
}

/**
 * 新增/编辑文章
 * @param type
 * @param row
 */
const newArticle = (type: string, row?: Row) => {
  articleEditorVisibility.value = true
  editorType.value = type
  editorList.value = {
    type,
    ...row,
    categoryOption: categoryOption.value,
  }
}

/**选中数量*/
const selectedQuantity = computed(() => {
  return selectedRows.value.filter(Boolean).length;
});

/**关闭编辑文章*/
const closeEditor = () => {
  articleEditorVisibility.value = false
  getList()
}

/**编辑状态*/
const editorType = ref<string>('')
/**文章数据*/
const editorList = ref()
/**提示弹窗*/
const deleteModal = ref(false)

/**确认删除*/
const handlePositiveClick = (id: number | null, status: ArticleStatus) => {
  dialog.warning({
    title: '确定要删除吗',
    content: '文章将变成已删除状态， 你可以随时恢复。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const ids = id ? [id] : selectedData.value.map((item: Row) => item.id)
      const res = await editArticleStatus({ids, status})
      if (res.code === HttpStatus.OK) {
        message.success(res.message)
        await getList()
      }
    },
  })

}

/**真实删除*/
const handleDeleteArticle = (id: number) => {
  dialog.warning({
    title: '确定要永久删除吗？',
    content: () =>  h('div', {style: {color: '#f0a020'}}, '文章将被永久删除，删除后不可恢复！'),
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await deleteArticle({id})
      if (res.code === HttpStatus.OK) {
        message.success(res.message)
        await getList()
      }
    },
  })
}

/**恢复文章*/
const handleRecover = (ids: number[]) =>{
  dialog.warning({
    title: '确定要恢复文章吗？',
    content: '文章将变成草稿状态，你需要手动进行发布',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await editArticleStatus({ids, status: ArticleStatus.DRAFT})
      if (res.code === HttpStatus.OK) {
        message.success(res.message)
        await getList()
      }
    },
  })
}

onMounted(async () => {
  const res = await getAllCategories()
  if (res.code === HttpStatus.OK) {
    categoryOption.value = res.data.map((item: { id: number, name: string }, index: number) => {
      return {
        value: item.id,
        label: item.name
      }
    })
  }
  await getList()
})

</script>

<template>
  <div v-show="!articleEditorVisibility">
    <div class="form-container">
      <n-form
          ref="formRef"
          inline
          label-placement="left"
          label-align="left"
          :model="form"
          size="small"
      >
        <div class="form-row">
          <n-form-item label="文章id">
            <n-input v-model:value="form.search" type="text" placeholder="请输入文章id/标题" clearable/>
          </n-form-item>
          <n-form-item label="标题">
            <n-input v-model:value="form.title" placeholder="请输入标题" clearable/>
          </n-form-item>
          <n-form-item label="分类">
            <n-select
                w-130
                filterable
                placeholder="请选择"
                v-model:value="form.categoryId"
                :options="categoryOption"
                clearable
            />
          </n-form-item>
          <n-form-item label="文章状态" path="status">
            <n-select
                w-100
                v-model:value="form.status"
                :options="statusOption"
                clearable
            />
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleQuery" m-b-10>
              <template #icon>
                <n-icon size="14">
                  <Search/>
                </n-icon>
              </template>
              查询
            </n-button>
          </n-form-item>
        </div>
      </n-form>
    </div>

    <div m-b-15 flex>
      <n-button :disabled="selectedQuantity == 0" size="small" mr-15
                @click="handlePositiveClick(null, ArticleStatus.DELETE)">
        {{ selectedQuantity > 0 ? `删除 ${selectedQuantity} 项` : '删除' }}
      </n-button>
      <n-button size="small" @click="newArticle('add')" dashed>
        <template #icon>
          <nuxt-img h-15 src="/svg/plusSign.svg"/>
        </template>
        新增文章
      </n-button>
    </div>

    <n-spin :show="loading">
      <template #description>
        我知道你很急，但是你先别急。
      </template>
      <n-table :bordered="false" size="medium">
        <thead>
        <tr>
          <th text-align-center w-35>
            <n-checkbox
                :indeterminate="indeterminate"
                :checked="isAllSelected"
                @update:checked="handleCheckAll"
            />
          </th>
          <th w-52>状态</th>
          <th>分类</th>
          <th>标题</th>
          <th>创建时间</th>
          <th>修改时间</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, index) in rows" :key="index">
          <td>
            <n-checkbox
                v-model:checked="selectedRows[index]"
                @update:checked="handleRowCheck(index)"
            />
          </td>
          <td>
            <n-tag v-if="row.status == ArticleStatus.PUBLISH" type="info">发布</n-tag>
            <n-tag v-else-if="row.status == ArticleStatus.DRAFT" type="warning">草稿</n-tag>
            <n-tag v-else-if="row.status == ArticleStatus.DELETE" type="error">删除</n-tag>
          </td>
          <td>{{ row.category_name }}</td>
          <td>{{ row.title }}</td>
          <td>{{ useTimeFormat(row.create_time) }}</td>
          <td>{{ useTimeFormat(row.update_time) }}</td>
          <td>
            <n-button v-if="row.status == ArticleStatus.DELETE" m-r-5 @click="handleRecover([row.id])">
              <n-icon size="19">
                <Reload/>
              </n-icon>
            </n-button>
            <n-button v-else m-r-5 @click="newArticle('edit', row)">
              <n-icon size="19">
                <Pencil/>
              </n-icon>
            </n-button>
            <n-button v-if="row.status == ArticleStatus.DELETE" @click="handleDeleteArticle(row.id)">
              <n-icon size="19">
                <TrashSharp/>
              </n-icon>
            </n-button>
            <n-button v-else @click="handlePositiveClick(row.id, ArticleStatus.DELETE)">
              <n-icon size="19">
                <CloseSharp/>
              </n-icon>
            </n-button>
          </td>
        </tr>
        </tbody>
      </n-table>
    </n-spin>
  </div>

  <!-- 新增/编辑文章 -->
  <article-editor
      v-if="articleEditorVisibility"
      :visible="articleEditorVisibility"
      :type="editorType"
      :currentRow="editorList"
      @close="closeEditor"
  />
</template>

<style scoped lang="scss">
.form-container {
  display: flex;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem; /* 控制表单项之间的间距 */
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
  }
}

th {
  text-align: center;
}

td {
  text-align: center;
}
</style>