const API_KEY = process.env.TTS_API_KEY
const SECRET_KEY = process.env.TTS_SECRET_KEY
const APP_ID = process.env.TTS_APP_ID
let AipSpeech = require('baidu-aip-sdk').speech

const ttsClient = new AipSpeech(APP_ID, API_KEY, SECRET_KEY)

module.exports = { ttsClient }
