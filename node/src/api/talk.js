const { router } = require('../../config.js')
const koaMulter = require('koa-multer')
const { ttsClient } = require('../tts/index.js')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')

let fs = require('fs')

const storage = koaMulter.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // 指定文件夹路径
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop()
    cb(null, file.fieldname + '-' + Date.now() + '.' + ext)
  }
})
const upload = koaMulter({ storage: storage })

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

  router.post('/tts', upload.single('audio'), async (ctx) => {
    const file = ctx.req.file
    const webmFilePath = path.join('uploads', file.filename)
    const wavFilePath = path.join(`${webmFilePath.replace('.webm', '')}.wav`)
    await new Promise((resolve, reject) => {
      ffmpeg(webmFilePath)
        .output(wavFilePath)
        .format('wav')
        .outputOptions('-sample_fmt s16')
        .outputOptions('-ar 16000')
        .outputOptions('-ac 1')
        .on('end', async () => {
          let voice = fs.readFileSync(wavFilePath)
          let voiceBase64 = Buffer.from(voice)
          const res = await ttsClient.recognize(voiceBase64, 'wav', 16000, {
            dev_pid: 1737
          })
          // .then(
          //   (result) => {
          //     console.log(
          //       '语音识别本地音频文件结果: ' + JSON.stringify(result)
          //     )
          //   },
          //   (err) => {
          //     console.log('err', err)
          //   }
          // )
          ctx.body = {
            message: '',
            code: 200,
            data: {
              content: Array.isArray(res.result) ? res.result[0] : res.result
              // id
            }
          }
          resolve()
        })
        .on('error', (err) => {
          console.error('Error during conversion:', err)
          reject(err)
        })
        .run()
    })
  })
}
