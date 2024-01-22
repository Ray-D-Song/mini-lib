import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './server'

// 在每一次测试开始前开启服务器
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})
// 在每一次测试结束后关闭服务器
afterAll(() => {
  server.close()
})
// 在每一个用例结束后重置 handlers
afterEach(() => {
  server.resetHandlers()
})
