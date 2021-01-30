<!--
 * @Author: eds
 * @Date: 2020-07-28 14:09:16
 * @LastEditTime: 2020-08-06 16:05:47
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\commonFrame\InfoFrame.vue
-->
<template>
  <!-- <div class="bimframe" v-if="fixedForceBimData.length">
    
  </div> -->
  <div class="tool" v-show="fixedForceBimData == '精模'">
    <div id="toolbar" class="tool-bar" v-show="fixedForceBimData == '精模'">
      <div class="inputs">
        <input type="text" id="SQL" value="" v-model="dmdz" class="inputone" />
      </div>
      <span style="vertical-align: middle; margin-left: -4%">
        <img
          src="../../../../static/image/sousuo.png"
          style="top: 4px"
          @click="SQL"
        />
      </span>
      <span style="vertical-align: middle; margin-left: -15%" v-if="dmdz != ''">
        <img
          src="../../../../static/image/close.png"
          style="top: 4px; width: 5%"
          @click="clear"
        />
      </span>
    </div>
    <div v-if="DmdzData.length > 0" class="datalist">
      <div
        style="margin-left: 3%; margin-right: 3%; margin-top: 1%"
        v-for="(d, i) in DmdzData"
        :key="i"
        v-infinite-scroll="DmdzData"
        @click="Zoom(d.data)"
      >
        <div class="text1">{{ d.data.小区名称 }}{{ d.data.幢数 }}幢</div>
        <div class="text2">{{ d.data.地址 }}</div>
        <div style="width: 100%; height: 1px; background-color: #979797"></div>
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
      isRtmpVideoOpen: false,
      DmdzData: "",
      dmdz: "",
      IDS: [],
      datasimid: "",
    };
  },
  beforeDestroy() {
    this.closeBimFrame();
  },
  computed: {
    ...mapGetters("map", [
      "forceBimData",
      "forceRoomData",
      "forceBimIDS",
      "forceBimName",
    ]),
    ...mapActions("map", ["SetForceBimData", "SetForceJMData"]),
    isMAX2012() {
      return ~this.forceBimData.map((item) => item.k).indexOf("幢名");
    },
    fixedForceBimData() {
      console.log("弹框", this.forceBimName);
      return this.forceBimName;
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
    Zoom(data) {
      console.log("点击事件", data);
      console.log(data.CENTER_Y, data.CENTER_X);
      if (this.datasimid != "") {
        var color = new Cesium.Color(1, 1, 1, 1);
        window.earth.scene.layers
          .find("精模")
          .setObjsColor(this.datasimid, color);
        var colors = new Cesium.Color(39 / 255, 189 / 255, 251 / 255, 0.5);
        window.earth.scene.layers
          .find("精模")
          .setObjsColor(this.datasimid, colors);
      }
      this.datasimid = data.SMID;
      var centeroptX = parseFloat(data.CENTER_X);
      var centeroptY = parseFloat(data.CENTER_Y);
      var arg1 = centeroptY;
      var arg2 = 0.004054;
      var r1, r2, m, n;
      try {
        r1 = arg1.toString().split(".")[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      //动态控制精度长度
      n = (r1 = r2) ? r1 : r2;
      var b = ((arg1 * m - arg2 * m) / m).toFixed(n);
      console.log("纬度转换之后", b);
      var centeropt = {
        y: parseFloat(b),
        x: parseFloat(data.CENTER_X),
        z: 200,
        heading: 6.174710006191949,
        pitch: -0.2350783651746684,
        roll: 6.283185307179577,
      };
      window.earth.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          centeropt.x,
          centeropt.y,
          centeropt.z
        ), //经度、纬度、高度
        orientation: {
          heading: centeropt.heading,
          pitch: centeropt.pitch,
          roll: centeropt.roll,
        },
        duration: 3,
      });
      var colorss = new Cesium.Color(254 / 255, 251 / 255, 3 / 255, 0.75);
      window.earth.scene.layers.find("精模").setObjsColor(data.SMID, colorss);
    },
    clear() {
      this.dmdz = "";
      this.DmdzData = "";
      var color = new Cesium.Color(1, 1, 1, 1);
      window.earth.scene.layers.find("精模").setObjsColor(this.IDS, color);
    },
    SQL() {
      var SQL =
        "地址 like '%" +
        this.dmdz +
        "%'" +
        "or 小区名称 like '%" +
        this.dmdz +
        "%'";
      console.log("sql", SQL);
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: SQL,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: ["172.20.83.196_swdata:" + "建筑_table"],
      });
      var url =
        "http://172.20.83.223:8098/iserver/services/data-SW_DATA/rest/data";
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: async (res) => {
            console.log("查询成功", res.result.features);
            this.DmdzData = res.result.features;
            for (let i = 0; i < res.result.features.length; i++) {
              this.IDS[i] = res.result.features[i].data.SMID;
            }
            var colors = new Cesium.Color(39 / 255, 189 / 255, 251 / 255, 0.75);
            window.earth.scene.layers
              .find("精模")
              .setObjsColor(this.IDS, colors);
          },
          processFailed: (msg) => console.log("查询失败", msg),
        },
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
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
input:-internal-autofill-previewed,
input:-internal-autofill-selected {
  -webkit-text-fill-color: white;
  transition: background-color 5000s ease-out 0.5s;
}
.close {
  color: #ffffff;
  font-size: 0.14rem;
  position: absolute;
  top: 0.07rem;
  right: 0.07rem;
  cursor: pointer;
  width: 0.16rem;
  height: 0.16rem;
  display: block;
  background-image: ("./images/close");
  transform: rotate(-45deg);
  transition: all 0.1s linear;
}
.text1 {
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  line-height: 20px;
}
.text2 {
  font-size: 10px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  line-height: 14px;
}
.datalist {
  margin-left: 1%;
  margin-top: 9%;
  overflow-y: scroll;
  display: inline-block;
  width: 97%;
  min-height: 30%;
  max-height: 72%;
  background: rgba(29, 31, 35, 0.8)
    linear-gradient(
      180deg,
      rgba(29, 31, 35, 0) 0%,
      rgba(46, 126, 161, 0.5) 100%
    );
}
.tool {
  width: 30%;
  height: 20%;
  position: absolute;
  left: 20%;
  top: 10px;
  z-index: 10000;
}
.inputone {
  width: 95%;
  height: 100%;
  border: none;
  margin-left: 2%;
  outline: none;
  background-color: transparent;
  color: white;
  -webkit-text-fill-color: white;
  caret-color: white;
}
.inputs {
  display: inline-block;
  width: 97%;
  height: 100%;
}
.tool-bar {
  width: 100%;
  height: 24%;
  background: rgba(29, 31, 35, 0.8);
  border-radius: 21px;
  border: 1px solid #00a3ff;
  position: absolute;
  /*  left: 20%;
  top: 10px; */
  z-index: 10000;
}
.button {
  line-height: 30px;
  text-align: center;
  font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 1px #333;
  border-radius: 3px;
  margin: 0 8px 8px 0;
  position: relative;
  overflow: hidden;
  padding: 0px 15px 0px 15px;
}
.button.black {
  border: 1px solid #333;
  box-shadow: 0 1px 2px #8b8b8b inset, 0 -1px 0 #3d3d3d inset,
    0 -2px 3px #8b8b8b inset;
  background: -webkit-linear-gradient(
    top,
    rgba(34, 34, 34, 0.49),
    rgba(51, 51, 51, 0.55)
  );
  background: -moz-linear-gradient(top, #656565, #4a4a4a);
  background: linear-gradient(top, #656565, #4a4a4a);
}
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
}
.inforFrameH >>> .el-tabs__nav-wrap::after {
  position: static !important;
} */
.inforFrameH .el-tabs__header {
  height: 37px;
}
</style>
