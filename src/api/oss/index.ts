import type {HttpRes} from "~/api/type";
import {useRuntimeConfig} from "#app";

export interface TemporarySignatureResponse {
  accessKeyId: string;
  accessKeySecret: string;
  securityToken: string;
  bucket: string;
  region: string;
}

const { apiBaseUrl } = useRuntimeConfig().public

/**
 * 上传文件 - 数据流
 * @param file
 */
export const fileUploadUrl = `${apiBaseUrl}oss/ali/article-img`