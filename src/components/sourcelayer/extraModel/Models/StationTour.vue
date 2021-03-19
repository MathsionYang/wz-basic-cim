<template>
  <div class="ThreeDContainer">
    <div
      class="sightline tframe"
      style="background-color: rgba(5, 41, 110, 0.78)"
    >
      <div>
        <div class="buttons" @click="startStationTour">
          <span class="bt">开始漫游</span>
        </div>
        <div class="buttons" @click="pauseStationTour">
          <span class="bt">暂停漫游</span>
        </div>
        <div class="buttons" @click="stopStationTour">
          <span class="bt">停止漫游</span>
        </div>
        <div class="buttons" @click="closeStationTour">
          <span class="bt">视角调整</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const Cesium = window.Cesium;
import { ExtraSourceURL } from "config/server/mapConfig";
import { treeDrawTool } from "components/sourcelayer/layerHub/TreeDrawTool";
import { getIserverFields } from "api/iServerAPI";
import { mapGetters, mapActions } from "vuex";
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
      tourOn: false,
      viewer: undefined,
      flyManager: undefined,
      label: {
        dataset: "erweidata:T2_WZ_S1_Station_2019",
        icon: "S1站点",
        id: "S1站点",
        label: "S1站点",
        newdataset: "erweidata:T2_WZ_S1_Station_2019",
        type: "mvt",
        url:
          "http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data",
        withExtraData: "stationList",
        withExtraDataGeometry: "stationListWithGeometry",
        saveExtraDataByGeometry: "setStationListWithGeometry",
        withExtraKey: "NAME",
        hiddenLabel: true
      },
      tileLayers: {}
    };
  },
  computed: {
    ...mapGetters("map", [
      "forceTreeLabel",
      "forceTrueTopicLabels",
      "forceTreeEventLabel"
    ])
  },
  created() {
    this.viewer = window.earth;
    const routes = new Cesium.RouteCollection(this.viewer.entities);
    routes.fromFile("./static/fpf/机场站内漫游.fpf");
    this.flyManager = new Cesium.FlyManager({
      scene: this.viewer.scene,
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
    this.viewer = undefined;
  },
  methods: {
    ...mapActions("map", [
      "SetForceTreeLabel",
      "SetForceTrueTopicLabels",
      "SetForceTrueTopicLabelId"
    ]),
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
      //this.stopStationTour();
      this.viewer.scene.camera.setView({
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
      //this.viewer.scene.debugShowFramesPerSecond = true;//帧数
      const _LAYER_ = window.earth.scene.layers.find(LAYER_NAME[0]);
      if (_LAYER_) {
        LAYERS.map(v => {
          window.earth.scene.layers.find(v.key).visible = true;
        });
      } else {
        const promise_array = LAYERS.map(v => {
          return window.earth.scene.addS3MTilesLayerByScp(v.url, {
            name: v.key
          });
        });
        const layers_airport = LAYERS.map(v => {
          return v.key;
        });
        Promise.all(promise_array).then(function(layers) {
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
          }
        });
      }
    },
    startStationTour() {
      if (window.billboardMap[this.label.id]._billboards[0].show == true) {
        this.liebiao(this.label);
      }
      window.earth.scene.undergroundMode = true;
      window.earth.scene.globe.globeAlpha = 0;
      this.flyManager && this.flyManager.play();
    },
    pauseStationTour() {
      this.flyManager && this.flyManager.pause();
    },
    stopStationTour() {
      if (window.billboardMap[this.label.id]._billboards[0].show == false) {
        this.liebiao(this.label);
      }
      window.earth.scene.undergroundMode = false;
      window.earth.scene.globe.globeAlpha = 1;
      this.flyManager && this.flyManager.stop();
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
    liebiao(label) {
      if (~this.forceTrueTopicLabels.indexOf(label.id)) {
        let _fttl_ = [...this.forceTrueTopicLabels];
        _fttl_.splice(_fttl_.indexOf(label.id), 1);
        this.SetForceTrueTopicLabels(_fttl_);
        this.nodeCheckChange(label, false);
      } else {
        this.SetForceTrueTopicLabels([
          ...new Set(this.forceTrueTopicLabels.concat([label.id]))
        ]);
        this.SetForceTrueTopicLabelId(label.id);
        this.nodeCheckChange(label, true);
      }
    },
    nodeCheckChange(node, checked) {
      if (checked) {
        if (node.type == "mvt" && node.id) {
          if (node.id && window.billboardMap[node.id]) {
            window.billboardMap[node.id]._billboards.map(v => (v.show = true));
            window.labelMap[node.id].setAllLabelsVisible(true);
          } else {
            this.getPOIPickedFeature(node, () => {
              this.switchSearchBox(node);
            });
          }
          window.checkedkey.push(node.id); //单图层数据存储到已选择数组中
          this.layerdatas = { label: node.label, id: node.id };
          window.layersdata.push(this.layerdatas);
        }
        this.switchSearchBox(node);
        //  有相机视角配置 -> 跳视角
        node.camera && window.earth.scene.camera.setView(node.camera);
      } else {
        const LAYER =
          node.type == "model"
            ? window.earth.scene.layers.find(node.id)
            : this.tileLayers[node.id];
        LAYER && (LAYER.show = false);
        if (node.icon && window.billboardMap[node.id]) {
          window.billboardMap[node.id]._billboards.map(v => (v.show = false));
          window.labelMap[node.id].setAllLabelsVisible(false);
          //清除已选择图层内容
          for (var i = 0; i < window.layersdata.length; i++) {
            if (window.layersdata[i].id == node.id) {
              window.layersdata.splice(i, 1);
            }
          }
          //清除图例
          for (let a = 0; a < window.checkedkey.length; a++) {
            if (window.checkedkey[a] == node.id) {
              window.checkedkey.splice(a, 1);
            }
          }
        }

        node.componentEvent &&
          this.$bus.$emit(node.componentEvent, { value: null });
      }
    },
    getPOIPickedFeature(node, fn) {
      const { newdataset, url } = node;
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: `SMID >= 0`
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: [newdataset]
      });
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: async res => {
            const fields = await getIserverFields(url, newdataset);
            treeDrawTool(this, res, node, fields, fn);
          },
          processFailed: msg => console.log(msg)
        }
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },
    switchSearchBox(node) {
      console.log("switchSearchBox", node);
      this.$bus.$emit("cesium-3d-switch-searchBox", {
        shall: node.type == "mvt" && node.id ? true : false,
        node
      });
    },
    closeStationTour() {
      this.clearStationTour();
    },
    //  清除BIM模块
    clearStationTour() {
      this.flyManager && this.flyManager.stop();
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
<style>
.ThreeDContainer {
  position: absolute;
  z-index: 7;
  top: 8vh;
  left: 16vw;
  border: 27px solid transparent;
  -moz-border-image: url("/static/images/common/框.png") 30 30 round; /* Old Firefox */
  -webkit-border-image: url("/static/images/common/框.png") 30 30 round; /* Safari and Chrome */
  -o-border-image: url("/static/images/common/框.png") 30 30 round; /* Opera */
  border-image: url("/static/images/common/框.png") 30 30 round;
}

.buttons {
  height: 5vh;
  opacity: 1;
  z-index: 7;
  margin-right: 10px;
  margin-top: 5px;
  width: 10vh;
  background-size: 100% 100%;
  border: 0;
  display: inline-block;
  background-image: url(/static/images/mode-ico/工具栏按钮.png);
}
.buttons:hover {
  height: 5vh;
  opacity: 1;
  z-index: 7;
  margin-right: 10px;
  margin-top: 5px;
  width: 10vh;
  background-size: 100% 100%;
  border: 0;
  display: inline-block;
  background-image: url(/static/images/mode-ico/工具栏按钮选中.png);
}

.bt {
  font-size: 18px;
  font-family: YouSheBiaoTiHei;
  color: rgb(255, 255, 255);
  text-shadow: rgb(4 36 39 / 40%) 0px 2px 4px;
  opacity: 1;
  margin: 0.5vh 0vw;
  display: block;
  width: 100%;
  height: 100%;
  text-align: center;
}
.bt:hover {
  font-size: 18px;
  font-family: YouSheBiaoTiHei;
  color: #ffff08;
  text-shadow: rgb(4 36 39 / 40%) 0px 2px 4px;
  opacity: 1;
  margin: 0.5vh 0vw;
  display: block;
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>
