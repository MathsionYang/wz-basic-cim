<!--
 * @Author: eds
 * @Date: 2020-07-28 14:09:16
 * @LastEditTime: 2020-08-06 16:05:47
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\commonFrame\InfoFrame.vue
-->
<template>
  <div class="bimframe" v-if="fixedForceBimData.length">
    <div class="_bimframe_">
      <i class="close" @click="closeBimFrame"></i>
      <div class="inforFrameH">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="详细信息" name="bim" class="detailedInformation">
            <button v-if="isMAX2012" @click="openRtmpVideo" class="buttons">
              查看监控
            </button>
            <button v-if="isPROJECT_CO" @click="openqlc" class="buttons">
              工程全流程
            </button>
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
            <div v-if="forceBimIDS.length">
              <button @click="openFloorStructure" class="buttons">
                查看楼层结构
              </button>
              <button @click="closeFloorStructure" class="buttons">
                关闭楼层结构
              </button>
            </div>
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
      <div class="rtmpVideos" v-if="openxmxx">
        <i class="close" @click="closeRtmpVideo"></i>
        <iframe :src="code"></iframe>
      </div>
      <videolist v-if="isRtmpVideoOpen" />
      <div style="display: none" v-if="fixedForceVideoData"></div>
      <div class="extra-frame" v-if="isFrame">
        <span @click="isFrame = false">X</span><iframe :src="isFrame" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  Logo,
  QueryByBoundsParameters,
  QueryService,
  FeatureService,
  MeasureService,
} from "@supermap/iclient-mapboxgl";
import {
  distance,
  point,
  circle,
  bboxPolygon,
  booleanPointInPolygon,
  polygon,
  pointsWithinPolygon,
} from "@turf/turf";
import { mapGetters, mapActions } from "vuex";
import { FILTER_KEYS, HASH_KEYS } from "./filterKeys";
import rtmpVideo from "./rtmpVideo";
import videolist from "./Videolist";
export default {
  name: "InfoFrame",
  data() {
    return {
      activeTab: "bim",
      isRtmpVideoOpen: false,
      videodata: "",
      shallPop: false,
      geometry: {},
      queryRadius: 500,
      item: {},
      rtmpOn: true,
      isFrame: false,
      openxmxx: false,
      code: "",
    };
  },
  components: { rtmpVideo, videolist },
  beforeDestroy() {
    this.closeBimFrame();
    this.isFrame = false;
  },

  computed: {
    ...mapGetters("map", ["forceBimData", "forceRoomData", "forceBimIDS"]),
    isMAX2012() {
      return ~this.forceBimData.map((item) => item.k).indexOf("VIDEO_URL");
    },
    isPROJECT_CO() {
      return ~this.forceBimData.map((item) => item.k).indexOf("项目代码");
    },
    fixedForceBimData() {
      return [
        ...this.forceBimData
          .filter(({ k, v }) => !~FILTER_KEYS.indexOf(k))
          .map(({ k, v }) => {
            if (k == "全景地址") this.isFrame = v;
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
    fixedForceVideoData() {
      var points_X = "";
      var points_Y = "";
      for (let c = 0; c < this.forceBimData.length; c++) {
        if (this.forceBimData[c].k == "CENTER_X") {
          points_X = this.forceBimData[c].v;
        }
        if (this.forceBimData[c].k == "CENTER_Y") {
          points_Y = this.forceBimData[c].v;
        }
      }
      var points = [points_X, points_Y];
      var circles = createCircle(points, 500);
      function createCircle(center, radius) {
        var options = { steps: 100, units: "meters", properties: "" };
        let res = circle(center, radius, options);
        return res;
      }
      var queryCoordinates = circles.geometry.coordinates;
      var queryPolygonGeometry = {
        type: "Polygon",
        coordinates: queryCoordinates,
      };
      var dataurls =
        "http://172.20.83.223:8090/iserver/services/data-EW_DATA/rest/data";
      var geometryParam = [];
      geometryParam = new SuperMap.GetFeaturesByGeometryParameters({
        attributeFilter: "SMID>0",
        datasetNames: ["172.20.83.196_ersjdata:WLGZ_VIDEO"],
        geometry: queryPolygonGeometry,
        spatialQueryMode: "INTERSECT", // 相交空间查询模式
        fromIndex: 0,
        toIndex: 99999,
        maxFeatures: 100000,
      });
      new FeatureService(dataurls).getFeaturesByGeometry(
        geometryParam,
        function (serviceResult) {
          const result = serviceResult && serviceResult.result;
          if (result) {
            let features = result.features;
            this.videodata = features.features;
            window.videodatas = this.videodata;
          } else {
            console.log("查询失败");
          }
        }
      );
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
      "SetForceBimSP",
      "SetForceVideo",
    ]),
    openqlc() {
      console.log("测试点击事件", this.forceBimData);
      this.openxmxx = true;
      for (let c = 0; c < this.forceBimData.length; c++) {
        if (this.forceBimData[c].k == "项目代码") {
          if (
            this.forceBimData[c].v != null ||
            this.forceBimData[c].v != "undefined" ||
            this.forceBimData[c].v != ""
          ) {
            this.code =
              "https://wzdjdm.wzcitybrain.com:8888/html/oneMap/projectInfo.html?project_code=" +
              this.forceBimData[c].v +
              "&id=";
          }
        }
        if (this.forceBimData[c].k == "项目编号") {
          this.code = this.code + this.forceBimData[c].v;
        }
      }
      console.log("全流程", this.code);
    },
    async openRtmpVideo() {
      if (window.entitiesID != undefined) {
        window.entitiesID.forEach((item) => {
          window.earth.entities.removeById(item);
        });
      }
      window.entitiesID = [];
      this.isRtmpVideoOpen = true;
      this.SetForceVideo(window.videodatas);
      console.log("画圈", window.earth);
      var points_X = "";
      var points_Y = "";
      var lng, lat;
      for (let d = 0; d < this.forceBimData.length; d++) {
        if (this.forceBimData[d].k == "CENTER_X") {
          points_X = this.forceBimData[d].v;
        }
        if (this.forceBimData[d].k == "CENTER_Y") {
          points_Y = this.forceBimData[d].v;
        }
      }
      lng = Number(points_X);
      lat = Number(points_Y);
      // 画圈
      console.log("[drawVideoCircle]", points_X, points_Y, this.queryRadius);
      const circleEntity = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 0),
        ellipse: {
          semiMinorAxis: this.queryRadius,
          semiMajorAxis: this.queryRadius,
          height: 12,
          material: Cesium.Color.BLUE.withAlpha(0.1),
          outline: true,
          outlineWidth: 3,
          outlineColor: Cesium.Color.BLUE,
        },
        name: "videoCircle",
      });
      window.earth.entities.add(circleEntity);
      console.log("circleEntity", circleEntity.id);
      window.entitiesID.push(circleEntity.id);
      const circleLabelEntity = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 500),
        label: {
          text: `周边${this.queryRadius}米内监控`,
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          font: "10px",
          scale: 1,
          outlineWidth: 4,
          showBackground: true,
          backgroundColor: Cesium.Color(0.165, 0.165, 0.165, 0.1),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0,
            10000
          ),
          eyeOffset: new Cesium.Cartesian3(0.0, -260.0, 0),
          scaleByDistance: new Cesium.NearFarScalar(5000, 1, 10000, 0.5),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        name: "videoCircleLabel",
      });
      window.earth.entities.add(circleLabelEntity);
      console.log("circleLabelEntity", circleLabelEntity.id);
      window.entitiesID.push(circleLabelEntity.id);

      // 画监控点
      const { data } = window.videodatas;
      //this.SetRtmpListOther(data);
      for (let i = 0; i < window.videodatas.length; i++) {
        const videoPointEntity = new Cesium.Entity({
          id: `videopoint_${window.videodatas[i].id}`,
          position: Cesium.Cartesian3.fromDegrees(
            Number(window.videodatas[i].properties.LONGITUDE),
            Number(window.videodatas[i].properties.LATITUDE),
            30
          ),
          billboard: {
            image: "../map/static/image/视频监控.png",
            //image: "../../../static/image/视频监控.png",
            width: 40,
            height: 40,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          name: window.videodatas[i].properties.NAME,
          url: window.videodatas[i].properties.VIDEO_URL,
        });
        window.earth.entities.add(videoPointEntity);
        window.entitiesID.push(videoPointEntity.id);
      }
    },
    openFloorStructure() {
      window.earth.entities.removeAll();
      var LC = "";
      var component = [
        "门",
        "窗",
        "墙",
        "楼板",
        "结构柱",
        "结构框架",
        "梯段",
        "平台",
      ];
      var dataSetNames = component.map(function (value, index) {
        return "第一栋:" + value;
      });
      dataSetNames.push("Block_2D:Block1_2D");
      for (let i = 0; i < this.forceBimData.length; i++) {
        if (this.forceBimData[i].k == "所属楼层") {
          LC = "'" + this.forceBimData[i].v + "'";
        }
      }
      LC = "所属楼层 = " + LC;
      console.log(LC);
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        // name:"墙@第一栋",
        attributeFilter: LC,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: dataSetNames,
        //数据源：二维数据
        //数据集：Building
      });
      var url =
        "http://172.20.83.223:8098/iserver/services/data-Placement_house_onetable/rest/data";
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: async (res) => {
            console.log("查询成功", res.originResult.features);
            var selectedFeatures = res.originResult.features;
            var Polygon_selected = [];
            var unit_list = ["A户型", "B户型", "C户型", "楼梯间"];
            var color_list = [
              new Cesium.Color(1.0, 0.0, 0.0, 0.5),
              new Cesium.Color(1, 1, 0, 0.5),
              new Cesium.Color(0, 112 / 255, 192 / 255, 0.5),
              new Cesium.Color(0, 178 / 255, 80 / 255, 0.5),
            ];
            for (var i = 0; i < selectedFeatures.length; i++) {
              if (selectedFeatures[i].fieldNames.indexOf("部件") == -1) {
                Polygon_selected.push(selectedFeatures[i]);
              }
            }
            for (var i = 0; i < Polygon_selected.length; i++) {
              addFeature(Polygon_selected[i]);
            }
            function addFeature(feature) {
              var unit =
                feature.fieldValues[feature.fieldNames.indexOf("UNIT")];
              var center = feature.geometry.center;
              var color_type = color_list[unit_list.indexOf(unit)];
              var lonLatArr = getLonLatArray(feature.geometry.points);
              var bottom =
                feature.fieldValues[feature.fieldNames.indexOf("BOTTOM")];
              var LSG = feature.fieldValues[feature.fieldNames.indexOf("LSG")];
              var headheight = parseFloat(bottom) + parseFloat(LSG);
              window.earth.entities.add({
                id: feature.ID,
                name: "单体化标识面",
                polygon: {
                  hierarchy: Cesium.Cartesian3.fromDegreesArray(lonLatArr),
                  material: color_type,
                  height: bottom,
                  extrudedHeight: headheight,
                },
                position: Cesium.Cartesian3.fromDegrees(
                  center.x,
                  center.y,
                  headheight + 1
                ),
                label: {
                  text: unit,
                  font: "32px sans-serif",
                  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                  outlineColor: Cesium.Color.BLACK,
                  outlineWidth: 2.0,
                },
              });
            }
            function getLonLatArray(points) {
              var point3D = [];
              points.forEach(function (point) {
                point3D.push(point.x);
                point3D.push(point.y);
              });
              return point3D;
            }
          },
          processFailed: (msg) => console.log("查询失败", msg),
        },
      });

      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
      this.$bus.$emit("cesium-3d-floorDIS", true);
    },
    closeRtmpVideo() {
      this.openxmxx = false;
    },
    closeFloorStructure() {
      window.earth.entities.removeAll();
      this.$bus.$emit("cesium-3d-floorDIS", false);
    },
    closeBimFrame() {
      this.openxmxx = false;
      this.closeFloorStructure();
      this.SetForceBimData([]);
      this.SetForceRoomData([]);
      this.SetForceBimIDS([]);
    },
  },
};
</script>
<style lang="less" scoped>
@import url("./InfoFrame.less");
.rtmpVideo {
  position: fixed;
  top: 100px;
  right: 400px;
  width: 400px;
  height: 300px;
}
</style>

<style lang="less" scoped>
.rtmpVideos {
  position: fixed;
  top: 13%;
  right: 21%;
  width: 60%;
  height: 73%;
  > iframe {
    width: 100%;
    height: 100%;
  }
  .close {
    position: absolute;
    right: 4px;
    top: 0;
    width: 0.2rem;
    height: 0.2rem;
    display: block;
    .bg-image("../../../page/map/images/zoom-in");
    transform: rotate(-45deg);
    transition: all 0.1s linear;
    cursor: pointer;
    z-index: 10;

    &:hover {
      transform: rotate(45deg);
    }
  }
}
.buttons {
  background-color: #00a3ff;
  border: none;
  color: white;
  padding: 3px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  /* font-size: 16px; */
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
}
.extra-frame {
  z-index: 999999;
  width: 1100px;
  height: 800px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.extra-frame iframe {
  height: 100%;
  width: 100%;
}
.extra-frame > span {
  display: block;
  height: 20px;
  width: 20px;
  cursor: pointer;
  background: black;
  color: #fff;
  font-weight: bold;
  position: absolute;
  top: 10px;
  right: 30px;
  line-height: 20px;
  border-radius: 10px;
  text-align: center;
}
.text1 {
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  line-height: 20px;
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
