import { ref } from 'vue'

export const useChat = (chatList, chatApi) => {
  let returnId

  const chat = async (input) => {
    const res = await chatApi({ input, id: returnId })
    chatList.value[chatList.value.length - 1] = {
      author_type: 0,
      content: res.data.content,
      loading: false
    }

    returnId = res.data.id
  }
  const getVoiceToText = (text) => {
    if (!text) return
    chatList.value.push({
      author_type: 1,
      content: text
    })
    chatList.value.push({
      author_type: 0,
      content: '',
      loading: true
    })
    chat(text)
  }

  return {
    getVoiceToText
  }
}

export const useTts = (chatList, ttsApi, chatApi) => {
  let returnId

  const chat = async (input) => {
    const res = await chatApi({ input, id: returnId })
    chatList.value[chatList.value.length - 1] = {
      author_type: 0,
      content: res.data.content,
      loading: false
    }

    returnId = res.data.id
  }
  const getVoiceToText = async (formData) => {
    if (!formData) return
    chatList.value.push({
      author_type: 0,
      content: '',
      loading: true
    })
    // chatList.value.push({
    //   author_type: 0,
    //   content: '',
    //   loading: true
    // })
    const res = await ttsApi(formData)
    console.log(111, res)
    // chat(text)
  }

  return {
    getVoiceToText
  }
}
