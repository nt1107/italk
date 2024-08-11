<template>
  <chatBase :contentList="chatList" @getRecord="getVoiceToText" />
</template>

<script setup>
import { ref } from 'vue'
import chatBase from '@/components/chatBaseTts.vue'
import { chat_chat, tts } from '@/api/chat.js'
import { useTts } from '@/useTool/useChat.js'

const chatList = ref([
  { author_type: 0, content: 'I am your conversational partner，Xiao Shi' }
])

const { getVoiceToText } = useTts(chatList, tts, chat_chat)
</script>

<style lang="scss" scoped></style>
