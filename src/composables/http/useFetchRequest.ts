
import type { FetchResponse, SearchParameters } from 'ofetch'
import {HttpStatus} from "~/enums/httpStatus";

export interface ResOptions<T> {
  data: T
  code: number
  message: string
  success: boolean
}

// get方法传递数组形式参数
const paramsSerializer = (params?: SearchParameters) => {
  if (!params)
    return

  // const query = useCloneDeep(params)
  const query = params
  Object.entries(query).forEach(([key, val]) => {
    if (typeof val === 'object' && Array.isArray(val) && val !== null) {
      query[`${key}[]`] = toRaw(val).map((v: any) => JSON.stringify(v))
      delete query[key]
    }
  })
  return query
}

const fetch = $fetch.create({
  // 请求拦截器
  onRequest({ options }) {
    // get方法传递数组形式参数
    // options.params = paramsSerializer(options.params)
    // 添加baseURL,nuxt3环境变量要从useRuntimeConfig里面取
    const { apiBaseUrl } = useRuntimeConfig().public;
    options.baseURL = apiBaseUrl as string
    // 添加请求头,没登录不携带token
    // const userStore = useUserStore()
    // if (!userStore.isLogin)
      // return
    // options.headers = new Headers(options.headers)
    // options.headers.set('Authorization', `Bearer ${1}`)
  },
  // 响应拦截
  onResponse({ response }) {
    // if (response.headers.get('content-disposition') && response.status === 200)
    //   return response
    // // 在这里判断错误
    // if (response._data.code === HttpStatus.INTERNAL_SERVER_ERROR) {
      // handleError(response)
      // return Promise.reject(response._data)

    // }
    // 成功返回
    return response._data
  },
  // 错误处理
  onResponseError({ response }) {
    // handleError(response)
    // return Promise.reject(response?._data ?? null)
  },
})

// 自动导出
export const fetchRequest = {
  get: <T>(url: string, params?: SearchParameters) => {
    return fetch<T>(url, { method: 'get', params })
  },

  post: <T>(url: string, body?: SearchParameters) => {
    return fetch<T>(url, { method: 'post', body })
  },

  put: <T>(url: string, body?: SearchParameters) => {
    return fetch<T>(url, { method: 'put', body })
  },

  delete: <T>(url: string, body?: SearchParameters) => {
    return fetch<T>(url, { method: 'delete', body })
  },
}
