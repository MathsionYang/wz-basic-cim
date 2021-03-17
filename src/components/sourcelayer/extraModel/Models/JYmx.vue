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
    // this.falsedatas();
  },
  beforeDestroy() {
    this.closeTrafficSubwayModel();
  },
  methods: {
    //  事件绑定
    eventRegsiter() {
      const that = this;
      //this.initBimScene();
      // this.falsedatas();
    },
    falsedatas() {
      var asda = window.earth.scene.layers.find("WZBaimo");
      console.log('asda',asda);
      asda.brightness = 0.5;
      if (
        window.earth.scene.layers.find("BJJM") ||
        window.earth.scene.layers.find("BJSWQ")
      ) {
        var points = null;
        for (let i = 0; i < window.fwm.length; i++) {
          if (window.fwm[i].name == "江滨CBD") {
            points = window.fwm[i].points;
          }
        }
        var queryObj = {
          getFeatureMode: "SPATIAL",
          spatialQueryMode: "CONTAIN",
          datasetNames: ["erweidata:RES_PY_QSY"],
          //datasetNames: ["CIM_2D:JZ_2D_buffer"],
          geometry: {
            points: points,
            type: "REGION"
          }
        };
        var queryData = JSON.stringify(queryObj); // 转化为JSON字符串作为查询参数
        $.ajax({
          type: "post",
          //url:"http://172.20.83.223:8098/iserver/services/data-CIM_2D/rest/data/featureResults.rjson?returnContent=true",
          url:
            "http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data/featureResults.rjson?returnContent=true",
          data: queryData,
          success: function(result) {
            var resultObj = JSON.parse(result);
            console.log("白模隐藏", resultObj);
            if (resultObj.featureCount > 0) {
              //window.Buildinglogo = resultObj.features;
              processCompleted(resultObj.features); 
            }
          },
          error: function(msg) {
            console.log(msg);
          }
        });
        function processCompleted(features) {
          var selectedFeatures = features;
          for (var i = 0; i < selectedFeatures.length; i++) {
            window.baimo.push(parseInt(selectedFeatures[i].fieldValues["0"]));
          }
          console.log("window.baimo", window.baimo);
          const V_LAYER_baimo = window.earth.scene.layers.find("WZBaimo");
          //V_LAYER_baimo.setOnlyObjsVisible([2682489],false)
          V_LAYER_baimo.setOnlyObjsVisible(window.baimo, false);
          window.baimo
        }
      }
    },
    
    //  初始化白模场景
    initBimScene(fn) {
      const _LAYER_ = window.earth.scene.layers.find(LAYERS[0].name);
      if (_LAYER_) {
        LAYERS.map(v => {
          const V_LAYER = window.earth.scene.layers.find(v.name);
          V_LAYER.visible = true;
        });
      } else {
        LAYERS.map(v => {
          const BaiMo_promise = window.earth.scene.addS3MTilesLayerByScp(v.url, {
            name: v.name
          });
          Cesium.when(BaiMo_promise, async (_LAYER_)=>{
            let BaiMo_layer = window.earth.scene.layers.find("WZBaimo");
            
            // BaiMo_layer.brightness = 0.65; //调亮度
            BaiMo_layer.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame; //线框加填充
            BaiMo_layer.wireFrameMode = Cesium.WireFrameType.EffectOutline;  
            BaiMo_layer.style3D.lineColor = Cesium.Color.fromCssColorString("rgb(204,204,204)");  //线框颜色
            BaiMo_layer.style3D.lineWidth = 1;  //线框粗细
            BaiMo_layer.style3D.fillForeColor = Cesium.Color.fromCssColorString(
                "rgba(255,255,255,0.6)"
            );
            //白模分层设色
            // BaiMo_layer.indexedDBSetting.isGeoTilesRootNodeSave = true;
            // BaiMo_layer.residentRootTile = true;
            // let hyp = new Cesium.HypsometricSetting();
            // let colorTable = new Cesium.ColorTable();
            // hyp.MaxVisibleValue = 3000;
            // hyp.MinVisibleValue = 0;
            // colorTable.insert(3000, new Cesium.Color(1, 1, 1));
            // colorTable.insert(1600, new Cesium.Color(0.95, 0.95, 0.95));
            // colorTable.insert(760, new Cesium.Color(0.7, 0.7, 0.7));
            // colorTable.insert(0, new Cesium.Color(13 / 255, 24 / 255, 45 / 255));
            // hyp.ColorTable = colorTable;
            // // hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
            // // hyp.Opacity = 1;
            // BaiMo_layer.hypsometricSetting = {
            //     hypsometricSetting: hyp,
            //     analysisMode:
            //         Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
            // };
          })
        });
        // Cesium.when(PROMISES, async (...arguments) => {         
        // })
      };
      
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
          z: 2993404.3775209677
        },
        orientation: {
          heading: 5.9232943303067405,
          pitch: -0.574668319401269,
          roll: 0
        }
      });
    },
    //  关闭白模模块
    closeTrafficSubwayModel() {
      this.clearTrafficSubwayModel();
      this.$bus.$emit("cesium-3d-bm", { value: null });
    },
    //  清除白模模块
    clearTrafficSubwayModel() {
      LAYERS.map(v => {
        const V_LAYER = window.earth.scene.layers.find(v.name);
        V_LAYER.visible = false;
      });
      // arrURL.map(({ KEY }) => {
      //   const _LAYER_ = window.earth.scene.layers.find(KEY);
      //   _LAYER_.visible = false;
      // });
    }
  }
};
</script>
