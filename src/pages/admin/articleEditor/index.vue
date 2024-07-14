<script setup lang="ts">
import ArticleEditor from "~/components/admin/articleEditor.vue";
import {Search} from '@vicons/ionicons5'
import {ArticleStatus} from "~/api/article/type";

definePageMeta({
  layout: 'admin'
})

/**是否新增或编辑文章*/
const articleEditorVisibility = ref(false)

const form = ref({
  id: '',
  title: '',
  category: null,
  status: null,
})

const rules = {}

const handleQuery = () => {

}

/**分类选项*/
const categoryOption = ref([
  {
    label: '我是分类1',
    value: '1'
  },
  {
    label: '我是2分类1',
    value: '122'
  }
])

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
  category: string;
  title: string;
}

const rows = ref<Row[]>([
  {id: 1, status: 1, category: '前端', title: '前端新一代框架'},
  {id: 2, status: 2, category: '后端', title: '后端新一代框架'},
  {id: 3, status: 3, category: '运维', title: 'k8s'},
  // 添加更多行数据
]);

/**存储每一行的选择状态*/
const selectedRows = ref<any>(rows.value.map(() => false));

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
const articleDeletion = () => {
  const params = {
    ids: selectedData.value.map((item: Row) => item.id).join(',')
  }
  console.log(params,'选中删除的ids')
}

/**新增文章*/
const newArticle = () => {
  articleEditorVisibility.value = true
  editorType.value = 'add'
}

/**选中数量*/
const selectedQuantity = computed(() => {
  return selectedRows.value.filter(Boolean).length;
});

/**编辑状态*/
const editorType = ref<string>('')
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
          :rules="rules"
          size="small"
      >
        <div class="form-row">
          <n-form-item label="文章id" path="id">
            <n-input v-model:value="form.id" placeholder="请输入文章id" style="width: 120px"/>
          </n-form-item>
          <n-form-item label="标题" path="title">
            <n-input v-model:value="form.title" placeholder="请输入标题"/>
          </n-form-item>
          <n-form-item label="分类" path="category">
            <n-select
                w-130
                filterable
                placeholder="请选择"
                v-model:value="form.category"
                :options="categoryOption"
                clearable
            />
          </n-form-item>
          <n-form-item label="文章状态" path="status">
            <n-select
                w-100
                v-model:value="form.status"
                :options="statusOption"
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

    <div m-b-15 flex >
      <n-button :disabled="selectedQuantity == 0" size="small" m-r-15 @click="articleDeletion">{{selectedQuantity > 0 ? `删除 ${selectedQuantity} 项` : '删除'}}</n-button>
      <n-button size="small" @click="newArticle" dashed>
        <template #icon>
          <nuxt-img h-15 src="/svg/plusSign.svg"/>
        </template>
        新增文章
      </n-button>
    </div>

    <n-table :bordered="false">
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
        <th >分类</th>
        <th>标题</th>
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
        <td>{{ row.category }}</td>
        <td>{{ row.title }}</td>
      </tr>
      </tbody>
    </n-table>
  </div>

  <!-- 新增/编辑文章 -->
  <article-editor
      v-show="articleEditorVisibility"
      :visible="articleEditorVisibility"
      :type="editorType"
      @close="() => articleEditorVisibility = false"
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