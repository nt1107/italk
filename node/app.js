const { router } = require('./config.js')
router.get('/get', async (ctx) => {
  ctx.body = '返回响应数据'
})
