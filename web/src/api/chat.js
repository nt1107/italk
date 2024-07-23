import request from './index'
// input returnId
export const chat_chat = (data) => {
  return request.post('chat_chat', data)
}

// input returnId
export const chat_translate = (data) => {
  return request.post('chat_translate', data)
}
