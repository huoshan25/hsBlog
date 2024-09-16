import type { FetchResponse, SearchParameters } from 'ofetch'
import { HttpStatus } from "~/enums/httpStatus"
import { useStorage } from '@vueuse/core'
import {ErrorStatus} from "~/enums/ErrorStatus";
import { createDiscreteApi } from 'naive-ui'
import type {FetchApiFn, RefreshTokenResponse} from "~/composables/http/type";

const { message } = createDiscreteApi(['message'])

/*参数序列化*/
const paramsSerializer = (params?: SearchParameters): SearchParameters | undefined => {
  if (!params) return undefined

  const query = { ...params }
  Object.entries(query).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      query[`${key}[]`] = val.map((v: any) => JSON.stringify(v))
      delete query[key]
    }
  })
  return query
}

/*API请求（开闭原则，依赖倒置原则）*/
class FetchApi implements FetchApiFn {
  private readonly fetch: typeof $fetch
  private token = useStorage('token', '')
  private refreshToken = useStorage('refreshToken', '')
  private isRefreshing: boolean = false
  private refreshSubscribers: Array<(token: string) => void> = []

  constructor() {
    this.fetch = $fetch.create({
      onRequest: this.onRequest.bind(this),
      onResponse: this.onResponse.bind(this),
      onResponseError: this.onResponseError.bind(this),
    })
  }

  private async onRequest({ options }: { options: any }) {
    options.params = paramsSerializer(options.params)
    const { apiBaseUrl } = useRuntimeConfig().public
    options.baseURL = apiBaseUrl as string

    if (this.token.value) {
      options.headers = new Headers(options.headers)
      options.headers.set('Authorization', `Bearer ${this.token.value}`)
    }
  }

  /*返回响应结果*/
  private async onResponse({ response }: { response: FetchResponse<any> }) {
    const data = response._data

    if(data.code === ErrorStatus.EXPIRE_TOKEN) {
      await this.handleTokenRefresh(response)
      return
    }

    if(data.code !== HttpStatus.OK) {
      message.error(`${data.code} - ${data.message}`)
      throw new Error(data.message)
    }

    if(data.code === HttpStatus.OK) {
      return data
    }
  }

  /*错误响应*/
  private onResponseError({ response }: { response: FetchResponse<any> }) {
    const data = response._data
    // 如果 data.code 存在且不等于200，说明这是一个被捕获的业务逻辑错误, 已经在 onResponse 中处理过了，所以这里不需要再显示错误消息
    if (data && data.code !== undefined && data.code !== HttpStatus.OK) {
      return
    }

    // 处理 HTTP 错误状态码
    message.error(`${response.status} - ${response.statusText || '未知错误'}`)
  }

  /*处理token刷新*/
  private async handleTokenRefresh(response: FetchResponse<any>) {
    if (!this.refreshToken.value) {
      // 处理没有刷新token的情况
      return Promise.reject(response._data)
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true

      try {
        const result = await this.fetch<RefreshTokenResponse>('/refresh-token', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.refreshToken.value}` }
        })

        if (result.code === HttpStatus.OK) {
          this.token.value = result.data.token
          this.refreshToken.value = result.data.refresh_token
          this.onRefreshSuccess(result.data.token)
        } else {
          this.onRefreshFailure(result)
        }
      } catch (error) {
        this.onRefreshFailure(error)
      } finally {
        this.isRefreshing = false
      }
    }
  }

  /*刷新token成功*/
  private onRefreshSuccess(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token))
    this.refreshSubscribers = []
  }

  /*刷新token失败*/
  private onRefreshFailure(error: any) {
    this.refreshSubscribers.forEach((callback) => callback(''))
    this.refreshSubscribers = []
    this.token.value = ''
    this.refreshToken.value = ''
    // 处理刷新失败的情况，清除所有token并重定向到登录页面
    navigateTo('/blog')
  }

  get<T>(url: string, params?: SearchParameters): Promise<T> {
    return this.fetch(url, { method: 'get', params })
  }

  post<T>(url: string, body?: SearchParameters): Promise<T> {
    return this.fetch(url, { method: 'post', body })
  }

  put<T>(url: string, body?: SearchParameters): Promise<T> {
    return this.fetch(url, { method: 'put', body })
  }

  delete<T>(url: string, body?: SearchParameters): Promise<T> {
    return this.fetch(url, { method: 'delete', body })
  }
}

/*创建并导出 API 客户端实例*/
export const fetchRequest = new FetchApi()