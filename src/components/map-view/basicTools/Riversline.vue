<template>
  <div class="ThreeDContainer ThreeToTop" :style="{ width: '200px' }">
    <div class="riverline tframe">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item class="elformbtns">
              <el-button class="elformbtn" @click="cameraMove">视角调整</el-button>
              <el-button class="elformbtn" @click="search">跳水</el-button>
              <el-button class="elformbtn" v-show="false" @click="closeStationTour"
                >关闭</el-button
              >
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
const LAYER_NAME = [
  "水域演示精模",
  "河床",
  "上江河_3D面@构建DEM体",
  "上江河_3D面_拉伸@构建DEM体#1",
];
export default {
  name: "Riversline",
  data() {
    return {
      shallTree: false,
      keys: [],
      tourOn: false,
      
      flyManager: undefined,
      count: 0,
      overGroundLayer: undefined,
      mvtlx: undefined,
      fnScroll: () => {},
    };
  },
  watch: {},
  created() {},
  async mounted() {
    this.initBimScene();
    //this.cameraMove();
    //this.search();
  },
  beforeDestroy() {
    this.clearStationTour();
  },
  methods: {
    ...mapActions("map", ["SetForceBimData", "SetForceRoomData"]),
    //  相机移动
    cameraMove() {
      //console.log("河流", window.earth.scene.layers);
      console.log("相机参数1", window.earth.scene.camera.position);
      console.log("相机参数2", window.earth.scene.camera.heading);
      console.log("相机参数3", window.earth.scene.camera.pitch);
      console.log("相机参数4", window.earth.scene.camera.roll);

      window.earth.scene.camera.setView({
        destination: {
          x: -2877690.7069220613,
          y: 4841478.698497789,
          z: 2993449.5145672085,
        },
        orientation: {
          heading: 0.48970382265201895,
          pitch: -0.6896129601210967,
          roll: 6.283185307179586,
        },
      });
    },
    search() {
      window.earth.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          120.72506806961962,
          27.98754766590595,
          1.487572273333078
        ),
        orientation: {
          heading: 0.321597223687748,
          pitch: -0.2209482767212465,
          roll: 6.283185307179581,
        },
      });
    },
    //  初始化BIM场景
    initBimScene(fn) {
      window.earth.scene.camera.setView({
        destination: {
          x: -2877690.7069220613,
          y: 4841478.698497789,
          z: 2993449.5145672085,
        },
        orientation: {
          heading: 0.17533640226758695,
          pitch: -0.2630904626624466,
          roll: 6.283185307179586,
        },
      });
      const imageryLayers = window.earth.scene.imageryLayers;
      this.overGroundLayer = imageryLayers.get(1);
      this.overGroundLayer.transparentBackColorTolerance = 1;
      this.mvtlx = imageryLayers.get(2);
      this.mvtlx.transparentBackColorTolerance = 1;
      window.earth.scene.undergroundMode = true;
      window.earth.terrainProvider = new Cesium.CesiumTerrainProvider({
        url:
          "http://172.20.83.223:8098/iserver/services/3D-ShangJiangHeDiXing/rest/realspace/datas/MathAnalystResult_Clip@%E6%9E%84%E5%BB%BADEM%E4%BD%93",
        isSct: true, //地形服务源自SuperMap iServer发布时需设置isSct为true
      });

      //this.mvtlx.show = false;
      const _LAYER_ = window.earth.scene.layers.find(LAYER_NAME[0]);
      if (_LAYER_) {
        var layers = window.earth.scene.layers._layers._array;
        for (let i = 0; i < layers.length; i++) {
          if (layers[i].name == "水域演示精模") {
            layers[i].visible = true;
          }
          if (layers[i].name == "上江河_3D面@构建DEM体") {
            layers[i].visible = true;
          }
          if (layers[i].name == "上江河_3D面_拉伸@构建DEM体#1") {
            layers[i].visible = true;
          }
        }
      } else {
        const { Rivers_URL } = BimSourceURL;
        const promise = window.earth.scene.open(Rivers_URL);
        Cesium.when(promise, async (layers) => {});
      }
    },
    closeStationTour() {
      this.clearStationTour();
      this.$bus.$emit("cesium-3d-event", { value: null });
    },
    //  清除BIM模块
    clearStationTour() {
      const imageryLayer = window.earth.scene.imageryLayers;
      this.overGroundLayer = imageryLayer.get(1);
      this.overGroundLayer.transparentBackColorTolerance = 0;
      this.mvtlx = imageryLayer.get(2);
      this.mvtlx.transparentBackColorTolerance = 0;
      var layers = window.earth.scene.layers._layers._array;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].name == "水域演示精模") {
          layers[i].visible = false;
        }
        if (layers[i].name == "上江河_3D面@构建DEM体") {
          layers[i].visible = false;
        }
        if (layers[i].name == "上江河_3D面_拉伸@构建DEM体#1") {
          layers[i].visible = false;
        }
      }
      console.log("图层", window.earth.scene);
      for (let j = 0; j < imageryLayer._layers.length; j++) {
        if (imageryLayer._layers[j].imageryProvider.name == "河床") {
          //window.earth.scene.imageryLayers.removeAll();
          window.earth.scene.imageryLayers.remove(imageryLayer._layers[j], true);
        }
      }
      console.log("图层", window.earth.scene.imageryLayers._layers);
      //LAYER_NAME.map((d) => (window.earth.scene.layers.find(d).visible = false));
    },
  },
};
</script>
