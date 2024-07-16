<template>
  <div class="bar-container">
    <div v-for="index in 20" :key="index" :class="['bar', `bar${index}`]"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
</script>

<style lang="scss" scoped>
.bar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  .bar {
    display: inline-block;
    width: 2px;
    margin: 0 3px;
    background-color: white;
    animation: randomHeight1 0.5s infinite;
  }
  .bar1,
  .bar3,
  .bar18 {
    animation: randomHeight2 0.8s infinite;
  }
  .bar5,
  .bar13,
  .bar15,
  .bar20 {
    animation: randomHeight3 0.6s infinite;
  }
  .bar7,
  .bar10,
  .bar14,
  .bar19 {
    animation: randomHeight4 0.2s infinite;
  }
  .bar9,
  .bar18 {
    animation: randomHeight5 0.7s infinite;
  }
}

@keyframes randomHeight1 {
  0% {
    height: 10px;
  }
  100% {
    height: 25px;
  }
}
@keyframes randomHeight2 {
  0% {
    height: 5px;
  }
  100% {
    height: 40px;
  }
}
@keyframes randomHeight3 {
  0% {
    height: 10px;
  }
  100% {
    height: 30px;
  }
}
@keyframes randomHeight4 {
  0% {
    height: 15px;
  }
  100% {
    height: 20px;
  }
}
@keyframes randomHeight5 {
  0% {
    height: 3px;
  }
  100% {
    height: 50px;
  }
}
</style>
