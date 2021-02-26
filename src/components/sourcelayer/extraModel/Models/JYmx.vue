<template>
  <div class="JYmxModels"></div>
</template>

<script>
const Cesium = window.Cesium;
import { ServiceUrl } from "config/server/mapConfig";
import { mapGetters, mapActions } from "vuex";
const LAYERS = [{ name: "WZBaimo", url: ServiceUrl.WZBaimo }];

// const arrURL = [
//   {
//     KEY: "WZBaimo_POINT_AROUND",
//     URL:
//       "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-BaiMo/rest/realspace/datas/BaiMo/config",
//     FLOW: true,
//   },
// ];

export default {
  name: "JYmxModels",
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

      // return new Promise((resolve, reject) => {
      //   const _LAYER_ = window.earth.scene.layers.find('WZBaimo_POINT_AROUND')
      //   if (_LAYER_) {
      //     arrURL.map(({ KEY }) => {
      //       const _LAYER_ = window.earth.scene.layers.find(KEY);
      //       _LAYER_.visible = true;
      //     });
      //   } else {
      //     arrURL.map(({ KEY, URL, FLOW, d, s, withoutFix }, index) => {
      //       const baimoPromise = window.earth.scene.addS3MTilesLayerByScp(URL, {
      //         name: KEY,
      //       });
      //       Cesium.when(baimoPromise, async (_LAYER_) => {
      //         const LAYER = window.earth.scene.layers.find(KEY);
      //         LAYER.indexedDBSetting.isGeoTilesRootNodeSave = true;
      //         LAYER.residentRootTile = true;
      //         if (FLOW) {
      //           LAYER.style3D.fillForeColor = new Cesium.Color.fromCssColorString(
      //             "rgba(137,137,137, 1)"
      //           );
      //           const hyp = new Cesium.HypsometricSetting();
      //           const colorTable = new Cesium.ColorTable();
      //           hyp.MaxVisibleValue = 300;
      //           hyp.MinVisibleValue = 0;
      //           colorTable.insert(300, new Cesium.Color(1, 1, 1));
      //           colorTable.insert(160, new Cesium.Color(0.95, 0.95, 0.95));
      //           colorTable.insert(76, new Cesium.Color(0.7, 0.7, 0.7));
      //           colorTable.insert(
      //             0,
      //             new Cesium.Color(13 / 255, 24 / 255, 45 / 255)
      //           );
      //           hyp.ColorTable = colorTable;
      //           hyp.DisplayMode =
      //             Cesium.HypsometricSettingEnum.DisplayMode.FACE;
      //           hyp.Opacity = 1;
      //           //  贴图纹理
      //           hyp.emissionTextureUrl = "/static/images/area/speedline.png";
      //           hyp.emissionTexCoordUSpeed = 0.2;
      //           LAYER.hypsometricSetting = {
      //             hypsometricSetting: hyp,
      //             analysisMode:
      //               Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
      //           };
      //         } else {
      //           if (withoutFix) {
      //             LAYER.style3D.fillForeColor = new Cesium.Color(
      //               0.4,
      //               0.4,
      //               0.43
      //             );
      //           } else {
      //             LAYER.brightness = 0.5;
      //             LAYER.gamma = 0.6;
      //             LAYER.refresh();
      //           }
      //         }
      //         //  最大可见
      //         d && (LAYER.visibleDistanceMax = d);
      //         s && (LAYER.shadowType = 2);
      //         index == arrURL.length - 1 && resolve(true);
      //       });
      //     });
      //   }
      // });
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
    //  关闭白模模块
    closeTrafficSubwayModel() {
      this.clearTrafficSubwayModel();
      this.$bus.$emit("cesium-3d-bm", { value: null });
    },
    //  清除白模模块
    clearTrafficSubwayModel() {
      LAYERS.map((v) => {
        const V_LAYER = window.earth.scene.layers.find(v.name);
        V_LAYER.visible = false;
      });
      // arrURL.map(({ KEY }) => {
      //   const _LAYER_ = window.earth.scene.layers.find(KEY);
      //   _LAYER_.visible = false;
      // });
    },
  },
};
</script>