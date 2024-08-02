import { ref } from 'vue'

const setLastItem = (list, item) => {
  if (Array.isArray(list.value)) {
    list.value[list.value.length - 1] = item
  }
}

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
    setLastItem(chatList, {
      author_type: 0,
      content: res.data.content,
      loading: false
    })
    returnId = res.data.id
  }
  const getVoiceToText = async (formData) => {
    if (!formData) return
    chatList.value.push({
      author_type: 1,
      content: '',
      loading: true
    })
    const res = await ttsApi(formData)
    setLastItem(chatList, {
      author_type: 1,
      content: res.data.content,
      loading: false
    })
    chatList.value.push({
      author_type: 0,
      content: '',
      loading: true
    })
    chat(res.data.content)
  }

  return {
    getVoiceToText
  }
}
