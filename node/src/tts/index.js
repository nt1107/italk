require('dotenv').config()
const API_KEY = process.env.TTS_API_KEY
const SECRET_KEY = process.env.TTS_SECRET_KEY
const APP_ID = process.env.TTS_APP_ID
let AipSpeech = require('baidu-aip-sdk').speech
let fs = require('fs')

let client = new AipSpeech(APP_ID, API_KEY, SECRET_KEY)

let voice = fs.readFileSync('../16k_test.pcm')

let voiceBase64 = Buffer.from(voice)

// 识别本地语音文件
client.recognize(voiceBase64, 'pcm', 16000).then(
  function (result) {
    console.log('语音识别本地音频文件结果: ' + JSON.stringify(result))
  },
  function (err) {
    console.log(err)
  }
)
