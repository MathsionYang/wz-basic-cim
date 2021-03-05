<template>
  <div class="LjxqModels"></div>
</template>

<script>
const Cesium = window.Cesium;
import { ExtraSourceURL, ServiceUrl } from "config/server/mapConfig";
import { mapGetters, mapActions } from "vuex";
import { mapBJSWQLayerInit } from "components/sourcelayer/cesium_map_init";
import {
  treeDrawTool,
  fixTreeWithExtra,
} from "components/sourcelayer/layerHub/TreeDrawTool";
import { getIserverFields } from "api/iServerAPI";
const LAYERS = [{ name: "Ljxq", url: ExtraSourceURL.LJxq }];
export default {
  name: "LjxqModels",
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
      //精模
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
      //范围面
      mapBJSWQLayerInit(
        "LJxqImage",
        ServiceUrl.LJxqImage,
        "erweidata:old_ommunity"
      );
      //小区点位
      var node = {
        label: "老旧小区",
        type: "mvt",
        dataset: "old_ommunity_point",
        dataname: "erweidata:",
        icon: "老旧小区",
        id: "老旧小区",
        newdataset: "erweidata:old_ommunity_point",
        url:
          "http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data",
        withExtraData: "LjxqPopup",
        withExtraDataGeometry: "LjxqListWithGeometry",
        saveExtraDataByGeometry: "setLjxqListWithGeometry",
        withExtraKey: "LJXQ",
      };
      //   var node = {
      //     dataname: "swdata:",
      //     dataset: "JZJZNL_YLJH_JHCS",
      //     icon: "老旧小区",
      //     id: "老旧小区",
      //     label: "医疗场所",
      //     newdataset: "swdata:JZJZNL_YLJH_JHCS",
      //     type: "mvt",
      //     url:
      //       "https://ditu.wzcitybrain.com/iserver/services/data-SW_DATA/rest/data",
      //     withExtraData: "LjxqPopup",
      //     withExtraDataGeometry: "medicalListWithGeometry",
      //     saveExtraDataByGeometry: "setMedicalListWithGeometry",
      //     withExtraKey: "SHORTNAME",
      //   };
      this.getPOIPickedFeature(node, () => {
        this.switchSearchBox(node);
      });
    },
    switchSearchBox(node) {
      this.$bus.$emit("cesium-3d-switch-searchBox", {
        shall: node.type == "mvt" && node.id ? true : false,
        node,
      });
    },
    getPOIPickedFeature(node, fn) {
      const { newdataset, url } = node;
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        // attributeFilter: `SMID <= 1000`,
        attributeFilter: `SMID >= 0`,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: [newdataset],
      });
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: async (res) => {
            const fields = await getIserverFields(url, newdataset);
            treeDrawTool(this, res, node, fields, fn);
          },
          processFailed: (msg) => console.log(msg),
        },
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },
    //  相机移动
    cameraMove() {
      window.earth.camera.flyTo({
        destination: {
          x: -2874832.064526169,
          y: 4845672.5214079125,
          z: 2994709.8067569756,
        },
        orientation: {
          heading: 0.0037010499017542386,
          pitch: -0.9710742814088849,
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
      const V_LAYER = window.earth.scene.layers.find(LAYERS[0].name);
      V_LAYER.setOnlyObjsVisible([348], true);
      V_LAYER.visible = false;
      const Lj = window.earth.scene.layers.find("蒲鞋市新村59号楼");
      Lj.visible = false;
    },
  },
};
</script>