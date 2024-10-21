import { createDiscreteApi } from 'naive-ui'

const { message } = createDiscreteApi(['message'])

export function handleApiError(error: any) {
  let errorMessage = '未知错误'

  if (error.response) {
    // 服务器返回了错误响应
    const { status, data } = error.response
    errorMessage = `${status} - ${data.message || '服务器错误'}`
  } else if (error.request) {
    // 请求已经发出，但没有收到响应
    errorMessage = '无法连接到服务器，请检查网络'
  } else {
    // 设置请求时发生了错误
    errorMessage = error.message || '请求错误'
  }

  if (process.client) {
    message.error(errorMessage)
  }

  return { error: errorMessage }
}