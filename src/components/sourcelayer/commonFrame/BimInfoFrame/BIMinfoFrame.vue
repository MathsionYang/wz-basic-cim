
<template>
  <div class="bimframe" v-if="fixedForceBimData.length">
    <div class="_bimframe_">
      <i class="close" @click="closeBimFrame"></i>
      <div class="inforFrameH">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="详细信息" name="bim" class="detailedInformation">
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
          <el-tab-pane
            label="房间信息"
            name="room"
            v-if="fixedForceRoomData.length"
          >
            <!-- <div v-if="forceBimIDS.length">
              <button @click="openFloorStructure" class="buttons">
                查看楼层结构
              </button>
              <button @click="closeFloorStructure" class="buttons">
                关闭楼层结构
              </button>
            </div> -->
            <table>
              <tbody>
                <tr v-for="(d, i) in fixedForceRoomData" :key="i">
                  <td>{{ d.k }}:</td>
                  <td>{{ d.v }}</td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { FILTER_KEYS, HASH_KEYS } from "./filterKeys";
export default {
  name: "InfoFrame",
  data() {
    return {
      activeTab: "bim",
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
    closeBimFrame() {
      console.log('closeBimFrame')
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
