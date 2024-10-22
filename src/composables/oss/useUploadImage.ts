import { useRuntimeConfig } from '#app'
import {HttpStatus} from "~/enums/httpStatus";
import {createDiscreteApi} from "naive-ui";
import {fileUploadUrl} from "~/api/admin/oss";
import type {HttpRes} from "~/api/type";

interface UploadResponse {
  fileUrl: string;
}

const { message } = createDiscreteApi(['message'])

/**
 * mavon-editort图片上传
 * @param file 图片
 * @param articleUUID 文章id | UUID
 */
export const useUploadImage = async (file: File, articleUUID: string,): Promise<string | null> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('articleUUID', articleUUID)

  try {
    const res = await $fetch<HttpRes<UploadResponse>>(fileUploadUrl, {
      method: 'POST',
      body: formData,
    })

    if (res.code === HttpStatus.CREATED) {
      message.success(res.message)
      return res.data.fileUrl
    } else {
      message.error(res.message)
      return null
    }
  } catch (error) {
    message.error(`上传失败: ${error}`)
    return null
  }
}