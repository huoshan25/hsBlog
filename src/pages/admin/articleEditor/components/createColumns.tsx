import type {DataTableColumns} from "naive-ui";
import {NButton, NIcon, NTag} from "naive-ui";
import {ArticleStatus} from "~/api/article/type";
import {useTimeFormat} from "~/composables/tools/useTimeFormat";
import {CloseSharp, Pencil, Reload, TrashSharp} from "@vicons/ionicons5";
import type {Row} from "~/pages/admin/articleEditor/index.vue";


type StatusMap = {
  [key in ArticleStatus]: { type: 'info' | 'warning' | 'error', text: string };
}
/**文章状态映射*/
const statusMap: StatusMap = {
  [ArticleStatus.PUBLISH]: { type: 'info', text: '发布' },
  [ArticleStatus.DRAFT]: { type: 'warning', text: '草稿' },
  [ArticleStatus.DELETE]: { type: 'error', text: '删除' }
};

type Methods = {
  handlePositiveClick: (id: number, status: ArticleStatus) => void;
  handleDeleteArticle: (id: number) => void;
  handleRecover: (id: number[]) => void;
  newArticle: (type: 'add' | 'edit', row?: Row) => void;
}

/**
 * @description: 创建表格列
 * @param methods
 */
export const createColumns = (
  {handleDeleteArticle, handlePositiveClick, handleRecover, newArticle}: Methods
): DataTableColumns<Row> => {
  const columnsConfig = [
    {
      type: 'selection',
      show: true,
      align: 'center'
    },

    {
      title: '状态',
      key: 'status',
      show: true,
      align: 'center',
      render(row: Row) {
        const statusInfo = statusMap[row.status as ArticleStatus];
        return statusInfo ? <NTag type={statusInfo.type}>{statusInfo.text}</NTag> : <div>错误状态值</div>;
      }
    },

    {
      title: '分类',
      key: 'category_name',
      show: true,
      align: 'center'
    },

    {
      title: '标题',
      key: 'title',
      show: true,
      align: 'center'
    },

    {
      title: '创建时间',
      key: 'create_time',
      show: true,
      align: 'center',
      render(row: Row) {
        return useTimeFormat(row.create_time)
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
        /**是否删除*/
        const isDelete = row.status === ArticleStatus.DELETE;
        return <>
          <NButton size="small" class="mr10" onClick={() => {
            if (isDelete) {
              handleRecover([row.id]);
            } else {
              newArticle('edit', row);
            }
          }}>
            <NIcon size="19">
              {isDelete? <Reload/> : <Pencil/>}
            </NIcon>
          </NButton>
          <NButton size="small" onClick={() => {
            if (isDelete) {
              handleDeleteArticle(row.id);
            } else {
              handlePositiveClick(row.id, ArticleStatus.DELETE);
            }
          }}>
            <NIcon size="19">
              {isDelete ? <TrashSharp/> : <CloseSharp/>}
            </NIcon>
          </NButton>
        </>
      }
    },

  ]
  return columnsConfig.filter(item => item.show) as DataTableColumns<Row>
}