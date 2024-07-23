export class Recognition {
  constructor(getResult) {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition()
      this.recognition.lang = 'en-US'
      this.setDefault()
      this.setResult(getResult)
    } else {
      alert('当前设备不支持语音识别')
    }
  }

  setDefault() {
    this.recognition.lang = 'zh-CN'
    this.recognition.continuous = true
    this.recognition.interimResults = false
  }

  start() {
    this.recognition.start()
  }
  stop() {
    this.recognition.stop()
  }

  setResult(getResult) {
    this.recognition.onresult = function (event) {
      try {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('')
        getResult(transcript)
      } catch (err) {
        alert(err)
      }
    }
  }
}
