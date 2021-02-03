<!--
 * @Author: eds
 * @Date: 2020-09-15 11:04:57
 * @LastEditTime: 2020-09-15 11:05:13
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\commonFrame\SceneSwitch\SceneSwitch.vue
-->
<template>
  <div class="labelleng">
    <div
      :class="{
        label: true,
        active: item.id == forceTreeLabel,
        disabled: item.disabled,
      }"
      v-for="(item, i) in data"
      :key="i"
      @click="!item.disabled ? SetForceTreeLabels(item.id) : undefined"
    >
      <div class="imgs"></div>
      <span class="bt">{{ item.label }}</span>
    </div>
  </div>
</template>

<script>
const RATE = 30;
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Switchlabel",
  data() {
    return {
      toRight: true,
      forceTreeLabel:"孪生城市全貌",
      cameraTimer: undefined,
      heading: 0,
      data: [
        { id: "孪生城市全貌", label: "孪生城市全貌" },
        { id: "城市规划", label: "城市规划" },
        { id: "城市建设", label: "城市建设" },
        { id: "城市运营", label: "城市运营" },
      ],
    };
  },
  computed: {
  },
  watch: {},
  methods: {
    ...mapActions("map", ["SetNightMode", "SetCameraMode"]),
    SetForceTreeLabels(item){
        this.forceTreeLabel=item;
    }
  },
};
</script>

<style scoped lang="less">
.labelleng {
  top: 1.5vh;
  position: absolute;
  z-index: 7;
  height: auto;
  width: auto;
  left: 25vw;
  background: linear-gradient(
    180deg,
    #030303 0%,
    #010714 28%,
    rgba(1, 4, 9, 0) 100%
  );
  opacity: 0.97;
}
.label {
  position: relative;
  display: inline-block;

  .imgs {
    height: 2.5vw;
    opacity: 1;
    z-index: 7;
    margin-right: 5px;
    width: 15.8vh;
    background-size: 100% 100%;
    border: 0;
    background-image: url(/static/images/mode-ico/标题.png);
  }
  &.active {
    > .imgs {
      height: 2.5vw;
      opacity: 1;
      z-index: 7;
      width: 16vh;
      border: 0;
      margin-right: 5px;
      background-size: 100% 100%;
      background-image: url(/static/images/mode-ico/标题选中.png);
    }
  }

  > .bt {
    position: absolute;
    font-size: 20px;
    font-family: YouSheBiaoTiHei;
    font-weight: 400;
    line-height: 49px;
    bottom: 0;
    left: 0;
    color: rgb(255, 255, 255);
    text-shadow: rgba(4, 36, 39, 0.4) 0px 2px 4px;
    opacity: 1;
    margin: 0.5vh 0vw;
    display: block;
    width: 100%;
    text-align: center;
  }

  &.active {
    > .bt {
      position: absolute;
      font-size: 20px;
      font-family: YouSheBiaoTiHei;
      font-weight: 400;
      line-height: 49px;
      bottom: 0;
      left: 0;
      color: #ffff08;
      text-shadow: rgba(4, 36, 39, 0.4) 0px 2px 4px;
      opacity: 1;
      margin: 0.5vh 0vw;
      display: block;
      width: 100%;
      text-align: center;
    }
  }
}
</style>
