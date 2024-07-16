<template>
  <div class="index_content">
    <div class="foot_content">
      <nut-tabbar v-model="active" @tab-switch="tabSwitch">
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
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { Refresh, Comment, CheckNormal } from '@nutui/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const active = ref('category')

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
  }
}
</style>
