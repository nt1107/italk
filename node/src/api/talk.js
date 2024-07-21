const { router } = require('../../config.js')
let chatFunction
;(async () => {
  const module = await import('../llm/chat.mjs')
  chatFunction = module
})()

module.exports = () => {
  router.post('/chat_chat', async (ctx) => {
    const input = ctx.request.body.input
    const returnId = ctx.request.body.id
    const res = await chatFunction.chat_chat(input, returnId)
    const id = 1
    ctx.body = {
      message: '上传成功',
      code: 200,
      data: {
        content: res,
        id
      }
    }
  })
  router.post('/chat_translate', async (ctx) => {
    const input = ctx.request.body.input
    const returnId = ctx.request.body.id
    const res = await chatFunction.chat_translate(input, returnId)
    const id = 1
    ctx.body = {
      message: '上传成功',
      code: 200,
      data: {
        content: res,
        id
      }
    }
  })
}
