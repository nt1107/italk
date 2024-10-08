const { router } = require('../../config.js')
const koaMulter = require('koa-multer')
const { ttsClient } = require('../tts/index.js')
// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const { Readable } = require('stream')
const ffmpegPath = require('child_process')
  .execSync('which ffmpeg')
  .toString()
  .trim()
ffmpeg.setFfmpegPath(ffmpegPath)

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
  // voice to text
  router.post('/tts', upload.single('audio'), async (ctx) => {
    const file = ctx.req.file
    const webmFilePath = path.join('uploads', file.filename)
    const ext = ctx.req.body.ext ? ctx.req.body.ext : 'webm'
    console.log(111, ext, new Date().toLocaleString())
    const wavFilePath = path.join(`${webmFilePath.replace('.' + ext, '')}.wav`)
    console.log(112, wavFilePath)
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
          console.log(113)

          try {
            const res = await ttsClient.recognize(voiceBase64, 'wav', 16000, {
              dev_pid: 1737
            })
            console.log(114, res)
            ctx.body = {
              message: '',
              code: 200,
              data: {
                content: Array.isArray(res.result) ? res.result[0] : res.result
                // id
              }
            }
            resolve()
          } catch (err) {
            console.log('err-', err)
          }
        })
        .on('error', (err) => {
          console.error('Error during conversion:', err)
          reject(err)
        })
        .run()
    })
  })
  // text to voice
  router.post('/tta', async (ctx) => {
    const input = ctx.request.body.input
    const returnId = ctx.request.body.id
    const config = ctx.request.body.config
    try {
      const res = await ttsClient.text2audio(input, config)
      ctx.set('Content-Type', 'audio/mpeg')
      ctx.set('Content-Disposition', 'attachment; filename=tts.mpVoice.mp3')
      ctx.body = res.data
    } catch (err) {
      console.log('err', err)
    }
  })
  router.get('/getGreeting', async (ctx) => {
    const type = ctx.request.query.type
    let returnStr = ''
    switch (type) {
      case 'chat':
        // returnStr = 'I am your conversational partner，Xiao Shi'
        returnStr = 'translate by chat'
        break
      case 'translate':
        // returnStr = 'I am your translation assistant'
        returnStr = 'tool of translate'
        break
      default:
        returnStr = ''
    }
    ctx.body = returnStr
  })
}
