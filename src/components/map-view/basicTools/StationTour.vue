<!--
 * @Author: eds
 * @Date: 2020-07-28 09:41:59
 * @LastEditTime: 2020-08-06 14:30:28
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\StationTour.vue
-->
<template>
  <div class="ThreeDContainer ThreeToTop" :style="{ width: '445px' }">
    <div class="stationtour tframe">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item class="elformbtns">
              <el-popover placement="top" title="图层选择" width="300" trigger="click">
                <div class="bim-analyse-tree" v-if="shallTree">
                  <el-tree
                    :data="StationTreeData"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    :default-expanded-keys="['all']"
                    :default-checked-keys="['all']"
                    @check-change="checkChange"
                  />
                </div>
                <el-button slot="reference" v-if="false">图层选择</el-button>
              </el-popover>
              <el-button class="elformbtn" :disabled="!tourOn" @click="startStationTour">开始漫游</el-button>
              <el-button class="elformbtn" :disabled="!tourOn" @click="pauseStationTour">暂停漫游</el-button>
              <el-button class="elformbtn" :disabled="!tourOn" @click="stopStationTour">停止漫游</el-button>
              <el-button class="elformbtn" :disabled="!tourOn" @click="cameraMove">视角调整</el-button>
              <el-button class="elformbtn" v-show="false" @click="closeStationTour">关闭</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { BimSourceURL } from "config/server/mapConfig";
