<template>
  <div class="street-light"></div>
</template>

<script>
import { ExtraSourceURL } from "config/server/mapConfig";

const _LIGHT_HASH_ = {
  Street_Lights: "路灯_DEM",
};
export default {
  name: "streetLight",
  data() {
    return {
      //  透明度
      forcePosition: {},
      solidModelsProfile: undefined,
      spotLight: undefined,
    };
  },
  async mounted() {
    this.eventRegsiter();
    this.initBimScene();
  },
  beforeDestroy() {
    this.doCivilizationCenterVisible(_LIGHT_HASH_, false);
  },
  methods: {
    eventRegsiter() {
      this.$bus.$off("cesium-3d-toggleLight");
      this.$bus.$on("cesium-3d-toggleLight", ({ on, data }) => {
        if (on) {
          this.turnonLight(data);
        } else {
          this.turnoffLight();
        }
      });
    },
    //  初始化BIM场景
    initBimScene() {
      const { LIGHT, LIGHT_DATA } = ExtraSourceURL;
      if (window.extraHash.streetLight) {
        this.doCivilizationCenterVisible(_LIGHT_HASH_, true);
      } else {
        this.doGroundInit(_LIGHT_HASH_, LIGHT, LIGHT_DATA);
      }
    },
    /**
     * 图层控制
     * @param {object} _HASH_ hash
     * @param {object} _SCENE_URL_ 模型服务地址
     * @param {object} _DATA_ 数据服务地址
     */
    doGroundInit(_HASH_, _SCENE_URL_, _DATA_) {
      Object.keys(_HASH_).map((key) => {
        const _KEY_ = `streetLight_${key}`;
        const promise = window.earth.scene.addS3MTilesLayerByScp(
          `${_SCENE_URL_}/datas/${key}/config`,
          { name: _KEY_ }
        );
        if (_DATA_) {
          Cesium.when(promise, async () => {
            const { url, dataSourceName } = _DATA_;
            const layer = window.earth.scene.layers.find(_KEY_);
            //layer.orderIndependentTranslucency=false,
            layer.setQueryParameter({
              url,
              isMerge: true,
              ...(dataSourceName
                ? {
                    dataSourceName,
                    dataSetName: _HASH_[key],
                  }
                : {
                    dataSourceName: _HASH_[key],
                  }),
            });
            layer.datasetInfo().then((result) => {
              console.log("result", result);
            });
          });
        }
        // this.getFeature();
        //  做全局标识，不保存图层指针了
        window.extraHash.streetLight = true;
      });
    },
    // getFeature() {
    //   console.log("getFeature");
    //   const url =
    //     "http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data";
    //   const dataSource = "erweidata:路灯_DEM";
    //   var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
    //   getFeatureParam = new SuperMap.REST.FilterParameter({
    //     attributeFilter: `SMID >= 0`,
    //   });
    //   getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
    //     queryParameter: getFeatureParam,
    //     toIndex: -1,
    //     datasetNames: [dataSource],
    //   });
    //   getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
    //     eventListeners: {
    //       processCompleted: async (res) => {
    //         let lightArr = [];
    //         res.result.features.forEach((item) => {
    //           let attributes = item.attributes;
    //           let lightPos = new Cesium.Cartesian3.fromDegrees(
    //             +attributes.CENTER_X,
    //             +attributes.CENTER_Y + 0.00001,
    //             20
    //           );
    //           let lightTargetPos = new Cesium.Cartesian3.fromDegrees(
    //             +attributes.CENTER_X,
    //             +attributes.CENTER_Y,
    //             0
    //           );
    //           lightArr.push({ pos: lightPos, targetPos: lightTargetPos });
    //         });
    //         console.log("lightArr", lightArr);
    //         this.addLightSource(lightArr);
    //       },
    //       processFailed: (msg) => console.log(msg),
    //     },
    //   });
    //   getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    // },
    // addLightSource(list) {
    //   let sliceList =  list.slice(0, 100)
    //   let option = {
    //     color: new Cesium.Color(6, 5, 0.2, 1),
    //     distance: 30,
    //     decay: 3,
    //     intensity: 13,
    //     // angle: Math.PI / 2
    //   };
    //   sliceList.forEach(item => {
    //     let spotLight = new Cesium.SpotLight(item.pos, item.targetPos, option);
    //     window.earth.scene.addLightSource(spotLight);
    //   })
    // },
    turnonLight(data) {
      window.earth.scene.sun.show = false;
      window.earth.scene.globe.enableLighting = false;
			window.earth.scene.lightSource._ambientLightColor = new Cesium.Color(0.4, 0.4, 0.4, 0.4);
      console.log("data", data);
      let tempObj = {}
      data.forEach(item => {
        tempObj[item.k] = item.v
      })
      let lightPos = new Cesium.Cartesian3.fromDegrees(
        +tempObj.CENTER_X,
        +tempObj.CENTER_Y,
        20
      );
      let lightTargetPos = new Cesium.Cartesian3.fromDegrees(
        +tempObj.CENTER_X,
        +tempObj.CENTER_Y,
        0
      );
      let option = {
        color: new Cesium.Color(6, 5, 0.2, 1),
        distance: 30,
        decay: 3,
        intensity: 13,
        // angle: Math.PI / 2
      };
      this.spotLight = new Cesium.SpotLight(lightPos, lightTargetPos, option);
      window.earth.scene.addLightSource(this.spotLight);
    },
    turnoffLight() {
      window.earth.scene.removeLightSource(this.spotLight);
    },
    /**
     * 显隐控制
     * @param {object} _HASH_ hash
     * @param {boolean} boolean 开关
     */
    doCivilizationCenterVisible(_HASH_, boolean) {
      Object.keys(_HASH_).map((key) => {
        const _KEY_ = `streetLight_${key}`;
        const layer = window.earth.scene.layers.find(_KEY_);
        layer.visible = boolean;
      });
    },
  },
};
</script>
