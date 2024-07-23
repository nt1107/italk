const { router } = require('../../config.js')
let chatFunction
;(async () => {
  try {
    const module = await import('../llm/chat.mjs')
    chatFunction = module
  } catch (err) {
    console.log('err', err)
  }
})()

module.exports = () => {
  router.post('/chat_chat', async (ctx) => {
    const input = ctx.request.body.input
    const returnId = ctx.request.body.id
    const res = await chatFunction.chat_chat(input, returnId)
    const id = 1
    ctx.body = {
      message: '',
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
      message: '',
      code: 200,
      data: {
        content: res,
        id
      }
    }
  })
}
