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

          const url = URL.createObjectURL(blob.value)

          // 创建一个隐藏的可下载链接并触发点击
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'recording.webm') // 设置文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          // 清理 URL 对象
          URL.revokeObjectURL(url)
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
