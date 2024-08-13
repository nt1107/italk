import { ref } from 'vue'

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
      const formData = new FormData()
      formData.append('audio', blob.value, 'recording.webm')
      const res = [formData, blob.value]
      reslove(res)
    })
  }

  return {
    recordStart,
    stopRecording,
    getFormData,
    recordFinish
  }
}
