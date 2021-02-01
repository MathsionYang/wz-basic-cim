
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
    fixedForceBimData() {
      return [
        ...this.forceBimData
          .filter(({ k, v }) => !~FILTER_KEYS.indexOf(k))
          .map(({ k, v }) => {
            return { k: HASH_KEYS[k] || k, v };
          }),
      ];
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
    ]),
    closeBimFrame() {
      console.log('fuckb')
      this.SetForceBimData([]);
    },
  },
};
</script>
<style lang="less" scoped>
@import url("./BIMinfoFrame.less");
</style>
