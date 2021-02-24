
<template>
  <div class="side-info" v-if="fixedForceBimData.length">
    <div class="info-header">
      <div class="title">信息详情</div>
      <div class="decorate"></div>
      <div class="parts" :class="{active: partsclick == true}" @click="ispartsclick()" ></div>
      <div class="close" @click="closeBimFrame()"></div>
      <!-- <div class="tab-list">
        <div class="tab-item active">基本信息</div>
      </div> -->
    </div>
    <ul class="info-content">
      <li
        class="info-item"
        v-for="(item, index) in fixedForceBimData"
        :key="index"
        v-show="item"
      >
        <span class="key" :title="key">{{ item.k }}</span>
        <span class="value" :title="item">{{ item.v }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { FILTER_KEYS, HASH_KEYS } from "./filterKeys";
export default {
  name: "InfoFrame",
  data() {
    return {
      filterKey: ["永久固定码", "唯一码", "分类代码"],
      activeTab: "bim",
      partsclick:false,
    };
  },
  beforeDestroy() {
    this.closeBimFrame();
  },
  computed: {
    ...mapGetters("map", ["forceBimData", "forceRoomData", "forceBimIDS"]),
    fixedForceBimData() {
      return [
        ...this.forceBimData
          .filter(({ k, v }) => !~FILTER_KEYS.indexOf(k))
          .map(({ k, v }) => {
            return { k: HASH_KEYS[k] || k, v };
          }),
      ];
    },
    fixedForceRoomData() {
      return this.forceRoomData
        .filter(({ k, v }) => !~FILTER_KEYS.indexOf(k))
        .map(({ k, v }) => {
          return { k: HASH_KEYS[k] || k, v };
        });
    },
  },
  watch: {
    forceBimData(n, o) {
      n && (this.activeTab = "bim");
    },
  },
  methods: {
    ...mapActions("map", [
      "SetForceBimData",
      "SetForceRoomData",
      "SetForceBimIDS",
    ]),
    ispartsclick(){
      window.ispartsclick=!window.ispartsclick;
      this.partsclick = window.ispartsclick;
    },
    closeBimFrame() {
      window.ispartsclick = false;
      this.partsclick = false;
      this.SetForceBimData([]);
      this.SetForceRoomData([]);
      this.SetForceBimIDS([]);
    },
  },
};
</script>
<style lang="less" scoped>
@import url("./BIMinfoFrame.less");
</style>
