<template>
  <div class="SZGC"></div>
</template>

<script>
const Cesium = window.Cesium;
import { BimSourceURL } from "config/server/mapConfig";
const LAYERS = [{ name: "SZGC", url: BimSourceURL.SZGC }];
export default {
  name: "SZGC",
  async mounted() {
    this.initBimScene();
    this.eventRegsiter();
    this.cameraMove();
  },
  beforeDestroy() {
    this.closeTrafficSubwayModel();
  },
  methods: {
    //  事件绑定
    eventRegsiter() {
      const that = this;
    },
    //  初始化BIM场景
    initBimScene(fn) {
      const _LAYER_ = window.earth.scene.layers.find(LAYERS[0].name);
      const PROMISES = LAYERS.map((v) => {
        return (window.earth.scene.terrainProvider = new Cesium.CesiumTerrainProvider(
          {
            url: v.url,
            requestWaterMask: true,
          }
        ));
      });
    },
    //  相机移动
    cameraMove() {
      window.earth.camera.flyTo({
        destination: {
          x: -2879361.2453708444,
          y: 4842957.116771699,
          z: 2993404.3775209677,
        },
        orientation: {
          heading: 5.9232943303067405,
          pitch: -0.574668319401269,
          roll: 0,
        },
      });
    },
    //  关闭地表地形模型模块
    closeTrafficSubwayModel() {
      this.clearTrafficSubwayModel();
      this.$bus.$emit("cesium-3d-szgc", { value: null });
    },
    //  清除地表地形模型模块
    clearTrafficSubwayModel() {
      LAYERS.map((v) => {
        var ellipsoidProvider = new Cesium.EllipsoidTerrainProvider();
        window.earth.terrainProvider = ellipsoidProvider;
      });
    },
  },
};
</script>