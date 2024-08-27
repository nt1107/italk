<template>
  <div class="dialog_content" ref="content">
    <div class="dialog_line" v-for="(item, index) in contentList" :key="index">
      <div
        class="dialog_item"
        :class="[item.author_type === 0 ? 'leftContent' : 'rightContent']"
      >
        <div
          class="text_line flex_box start"
          :class="[item.author_type === 1 ? 'reverse' : '']"
        >
          <!-- <div class="user">
            <svg-icon
              class="svgicon"
              :icon-class="item.author_type === 0 ? 'chat' : 'user'"
            ></svg-icon>
          </div> -->
          <div
            class="dialog_text"
            :class="[item.author_type === 0 ? '' : 'blueBackground']"
          >
            <pre v-if="item.author_type === 1">{{ item.content }}</pre>
            <div v-else>
              <slot :content="item.content">
                <pre>{{ item.content }}</pre>
              </slot>
            </div>
            <div class="loading_content flex_box" v-show="item.loading">
              <div class="ldball1"></div>
              <div class="ldball2"></div>
              <div class="ldball3"></div>
              <div class="ldball4"></div>
            </div>
            <div
              class="voice_player_box"
              v-show="!item.loading"
              :class="[
                item.author_type === 1 ? 'positionLeft' : 'positionRight'
              ]"
              @click="playerClick(item)"
            >
              <Voice color="white" width="15px" height="15px" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="stickyBottom">
      <div class="dynamic_content" v-show="isSpeek">
        <dynamicVoice />
      </div>
      <div class="speechInput_content" :style="dynamicHeight">
        <div
          ref="touchElement"
          class="speechInput_button"
          @touchstart.prevent="onTouchStart"
          @touchend="onTouchEnd"
        >
          <div class="speechInput_border">
            <Microphone color="white" width="30px" height="30px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { Microphone, Voice } from '@nutui/icons-vue'
import dynamicVoice from './dynamicVoice.vue'
import { useMediaRecord } from '@/tools/mediaRecord.js'
import { tta } from '@/api/chat.js'
import axios from 'axios'

const prop = defineProps({
  contentList: Array,
  type: String
})
const emit = defineEmits(['getRecord'])

const { recordStart, stopRecording, getFormData, recordFinish } =
  useMediaRecord()

const playerClick = async (item) => {
  let url
  if (item.blob) {
    url = URL.createObjectURL(item.blob)
  } else {
    const res = await fetch(import.meta.env.VITE_API_ADRESS + 'tta', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: prop.type === 'chat' ? item.content : item.content.english,
        config: JSON.parse(localStorage.getItem('tta_config'))
      })
    })
    const blob = await res.blob()
    url = URL.createObjectURL(blob)
  }

  // 开始播放
  const audio = new Audio(url)
  audio.volume = 1
  audio.play()
}

const content = ref()
const isSpeek = ref(false)

const dynamicHeight = ref({
  height: '60px'
})

const onTouchStart = (event) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50)
  }
  dynamicHeight.value = {
    height: '150px'
  }
  isSpeek.value = true
  recordStart()
}

const onTouchEnd = (event) => {
  dynamicHeight.value = {
    height: '60px'
  }
  isSpeek.value = false
  stopRecording()
}

watch([isSpeek, recordFinish], () => {
  if (!isSpeek.value && recordFinish.value) {
    getFormData().then((res) => {
      emit('getRecord', res)
    })
  }
})

const touchElement = ref()

watch(
  () => prop.contentList,
  () => {
    nextTick(() => {
      content.value.scrollTop = content.value.scrollHeight
    })
  },
  {
    deep: true
  }
)
</script>

<style lang="scss" scoped>
.dialog_content {
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 100px;
  overflow-y: auto;
  .flex_box {
    display: flex;
    align-items: center;
  }
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: transparent;
  }
  .dialog_line {
    margin-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    .dialog_item {
      display: flex;
      flex-direction: column;
      .text_line {
        max-width: 100%;
        align-items: flex-start;
        gap: 10px;
        .user {
          width: 50px;
          height: 50px;
          .svgicon {
            width: 100%;
            height: 100%;
          }
        }
        .dialog_text {
          background: rgb(242, 242, 242);
          box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.2);
          position: relative;
          color: #24292f;
          font-weight: bold;
          padding: 10px;
          font-size: 14px;
          border-radius: 10px;
          line-height: 25px;
          pre {
            margin: 0px;
            // white-space: pre-line;
            white-space: pre-wrap;
            text-indent: 0px;
            margin: 0px;
            font-family: 'myFont', sans-serif;
            font-weight: normal;
          }
          code {
            white-space: pre-line;
            text-indent: 0px;
            margin: 0px;
            font-family: 'myFont', sans-serif;
            font-weight: normal;
          }
          .loading_content {
            gap: 5px;
            .ldball1,
            .ldball2,
            .ldball3,
            .ldball4 {
              width: 8px;
              height: 8px;
              border-radius: 4px;
            }
            .ldball1 {
              background-color: rgb(91, 225, 216);
              animation: scale 0.4s ease-in-out 0.1s infinite alternate;
            }
            .ldball2 {
              background-color: rgb(96, 213, 244);
              animation: scale 0.4s ease-in-out 0.2s infinite alternate;
            }
            .ldball3 {
              background-color: rgb(106, 176, 248);
              animation: scale 0.4s ease-in-out 0.3s infinite alternate;
            }
            .ldball4 {
              background-color: rgb(147, 129, 189);
              animation: scale 0.4s ease-in-out 0.4s infinite alternate;
            }
          }
          .voice_player_box {
            height: 20px;
            width: 20px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--theme-color);
            position: absolute;
            bottom: 0px;
            transform: translateY(50%);
          }
          .positionLeft {
            left: 10px;
          }
          .positionRight {
            right: 10px;
          }
        }
        .operate_content {
          align-self: flex-end;
          .stop_box {
            background: rgb(222, 239, 255);
            height: 26px;
            border-radius: 13px;
            color: var(--blueColor);
            font-size: 12px;
            padding: 0px 10px;
            gap: 10px;
          }
        }
        .blueBackground {
          background-color: rgb(1, 168, 231);
          color: white;
        }
      }
    }
    .leftContent {
      align-items: flex-start;
    }
    .rightContent {
      align-items: flex-end;
    }
  }

  .stickyBottom {
    position: fixed;
    bottom: 0px;
    width: 100vw;
    .dynamic_content {
      height: 50px;
      position: fixed;
      bottom: 100px;
      width: 100vw;
      display: flex;
      justify-content: center;
    }
    .speechInput_content {
      // background-color: rgb(144, 124, 255);
      background-color: var(--theme-color);
      height: 40px;
      .speechInput_button {
        position: fixed;
        left: 50%;
        bottom: 0px;
        transform: translate(-50%, -50%);
        background-color: var(--theme-color);
        width: 60px;
        height: 60px;
        border-radius: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        .speechInput_border {
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50px;
        }
      }
    }
  }

  @keyframes scale {
    0% {
      transform: scale(0.3);
    }
    100% {
      transform: scale(1);
    }
  }
}
</style>
