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
            <pre>{{ item.content }}</pre>
            <div class="loading_content flex_box" v-show="item.loading">
              <div class="ldball1"></div>
              <div class="ldball2"></div>
              <div class="ldball3"></div>
              <div class="ldball4"></div>
            </div>
          </div>
          <div class="operate_content flex_box">
            <div
              class="stop_box flex_box cursor"
              v-show="item.loading"
              @click="stop"
            >
              停止生成 <PoweroffCircleFill style="width: 15px; height: 15px" />
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
import { PoweroffCircleFill } from '@nutui/icons-vue'
import { Microphone } from '@nutui/icons-vue'
import dynamicVoice from './dynamicVoice.vue'
import { Recognition } from '@/tools/recognition.js'

const prop = defineProps({
  contentList: Array
})
const emit = defineEmits(['getText'])

const content = ref()
const isSpeek = ref(false)

const dynamicHeight = ref({
  height: '60px'
})

let resultText
const recognitionStatus = ref(0)
const getResult = (text) => {
  resultText = text
  recognitionStatus.value = 1
}

const recognition = new Recognition(getResult)

const onTouchStart = (event) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50)
  }
  dynamicHeight.value = {
    height: '150px'
  }
  recognitionStatus.value = 0
  isSpeek.value = true
  recognition.start()
}

const onTouchEnd = (event) => {
  dynamicHeight.value = {
    height: '60px'
  }
  isSpeek.value = false
  recognition.stop()
}

watch([isSpeek, recognitionStatus], () => {
  if (!isSpeek.value && recognitionStatus.value) {
    emit('getText', resultText)
    resultText = ''
  }
})

const stop = () => {
  // emitter.emit('stop')
}

const touchElement = ref()
// onMounted(() => {
//   touchElement.value.addEventListener('touchcancel', onTouchCancel)
// })
// onBeforeUnmount(() => {
//   touchElement.value.removeEventListener('touchcancel', onTouchCancel)
// })
// const onTouchCancel = (event) => {
//   if (isSpeek.value) {
//     onTouchEnd()
//   }
// }

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
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: transparent;
  }
  .dialog_line {
    margin-top: 10px;
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
      background-color: rgb(144, 124, 255);
      height: 40px;
      .speechInput_button {
        position: fixed;
        left: 50%;
        bottom: 0px;
        transform: translate(-50%, -50%);
        background-color: rgb(144, 124, 255);
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
