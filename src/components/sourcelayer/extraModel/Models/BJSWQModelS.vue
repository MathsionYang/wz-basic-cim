<template>
  <div class="BjswqModelss"></div>
</template>

<script>
const Cesium = window.Cesium;
import { ExtraSourceURL } from "config/server/mapConfig";
import { mapGetters, mapActions } from "vuex";
const LAYERS_NEW = [{ name: "BJSWQNEW", url: ExtraSourceURL.BJSWQNEW }];
const LAYERS = [{ name: "BJSWQNEW1", url: ExtraSourceURL.BJSWQNEW1 }];
export default {
  name: "BjswqModelss",
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
      const _LAYER_ = window.earth.scene.layers.find(LAYERS_NEW[0].name);
      if (_LAYER_) {
        LAYERS_NEW.map(v => {
          const V_LAYER = window.earth.scene.layers.find(v.name);
          V_LAYER.visible = true;
        });
        LAYERS.map(v => {
          const V_LAYER = window.earth.scene.layers.find(v.name);
          V_LAYER.visible = true;
        });
      } else {
        LAYERS_NEW.map(v => {
          return window.earth.scene.addS3MTilesLayerByScp(v.url, {
            name: v.name
          });
        });
        LAYERS.map(v => {
          return window.earth.scene.addS3MTilesLayerByScp(v.url, {
            name: v.name
          });
        });
      }
    },
    //  相机移动
    cameraMove() {
      window.earth.camera.flyTo({
        destination: {
          x: -2879361.2453708444,
          y: 4842957.116771699,
          z: 2993404.3775209677
        },
        orientation: {
          heading: 5.9232943303067405,
          pitch: -0.574668319401269,
          roll: 0
        }
      });
    },
    //  关闭倾斜摄影模块
    closeTrafficSubwayModel() {
      this.clearTrafficSubwayModel();
      this.$bus.$emit("cesium-3d-2021qxsy", { value: null });
    },
    //  清除BIM模块
    clearTrafficSubwayModel() {
      LAYERS_NEW.map(v => {
        const V_LAYER = window.earth.scene.layers.find(v.name);
        V_LAYER.visible = false;
      });
      LAYERS.map(v => {
        const V_LAYER = window.earth.scene.layers.find(v.name);
        V_LAYER.visible = false;
      });
    }
  }
};
</script>
