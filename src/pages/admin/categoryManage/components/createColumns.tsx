import type {DataTableColumns} from "naive-ui";
import {NButton, NIcon} from "naive-ui";
import {useTimeFormat} from "~/composables/tools/useTimeFormat";
import {Pencil, TrashSharp} from "@vicons/ionicons5";
import {NuxtImg} from "#components";
import type {Row} from "~/pages/admin/categoryManage/index.vue";


type Methods = {
  handleCategory: (id: number | null, type: 'add' | 'edit') => void;
  handleDeleteCategory: (id?: number )=> void;
}

/**
 * @description: 创建表格列
 * @param methods
 */
export const createColumns = (
  {handleCategory, handleDeleteCategory}: Methods
): DataTableColumns<Row> => {
  const columnsConfig = [
    {
      type: 'selection',
      show: true,
      align: 'center',
      disabled(row: Row) {
        return row.alias === 'all' || row.alias === 'uncategorized'
      }
    },

    {
      title: '排序',
      key: 'sort',
      show: true,
      align: 'center',
    },

    {
      title: '分类图标',
      key: 'category_name',
      show: true,
      align: 'center',
      render(row: Row) {
        return <NuxtImg src={row.icon} class="h40" />
      }
    },

    {
      title: '分类名称',
      key: 'name',
      show: true,
      align: 'center'
    },

    {
      title: '分类名称',
      key: 'alias',
      show: true,
      align: 'center',
    },

    {
      title: 'Alias',
      key: 'alias',
      show: true,
      align: 'center',
    },

    {
      title: '文章数量',
      key: 'article_count',
      show: true,
      align: 'center',
    },

    {
      title: '创建时间',
      key: 'creation_time',
      show: true,
      align: 'center',
      render(row: Row) {
        return useTimeFormat(row.creation_time)
      }
    },

    {
      title: '修改时间',
      key: 'update_time',
      show: true,
      align: 'center',
      render(row: Row) {
        return useTimeFormat(row.update_time)
      }
    },

    {
      title: '操作',
      key: 'controls',
      show: true,
      align: 'center',
      render(row: Row) {
        return <>
          <NButton size="small" class="mr10" onClick={() => handleCategory(row.id, 'edit')}>
            <NIcon size="19">
              <Pencil/>
            </NIcon>
          </NButton>
          <NButton size="small" onClick={() => handleDeleteCategory(row.id)}>
            <NIcon size="19">
              <TrashSharp/>
            </NIcon>
          </NButton>
        </>
      }
    },

  ]
  return columnsConfig.filter(item => item.show) as DataTableColumns<Row>
}