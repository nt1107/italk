<template>
  <chatBase :contentList="chatList" @getText="getVoiceToText" />
</template>

<script setup>
import { ref } from 'vue'
import chatBase from '@/components/chatBase.vue'

const chatList = ref([
  { author_type: 0, content: '你好' },
  {
    author_type: 1,
    content: '我是小识'
  }
])

const getVoiceToText = (text) => {
  if (!text) return
  chatList.value.push({
    author_type: 1,
    content: text
  })
}
</script>

<style lang="scss" scoped></style>
