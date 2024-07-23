<template>
  <chatBase :contentList="chatList" @getText="getVoiceToText" />
</template>

<script setup>
import { ref } from 'vue'
import chatBase from '@/components/chatBase.vue'
import { chat_chat } from '@/api/chat.js'

const chatList = ref([
  { author_type: 0, content: 'I am your conversational partner，Xiao Shi' }
])

let returnId

const chat = async (input) => {
  const res = await chat_chat({ input, id: returnId })
  chatList.value.push({
    author_type: 0,
    content: res.data.content
  })
  returnId = res.data.id
}

const getVoiceToText = (text) => {
  if (!text) return
  chatList.value.push({
    author_type: 1,
    content: text
  })
  chat(text)
}
</script>

<style lang="scss" scoped></style>
