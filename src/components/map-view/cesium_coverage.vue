<!--
 * @Author: eds
 * @Date: 2020-07-07 10:57:45
 * @LastEditTime: 2020-07-29 17:10:26
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\cesium_coverage.vue
-->
<template>
  <div class="coverage">
    <el-popover
      placement="right-end"
      title="图层选择"
      width="280"
      trigger="click"
      class="layerPopover"
      v-model="visible"
    >
      <el-input v-model="filterText" class="treeFilterInput" placeholder="搜索" size="small" />
      <div class="layerTreeContainer">
        <el-tree
          ref="tree"
          :data="isData"
          show-checkbox
          node-key="id"
          :filter-node-method="filterNode"
          :props="defaultProps"
          default-expand-all
          @check-change="checkChange"
        />
      </div>
    </el-popover>
    <img
      slot="reference"
      :class="{animated: true, pulse: rotateIn}"
      style="animation-duration: 0.5s;"
      :src="avatar"
      width="59px"
      height="60px"
      @click="visible = !visible"
    />
  </div>
</template>

<script>
import $ from "jquery";
import { mapGetters } from "vuex";
import cesiumLayers from "config/server/cesiumLayers";
import CoverageData from "mock/coverage";
const Cesium = window.Cesium;
export default {
  name: "Coverage",
  data() {
    return {
      rotateIn: true,
      visible: true,
      filterText: "",
      sqlParam: {},
      dataNameList: [],
      popup: null,
      data: CoverageData,
      defaultProps: {
        children: "children",
        label: "label",
      },
      isVal: false,
      cesiumData: cesiumLayers,
      baimolayer: null,
      finalayer2012: null,
      finalayer2017: null,
      avatar: require("common/images/coverage.png"),
      hszlayer: null, // 鹤盛镇
      drylayer: null, // 大若岩镇
      hszhandler: null, // 鹤盛镇绑定事件
      dryhandler: null, // 大若岩镇绑定事件
      flzlayer: null, // 枫林镇
      flzhandler: null, // 枫林镇镇绑定事件
      jkclayer: null, // 永嘉界坑村
      jkchandler: null, // 永嘉界坑村绑定事件
      qxzOlayer: null, // 永嘉桥下镇1
      qxzOhandler: null, // 永嘉桥下镇1绑定事件
      qxzTlayer: null, // 永嘉桥下镇2
      qxzThandler: null, // 永嘉桥下镇2绑定事件
      xxxlayer: null, // 永嘉溪下乡
      xxxhandler: null, // 永嘉溪下乡绑定事件
      stzlayer: null, // 永嘉沙头镇
      stzhandler: null, // 永嘉沙头镇绑定事件
      xzzlayer: null, // 永嘉巽宅镇
      xzzhandler: null, // 永嘉巽宅镇绑定事件
      ytzlayer: null, // 永嘉岩头镇
      ytzhandler: null, // 永嘉岩头镇绑定事件
      ytanlayer: null, // 永嘉岩坦镇
      ytanhandler: null, // 永嘉岩坦镇绑定事件
      syxlayer: null, // 永嘉水云溪
      syxhandler: null, // 永嘉水云溪绑定事件
      blzlayer: null, // 永嘉碧莲镇
      blzhandler: null, // 永嘉碧莲镇绑定事件
      qtzlayer: null, // 永嘉桥头镇
      qtzhandler: null, // 永嘉桥头镇绑定事件
      sqcllayer: null, // 山区村落自然灾害易发区
    };
  },
  computed: {
    ...mapGetters(["map"]),
    isData() {
      return this.isVal ? this.data : this.cesiumData;
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    window.showInfo = () => {
      this.$bus.$emit("nearby", { x: 1 });
      this.$bus.$emit("surroundClick", false);
    };
    window.surroundClick = () => {
      this.$bus.$emit("nearby", { x: 2 });
      this.$bus.$emit("surroundClick", true);
    };
    this.$bus.$on("sendDiZhi", (e) => {
      this.isVal = e;
    });

    this.$bus.$on("clearChecked", (e) => {
      var nodeLst;
      if (e.mapType !== "3D") {
        nodeLst = this.data;
      } else {
        nodeLst = this.cesiumData;
      }

      for (var i = 0; i < nodeLst.length; i++) {
        var itm = nodeLst[i];
        this.$refs.tree.setChecked(itm.id, false, e.deep);
      }
    });

    // 设置白模勾选状态
    this.$bus.$on("setBaiMoChecked", (e) => {
      this.$refs.tree.setChecked("4", e.show, e.deep);
    });
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    checkChange(a, b, c) {
      var param;

      // 三维数据叠加
      if (a.url) {
        a.legendStatus = b;
        this.$bus.$emit("change", a.label);
        if (a.id <= 10) {
          this.$bus.$emit("cesiumLegend", a);
        } else if (a.id === 40) {
          this.showSqLegend(a);
        }
        if (b === true) {
          var entityObj = {
            url: a.url,
            type: a.type,
            point: {},
            polyline: { width: 30 },
            polygon: {},
          };
          var color = null;
          switch (a.id) {
            case 5:
              // 避险点 点
              color = Cesium.Color.CRIMSON;
              // this.addEntity(a.url, a.type, color)
              this.addEntities(entityObj);
              break;
            case 6:
              // 不稳定斜坡 线
              color = Cesium.Color.INDIANRED;
              // this.addEntity(a.url, a.type, color)
              entityObj.polyline = {
                material: Cesium.Color.RED,
                width: 20,
              };
              this.addEntities(entityObj);
              break;
            case 7:
              // 撤离路线 线
              color = Cesium.Color.GREEN;
              // this.addEntity(a.url, a.type, color)
              entityObj.polyline = {
                material: new Cesium.PolylineDashMaterialProperty({
                  color: color,
                  dashLength: 8,
                }),
                width: 20,
              };
              this.addEntities(entityObj);
              break;
            case 8:
              // 承灾体 面
              color = Cesium.Color.TOMATO;
              // this.addEntity(a.url, a.type, color)
              entityObj.polygon = {
                material: new Cesium.GridMaterialProperty({
                  color: Cesium.Color.TOMATO,
                  lineCount: new Cesium.Cartesian2(12, 12),
                }),
              };
              this.addEntities(entityObj);
              break;
            case 9:
              // 地质灾害隐患 线
              color = Cesium.Color.INDIGO;
              // this.addEntity(a.url, a.type, color)
              entityObj.polyline = {
                material: Cesium.Color.YELLOW,
                width: 10,
              };
              this.addEntities(entityObj);
              break;
            case 10:
              // 风险防范区 面
              color = Cesium.Color.NAVAJOWHITE;
              // this.addEntity(a.url, a.type, color)
              entityObj.polygon = {
                material: Cesium.Color.NAVAJOWHITE.withAlpha(0.5),
              };
              this.addEntities(entityObj);
              break;
            case 4:
              // 白模
              if (this.baimolayer !== null) {
                this.baimolayer.then(function (layer) {
                  layer.visible = true;
                });
              } else {
                this.baimolayer = window.earth.scene.addS3MTilesLayerByScp(
                  a.url,
                  {
                    name: "baimo",
                  }
                );
              }
              break;
            case 30:
              if (this.finalayer2012 !== null) {
                this.finalayer2012.then(function (layer) {
                  layer.visible = true;
                });
              } else {
                const LAYER_NAME = "jingmo2012";
                this.finalayer2012 = window.earth.scene.addS3MTilesLayerByScp(
                  a.url,
                  { name: LAYER_NAME }
                );
                Cesium.when(this.finalayer2012, async (layers) => {
                  const layer = window.earth.scene.layers.find(LAYER_NAME);
                  layer.setQueryParameter({
                    url: a.dataurl,
                    dataSourceName: "172.20.83.196_swdata",
                    dataSetName: "max_2012",
                    isMerge: true,
                  });
                });
              }
              this.locateFinaLyr();
              break;
            case 31:
              if (this.finalayer2017 !== null) {
                this.finalayer2017.then(function (layer) {
                  layer.visible = true;
                });
              } else {
                const LAYER_NAME = "jingmo2017";
                this.finalayer2017 = window.earth.scene.addS3MTilesLayerByScp(
                  a.url,
                  { name: LAYER_NAME }
                );
                Cesium.when(this.finalayer2017, async (layers) => {
                  const layer = window.earth.scene.layers.find(LAYER_NAME);
                  layer.setQueryParameter({
                    url: a.dataurl,
                    dataSourceName: "172.20.83.196_swdata",
                    dataSetName: "max_2017",
                    isMerge: true,
                  });
                });
              }
              this.locateFinaLyr();
              break;
            case 40:
              // 山区村落自然灾害易发区
              if (this.sqcllayer !== null) {
                this.sqcllayer.show = true;
              } else {
                this.sqcllayer = window.earth.imageryLayers.addImageryProvider(
                  new Cesium.SuperMapImageryProvider({
                    url: a.url,
                    name : 'test'
                  })
                );
              }
              break;
            case 201:
              // 鹤盛镇倾斜摄影
              // window.earth.scene.globe.depthTestAgainstTerrain = true // 深度测试
              if (this.hszlayer !== null) {
                this.hszlayer.then(function (layer) {
                  layer.visible = true;
                  this.setview(
                    120.8387279805759,
                    28.371971130691417,
                    291.08784810315643
                  );
                });
              } else {
                this.hszlayer = this.addQXSY(
                  a.url,
                  a.dataurl,
                  a.id,
                  120.8387279805759,
                  28.371971130691417,
                  291.08784810315643
                );
              }
              param = {
                isshow: true,
                layername: a.id,
                name: "鹤盛镇",
                lng: 120.8387279805759,
                lat: 28.371971130691417,
                height: 291.08784810315643,
              };
              this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
              break;
            case 202:
              // 大若岩镇倾斜摄影
              // window.earth.scene.globe.depthTestAgainstTerrain = true // 深度测试
              if (this.drylayer !== null) {
                this.drylayer.then((layer) => {
                  layer.visible = true;
                  this.setview(
                    120.62184613528393,
                    28.274737966665757,
                    244.76462327032053
                  );
                });
              } else {
                this.drylayer = this.addQXSY(
                  a.url,
                  a.dataurl,
                  a.id,
                  120.62184613528393,
                  28.274737966665757,
                  244.76462327032053
                );
              }
              param = {
                isshow: true,
                layername: a.id,
                name: "大若岩镇",
                lng: 120.62184613528393,
                lat: 28.274737966665757,
                height: 244.76462327032053,
              };
              this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
              break;
            case 203:
              // 三维倾斜永嘉枫林镇
              // window.earth.scene.globe.depthTestAgainstTerrain = true // 深度测试
              if (this.flzlayer !== null) {
                this.flzlayer.then((layer) => {
                  layer.visible = true;
                  this.setview(
                    120.75575851539088,
                    28.33507791787183,
                    288.32367182732537
                  );
                });
              } else {
                this.flzlayer = this.addQXSY(
                  a.url,
                  a.dataurl,
                  a.id,
                  120.75575851539088,
                  28.33507791787183,
                  288.32367182732537
                );
              }
              param = {
                isshow: true,
                layername: a.id,
                name: "枫林镇",
                lng: 120.75575851539088,
                lat: 28.33507791787183,
                height: 288.32367182732537,
              };
              this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
              break;
            case 204:
              // 三维倾斜永嘉界坑村
              // window.earth.scene.globe.depthTestAgainstTerrain = true // 深度测试
              if (this.jkclayer !== null) {
                this.jkclayer.then((layer) => {
                  layer.visible = true;
                  this.setview(
                    120.40930812949061,
                    28.44132591044351,
                    708.0313029476863
                  );
                });
              } else {
                this.jkclayer = this.addQXSY(
                  a.url,
                  a.dataurl,
                  a.id,
                  120.40930812949061,
                  28.44132591044351,
                  708.0313029476863
                );
              }
              param = {
                isshow: true,
                layername: a.id,
                name: "界坑乡",
                lng: 120.40930812949061,
                lat: 28.44132591044351,
                height: 708.0313029476863,
              };
              this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
              break;
            case 205:
              // 三维倾斜永嘉桥下镇1
              // window.earth.scene.globe.depthTestAgainstTerrain = true // 深度测试
              if (this.qxzOlayer !== null) {
                this.qxzOlayer.then((layer) => {
                  layer.visible = true;
                  this.setview(
                    120.55651911551178,
                    28.16172350146348,
                    242.4084108219556
                  );
                });
              } else {
                this.qxzOlayer = this.addQXSY(
                  a.url,
                  a.dataurl,
                  a.id,
                  120.55651911551178,
                  28.16172350146348,
                  242.4084108219556
                );
              }
              param = {
                isshow: true,
                layername: a.id,
                name: "桥下镇1",
                lng: 120.55651911551178,
                lat: 28.16172350146348,
                height: 242.4084108219556,
              };
              this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
              break;
            case 206:
              // 三维倾斜永嘉桥下镇2
              // window.earth.scene.globe.depthTestAgainstTerrain = true // 深度测试
              if (this.qxzTlayer !== null) {
                this.qxzTlayer.then((layer) => {
                  layer.visible = true;
                  this.setview(
                    120.56133273898112,
                    28.14169291592059,
                    242.14159886635622
                  );
                });
              } else {
                this.qxzTlayer = this.addQXSY(
                  a.url,
                  a.dataurl,
                  a.id,
                  120.56133273898112,
                  28.14169291592059,
                  242.14159886635622
                );
              }
              param = {
                isshow: true,
                layername: a.id,
                name: "桥下镇2",
                lng: 120.56133273898112,
                lat: 28.14169291592059,
                height: 242.14159886635622,
              };
              this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
              break;
            case 207:
              // 三维倾斜永嘉溪下乡
              // window.earth.scene.globe.depthTestAgainstTerrain = true // 深度测试
              if (this.xxxlayer !== null) {
                this.xxxlayer.then((layer) => {
                  layer.visible = true;
                  this.setview(
                    120.48664280212724,
                    28.49672230235694,
                    577.4576632360657
                  );
                });
              } else {
                this.xxxlayer = this.addQXSY(
                  a.url,
                  a.dataurl,
                  a.id,
                  120.48664280212724,
                  28.49672230235694,
                  577.4576632360657
                );
              }
              param = {
                isshow: true,
                layername: a.id,
                name: "溪下乡",
                lng: 120.48664280212724,
                lat: 28.49672230235694,
                height: 577.4576632360657,
              };
              this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
              break;
            case 208:
              // 三维倾斜永嘉沙头镇
              // window.earth.scene.globe.depthTestAgainstTerrain = true // 深度测试
              if (this.stzlayer !== null) {
                this.stzlayer.then((layer) => {
                  layer.visible = true;
                  this.setview(
                    120.76422242166228,
                    28.18909322620766,
                    459.15589999858855
                  );
                });
              } else {
                this.stzlayer = this.addQXSY(
                  a.url,
                  a.dataurl,
                  a.id,
                  120.76422242166228,
                  28.18909322620766,
                  459.15589999858855
                );
              }
              param = {
                isshow: true,
                layername: a.id,
                name: "沙头镇",
                lng: 120.76422242166228,
                lat: 28.18909322620766,
                height: 459.15589999858855,
              };
              this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
              break;
            case 209:
              // 三维倾斜永嘉巽宅镇
              if (this.xzzlayer !== null) {
                this.xzzlayer.then((layer) => {
                  layer.visible = true;
                  this.setview(
                    120.49072736166544,
                    28.337897347538647,
                    439.53423
                  );
                });
              } else {
                this.xzzlayer = this.addQXSY(
                  a.url,
                  a.dataurl,
                  a.id,
                  120.49072736166544,
                  28.337897347538647,
                  439.53423
                );
              }
              param = {
                isshow: true,
                layername: a.id,
                name: "巽宅镇",
                lng: 120.49072736166544,
                lat: 28.337897347538647,
                height: 439.53423,
              };
              this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
              break;
            case 210:
              // 三维倾斜永嘉岩头镇
              if (this.ytzlayer !== null) {
                this.ytzlayer.then((layer) => {
                  layer.visible = true;
                  this.setview(
                    120.76438461789809,
                    28.351542555895815,
                    606.98235
                  );
                });
              } else {
                this.ytzlayer = this.addQXSY(
                  a.url,
                  a.dataurl,
                  a.id,
                  120.76438461789809,
                  28.351542555895815,
                  606.98235
                );
              }
              param = {
                isshow: true,
                layername: a.id,
                name: "岩头镇",
                lng: 120.76438461789809,
                lat: 28.351542555895815,
                height: 606.98235,
              };
              this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
              break;
            case 211:
              // 三维倾斜永嘉岩坦镇
              if (this.ytanlayer !== null) {
                this.ytanlayer.then((layer) => {
                  layer.visible = true;
                  this.setview(
                    120.72538630132725,
                    28.43329372991379,
                    370.16315545780446
                  );
                });
              } else {
                this.ytanlayer = this.addQXSY(
                  a.url,
                  a.dataurl,
                  a.id,
                  120.72538630132725,
                  28.43329372991379,
                  370.16315545780446
                );
              }
              param = {
                isshow: true,
                layername: a.id,
                name: "岩坦镇",
                lng: 120.72538630132725,
                lat: 28.43329372991379,
                height: 370.16315545780446,
              };
              this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
              break;
            case 212:
              // 三维倾斜永嘉碧莲镇
              if (this.blzlayer !== null) {
                this.blzlayer.then((layer) => {
                  layer.visible = true;
                  this.setview(
                    120.56959564155919,
                    28.301079769394445,
                    459.15589999568067
                  );
                });
              } else {
                this.blzlayer = this.addQXSY(
                  a.url,
                  a.dataurl,
                  a.id,
                  120.56959564155919,
                  28.301079769394445,
                  459.15589999568067
                );
              }
              param = {
                isshow: true,
                layername: a.id,
                name: "碧莲镇",
                lng: 120.56959564155919,
                lat: 28.301079769394445,
                height: 459.15589999568067,
              };
              this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
              break;
            case 213:
              // 三维倾斜永嘉水云溪
              if (this.syxlayer !== null) {
                this.syxlayer.then((layer) => {
                  layer.visible = true;
                  this.setview(
                    120.63877494046184,
                    28.27743052748186,
                    552.1622241592182
                  );
                });
              } else {
                this.syxlayer = this.addQXSY(
                  a.url,
                  a.dataurl,
                  a.id,
                  120.63877494046184,
                  28.27743052748186,
                  552.1622241592182
                );
              }
              param = {
                isshow: true,
                layername: a.id,
                name: "水云溪",
                lng: 120.63877494046184,
                lat: 28.27743052748186,
                height: 552.1622241592182,
              };
              this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
              break;
            case 214:
              // 三维倾斜永嘉桥头镇
              if (this.qtzlayer !== null) {
                this.qtzlayer.then((layer) => {
                  layer.visible = true;
                  this.setview(120.7601745, 28.19577031, 459.1559);
                });
              } else {
                this.qtzlayer = this.addQXSY(
                  a.url,
                  a.dataurl,
                  a.id,
                  120.7601745,
                  28.19577031,
                  459.1559
                );
              }
              param = {
                isshow: true,
                layername: a.id,
                name: "桥头镇",
                lng: 120.7601745,
                lat: 28.19577031,
                height: 459.1559,
              };
              this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
              break;
          }
        } else {
          if (a.id === 4) {
            this.baimolayer.then(function (layer) {
              layer.visible = false;
            });
          } else if (a.id === 30) {
            this.finalayer2012.then(function (layer) {
              layer.visible = false;
            });
          } else if (a.id === 31) {
            this.finalayer2017.then(function (layer) {
              layer.visible = false;
            });
          } else if (a.id === 40) {
            this.sqcllayer.show = false;
          } else if (a.id === 201) {
            this.hszlayer.then(function (layer) {
              layer.visible = false;
            });
            param = {
              isshow: false,
              layername: a.id,
              name: "鹤盛镇",
              lng: 120.8387279805759,
              lat: 28.371971130691417,
              height: 291.08784810315643,
            };
            this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
          } else if (a.id === 202) {
            this.drylayer.then(function (layer) {
              layer.visible = false;
            });
            param = {
              isshow: false,
              layername: a.id,
              name: "大若岩镇",
              lng: 120.62184613528393,
              lat: 28.274737966665757,
              height: 244.76462327032053,
            };
            this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
          } else if (a.id === 203) {
            this.flzlayer.then(function (layer) {
              layer.visible = false;
            });
            param = {
              isshow: false,
              layername: a.id,
              name: "枫林镇",
              lng: 120.75575851539088,
              lat: 28.33507791787183,
              height: 288.32367182732537,
            };
            this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
          } else if (a.id === 204) {
            this.jkclayer.then(function (layer) {
              layer.visible = false;
            });
            param = {
              isshow: false,
              layername: a.id,
              name: "界坑乡",
              lng: 120.40930812949061,
              lat: 28.44132591044351,
              height: 708.0313029476863,
            };
            this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
          } else if (a.id === 205) {
            this.qxzOlayer.then(function (layer) {
              layer.visible = false;
            });
            param = {
              isshow: false,
              layername: a.id,
              name: "桥下镇1",
              lng: 120.55651911551178,
              lat: 28.16172350146348,
              height: 242.4084108219556,
            };
            this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
          } else if (a.id === 206) {
            this.qxzTlayer.then(function (layer) {
              layer.visible = false;
            });
            param = {
              isshow: false,
              layername: a.id,
              name: "桥下镇2",
              lng: 120.56133273898112,
              lat: 28.14169291592059,
              height: 242.14159886635622,
            };
            this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
          } else if (a.id === 207) {
            this.xxxlayer.then(function (layer) {
              layer.visible = false;
            });
            param = {
              isshow: false,
              layername: a.id,
              name: "溪下乡",
              lng: 120.48664280212724,
              lat: 28.49672230235694,
              height: 577.4576632360657,
            };
            this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
          } else if (a.id === 208) {
            this.stzlayer.then(function (layer) {
              layer.visible = false;
            });
            param = {
              isshow: false,
              layername: a.id,
              name: "沙头镇",
              lng: 120.76422242166228,
              lat: 28.18909322620766,
              height: 459.15589999858855,
            };
            this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
          } else if (a.id === 209) {
            this.xzzlayer.then(function (layer) {
              layer.visible = false;
            });
            param = {
              isshow: false,
              layername: a.id,
              name: "巽宅镇",
              lng: 120.49072736166544,
              lat: 28.337897347538647,
              height: 439.53423,
            };
            this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
          } else if (a.id === 210) {
            this.ytzlayer.then(function (layer) {
              layer.visible = false;
            });
            param = {
              isshow: false,
              layername: a.id,
              name: "岩头镇",
              lng: 120.76438461789809,
              lat: 28.351542555895815,
              height: 606.98235,
            };
            this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
          } else if (a.id === 211) {
            this.ytanlayer.then(function (layer) {
              layer.visible = false;
            });
            param = {
              isshow: false,
              layername: a.id,
              name: "岩坦镇",
              lng: 120.72538630132725,
              lat: 28.43329372991379,
              height: 370.16315545780446,
            };
            this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
          } else if (a.id === 212) {
            this.blzlayer.then(function (layer) {
              layer.visible = false;
            });
            param = {
              isshow: false,
              layername: a.id,
              name: "碧莲镇",
              lng: 120.56959564155919,
              lat: 28.301079769394445,
              height: 459.15589999568067,
            };
            this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
          } else if (a.id === 213) {
            this.syxlayer.then(function (layer) {
              layer.visible = false;
            });
            param = {
              isshow: false,
              layername: a.id,
              name: "水云溪",
              lng: 120.63877494046184,
              lat: 28.27743052748186,
              height: 552.1622241592182,
            };
            this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
          } else if (a.id === 214) {
            this.qtzlayer.then(function (layer) {
              layer.visible = false;
            });
            param = {
              isshow: false,
              layername: a.id,
              name: "桥头镇",
              lng: 120.7601745,
              lat: 28.19577031,
              height: 459.1559,
            };
            this.$bus.$emit("simulateFlood", param); // 控制洪水淹没模拟的显示与隐藏，以及倾斜摄影下拉列表的数据
          } else {
            var length = window.earth.dataSources.length;
            for (var i = 0; i < length; i++) {
              const data = window.earth.dataSources.get(i);
              if (data.name.indexOf(a.label) !== -1) {
                window.earth.dataSources.remove(data, true);
              }
            }
          }
        }
      }
    },
    /**
     * 查询图层信息
     * @param dataName // 数据源名称['pg_wzyjdb:mountain_flood_ditch']
     */
    queryLayer(dataName, layerId) {
      if (this.map.getLayer("queryDatas")) {
        this.map.removeLayer("queryDatas");
      }
      const tipElArr = document.getElementsByClassName(
        "mapboxgl-popup-close-button"
      );
      for (let i = 0; i < tipElArr.length; i++) {
        tipElArr[i].click();
      }
      if (dataName.length > 0) {
        this.sqlParam = new SuperMap.GetFeaturesBySQLParameters({
          queryParameter: {
            attributeFilter: "1=1",
          },
          datasetNames: dataName,
          toIndex: -1,
        });
        new FeatureService(dataSourceUrl.dataWenzhouyingji).getFeaturesBySQL(
          this.sqlParam,
          (serviceResult) => {
            if (serviceResult && serviceResult.result) {
              if (!this.map.getSource(layerId)) {
                this.map.addSource(layerId, {
                  type: "geojson",
                  data: serviceResult.result.features,
                });
              }
              this.map.addLayer({
                id: "queryDatas",
                type: "fill" /* fill类型一般用来表示一个面，一般较大 */,
                source: layerId,
                paint: {
                  "fill-color": "#FF3300" /* 填充的颜色 */,
                  "fill-opacity": 0 /* 透明度 */,
                },
              });
              this.map.on("click", "queryDatas", (e) => {
                const html = `<div class="pop-tip">
                <p class="pop-tip-title">${e.features[0].properties.NAME}</p>
                <table class="pop-tip-table">
                  <tr>
                    <td>地址：</td>
                    <td class="pop-tip-table-title">${e.features[0].properties.ADDRESS}</td>
                  </tr>
                  <tr>
                    <td>类型：</td>
                    <td class="pop-tip-table-title">${e.features[0].properties.DATATYPE}</td>
                  </tr>
                </table>
                <div class="pop-tip-bottom">
                 <span class="pop-tip-more" onclick="showInfo()">信息详情>>></span>
                 <span class="pop-tip-analyse" onclick="showAround()">就近分析</span>
                </div>
              </div>`;
                // eslint-disable-next-line no-undef
                this.popup = new mapboxgl.Popup()
                  .setLngLat(e.lngLat)
                  .setHTML(html)
                  .addTo(this.map);
              });
            }
          }
        );
      }
    },
    deleteArryList(arry, val) {
      for (let i = 0; i < arry.length; i++) {
        if (arry[i] === val) {
          arry.splice(i, 1);
          return arry;
        }
      }
    },
    addEntities(obj) {
      const _this = this;
      // 叠加三维点线面通用方法
      var promiseroute11 = Cesium.GeoJsonDataSource.load(obj.url, {
        clampToGround: true,
      });
      // window.earth.scene.globe.depthTestAgainstTerrain = false// 取消深度测试
      promiseroute11
        .then((dataSource) => {
          window.earth.dataSources.add(dataSource);
          this.$store.state.app.datasourcelist.push(dataSource.name); // 将datasource的name存储，方便清空
          const entities = dataSource.entities.values;
          for (var i = 0; i < entities.length; i++) {
            var item = entities[i];
            switch (obj.type) {
              case "LineString":
                item.polyline.material = obj.polyline.material;
                item.polyline.clampToGround = true;
                item.polyline.width = obj.polyline.width;
                break;
              case "Point":
                item.billboard = new Cesium.BillboardGraphics({
                  image: _this.avatar,
                  heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                  width: 40,
                  height: 40,
                });
                break;
              case "Polygon":
                item.polygon.material = obj.polygon.material;
                item.polygon.heightReference =
                  Cesium.HeightReference.CLAMP_TO_GROUND;
                item.polygon.outline = false;
                break;
            }
          }
        })
        .otherwise(function (error) {
          console.log(error);
        });
    },
    locateFinaLyr() {
      window.earth.scene.camera.setView({
        destination: {
          //方位(direction)
          x: -2876276.933400896,
          y: 4843131.36288743,
          z: 2993318.7080605105,
        },
        orientation: {
          heading: 0.003412230608473621, //方位角(heading)
          pitch: -0.5809013016156084, //俯仰角(pitch)
          roll: 0, //滚动角(roll)
        },
      });
    },
    // 添加倾斜摄影
    addQXSY(qxurl, dataServiceUrl, name, lng, lat, height) {
      var scene = window.earth.scene;
      var camera = scene.camera;
      var dataSourceName = "10.36.234.85_fxft"; // 数据源名称
      var dataSetName = "FWM_DanTiHua_YJ"; // 数据集名称
      // 加载倾斜摄影图层
      var layer = null;
      var handler = null;
      layer = scene.addS3MTilesLayerByScp(qxurl, { name: name });
      layer.then((obliqueLayers) => {
        camera.setView({
          // 将经度、纬度、高度的坐标转换为笛卡尔坐标
          destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
          orientation: {
            heading: 5.6326,
            pitch: -0.40149976501196627,
            roll: 6.283185307179572,
          },
        });
        handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        handler.setInputAction((e) => {
          // 首先移除之前添加标识实体
          window.earth.entities.removeById("identify-area");
          // 获取点击位置笛卡尔坐标
          var position = scene.pickPosition(e.position);
          // 从笛卡尔坐标获取经纬度
          var cartographic = Cesium.Cartographic.fromCartesian(position);
          var longitude = Cesium.Math.toDegrees(cartographic.longitude);
          var latitude = Cesium.Math.toDegrees(cartographic.latitude);

          var queryPoint = {
            // 查询点对象
            x: longitude,
            y: latitude,
          };
          this.queryByPoint(
            queryPoint,
            dataSourceName,
            dataSetName,
            dataServiceUrl
          );
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      });
      return layer;
    },
    // 通过点击查询用于表示单体化的面要素，添加到场景中高亮显示。
    queryByPoint(queryPoint, dataSourceName, dataSetName, dataServiceUrl) {
      const _this = this;
      var queryObj = {
        getFeatureMode: "SPATIAL",
        spatialQueryMode: "INTERSECT",
        datasetNames: [dataSourceName + ":" + dataSetName],
        geometry: {
          id: 0,
          parts: [1],
          points: [queryPoint],
          type: "POINT",
        },
      };

      const queryObjJSON = JSON.stringify(queryObj); // 转化为JSON字符串作为查询参数
      $.ajax({
        type: "post",
        url: dataServiceUrl,
        data: queryObjJSON,
        success: (result) => {
          console.log(result);
          var resultObj = JSON.parse(result);
          if (resultObj.featureCount > 0) {
            _this.addClapFeature(resultObj.features[0]);
          }
        },
        error: (msg) => {
          console.log(msg);
        },
      });
    },
    // 将数据服务查询到的要素添加到场景中高亮显示，表示选中效果。
    addClapFeature(feature) {
      const _this = this;
      var lonLatArr = _this.getLonLatArray(feature.geometry.points);
      window.earth.entities.add({
        id: "identify-area",
        name: "单体化标识面",
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(lonLatArr),
          material: new Cesium.Color(1.0, 0.0, 0.0, 0.3),
        },
        clampToS3M: true, // 贴在S3M模型表面
      });
    },
    // 得到[经度,纬度,经度,纬度...]形式的数组，用于构造面。
    getLonLatArray(points) {
      var point3D = [];
      points.forEach((point) => {
        point3D.push(point.x);
        point3D.push(point.y);
      });
      return point3D;
    },
    // 三维定位
    setview(lng, lat, height) {
      window.earth.scene.camera.setView({
        // 将经度、纬度、高度的坐标转换为笛卡尔坐标
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
        orientation: {
          heading: 5.6326,
          pitch: -0.40149976501196627,
          roll: 6.283185307179572,
        },
      });
    },
    // 山区灾害图例
    showSqLegend(obj) {
      var legends = [
        {
          id: obj.id + "high",
          label: "极高风险区",
          legendStatus: obj.legendStatus,
          type: "Polygon",
          bgcolor: "#e7254f",
        },
        {
          id: obj.id + "middleHigh",
          label: "较高风险区",
          legendStatus: obj.legendStatus,
          type: "Polygon",
          bgcolor: "#f79646",
        },
        {
          id: obj.id + "middle",
          label: "中风险区",
          legendStatus: obj.legendStatus,
          type: "Polygon",
          bgcolor: "#ffff00",
        },
        {
          id: obj.id + "low",
          label: "低风险区",
          legendStatus: obj.legendStatus,
          type: "Polygon",
          bgcolor: "#59926d",
        },
      ];

      for (var i = 0; i < legends.length; i++) {
        this.$bus.$emit("cesiumLegend", legends[i]);
      }
    },
  },
};
</script>

<style lang="less">
.coverage {
  position: absolute;
  bottom: 40px;
  left: 50px;

  .treeFilterInput {
    position: absolute;
    right: 25px;
    top: 12px;
    width: 40%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    .el-input__inner {
      background: none;
      border: 1px solid #449bf6;
      color: white;
    }
  }

  .layerTreeContainer {
    height: calc(100% - 110px);
    overflow: hidden auto;

    .el-tree-node__expand-icon {
      color: #449bf6;
      font-size: 18px;
    }

    .el-tree-node__expand-icon.is-leaf {
      color: transparent;
    }

    .el-tree-node__label {
      color: white;
      text-shadow: #449bf6 1px 0 0, #449bf6 0 1px 0, #449bf6 -1px 0 0,
        #449bf6 0 -1px 0;
    }

    .el-tree-node:focus > .el-tree-node__content {
      background: none;
    }

    .el-tree-node__content:hover {
      background: none;
    }

    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: #0adffa;
      border-color: #0adffa;
    }

    .el-checkbox__inner::after {
      border: 1px solid black;
      border-left: 0;
      border-top: 0;
    }

    .el-checkbox__inner::before {
      background-color: black !important;
    }
  }

  .mapboxgl-popup-content {
    min-width: 405px;
    height: auto;
    background: rgba(13, 20, 34, 0.9);
    border: 2px solid #01cfff;
    padding: 0px;

    .mapboxgl-popup-close-button {
      line-height: 35px;
      font-size: 20px;
      color: #0de0c1;
      margin-right: 10px;
    }

    .pop-tip {
      .pop-tip-title {
        margin: 0;
        color: #fff;
        line-height: 40px;
        max-width: 400px;
        height: 40px;
        padding: 0 25px;
        font-size: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border-bottom: 1px solid #00e3f1;
      }

      .pop-tip-table {
        margin: 5px 10px;
        color: #fff;
        font-size: 16px;

        .pop-tip-table-title {
          color: #21e077;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .pop-tip-bottom {
        width: 100%;
        // position: absolute;
        height: 40px;

        .pop-tip-more {
          position: absolute;
          color: #00e3f1;
          padding: 2px 10px;
          border: 1px solid #00e3f1;
          border-radius: 25px;
          margin-left: 10px;
        }

        .pop-tip-analyse {
          position: absolute;
          color: #00e3f1;
          right: 0;
          padding: 2px 10px;
          border: 1px solid #00e3f1;
          border-radius: 25px;
          margin-right: 10px;
        }

        .pop-tip-more:hover {
          color: #fff;
          cursor: pointer;
          background-color: #00e3f1;
        }

        .pop-tip-analyse:hover {
          color: #fff;
          cursor: pointer;
          background-color: #00e3f1;
        }
      }
    }
  }

  .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip,
  .mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
    border-top-color: #01cfff;
    border-bottom-color: #01cfff;
  }

  .mapboxgl-popup {
    max-width: 100% !important;
  }

  .el-popover {
    height: 440px;
    background: url("../../common/images/popover.png") no-repeat;
    background-size: 100% 100%;
    border: none !important;
    bottom: 16px;
    left: 30px;

    .el-popover__title {
      margin-bottom: 10px;
      padding: 10px;
      font-size: 16px;
      border-bottom: 1px solid #449bf6;
      color: white;
      font-size: 18px;
      line-height: 20px;
      text-shadow: #449bf6 1px 0 0, #449bf6 0 1px 0, #449bf6 -1px 0 0,
        #449bf6 0 -1px 0;
    }
  }

  .el-tree {
    background: none;
  }
}
</style>
