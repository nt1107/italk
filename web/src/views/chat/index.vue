<template>
  <chatBase :contentList="chatList" @getText="getVoiceToText" />
</template>

<script setup>
import { ref } from 'vue'
import chatBase from '@/components/chatBase.vue'
import { chat_chat } from '@/api/chat.js'
import { useChat } from '@/useTool/useChat.js'

const chatList = ref([
  { author_type: 0, content: 'I am your conversational partner，Xiao Shi' }
])

const { getVoiceToText } = useChat(chatList, chat_chat)
</script>

<style lang="scss" scoped></style>
