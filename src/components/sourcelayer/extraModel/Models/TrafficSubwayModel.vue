<template> </template>

<script>
const Cesium = window.Cesium;
import { ExtraSourceURL } from "config/server/mapConfig";
import { treeDrawTool } from "components/sourcelayer/layerHub/TreeDrawTool";
import { getIserverFields } from "api/iServerAPI";
import { mapGetters, mapActions } from "vuex";
const LAYERS = [{ name: "S1", url: ExtraSourceURL.S1 }];
export default {
  name: "TrafficSubwayModel",
  data() {
    return {
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
  async mounted() {
    this.initBimScene();
    this.eventRegsiter();
    this.cameraMove();
  },
  beforeDestroy() {
    this.closeTrafficSubwayModel();
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
    },
    //  初始化BIM场景
    initBimScene(fn) {
      const _LAYER_ = window.earth.scene.layers.find(LAYERS[0].name);
      if (_LAYER_) {
        LAYERS.map(v => {
          const V_LAYER = window.earth.scene.layers.find(v.name);
          V_LAYER.visible = true;
        });
        this.liebiao(this.label);
      } else {
        const PROMISES = LAYERS.map(v => {
          return window.earth.scene.addS3MTilesLayerByScp(v.url, {
            name: v.name
          });
        });
        this.liebiao(this.label);
      }
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
    //  相机移动
    cameraMove() {
      window.earth.camera.flyTo({
        destination: {
          x: -2876240.8556349813,
          y: 4844823.855379582,
          z: 2991618.648799055
        },
        orientation: {
          heading: 6.274388551340762,
          pitch: -0.5191263959623971,
          roll: 0
        }
      });
    },
    //  关闭交通S1模块
    closeTrafficSubwayModel() {
      this.clearTrafficSubwayModel();
      this.$bus.$emit("cesium-3d-hub-event", { value: null });
    },
    //  清除BIM模块
    clearTrafficSubwayModel() {
      this.liebiao(this.label);
      LAYERS.map(v => {
        const V_LAYER = window.earth.scene.layers.find(v.name);
        V_LAYER.visible = false;
      });
    }
  }
};
</script>
