<template>
  <div class="index_content">
    <div class="foot_content">
      <nut-tabbar
        v-model="active"
        @tab-switch="tabSwitch"
        unactive-color="#000"
        active-color="#fff"
      >
        <nut-tabbar-item
          v-for="item in List"
          :key="item.name"
          :name="item.name"
          :tab-title="item.title"
          :icon="item.icon"
        >
        </nut-tabbar-item>
      </nut-tabbar>
    </div>
    <div class="head_content"></div>
    <div class="body_content">
      <router-view />
    </div>
    <nut-popup
      v-model:visible="noticeShow"
      round
      :style="{ width: '70vw', height: '60vh' }"
    >
      <div class="pop_content">
        <div class="pop_head"><div class="popTitle">为了更好的体验：</div></div>
        <div class="pop_body">
          <div class="popText">允许页面调用麦克风</div>
          <div class="popText">允许浏览器使用振动</div>
        </div>
        <div class="pop_foot">
          <nut-button type="default" @click="noticeShow = false"
            >我知道了</nut-button
          >
        </div>
      </div>
    </nut-popup>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { Refresh, Comment, CheckNormal } from '@nutui/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const active = ref('category')

const noticeShow = ref(true)

const List = [
  {
    title: '对话',
    icon: h(Comment),
    name: 'category',
    route: 'chat'
  },
  {
    title: '翻译',
    icon: h(Refresh),
    name: 'home',
    route: 'translate'
  },
  {
    title: '场景单词',
    icon: h(CheckNormal),
    name: 'find',
    route: 'word'
  }
]

const tabSwitch = (item, index) => {
  const clickItem = List.find((item) => item.name === index)
  router.push({ name: clickItem.route })
}
</script>

<style lang="scss" scoped>
.index_content {
  height: 100%;
  background-color: var(--background-color);
  padding-bottom: 0px;
  --headHeight: 0px;
  --footHeight: 52px;

  .head_content {
    height: var(--headHeight);
  }
  .body_content {
    height: calc(100% - var(--footHeight) - var(--headHeight));
  }
  .foot_content {
    height: var(--footHeight);
    :deep(.nut-tabbar) {
      background-color: var(--theme-color);
      border: 0px;
    }
  }

  .pop_content {
    height: 100%;
    .pop_head {
      height: 50%;
      background-color: var(--theme-color);
      color: var(--text-color);
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding-bottom: 20px;
      box-sizing: border-box;

      .popTitle {
        font-size: 18px;
        font-weight: bold;
      }
    }
    .pop_body {
      height: 35%;
      box-sizing: border-box;
      padding-left: 20px;
      padding-top: 20px;
      .popText {
        font-size: 14px;
        height: 30px;
      }
    }
    .pop_foot {
      height: 15%;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
