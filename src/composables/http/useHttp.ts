import type { FetchError, FetchResponse, SearchParameters } from 'ofetch'
import { hash } from 'ohash'
import type { AsyncData, UseFetchOptions } from '#app'
import type { KeysOf, PickFrom } from '#app/composables/asyncData'
import type {Ref} from "vue";

type UrlType = string | Request | Ref<string | Request> | (() => string | Request)

export type HttpOption<T> = UseFetchOptions<ResOptions<T>, T, KeysOf<T>, T>
interface ResOptions<T> {
  data?: T
  code: number
  success: boolean
  detail?: string
}

const handleError = <T>(
  _method: string | undefined,
  _response: FetchResponse<ResOptions<T>> & FetchResponse<ResponseType>,
  ) => {
  // 处理错误
}

const checkRef = (obj: Record<string, any>) => {
  return Object.keys(obj).some(key => isRef(obj[key]))
}

const fetch = <T>(url: UrlType, opts: HttpOption<T>) => {
  // 选中“密钥”选项
  const { key, params, watch } = opts
  if (!key && ((params && checkRef(params)) || (watch && checkRef(watch))))
    console.error('\x1B[31m%s\x1B[0m %s', '[useHttp] [error]', '当“params”或“watch”具有 ref 属性时，需要“key”选项，请为当前请求设置唯一键。')

  const options = opts as UseFetchOptions<ResOptions<T>>
  options.lazy = options.lazy ?? true

  const { apiBaseUrl } = useRuntimeConfig().public

  return useFetch<ResOptions<T>>(url, {
    // 请求拦截
    onRequest({ options }) {
      // 设置基本网址
      options.baseURL = apiBaseUrl as string
      // 设置请求标头
      const { $i18n } = useNuxtApp()
      // @ts-ignore
      const locale = $i18n.locale.value
      options.headers = new Headers(options.headers)
      options.headers.set('Content-Language', locale)
    },

    // 响应拦截
    onResponse(_context) {
      //处理响应
    },

    // 错误拦截
    onResponseError({ response, options: { method } }) {
      handleError<T>(method, response)
    },

    // 设置缓存键
    key: key ?? hash(['api-fetch', url, JSON.stringify(options)]),
    // 合并选项
    ...options,
  }) as AsyncData<PickFrom<T, KeysOf<T>>, FetchError<ResOptions<T>> | null>
}

export const useHttp = {
  get: <T>(url: UrlType, params?: SearchParameters, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: 'get', params, ...option })
  },

  post: <T>(url: UrlType, body?: RequestInit['body'] | Record<string, any>, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: 'post', body, ...option })
  },

  put: <T>(url: UrlType, body?: RequestInit['body'] | Record<string, any>, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: 'put', body, ...option })
  },

  delete: <T>(url: UrlType, body?: RequestInit['body'] | Record<string, any>, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: 'delete', body, ...option })
  },
}