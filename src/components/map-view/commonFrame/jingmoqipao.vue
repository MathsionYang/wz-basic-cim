<!--
 * @Author: eds
 * @Date: 2020-07-28 14:09:16
 * @LastEditTime: 2020-08-06 16:05:47
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\commonFrame\InfoFrame.vue
-->
<template>
  <!-- <div class="bimframe" v-if="fixedForceBimData.length"> -->
    <div class="bimframe" v-if="false">
    <div class="_bimframe_">
      <i class="close" @click="closeBimFrame"></i>
      <div class="inforFrameH">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="详细信息" name="bim" class="detailedInformation">
            <button v-if="isMAX2012" @click="openRtmpVideo">查看监控</button>
            <table>
              <tbody>
                <tr
                  v-for="(d, i) in fixedForceBimData"
                  :key="i"
                  v-infinite-scroll="fixedForceBimData"
                >
                  <td>{{ d.k }}:</td>
                  <td>{{ d.v }}</td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <rtmpVideo v-if="isMAX2012 && isRtmpVideoOpen" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { FILTER_KEYS, HASH_KEYS } from "./filterKeys";
import rtmpVideo from "./rtmpVideo";
export default {
  name: "InfoFrame",
  data() {
    return { activeTab: "bim", isRtmpVideoOpen: false };
  },
  components: { rtmpVideo },
  beforeDestroy() {
    this.closeBimFrame();
  },
  computed: {
    ...mapGetters("map", ["forceBimData", "forceRoomData", "forceBimIDS"]),
    isMAX2012() {
      return ~this.forceBimData.map((item) => item.k).indexOf("幢名");
    },
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
      "SetForceJMData",
      "SetForceRoomData",
      "SetForceBimIDS",
    ]),
    openRtmpVideo() {
      this.isRtmpVideoOpen = true;
    },
    openFloorStructure() {
      this.$bus.$emit("cesium-3d-floorDIS", true);
    },
    closeFloorStructure() {
      this.$bus.$emit("cesium-3d-floorDIS", false);
    },
    closeBimFrame() {
      console.log(window.earth.scene.camera.position);
      console.log(window.earth.scene.camera.heading);
      console.log(window.earth.scene.camera.pitch);
      this.closeFloorStructure();
      this.SetForceJMData([]);
      this.SetForceRoomData([]);
      this.SetForceBimIDS([]);
    },
  },
};
</script>
<style lang="less" scoped>
@import url("./InfoFrame.less");
</style>

<style>
.inforFrameH .el-tabs__nav-wrap {
  height: 67px;
}
.inforFrameH .el-tabs__nav-scroll {
  margin-top: 10px;
}
/* .inforFrameH .el-tabs__item{
  margin-left: 19px;
} */
/*去除下划线 element默认样式坑爹的玩意*/
.inforFrameH .el-tabs__active-bar {
  background-color: transparent !important;
}
/* .inforFrameH .el-tabs__nav-wrap::after {
  position: static !important;
} */
/* .inforFrameH >>> .el-tabs__nav-wrap::after {
  position: static !important;
} */
.inforFrameH .el-tabs__header {
  height: 37px;
}
</style>
