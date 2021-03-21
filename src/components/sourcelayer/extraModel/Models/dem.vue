<template></template>

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
const LAYERS = [{ name: "dem", url: ExtraSourceURL.Dem }];
export default {
  name: "Dem",
  data() {
    return {
      //   node: {
      //     label: "水利工程",
      //     type: "mvt",
      //     dataset: "river_sz",
      //     dataname: "erweidata:",
      //     icon: "水利工程",
      //     id: "水利工程",
      //     newdataset: "erweidata:river_sz",
      //     url:
      //       "http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data",
      //   },
      layerdatas: "",
      node: {
        label: "水利工程",
        type: "mvt",
        dataname: "",
        url:
          "http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data",
        dataset: "",
        moreurl: [
          {
            label: "水利工程",
            type: "mvt",
            dataset: "river_sz",
            dataname: "erweidata:",
            icon: "水利工程",
            id: "水闸",
            newdataset: "erweidata:river_sz",
            url:
              "http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data",
          },
          {
            label: "水利工程",
            type: "mvt",
            dataset: "river_mt",
            dataname: "erweidata:",
            icon: "水利工程",
            id: "码头",
            newdataset: "erweidata:river_mt",
            url:
              "http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data",
          },
        ],
      },
      imagenode: {
        label: "水系水文",
        type: "image",
        id: "水系水文",
        url:
          "http://172.20.83.223:8090/iserver/services/map-CIMERWEI/rest/maps/river",
      },
      tileLayers: [],
    };
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
    //  事件绑定
    eventRegsiter() {
      const that = this;
    },
    //  初始化BIM场景
    initBimScene(fn) {
      //精模
      const _LAYER_ = window.earth.scene.layers.find(LAYERS[0].name);
      if (_LAYER_) {
        const V_LAYER = window.earth.scene.layers.find("dem");
        V_LAYER.visible = true;
        //隐藏水闸点位
        for (let i = 0; i < this.node.moreurl.length; i++) {
          window.billboardMap[this.node.moreurl[i].id]._billboards.map(
            (v) => (v.show = true)
          );
          window.checkedkey.push(this.node.moreurl[i].id);
          window.billboardMap[this.node.moreurl[i].id] &&
            window.labelMap[this.node.moreurl[i].id].setAllLabelsVisible(true);
        }
        this.layerdatas = {
          label: this.node.label,
          id: this.node.id,
          children: this.node.moreurl,
        };
        window.layersdata.push(this.layerdatas);
        this.switchSearchBox(this.node);
        //隐藏水系水文覆盖面
        this.tileLayers[
          this.imagenode.id
        ] = window.earth.imageryLayers.addImageryProvider(
          new Cesium.SuperMapImageryProvider({
            url: this.imagenode.url,
            name: this.imagenode.id,
          })
        );
      } else {
        this.initBimScenes();
      }
    },
    initBimScenes() {
      //加载模型
      LAYERS.map((v) => {
        return window.earth.scene.addS3MTilesLayerByScp(v.url, {
          name: v.name,
        });
      });

      //水闸码头点位
      for (let i = 0; i < this.node.moreurl.length; i++) {
        this.getPOIPickedFeature(this.node.moreurl[i], () => {
          this.switchSearchBox(this.node.moreurl[i]);
        });
        window.checkedkey.push(this.node.moreurl[i].id);
      }
      this.layerdatas = {
        label: this.node.label,
        id: this.node.id,
        children: this.node.moreurl,
      };
      window.layersdata.push(this.layerdatas);
      this.tileLayers[
        this.imagenode.id
      ] = window.earth.imageryLayers.addImageryProvider(
        new Cesium.SuperMapImageryProvider({
          url: this.imagenode.url,
          name: this.imagenode.id,
        })
      );
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
    //  关闭
    closeTrafficSubwayModel() {
      this.clearTrafficSubwayModel();
      this.$bus.$emit("cesium-3d-dem", { value: null });
    },
    //  清除
    clearTrafficSubwayModel() {
      const V_LAYER = window.earth.scene.layers.find("dem");
      V_LAYER.visible = false;
      //隐藏水闸点位
      for (let i = 0; i < this.node.moreurl.length; i++) {
        window.billboardMap[this.node.moreurl[i].id]._billboards.map(
          (v) => (v.show = false)
        );
        window.billboardMap[this.node.moreurl[i].id] &&
          window.labelMap[this.node.moreurl[i].id].setAllLabelsVisible(false);
      }
      //清除已选择图层内容
      for (var i = 0; i < window.layersdata.length; i++) {
        if (window.layersdata[i].id == this.node.id) {
          window.layersdata.splice(i, 1);
        }
      }
      //清除图例
      for (let a = 0; a < window.checkedkey.length; a++) {
        for (let b = 0; b < this.node.moreurl.length; b++) {
          if (window.checkedkey[a] == this.node.moreurl[b].id) {
            window.checkedkey.splice(a, 1);
          }
        }
      }
      this.switchSearchBox(this.node, false);
      //隐藏水系水文覆盖面
      this.tileLayers["水系水文"].show = false;
    },
  },
};
</script>
