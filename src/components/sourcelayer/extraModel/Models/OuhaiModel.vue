<template>
  <div class="OuhaiModel"></div>
</template>

<script>
const Cesium = window.Cesium;
import { ExtraSourceURL } from "config/server/mapConfig";
import { mapGetters, mapActions } from "vuex";
const LAYERS = [{ name: "OuhaiModel", url: ExtraSourceURL.OUHAI }];
export default {
  name: "OuhaiModel",
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
      if (_LAYER_) {
        LAYERS.map((v) => {
          const V_LAYER = window.earth.scene.layers.find(v.name);
          V_LAYER.visible = true;
        });
      } else {
        const PROMISES = LAYERS.map((v) => {
          return window.earth.scene.addS3MTilesLayerByScp(v.url, {
            name: v.name,
          });
        });

      }
    },
    //  相机移动
    cameraMove() {
      let position = Cesium.Cartesian3.fromDegrees(120.6124, 27.9594, 800)
      console.log('position!!!', position)
      window.earth.camera.flyTo({
        destination: {
          x: position.x,
          y: position.y,
          z: position.z,
        },
        orientation: {
          heading: 6.2332943303067405,
          pitch: -0.574668319401269,
          roll: 0,
        },
      });
    },
    //  关闭倾斜摄影模块
    closeTrafficSubwayModel() {
      this.clearTrafficSubwayModel();
      this.$bus.$emit("cesium-3d-hub-event", { value: null });
    },
    //  清除BIM模块
    clearTrafficSubwayModel() {
      LAYERS.map((v) => {
        const V_LAYER = window.earth.scene.layers.find(v.name);
        V_LAYER.visible = false;
      });
    },
  },
};
</script>