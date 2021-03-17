<!--
 * @Author: eds
 * @Date: 2020-09-15 11:04:57
 * @LastEditTime: 2020-09-15 11:05:13
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\commonFrame\SceneSwitch\SceneSwitch.vue
-->
<template>
  <div class="labelleng">
    <div
      :class="{
        label: true,
        active: item.id == forceTreeLabels,
        disabled: item.disabled,
      }"
      v-for="(item, i) in data"
      :key="i"
      @click="!item.disabled ? SetForceTreeLabels(item.id) : undefined"
    >
      <div class="imgs"></div>
      <span class="bt">{{ item.label }}</span>
      <ul
        class="child-list"
        v-show="item.children && item.id == forceTreeLabels"
      >
        <li
          class="child-item"
          :class="{active: child.id == childSelectedLabel}"
          v-for="(child, index) in item.children"
          :key="index"
          @click.stop="childClick(child.id)"
        >
          {{ child.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const RATE = 30;
import { treeDrawTool } from "components/sourcelayer/layerHub/TreeDrawTool";
import { getIserverFields } from "api/iServerAPI";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Switchlabel",
  data() {
    return {
      toRight: true,
      forceTreeLabels: "",
      childSelectedLabel: "",
      cameraTimer: undefined,
      heading: 0,
      label: "",
      oldlabel: "",
      tileLayers: {},
      data: [
        { id: "孪生城市全貌", label: "孪生城市全貌" },
        {
          id: "数字工程",
          label: "数字工程",
          children: [
            { id: "项目全过程", label: "项目全过程" },
            { id: "项目综合管理", label: "项目综合管理" },
          ],
        },
        { id: "数字住房", label: "数字住房" },
        { id: "数字城管", label: "数字城管" },
      ],
    };
  },
  created() {
    //this.SetForceTreeLabels("孪生城市全貌");
  },
  computed: {
    ...mapGetters("map", [
      "forceTreeLabel",
      "forceTrueTopicLabels",
      "forceTreeEventLabel",
    ]),
  },
  watch: {},
  methods: {
    ...mapActions("map", [
      "SetForceTreeLabel",
      "SetForceTrueTopicLabels",
      "SetForceTrueTopicLabelId",
    ]),
    SetForceTreeLabels(item) {
      if (this.forceTreeLabels == item) {
        this.forceTreeLabels = "";
        this.liebiao(this.oldlabel);
        this.oldlabel = ""
        return;
      }
      if (this.oldlabel) {
        this.liebiao(this.oldlabel);
      }
      this.forceTreeLabels = item;
      this.childSelectedLabel = "";
      if (item == "数字住房") {
        this.label = {
          componentEvent: "cesium-3d-ljxq",
          componentKey: "3d2",
          icon: "老旧小区",
          id: "老旧小区",
          label: "老旧小区",
          newdataset: "undefined",
          type: "model",
        };
        this.oldlabel = this.label;
        this.liebiao(this.label);
      } else if (item == "数字工程") {
        this.oldlabel = "";
      } else if (item == "孪生城市全貌") {
        this.label = {
          componentEvent: "cesium-3d-2021qxsy",
          componentKey: "3d21",
          icon: "2021年倾斜摄影",
          id: "2021年倾斜摄影",
          label: "2021年倾斜摄影",
          newdataset: "erweidata:undefined",
          type: "model",
          url: "true",
        };
        this.oldlabel = this.label;
        this.liebiao(this.label);
      } else if (item == "数字城管") {
        //this.$router.push('http://125.124.19.162:8888/');
        window.open("http://125.124.19.162:8888/");
        this.oldlabel = "";
      }
    },
    childClick(item) {
      if (this.childSelectedLabel == item) {
        this.childSelectedLabel = "";
        this.liebiao(this.oldlabel);
        this.oldlabel = ""
        return;
      }
      if (this.oldlabel) {
        this.liebiao(this.oldlabel);
      }
      this.childSelectedLabel = item
      if (item == '项目全过程') {
        this.label = {
          dataset: "erweidata:V_TM_PROJECT_P",
          icon: "工程项目",
          id: "工程项目",
          label: "工程项目",
          newdataset: "erweidata:V_TM_PROJECT_P",
          type: "mvt",
          url:
            "http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data",
          withImage: [
            {
              name: "ydhx",
              url:
                "http://172.20.83.223:8090/iserver/services/map-CIMERWEI/rest/maps/JSGC_DJDM",
            },
          ],
        };
        this.oldlabel = this.label;
        this.liebiao(this.label);
      }
      if (item == '项目综合管理') {
        window.open("http://www.epc-pm.cn:8888/");
        this.oldlabel = "";
      }
    },
    liebiao(label) {
      console.log('liebiao', label)
      if (~this.forceTrueTopicLabels.indexOf(label.id)) {
        let _fttl_ = [...this.forceTrueTopicLabels];
        _fttl_.splice(_fttl_.indexOf(label.id), 1);
        this.SetForceTrueTopicLabels(_fttl_);
        this.nodeCheckChange(label, false);
      } else {
        this.SetForceTrueTopicLabels([
          ...new Set(this.forceTrueTopicLabels.concat([label.id])),
        ]);
        this.SetForceTrueTopicLabelId(label.id);
        this.nodeCheckChange(label, true);
      }
    },
    nodeCheckChange(node, checked) {
      if (checked) {
        console.log("点击内容1", node);
        if (node.type == "mvt" && node.id) {
          if (node.id && window.billboardMap[node.id]) {
            window.billboardMap[node.id]._billboards.map(
              (v) => (v.show = true)
            );
            window.labelMap[node.id].setAllLabelsVisible(true);
          } else {
            this.getPOIPickedFeature(node, () => {
              this.switchSearchBox(node);
            });
          }
          //用地红线展示
          if (node.withImage) {
            node.withImage.forEach((item) => {
              const LAYER = this.tileLayers[item.name];
              if (LAYER) {
                LAYER.show = true;
              } else {
                this.tileLayers[
                  item.name
                ] = window.earth.imageryLayers.addImageryProvider(
                  new Cesium.SuperMapImageryProvider({
                    url: item.url,
                  })
                );
                item.alpha && (this.tileLayers[item.name].alpha = item.alpha);
                // window.earth.imageryLayers.lower(this.tileLayers[item.name]);
              }
            });
          }
          //多图层展示
          if (node.moreurl) {
            for (let i = 0; i < node.moreurl.length; i++) {
              this.getPOIPickedFeature(node.moreurl[i], () => {
                this.switchSearchBox(node.moreurl[i]);
              });
              window.checkedkey.push(node.moreurl[i].id);
            }
            this.layerdatas = {
              label: node.label,
              id: node.id,
              children: node.moreurl,
            };
          } else {
            window.checkedkey.push(node.id); //单图层数据存储到已选择数组中
            this.layerdatas = { label: node.label, id: node.id };
          }
          window.layersdata.push(this.layerdatas);
        } else if (node.type == "model") {
          node.componentEvent &&
            node.componentKey &&
            this.$bus.$emit(node.componentEvent, { value: node.componentKey });
        } else if (node.type == "image") {
          console.log("面", node);
          const LAYER = this.tileLayers[node.id];
          this.tileLayers[
            node.id
          ] = window.earth.imageryLayers.addImageryProvider(
            new Cesium.SuperMapImageryProvider({
              url: node.url,
              name: node.id,
            })
          );
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
          window.billboardMap[node.id]._billboards.map((v) => (v.show = false));
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
        if (node.moreurl) {
          //隐藏图层
          for (let i = 0; i < node.moreurl.length; i++) {
            window.billboardMap[node.moreurl[i].id]._billboards.map(
              (v) => (v.show = false)
            );
            window.labelMap[node.moreurl[i].id].setAllLabelsVisible(false);
          }
          //清除已选择图层内容
          for (var i = 0; i < window.layersdata.length; i++) {
            if (window.layersdata[i].id == node.id) {
              window.layersdata.splice(i, 1);
            }
          }
          //清除图例
          for (let a = 0; a < window.checkedkey.length; a++) {
            for (let b = 0; b < node.moreurl.length; b++) {
              if (window.checkedkey[a] == node.moreurl[b].id) {
                window.checkedkey.splice(a, 1);
              }
            }
          }
        }
        if (node.withImage) {
          node.withImage.forEach((item) => {
            const LAYER = this.tileLayers[item.name];
            LAYER.show = false;
          });
        }
        node.componentEvent &&
          this.$bus.$emit(node.componentEvent, { value: null });
      }
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
    switchSearchBox(node) {
      console.log('switchSearchBox', node)
      this.$bus.$emit("cesium-3d-switch-searchBox", {
        shall: node.type == "mvt" && node.id ? true : false,
        node,
      });
    },
  },
};
</script>

<style scoped lang="less">
.labelleng {
  top: 1.5vh;
  position: absolute;
  z-index: 7;
  height: auto;
  width: auto;
  // left: 27vw;
  left: 54vh;
  background: linear-gradient(
    180deg,
    #030303 0%,
    #010714 28%,
    rgba(1, 4, 9, 0) 100%
  );
  opacity: 0.97;
}
.label {
  position: relative;
  display: inline-block;
  cursor: pointer;

  .imgs {
    // height: 1.7vw;
    height: 3.4vh;
    opacity: 1;
    z-index: 7;
    // width: 8vw;
    width: 16.5vh;
    border: 0;
    // margin-right: 0.3vw;
    margin-right: 0.6vh;
    background-size: 100% 100%;
    background-image: url(/static/images/mode-ico/标题.png);
  }
  &.active {
    > .imgs {
      // height: 1.7vw;
      height: 3.4vh;
      opacity: 1;
      z-index: 7;
      // width: 8vw;
      width: 16vh;
      border: 0;
      // margin-right: 0.3vw;
      margin-right: 0.6vh;
      background-size: 100% 100%;
      background-image: url(/static/images/mode-ico/标题选中.png);
    }
  }

  > .bt {
    position: absolute;
    // font-size: 0.8vw;
    font-size: 1.6vh;
    font-family: YouSheBiaoTiHei;
    font-weight: 400;
    // line-height: 1.6vw;
    line-height: 3vh;
    // bottom: 0;
    top: 0;
    left: 0;
    color: #ffffff;
    text-shadow: rgba(4, 36, 39, 0.4) 0px 2px 4px;
    opacity: 1;
    // margin: 0.6vh 0vw;
    display: block;
    width: 100%;
    text-align: center;
  }

  .child-list {
    position: absolute;
    width: 90%;
    left: 50%;
    transform: translateX(-50%);
    .bg-image("/static/images/mode-ico/图例背景");
    padding: 0.8vh 0;
    text-align: center;
    .child-item {
      padding: 0.6vh 0;
      font-size: 1.6vh;
      line-height: 1.5vh;
      color: #ffffff;
      font-family: YouSheBiaoTiHei;
      &.active {
        color: #ffff08;
        text-shadow: rgba(4, 36, 39, 0.4) 0px 2px 4px;
      }
    }
  }

  &.active {
    > .bt {
      // position: absolute;
      // font-size: 0.8vw;
      // font-family: YouSheBiaoTiHei;
      // font-weight: 400;
      // line-height: 1.7vw;
      // bottom: 0;
      // left: 0;
      color: #ffff08;
      // text-shadow: rgba(4, 36, 39, 0.4) 0px 2px 4px;
      // opacity: 1;
      // margin: 0.6vh 0vw;
      // display: block;
      // width: 100%;
      // text-align: center;
    }
  }
}
</style>
