<template>
  <div class="config_content"></div>
  <nut-range v-model="val" :max="10" :min="-10" @change="change" />
</template>

<script setup>
import { ref } from 'vue'
</script>

<style lang="scss" scoped></style>
