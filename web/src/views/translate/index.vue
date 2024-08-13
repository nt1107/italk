<template>
  <chatBase
    :contentList="chatList"
    @getRecord="getVoiceToText"
    v-slot="slotProps"
    type="translate"
  >
    <div>
      <pre>{{ slotProps.content.english }}</pre>
      <pre>{{ slotProps.content.explain }}</pre>
      <pre v-show="slotProps.content.phonetic">
        {{ slotProps.content.phonetic }}
      </pre>
      <div v-show="slotProps.content.examlpe">
        <div v-for="item in slotProps.content.examlpe">
          <pre>{{ item.example_sentence }}</pre>
          <pre>{{ item.example_translation }}</pre>
        </div>
      </div>
    </div>
  </chatBase>
</template>

<script setup>
import { ref } from 'vue'
import chatBase from '@/components/chatBaseTts.vue'
import { chat_translate, tts } from '@/api/chat.js'
import { useTts } from '@/useTool/useChat.js'

const chatList = ref([
  {
    author_type: 0,
    content: {
      english: 'I am your translation assistant'
    }
  }
])

const { getVoiceToText } = useTts(chatList, tts, chat_translate)
</script>

<style lang="scss" scoped>
pre {
  margin: 0px;
  // white-space: pre-line;
  white-space: pre-wrap;
  text-indent: 0px;
  margin: 0px;
  font-family: 'myFont', sans-serif;
  font-weight: normal;
}
</style>
