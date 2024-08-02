import { ref } from 'vue'

const convertToPCM = async (webmBlob) => {
  const audioContext = new AudioContext()
  const audioBuffer = await audioContext.decodeAudioData(
    await webmBlob.arrayBuffer()
  )

  const sampleRate = audioBuffer.sampleRate
  const channelData = audioBuffer.getChannelData(0)
  const pcmArray = new Int16Array(channelData.length)

  channelData.forEach((sample, index) => {
    pcmArray[index] = Math.max(-32768, Math.min(32767, sample * 32767)) // 转换为 PCM
  })

  return new Blob([pcmArray.buffer], { type: 'audio/x-wav' })
}

export const useMediaRecord = () => {
  const mediaRecorder = ref(null)
  const chunks = ref([])
  const blob = ref(null)
  const recordFinish = ref(false)

  const recordStart = () => {
    recordFinish.value = false
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder.value = new MediaRecorder(stream)
        mediaRecorder.value.start()

        mediaRecorder.value.addEventListener('stop', () => {
          blob.value = new Blob(chunks.value, { type: 'audio/webm' })
          chunks.value = []
          recordFinish.value = true
        })

        mediaRecorder.value.addEventListener('dataavailable', (e) => {
          chunks.value.push(e.data)
        })
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const stopRecording = () => {
    mediaRecorder.value.stop()
  }

  const getFormData = () => {
    return new Promise(async (reslove) => {
      // const pcmBlob = await convertToPCM(blob.value)
      const pcmBlob = blob.value
      const formData = new FormData()
      formData.append('audio', pcmBlob, 'recording.webm')
      reslove(formData)
    })
  }

  return {
    recordStart,
    stopRecording,
    getFormData,
    recordFinish
  }
}
