/** /src/mocks/server.ts */
import { setupServer } from 'msw/node'
import { type HttpHandler, HttpResponse, http } from 'msw'

const prefix = 'https://test.mock'
let num = 0

export const handlers: HttpHandler[] = [
  http.get(`${prefix}/useFetch/default`, () => {
    return HttpResponse.json({
      msg: 'hey',
    })
  }),

  http.post(`${prefix}/useFetch/hooks`, async (ctx) => {
    return HttpResponse.json({
      msg: 'hey',
      reqBody: (await ctx.request.json() as any)?.name,
    })
  }),

  http.get(`${prefix}/useFetch/value`, async () => {
    num++
    return HttpResponse.json({
      num,
    })
  }),
]

export const server = setupServer(...handlers)
