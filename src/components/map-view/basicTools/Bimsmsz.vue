<!--
 * @Author: eds
 * @Date: 2020-07-28 09:41:59
 * @LastEditTime: 2020-08-06 14:30:28
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\StationTour.vue
-->
<template>
  <div class="ThreeDContainer ThreeToTop" :style="{ width: '530px' }">
    <div class="stationtour tframe" id="toolbar">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item class="elformbtns">
              <el-button class="elformbtn" @click="startStationTour"
                >地上建筑</el-button
              >
              <el-button class="elformbtn" @click="pauseStationTour"
                >停车场1F</el-button
              >
              <el-button class="elformbtn" @click="stopStationTour"
                >停车场2F</el-button
              >
              <el-button class="elformbtn" id="eventRegsiter"
                >倾斜开挖</el-button
              >
              <el-button class="elformbtn" @click="clear">清除</el-button>
              <br />
              <label class="UnderGroundTitle">图层透明:</label>
              <input
                type="range"
                style="width: 70%; margin-top: 13px"
                value="0"
                min="0"
                max="1"
                step="0.02"
                title="调整地上图层透明度"
                data-bind="value: overGroundAlpha, valueUpdate: 'input'"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
const Cesium = window.Cesium;
import { queryFloorByBottom } from "./BimAnalyseFloorSection";
import {mapGetters, mapActions } from "vuex";
var LAYERS = [
  {
    key: "SMZX_Block",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-mongodb-citizens/rest/realspace/datas/citizens/config",
    // "http://125.124.19.162:8090/iserver/services/3D-mongodb/rest/realspace/datas/Block/config",
  },
  {
    key: "SMZX_B1_macro",
    url:
      "http://125.124.19.162:8090/iserver/services/3D-mongodb/rest/realspace/datas/B1_macro/config",
  },
  {
    key: "SMZX_B1_micro",
    url:
      "http://125.124.19.162:8090/iserver/services/3D-mongodb/rest/realspace/datas/B1_micro/config",
  },
  {
    key: "SMZX_B2_macro",
    url:
      "http://125.124.19.162:8090/iserver/services/3D-mongodb/rest/realspace/datas/B2_macro/config",
  },
  {
    key: "SMZX_B2_micro",
    url:
      "http://125.124.19.162:8090/iserver/services/3D-mongodb/rest/realspace/datas/B2_micro/config",
  },
  {
    key: "SMZX_roof",
    url:
      "http://125.124.19.162:8090/iserver/services/3D-mongodb/rest/realspace/datas/Roof/config",
  },
];
const LAYER_NAME = [
  "SMZX_Block",
  "SMZX_B1_macro",
  "SMZX_B1_micro",
  "SMZX_B2_macro",
  "SMZX_B2_micro",
  "SMZX_roof",
];
export default {
  name: "StationTour",
  data() {
    return {
      shallTree: false,
      keys: [],
      StationTreeData: [{ id: "all", label: "图层控制", children: [] }],
      tourOn: false,
      // cesium Object
      viewer: undefined,
      flyManager: undefined,
      handlerPolygon: undefined,
      overGroundLayer: undefined,
      globe: undefined,
      scene: undefined,
      tooltip: undefined,
      promise: undefined,
      notclick: "1",
      kaiwa: false,
      BimHash: {},
      endID: 0,
      //  floor IDS
      IDS: [],
      FLOOR_ON: false,
      //  cesium Object
      handler: undefined,
      lastHouseEntity: undefined,
      //  节流
      count: 0,
      fnScroll: () => {},
    };
  },
  watch: {
    StationTreeData: {
      handler(n, o) {
        n[0].children.length == 3 && (this.shallTree = true);
      },
      deep: true,
    },
  },
  created() {
    this.viewer = window.earth;
    this.scene = this.viewer.scene;
    this.scene = this.viewer.globe;
    this.handlerPolygon = new Cesium.DrawHandler(
      this.viewer,
      Cesium.DrawMode.Polygon
    );
  },
  async mounted() {
    this.initBimScene();
    this.eventRegsiter();
    //this.cameraMove();
  },
  beforeDestroy() {
    this.clearStationTour();
    this.viewer = undefined;
  },
  methods: {
    ...mapActions("map", [
      "SetForceBimData",
      "SetForceRoomData",
      "SetForceBimIDS",
    ]),
    //  事件绑定
    eventRegsiter() {
      const that = this;
      //监听滑动条变化，改变alpha的值，设置地表透明度
      var viewModel = {
        color: "#ffffff",
        overGroundAlpha: 0,
      };
      Cesium.when(this.promise, function (layers) {
        //这里要跟图层一起加载，不能放到场景初始化的时候，否则会找不到这个图层导致没有效果进行
        //that.viewer.scene.globe.globeAlpha = 0;
        //获取地球表面的透明度 默认为1 1为不透明 0为完全透明
        //const abc = that.viewer.scene.globe.globeAlpha;
        //这里是用来找到这个场景里的所有图层

        const imageryLayers = window.earth.scene.imageryLayers;
        //console.log("images", imageryLayers);
        //找到 YX_2019_SW 图层 这个方法等同于scene.find
        that.overGroundLayer = imageryLayers.get(1);
        //进行图层的透明控制
        Cesium.knockout.track(viewModel);
        var tlbar = document.getElementById("toolbar");
        Cesium.knockout.applyBindings(viewModel, tlbar);
        Cesium.knockout.getObservable(viewModel, "overGroundAlpha").subscribe(
          // 设置地表图层透明度 1为不透明 0为透明
          function (newValue) {
            that.overGroundLayer.transparentBackColorTolerance = newValue;
            if (newValue == 1) {
              that.viewer.scene.globe.globeAlpha = 0;
            } else if (newValue != 1) {
              that.viewer.scene.globe.globeAlpha = 1;
            }
          }
        );
        $("#eventRegsiter").on("click", function () {
          window.earth.scene.layers.find("SMZX_Block").visible = false;
          window.earth.scene.layers.find("SMZX_roof").visible = false;
          that.handlerPolygon.activeEvt.addEventListener(function (isActive) {
            if (isActive == true) {
              that.viewer.enableCursorStyle = false;
              that.viewer._element.style.cursor = "";
              $("body").removeClass("drawCur").addClass("drawCur");
            } else {
              that.viewer.enableCursorStyle = true;
              $("body").removeClass("drawCur");
            }
          });
          that.handlerPolygon.movingEvt.addEventListener(function (
            windowPosition
          ) {
            if (windowPosition.x < 2000 && windowPosition.y < 2000) {
              //this.tooltip.setVisible(false);
              return;
            }
          });
          that.handlerPolygon.drawEvt.addEventListener(function (result) {
            if (!result.object.positions) {
              // this.tooltip.showAt(result, "<p>请绘制正确的多边形</p>");
              that.handlerPolygon.polygon.show = false;
              that.handlerPolygon.polyline.show = false;
              that.handlerPolygon.deactivate();
              that.handlerPolygon.activate();
              return;
            }
            var array = [].concat(result.object.positions);
            //this.tooltip.setVisible(false);
            var positions = [];
            for (var i = 0, len = array.length; i < len; i++) {
              //获取经纬度和高度
              var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
              var longitude = Cesium.Math.toDegrees(cartographic.longitude);
              var latitude = Cesium.Math.toDegrees(cartographic.latitude);
              var height = cartographic.height;
              if (
                positions.indexOf(longitude) == -1 &&
                positions.indexOf(latitude) == -1
              ) {
                positions.push(longitude);
                positions.push(latitude);
                positions.push(height);
              }
            }
            that.viewer.scene.globe.removeAllExcavationRegion();
            //开挖深度
            that.viewer.scene.globe.addExcavationRegion({
              name: "ggg",
              position: positions,
              height: 50,
              transparent: false,
            });
            that.handlerPolygon.polygon.show = false;
            that.handlerPolygon.polyline.show = false;
            that.handlerPolygon.deactivate();
            that.handlerPolygon.activate();
          });
          that.handlerPolygon.activate();
        });
      });
    },
    eventRegsiters() {
      console.log("调用成功");
      const that = this;
      this.$bus.$off("cesium-3d-floorDIS");
      this.$bus.$on("cesium-3d-floorDIS", (value) => {
        const layer = this.viewer.scene.layers.find(LAYER_NAME);
        if (value) {
          layer.setObjsVisible(this.forceBimIDS, true);
        } else {
          const IDS = [];
          const endID = this.endID;
          for (let i = 0; i < endID + 1; i++) {
            IDS.push(i);
          }
          layer.setObjsVisible(IDS, true);
        }
      });
      let position = window.position;
      !position && (position = Cesium.Cartesian3.fromDegrees(0, 0, 0));
      const cartographic = Cesium.Cartographic.fromCartesian(position);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      const height = cartographic.height;
      that.bindDataSQL({ x: longitude, y: latitude, z: height });
    },
    //  相机移动
    cameraMove() {
      this.stopStationTour();
      window.earth.scene.camera.setView({
        destination: {
          x: -2876892.364809324,
          y: 4841021.431217134,
          z: 2995312.6326809525,
        },
        orientation: {
          heading: 6.003945075821948,
          pitch: -0.5756540908458359,
          roll: 0,
        },
      });
    },
    //  初始化BIM场景
    initBimScene(fn) {
      const that = this;
      this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = -100;
      //this.viewer.scene.debugShowFramesPerSecond = true;//帧数
      const _LAYER_ = this.viewer.scene.layers.find(LAYER_NAME[0]);
      if (_LAYER_) {
        LAYERS.map((v) => {
          window.earth.scene.layers.find(v.key).visible = true;
        });
        that.globe = that.viewer.scene.globe;
        //开启地下模式
        that.viewer.scene.undergroundMode = true;
        //设置相机最小缩放距离,距离地表-1000米
        that.viewer.scene.screenSpaceCameraController.minimumZoomDistance = -1000;
        // 关闭裙边
        that.viewer.scene.terrainProvider.isCreateSkirt = false;
      } else {
        const promise_array = LAYERS.map((v) => {
          return window.earth.scene.addS3MTilesLayerByScp(v.url, {
            name: v.key,
          });
        });
        Cesium.when(promise_array, async (layers) => {
          const layer = this.viewer.scene.layers.find(LAYER_NAME[0]);
          layer.setQueryParameter({
            url:
              "http://172.20.83.223:8098/iserver/services/data-citizens_table/rest/data",
            dataSourceName: "citizens_table",
            isMerge: true,
          });
          const color = new Cesium.Color.fromCssColorString(
            "rgba(23,92,239,0.3)"
          );
          layer.selectedColor = color;
        });
        that.promise = promise_array;
        const layers_airport = LAYERS.map((v) => {
          return v.key;
        });
        that.globe = that.viewer.scene.globe;
        //开启地下模式
        that.viewer.scene.undergroundMode = true;
        //设置相机最小缩放距离,距离地表-1000米
        // 关闭裙边
        that.viewer.scene.terrainProvider.isCreateSkirt = false;
        Promise.all(promise_array).then(function (layers) {
          window.earth.scene.camera.setView({
            destination: {
              x: -2876892.364809324,
              y: 4841021.431217134,
              z: 2995312.6326809525,
            },
            orientation: {
              heading: 6.003945075821948,
              pitch: -0.5756540908458359,
              roll: 0,
            },
          });
          for (var layer_name of layers_airport) {
            var layer_airport = window.earth.scene.layers.find(layer_name);
            if (
              layer_name.indexOf("macro") != -1 ||
              layer_name.indexOf("roof") != -1
            ) {
              layer_airport.lodRangeScale = 0.01;
              layer_airport.clearMemoryImmediately = false;
            } else if (layer_name.indexOf("invisible") != -1) {
              layer_airport.visible = false;
            } else {
              layer_airport.lodRangeScale = 1;
            }
            // layer_airport.lodRangeScale = 0.01;
          }
        });
      }
    },
    //地上模型
    startStationTour() {
      LAYERS.map((v) => {
        window.earth.scene.layers.find(v.key).visible = true;
      });
      this.viewer.scene.undergroundMode = false;
      this.viewer.scene.globe.globeAlpha = 1;
      var mvtMap = window.mvtmaps;
      var mapboxStyle = mvtMap.mapboxStyle;
      var layers = mapboxStyle.layers;
      for (let j = 0; j < layers.length; j++) {
        mvtMap.setLayoutProperty(layers[j].id, "visibility", "visible"); //显示某个图层
      }
    },
    //地下停车场1f
    pauseStationTour() {
      window.earth.scene.layers.find("SMZX_Block").visible = false;
      window.earth.scene.layers.find("SMZX_roof").visible = false;
      var mvtMap = window.mvtmaps;
      var mapboxStyle = mvtMap.mapboxStyle;
      var layers = mapboxStyle.layers;
      for (let j = 0; j < layers.length; j++) {
        mvtMap.setLayoutProperty(layers[j].id, "visibility", "none"); //隐藏某个图层
      }
      this.viewer.scene.undergroundMode = true;
      this.viewer.scene.globe.globeAlpha = 0;
    },
      //地下停车场2f
    stopStationTour() {
      window.earth.scene.layers.find("SMZX_Block").visible = false;
      window.earth.scene.layers.find("SMZX_roof").visible = false;
      window.earth.scene.layers.find("SMZX_B1_macro").visible = false;
      window.earth.scene.layers.find("SMZX_B1_micro").visible = false;
      var mvtMap = window.mvtmaps;
      var mapboxStyle = mvtMap.mapboxStyle;
      var layers = mapboxStyle.layers;
      for (let j = 0; j < layers.length; j++) {
        mvtMap.setLayoutProperty(layers[j].id, "visibility", "none"); //隐藏某个图层
      }
      this.viewer.scene.undergroundMode = true;
      this.viewer.scene.globe.globeAlpha = 0;
    },
    //清除
    clear() {
      LAYERS.map((v) => {
        window.earth.scene.layers.find(v.key).visible = true;
      });
      this.viewer.scene.globe.removeAllExcavationRegion();
      this.viewer.scene.undergroundMode = false;
      this.viewer.scene.globe.globeAlpha = 1;
      var mvtMap = window.mvtmaps;
      var mapboxStyle = mvtMap.mapboxStyle;
      var layers = mapboxStyle.layers;
      for (let j = 0; j < layers.length; j++) {
        mvtMap.setLayoutProperty(layers[j].id, "visibility", "visible"); //显示某个图层
      }
    },
    closeStationTour() {
      this.clearStationTour();
      this.$bus.$emit("cesium-3d-event", { value: null });
    },
    //  清除BIM模块
    clearStationTour() {
      this.viewer.scene.undergroundMode = false;
      this.viewer.scene.globe.globeAlpha = 1;
      var mvtMap = window.mvtmaps;
      var mapboxStyle = mvtMap.mapboxStyle;
      var layers = mapboxStyle.layers;
      for (let j = 0; j < layers.length; j++) {
        mvtMap.setLayoutProperty(layers[j].id, "visibility", "visible"); //显示某个图层
      }
      window.earth.scene.camera.setView({
        destination: {
          x: -2876892.364809324,
          y: 4841021.431217134,
          z: 2995312.6326809525,
        },
        orientation: {
          heading: 6.003945075821948,
          pitch: -0.5756540908458359,
          roll: 0,
        },
      });
      window.earth.scene.screenSpaceCameraController.minimumZoomDistance = 0;
      LAYERS.map((v) => {
        window.earth.scene.layers.find(v.key).visible = false;
      });
    },
  },
};
</script>
<style>
.UnderGroundTitle {
  margin-left: 2px;
  float: left;
}
</style>