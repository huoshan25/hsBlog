<script setup lang="ts">
import {InformationCircleOutline, HelpCircleOutline, ArchiveOutline} from "@vicons/ionicons5";
import {HttpStatus} from "~/enums/httpStatus";
import {deleteCategory, getAllCategories} from "~/api/categories";
import {createColumns} from "~/pages/admin/categoryManage/components/createColumns";

definePageMeta({
  layout: 'admin',
})
const message = useMessage()
const dialog = useDialog()

export interface Row {
  sort: number,
  id: number,
  icon: string;
  name: string;
  alias: string;
  article_count: string;
  creation_time: string;
  update_time: string;
  isEdit: boolean;
}

const total = ref(0)

/**分页*/
const pagination = {
  prefix() {
    return `共 ${total.value} 条`
  },
}
/**选中分类id*/
const checkedRowKeysRef = ref<number[]>([])
/**选中数据过滤*/
const rowKey = (row: Row) => row.id
const handleCheck = (rowKeys: (string | number)[]) => {
  checkedRowKeysRef.value = rowKeys as number[]
}

/**表格数据*/
const tableData = ref<Row[]>([]);

/**删除分类*/
const handleDeleteCategory = async (id?: number) => {
  dialog.warning({
    title: '确定要永久删除吗？',
    content: () => h('div', {style: {color: '#f0a020'}}, '分类将被永久删除，删除后不可恢复！'),
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const ids = id ? [id] : checkedRowKeysRef.value
      const res = await deleteCategory(ids)
      if (res.code === HttpStatus.OK) {
        message.success('删除成功！')
        await getList()
      }
    }
  })
}

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
  icon: '',
  name: '',
  alias: '',
})

const loading = ref(false)

const rules = {
  sort: {
    required: true,
    message: '请输入排序',
    trigger: 'blur'
  },
  icon: {
    required: true,
    message: '请上传分类图标',
    trigger: 'blur'
  },
  name: {
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
const noSideSpace = (value: string) => !value.startsWith(' ') && !value.endsWith(' ')

const formRef = ref()

/**列表*/
const getList = async () => {
  loading.value = true
  const res = await getAllCategories()
  if (res.code === HttpStatus.OK) {
    tableData.value = res.data
    total.value = res.data.length
    loading.value = false
  }
}

/**提交*/
const handleSubmit = async () => {
  await formRef.value?.validate()
}

const columns = ref(createColumns(
    {
      handleCategory, handleDeleteCategory
    }
))
onMounted(async () => {
  await getList()
})

</script>

<template>
  <div class="form-container">
  </div>

  <div m-b-15 flex>
    <n-button @click="handleDeleteCategory()" :disabled="checkedRowKeysRef.length == 0" size="small" m-r-15>
      {{ checkedRowKeysRef.length > 0 ? `删除 ${checkedRowKeysRef.length} 项` : '删除' }}
    </n-button>
    <n-button size="small" @click="handleCategory(null, 'add')" dashed>
      <template #icon>
        <nuxt-img h-15 src="/svg/plusSign.svg"/>
      </template>
      新增分类
    </n-button>
  </div>

  <n-spin :show="loading">
    <template #description>
      生活偶尔需要放慢下脚步...
    </template>
    <n-data-table
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :row-key="rowKey"
        @update:checked-row-keys="handleCheck"
        :bordered="false"
        size="medium"
    />
  </n-spin>

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
              <n-icon m-r-3>
                <InformationCircleOutline/>
              </n-icon>
              你可以再
              <nuxt-link class="mx-[4px]" to="https://www.iconfont.cn" color-blue target="_blank">阿里巴巴矢量图标库
              </nuxt-link>
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
        <n-form-item label="分类名称" path="name">
          <n-input v-model:value="form.name" placeholder="请输入名称"/>
        </n-form-item>
        <n-form-item path="alias">
          <template #label>
            <div flex items-center>
              分类名称
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon color-gray m-l-3>
                    <HelpCircleOutline/>
                  </n-icon>
                </template>
                分类别名，如：NuxtJs，将作为URL的一部分
              </n-tooltip>
            </div>
          </template>
          <n-input v-model:value="form.alias" placeholder="请输入Alias"/>
        </n-form-item>
        <n-form-item label="排序" path="sort">
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