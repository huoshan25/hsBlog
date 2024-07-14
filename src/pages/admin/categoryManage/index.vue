<script setup lang="ts">
import {Pencil, TrashSharp, InformationCircleOutline, HelpCircleOutline, ArchiveOutline } from "@vicons/ionicons5";

definePageMeta({
  layout: 'admin'
})

interface Row {
  sort: number,
  id: number,
  categoryIcon: string;
  classificationName: string;
  alias: string;
  creationTime: string;
  updateTime: string;
}

const rows = ref<Row[]>([
  {sort: 1, id: 1, categoryIcon: '/svg/nest.svg', classificationName: 'nest', alias: 'nest', creationTime: '', updateTime: ''},
  {sort: 2, id: 2, categoryIcon: '/svg/nuxt.svg', classificationName: 'nuxt', alias: 'ssr', creationTime: '', updateTime: ''},
]);

/**删除分类*/
const deleteCategory = (id: number | null) => {
  let params = {}
  if(id) {
    params = id
  } else {
    params = selectedData.value.map((item: Row) => item.id).join(',')
  }
}

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

/**编辑分类*/
const categoryEditing = (id: number) => {

}

/**选中数量*/
const selectedQuantity = computed(() => {
  return selectedRows.value.filter(Boolean).length;
});

/**新增分类*/
const handleCategory = (id: number | null, type: string) => {
  categoryVisibility.value = !categoryVisibility.value
  categoryDialogTitle.value = type === 'edit' ? '编辑分类' : '新增分类'
}

/**分类弹窗*/
const categoryVisibility = ref(false)

const categoryDialogTitle = ref('')

const form = ref({
  sort: 0,
  categoryIcon: '',
  classificationName: '',
  alias: '',
})

const rules = {
  sort: {
    required: true,
    message: '请输入排序',
    trigger: 'blur'
  },
  categoryIcon: {
    required: true,
    message: '请上传分类图标',
    trigger: 'blur'
  },
  classificationName: {
    required: true,
    message: '请输入分类名称',
    trigger: 'blur',
  },
  alias: {
    required: true,
    message: '请输入Alias',
    trigger: 'blur',
  }
}

/**不允许排序的值前后有空格*/
const noSideSpace =  (value: string) => !value.startsWith(' ') && !value.endsWith(' ')

const formRef = ref()

const message = useMessage()
/**提交*/
const handleSubmit = async () => {
  await formRef.value?.validate()
}
</script>

<template>
  <div class="form-container">
  </div>

  <div m-b-15 flex >
    <n-button :disabled="selectedQuantity == 0" size="small" m-r-15 @click="deleteCategory(null)">{{selectedQuantity > 0 ? `删除 ${selectedQuantity} 项` : '删除'}}</n-button>
    <n-button size="small" @click="handleCategory(null, 'add')" dashed>
      <template #icon>
        <nuxt-img h-15 src="/svg/plusSign.svg"/>
      </template>
      新增分类
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
      <th w-52>排序</th>
      <th>分类图标</th>
      <th>分类名称</th>
      <th>Alias</th>
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
      <td>{{row.sort}}</td>
      <td>
        <nuxt-img :src="row.categoryIcon" h-40/>
      </td>
      <td>{{ row.classificationName }}</td>
      <td>{{ row.alias }}</td>
      <td>{{ row.creationTime }}</td>
      <td>{{ row.updateTime }}</td>
      <td>
        <n-button m-r-5 @click="handleCategory(row.id, 'edit')">
          <n-icon size="19">
            <Pencil />
          </n-icon>
        </n-button>
        <n-button @click="deleteCategory(row.id)">
          <n-icon size="19">
            <TrashSharp />
          </n-icon>
        </n-button>
      </td>
    </tr>
    </tbody>
  </n-table>

  <n-modal v-model:show="categoryVisibility">
    <n-card
        w-500
        h-600
        :title="categoryDialogTitle"
        :segmented="{
          content: true,
        }"
    >
      <n-form
          ref="formRef"
          :model="form"
          :rules="rules"
          size="small"
          require-mark-placement="left"
      >
        <n-form-item label="分类图标" path="categoryIcon">
          <div style="width: 100%">
            <div flex items-center color-gray m-b-6>
              <n-icon m-r-3><InformationCircleOutline/></n-icon>
              你可以再
              <nuxt-link class="mx-[4px]" to="https://www.iconfont.cn" color-blue target="_blank">阿里巴巴矢量图标库</nuxt-link>
              搜索和下载喜欢的图标。
            </div>
            <n-upload
                multiple
                w-200
                h-110
                directory-dnd
                action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
            >
              <n-upload-dragger>
                <div>
                  <n-icon size="28">
                    <ArchiveOutline/>
                  </n-icon>
                </div>
                <n-text text-size-10>
                  点击或者拖动文件到该区域
                </n-text>
              </n-upload-dragger>
            </n-upload>
          </div>
        </n-form-item>
        <n-form-item label="分类名称" path="classificationName">
          <n-input v-model:value="form.classificationName" placeholder="请输入名称"/>
        </n-form-item>
        <n-form-item path="alias">
          <template #label>
            <div flex items-center>
              分类名称
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon color-gray m-l-3><HelpCircleOutline/></n-icon>
                </template>
                分类别名，如：NuxtJs，将作为URL的一部分
              </n-tooltip>
            </div>
          </template>
          <n-input v-model:value="form.alias" placeholder="请输入Alias"/>
        </n-form-item>
        <n-form-item label="排序" path="classificationName">
          <n-input-number v-model:value="form.sort" w-140 :allow-input="noSideSpace" placeholder="请输入排序"/>
        </n-form-item>
      </n-form>
      <template #action>
        <div style="text-align: right">
          <n-button @click="categoryVisibility = false">取消</n-button>
          <n-button type="primary" @click="handleSubmit">提交</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped lang="scss">
th {
  text-align: center;
}
td {
  text-align: center;
}
</style>