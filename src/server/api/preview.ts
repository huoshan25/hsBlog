export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url) {
    throw new Error('URL是必需的')
  }

  const response = await fetch(url, {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive'
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP错误! 状态: ${response.status}`)
  }

  return response.text()
})