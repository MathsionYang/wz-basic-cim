<template>
  <div class="target-wrapper">
    <div class="titles">交通情况</div>
    <el-select v-model="select" @change="areaclick" class="ljxq">
      <el-option
        v-for="item in Options"
        :key="item"
        :label="item"
        :value="item"
      >
      </el-option>
    </el-select>
    <div class="zhuangshi"></div>
    <div class="s1" v-show="cityselect"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DynamicNum from "../dynamicNum";

export default {
  name: "trafficIndex",
  data() {
    return {
      select: "S1", //  默认半径200米
      Options: ["S1"],
      cityselect: true,
    };
  },
  components: { DynamicNum },
  computed: {
    ...mapGetters("map", ["WzTourData"]),
  },
  async created() {
    await this.fetchTourData();
  },
  methods: {
    ...mapActions("map", ["SetWzTourData"]),
    /**
     * 概览数据
     */
    async fetchTourData() {
      await this.SetWzTourData();
    },
    async areaclick() {
    //   if (this.select == "鹿城区") {
    //     this.cityselect = false;
    //   } else {
    //     this.cityselect = true;
    //   }
    },
  },
};
</script>
<style lang="less">
// .ljxq {
//   width: unset !important;
//   float: right;
//   background-image: url("/static/images/mode-ico/下拉框.png");
//   > .el-input {
//     > .el-input__inner {
//       padding: 1vh 0.6vh !important;
//       height: 2vh !important;
//       line-height: 2vh !important;
//       width: 5.8vh;
//       font-size: 1.4vh;
//     }
//     > .el-input__suffix {
//       right: 0vh;
//       > .el-input__suffix-inner {
//         > .el-input__icon {
//           height: unset !important;
//           width: 2vh !important;
//           line-height: unset !important;
//         }
//         > .el-select__caret {
//           &::before {
//             color: black;
//             font-size: 1vh;
//           }
//         }
//       }
//     }
//   }
// }
</style>