const Cesium = window.Cesium;
import { mapActions } from "vuex";
var LAYERS = [
  {
    key: "Airport_B1_macro",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-mongodb5/rest/realspace/datas/Airport_B1_macro/config"
  },
  {
    key: "Airport_B1_micro",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-mongodb5/rest/realspace/datas/Airport_B1_micro/config"
  },
  {
    key: "Airport_B2_macro",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-mongodb5/rest/realspace/datas/Airport_B2_macro/config"
  },
  {
    key: "Airport_B2_micro",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-mongodb5/rest/realspace/datas/Airport_B2_micro/config"
  },
  {
    key: "Airport_roof",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-mongodb5/rest/realspace/datas/Airport_roof/config"
  }
];
const LAYER_NAME = [
  "Airport_B2_micro",
  "Airport_roof",
  "Airport_B2_macro",
  "Airport_B1_micro",
  "Airport_B2_invisible",
  "Airport_B1_macro"
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
      
      flyManager: undefined
    };
  },
  watch: {
    StationTreeData: {
      handler(n, o) {
        n[0].children.length == 3 && (this.shallTree = true);
      },
      deep: true
    }
  },
  created() {
    const routes = new Cesium.RouteCollection(window.earth.entities);
    routes.fromFile("./static/fpf/机场站内漫游.fpf");
    this.flyManager = new Cesium.FlyManager({
      scene: window.earth.scene,
      routes: routes
    });
  },
  async mounted() {
    this.initBimScene();
    this.eventRegsiter();
    this.cameraMove();
  },
  beforeDestroy() {
    this.clearStationTour();
  },
  methods: {
    ...mapActions("map", ["SetForceBimData", "SetForceRoomData"]),
    //  事件绑定
    eventRegsiter() {
      const that = this;
      that.flyManager.stopArrived.addEventListener(function(routeStop) {
        routeStop.waitTime = 0.4; // 在每个站点处停留1s
      });
      that.flyManager.readyPromise.then(() => {
        that.tourOn = true;
      });
    },
    //  相机移动
    cameraMove() {
      this.stopStationTour();
      window.earth.scene.camera.setView({
        destination: {
          x: -2889836.1221072627,
          y: 4839196.223723019,
          z: 2985417.9096547803
        },
        orientation: {
          heading: 5.276883674010309,
          pitch: -0.510722024776082,
          roll: 0
        }
      });
    },
    //  初始化BIM场景
    initBimScene(fn) {
      
      window.earth.scene.screenSpaceCameraController.minimumZoomDistance = -20;
      //window.earth.scene.debugShowFramesPerSecond = true;//帧数
      const _LAYER_ = window.earth.scene.layers.find(LAYER_NAME[0]);
      if (_LAYER_) {
        LAYERS.map(v => {
          window.earth.scene.layers.find(v.key).visible = true;
        });
      } else {
        const promise_array = LAYERS.map(v => {
          //console.log(v);
          return (
            window.earth.scene.addS3MTilesLayerByScp(v.url, {
              name: v.key
            })
          );
        });
        const layers_airport = LAYERS.map(v => {
          return v.key;
        });
        const { STATION_SCENE_URL, STATION_DATA_URL } = BimSourceURL;
        //const promise = window.earth.scene.open(STATION_SCENE_URL);
        Promise.all(promise_array).then(function(layers) {
          window.earth.scene.camera.setView({
            destination: {
              x: -2889836.1221072627,
              y: 4839196.223723019,
              z: 2985417.9096547803
            },
            orientation: {
              heading: 5.276883674010309,
              pitch: -0.510722024776082,
              roll: 0
            }
          });
          for (var layer_name of layers_airport) {
            //console.log(layer_name);
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
        // Cesium.when(promise_array, async layers => {
        //   for (var layer_name of layers_airport) {
        //     console.log(layer_name);
        //     var layer_airport = window.earth.scene.layers.find(layer_name);
        //     console.log("layer_airport",window.earth.scene.layers.find(layer_name));
        //     if (
        //       layer_name.indexOf("macro") != -1 ||
        //       layer_name.indexOf("roof") != -1
        //     ) {
        //       console.log(layer_name.indexOf("macro"));
        //       layer_airport.lodRangeScale = 0.01;
        //       layer_airport.clearMemoryImmediately = false;
        //       console.log("0.01")
        //     } else if (layer_name.indexOf("invisible") != -1) {
        //       //console.log(layer_airport);
        //       layer_airport.visible = false;
        //     } else {
        //       layer_airport.lodRangeScale = 1;
        //     }
        //     //console.log(layer_airport);
        //     // layer_airport.lodRangeScale = 0.01;
        //     // console.log(layer_name);
        //   }
        //   LAYERS.map((d, index) => {
        //     if (index > 2) return undefined;
        //     const layer = window.earth.scene.layers.find(d);
        //     layer.setQueryParameter({
        //       url: STATION_DATA_URL,
        //       dataSourceName: d,
        //       isMerge: true
        //     });
        //     const color = new Cesium.Color.fromCssColorString(
        //       "rgba(23,92,239,0.3)"
        //     );
        //     layer.selectedColor = color;
        //     layer.datasetInfo().then(result => {
        //       this.keys = [...this.keys, ...result.map(v => v.datasetName)];
        //       this.StationTreeData[0].children.push({
        //         id: d,
        //         label: d,
        //         children: result.map((v, index) => {
        //           return {
        //             id: `${d}_${index}`,
        //             label: v.datasetName,
        //             k: d,
        //             startID: v.startID,
        //             endID: v.endID
        //           };
        //         })
        //       });
        //     });
        //   });
        // });
      }
    },
    //  树结构改变
    checkChange(...params) {
      // const obj = { 顶板: [], "机场站-B1": [], "机场站-B2": [] };
      // const nodes = this.$refs.tree
      //   .getCheckedNodes()
      //   .filter((v) => !v.children)
      //   .map((v) => {
      //     for (let i = v.startID; i < v.endID + 1; i++) {
      //       obj[v.k].push(i);
      //     }
      //   });
      // Object.keys(obj).map((v) => {
      //   const layer = window.earth.scene.layers.find(v);
      //   layer.setObjsVisible(obj[v], true);
      // });
    },
    startStationTour() {
      var mvtMap = window.mvtmaps;
      var mapboxStyle = mvtMap.mapboxStyle;
      var layers = mapboxStyle.layers;
      for (let j = 0; j < layers.length; j++) {
        mvtMap.setLayoutProperty(layers[j].id, "visibility", "none"); //隐藏某个图层
      }
      window.earth.scene.undergroundMode = true;
      window.earth.scene.globe.globeAlpha = 0;
      this.flyManager && this.flyManager.play();
    },
    pauseStationTour() {
      this.flyManager && this.flyManager.pause();
    },
    stopStationTour() {
      var mvtMap = window.mvtmaps;
      var mapboxStyle = mvtMap.mapboxStyle;
      var layers = mapboxStyle.layers;
      for (let j = 0; j < layers.length; j++) {
        mvtMap.setLayoutProperty(layers[j].id, "visibility", "visible"); //隐藏某个图层
      }
      window.earth.scene.undergroundMode = false;
      window.earth.scene.globe.globeAlpha = 1;
      this.flyManager && this.flyManager.stop();
    },
    closeStationTour() {
      this.clearStationTour();
      this.$bus.$emit("cesium-3d-event", { value: null });
    },
    //  清除BIM模块
    clearStationTour() {
      this.stopStationTour();
      window.earth.scene.camera.setView({
        destination: {
          x: -2889836.1221072627,
          y: 4839196.223723019,
          z: 2985417.9096547803
        },
        orientation: {
          heading: 5.276883674010309,
          pitch: -0.510722024776082,
          roll: 0
        }
      });
      var mvtMap = window.mvtmaps;
      var mapboxStyle = mvtMap.mapboxStyle;
      var layers = mapboxStyle.layers;
      for (let j = 0; j < layers.length; j++) {
        mvtMap.setLayoutProperty(layers[j].id, "visibility", "visible"); //显示mvt图层
      }
      window.earth.scene.undergroundMode = false;
      window.earth.scene.globe.globeAlpha = 1;
      window.earth.scene.screenSpaceCameraController.minimumZoomDistance = 0;
      this.flyManager && (this.flyManager = undefined);
      LAYERS.map(v => {
        //console.log("图层", window.earth.scene.layers.find(v.key));
        window.earth.scene.layers.find(v.key).visible = false;
      });
    }
  }
};
</script>
