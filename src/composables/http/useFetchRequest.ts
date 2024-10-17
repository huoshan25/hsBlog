import type { FetchResponse, SearchParameters } from 'ofetch'
import { HttpStatus } from "~/enums/httpStatus"
import { useStorage } from '@vueuse/core'
import { ErrorStatus } from "~/enums/ErrorStatus"
import { createDiscreteApi } from 'naive-ui'
import type { FetchApiFn, RefreshTokenResponse } from "~/composables/http/type"
import type {HttpRes} from "~/api/type";

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
  private pending: Promise<HttpRes<RefreshTokenResponse>> | null = null

  constructor() {
    this.fetch = $fetch.create({
      onRequest: this.onRequest.bind(this),
      onResponse: this.onResponse.bind(this),
      onResponseError: this.onResponseError.bind(this),
    })
  }

  private async onRequest({ options, request }: { options: any, request: any }) {
    options.params = paramsSerializer(options.params)
    const { apiBaseUrl } = useRuntimeConfig().public
    options.baseURL = apiBaseUrl as string

    const isRefreshTokenRequest = request === '/admin/user/refresh-token'

    if (isRefreshTokenRequest && this.refreshToken.value) {
      options.headers = new Headers(options.headers)
      options.headers.set('Authorization', `Bearer ${this.refreshToken.value}`)
    } else if (this.token.value) {
      options.headers = new Headers(options.headers)
      options.headers.set('Authorization', `Bearer ${this.token.value}`)
    }
  }

  /*返回响应结果*/
  private async onResponse({ request, response, options }: { request: Request, response: FetchResponse<any>, options: any }) {
    const data = response._data

    if (data.code === ErrorStatus.EXPIRE_TOKEN) {
      if (this.pending === null) {
        this.pending = this.handleTokenRefresh()
      }

      try {
        const refreshResult = await this.pending

        if (refreshResult.code === HttpStatus.OK) {
          this.token.value = refreshResult.data.token
          this.refreshToken.value = refreshResult.data.refresh_token

          // 继续请求原来的数据
          const newResponse: any = await this.fetch(request, {
            ...options,
            headers: { ...options.headers }
          })

          // 返回新的响应数据
          return newResponse._data
        } else {
          return message.error(`刷新令牌失败`)
        }
      } catch (error) {
        this.pending = null
        this.token.value = ''
        this.refreshToken.value = ''
        navigateTo('/blog')
        return Promise.reject(error)
      }
    }

    return data
  }

  /*错误响应*/
  private onResponseError({ response }: { response: FetchResponse<any> }) {
    const data = response._data

    if (data && typeof data.code === 'number' && typeof data.message === 'string') {
      // 服务器的结构化错误响应
      if (data.code !== HttpStatus.OK && data.code !== HttpStatus.CREATED) {
        message.error(`${data.code} - ${data.message}`)
      }
    } else {
      message.error(`${response.status} - ${response.statusText || '未知错误'}`)
    }
  }

  /*处理token刷新*/
  private handleTokenRefresh(): Promise<HttpRes<RefreshTokenResponse>> {
    return this.fetch<HttpRes<RefreshTokenResponse>>('/user/refresh-token', {
      method: 'POST',
    }).finally(() => {
      this.pending = null
    })
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