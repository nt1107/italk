<template>
  <div class="config_content">
    <div class="operat_line">
      <div class="title">发音人:</div>
      <nut-radio-group
        v-model="config.per"
        direction="horizontal"
        @change="configChange"
      >
        <nut-radio :label="0" shape="button">小美</nut-radio>
        <nut-radio :label="1" shape="button">小迪</nut-radio>
        <nut-radio :label="3" shape="button">阿华</nut-radio>
        <nut-radio :label="4" shape="button">小丽</nut-radio>
        <!-- <nut-radio :label="5003" shape="button">度逍遥</nut-radio>
        <nut-radio :label="5118" shape="button">度小鹿</nut-radio>
        <nut-radio :label="106" shape="button">度博文</nut-radio>
        <nut-radio :label="110" shape="button">度小童</nut-radio>
        <nut-radio :label="111" shape="button">度小萌</nut-radio>
        <nut-radio :label="103" shape="button">度米朵</nut-radio>
        <nut-radio :label="5" shape="button">度小娇</nut-radio> -->
      </nut-radio-group>
    </div>
    <div class="operat_line">
      <div class="title">语速:</div>
      <div class="operate_content">
        <nut-range
          v-model="config.spd"
          :max="9"
          :min="0"
          inactive-color="white"
          button-color="blue"
          active-color="#BE77F9"
          @change="configChange"
        />
      </div>
    </div>
    <div class="operat_line">
      <div class="title">语调:</div>
      <div class="operate_content">
        <nut-range
          v-model="config.pit"
          :max="9"
          :min="0"
          inactive-color="white"
          button-color="blue"
          active-color="#BE77F9"
          @change="configChange"
        />
      </div>
    </div>
    <div class="operat_line">
      <div class="title">音量:</div>
      <div class="operate_content">
        <nut-range
          v-model="config.vol"
          :max="15"
          :min="0"
          inactive-color="white"
          button-color="blue"
          active-color="#BE77F9"
          @change="configChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const config = ref(
  localStorage.getItem('tta_config')
    ? JSON.parse(localStorage.getItem('tta_config'))
    : {
        spd: 5,
        per: 1,
        pit: 5,
        vol: 5
      }
)

const configChange = () => {
  localStorage.setItem('tta_config', JSON.stringify(config.value))
}
</script>

<style lang="scss" scoped>
.config_content {
  color: white;
  padding: 20px;
  .operat_line {
    margin-top: 20px;
    display: flex;
    align-items: center;
    background-color: rgb(29, 30, 34);
    padding: 10px;
    padding-top: 30px;
    border-radius: 5px;
    gap: 20px;
    .title {
      width: 80px;
    }
    .operate_content {
      flex: 1;
    }
    &:nth-child(1) {
      align-items: flex-start;
    }
    .nut-radio-group .nut-radio {
      margin-bottom: 15px;
    }
    :deep(.nut-radio__button--active) {
      color: var(--text-color);
      background-color: var(--theme-color);
      border-color: var(--theme-color);
    }
    :deep(.nut-range-container) {
      .nut-range-min,
      .nut-range-max {
        color: var(--theme-color);
      }
    }
    :deep(.nut-range::before) {
      background-color: transparent;
    }
    :deep(.nut-range-button .number) {
      color: var(--theme-color);
      font-size: 16px;
    }
    &:nth-child(1) {
      padding-top: 10px;
    }
  }
}
</style>
