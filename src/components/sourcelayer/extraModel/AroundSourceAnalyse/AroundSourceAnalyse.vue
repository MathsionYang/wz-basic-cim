<template>
  <div class="around-source-analyse" v-if="isLoaded">
    <div class="header">
      <div class="title">周边分析</div>
      <div class="decorate"></div>
      <i class="around-source-close" @click="closeAroundSourceAnalyse"></i>
    </div>
    <div class="around-source-pick">
      <el-select
        class="around-source-select-source"
        v-model="selectSourceLayer"
        multiple
        collapse-tags
        placeholder="请选择"
        @change="sourceUpdateHandler"
      >
        <el-option
          v-for="item in aroundOption"
          :key="item.value"
          :label="item.label"
          :value="item.label"
        />
      </el-select>
      <el-select
        v-if="selectedSourceObj.title.length"
        class="around-source-select-distance"
        v-model="distanceObj[selectedSourceObj.title].distance"
        @change="distanceUpdateHandler"
      >
        <el-option
          v-for="item in distanceObj[selectedSourceObj.title].option"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="around-source-list">
      <div
        class="around-source-item"
        v-for="(item, index) in selectSourceLayer"
        :key="index"
        @click="sourceClick(item)"
      >
        <img
          class="around-source-list-icon"
          :src="
            selectedSourceObj.title == item
              ? `/static/images/aroundSource/${item}选中@2x.png`
              : `/static/images/aroundSource/${item}@2x.png`
          "
        />
        <div
          v-show="selectedSourceObj.title == item"
          class="around-source-list-shine"
        ></div>
        <p class="sourceName" :class="{selected:selectedSourceObj.title == item}">{{item}}</p>
      </div>
    </div>
    <ul
      class="around-source-list-single"
      v-if="forceEntity && aroundSourceAnalyseList.length"
    >
      <li
        class="around-source-list-item"
        v-for="(item, index) in selectedSourceObj.list"
        :key="index"
      >
        <!-- <img
          class="single-location"
          src="/static/images/common/location2.png"
        /> -->
        <span class="index">{{ index + 1 }}</span>
        <span class="name">{{
          forceEntity.type == "source"
            ? item.attributes.NAME
            : item.resourceName
        }}</span>
        <span class="single-distance">{{ (+item.distance).toFixed(2) }}米</span>
        <span class="navigate" @click="navigate(item, forceEntity.type)">导航</span>
      </li>
      <p class="no-data" v-if="!selectedSourceObj.list.length">暂无数据</p>
    </ul>
  </div>
</template>

<script>
import gcoord from "gcoord";
import { mapGetters } from "vuex";
import { treeDrawTool } from "../../layerHub/TreeDrawTool";
import {
  CESIUM_TREE_AROUND_ANALYSE_OPTION,
  CESIUM_TREE_EVENT_AROUND_ANALYSE_OPTION,
} from "config/server/sourceTreeOption";
import {
  aroundSourceAnalyseDraw,
  initPrimitivesCollection,
  hideVisible,
  aroundSourceAnalyseCircle,
  removeAroundSourceAnalyseCircle,
} from "./AroundSourceAnalyseDraw";
import { dealPathWithXhr, clearPath, carModelMove } from "./PathTools";
import { getAroundSourceAnalyse } from "@/api/layerServerAPI";
import { arrayCompareWithParam } from "common/js/util";

export default {
  name: "aroundSourceAnalyse",
  data() {
    return {
      isLoaded: false,
      forceEntity: undefined,
      distanceObj: {},
      selectSourceLayer: [],
      aroundOption: [],
      aroundSourceAnalyseList: [],
      locationBillboard: undefined,
      selectedSourceObj: {
        title: "",
        key: "",
        list: [],
      },
    };
  },
  props: ["force"],
  computed: {
    ...mapGetters("map", []),
  },
  mounted() {
    this.eventRegsiter();
  },
  beforeDestroy() {},
  methods: {
    eventRegsiter() {
      this.$bus.$off("cesium-3d-around-analyse-pick");
      this.$bus.$on("cesium-3d-around-analyse-pick", (forceEntity) => {
        this.forceEntity = forceEntity;
        this.initAroundOption();
        this.initCircle();
        if (this.forceEntity.type == "source") {
          this.fetchSourceAround(this.forceEntity);
        } else {
          this.fetchEventSourceAround(this.forceEntity);
        }
      });
    },
    /**
     * 获取周边分析圈,执行周边分析
     * @param {object} forceEntity 分析点
     */
    fetchEventSourceAround(forceEntity) {
      const lng = forceEntity.geometry.x;
      const lat = forceEntity.geometry.y;
      const aroundSourceAnalyseList = [];
      //  统一清除 circle label icon
      this.aroundOption.map(({ value }) => initPrimitivesCollection(value));
      //  周边分析
      this.aroundOption
        .filter((v) => ~this.selectSourceLayer.indexOf(v.label))
        .map(async ({ label, value }) => {
          let distance = this.distanceObj[label].distance;
          const { data } = await getAroundSourceAnalyse({
            resourceType: value,
            lng,
            lat,
            distance,
          });
          let list = data.sort(arrayCompareWithParam("distance")).slice(0, 20);
          const sourceAnalyseResult = {
            title: label,
            key: value,
            list,
            dataset: CESIUM_TREE_EVENT_AROUND_ANALYSE_OPTION.children.filter(
              ({ resourceType }) => resourceType == value
            )[0],
          };

          aroundSourceAnalyseList.push(sourceAnalyseResult);
          //  默认选中第一项
          if (
            !this.selectedSourceObj.title.length ||
            this.selectSourceLayer.indexOf(this.selectedSourceObj.title) < 0
          ) {
            this.sourceClick(this.selectSourceLayer[0]);
          } else {
            this.sourceClick(this.selectedSourceObj.title);
          }
          //  周边分析画点
          aroundSourceAnalyseDraw(sourceAnalyseResult);
        });
      this.aroundSourceAnalyseList = aroundSourceAnalyseList;
    },
    fetchSourceAround(forceEntity) {
      const aroundSourceAnalyseList = [];

      this.aroundOption.forEach((item) => hideVisible(item));
      this.aroundOption
        .filter((v) => ~this.selectSourceLayer.indexOf(v.value))
        .forEach((item) => {
          let distance = this.distanceObj[item.label].distance;
          let getFeatureParameter, getFeatureService;
          getFeatureParameter = new SuperMap.REST.GetFeaturesByBufferParameters(
            {
              // 缓冲距离单位疑似十万米！！！图形单位米！！！
              bufferDistance: distance / 100000,
              toIndex: -1,
              datasetNames: [`${item.newdataset}`],
              returnContent: true,
              geometry: forceEntity.geometry,
            }
          );
          getFeatureService = new SuperMap.REST.GetFeaturesByBufferService(
            item.url,
            {
              eventListeners: {
                processCompleted: async (res) => {
                  if (
                    res.result &&
                    res.result.features &&
                    res.result.features.length
                  ) {
                    treeDrawTool(this, res, item);

                    //  求距离
                    let geodesic = new Cesium.EllipsoidGeodesic();
                    let startCartographic = Cesium.Cartographic.fromDegrees(
                      this.forceEntity.geometry.x,
                      this.forceEntity.geometry.y
                    );
                    res.result.features.map((v) => {
                      let endCartographic = Cesium.Cartographic.fromDegrees(
                        v.geometry.x,
                        v.geometry.y
                      );
                      geodesic.setEndPoints(startCartographic, endCartographic);
                      let surfaceDistance = geodesic.surfaceDistance;
                      return Object.assign(v, { distance: surfaceDistance });
                    });
                  }
                  const sourceAnalyseResult = {
                    title: item.label,
                    key: item.value,
                    list: res.result.features.sort(
                      arrayCompareWithParam("distance")
                    ),
                  };
                  aroundSourceAnalyseList.push(sourceAnalyseResult);
                  if (
                    !this.selectedSourceObj.title.length ||
                    this.selectSourceLayer.indexOf(
                      this.selectedSourceObj.title
                    ) < 0
                  ) {
                    this.sourceClick(this.selectSourceLayer[0]);
                  } else {
                    this.sourceClick(this.selectedSourceObj.title);
                  }
                },
                processFailed: (msg) => console.log(msg),
              },
            }
          );
          getFeatureService.processAsync(getFeatureParameter);
        });
      this.aroundSourceAnalyseList = aroundSourceAnalyseList;
    },
    initAroundOption() {
      if (this.forceEntity && this.forceEntity.type == "source") {
        this.aroundOption = CESIUM_TREE_AROUND_ANALYSE_OPTION.children.map(
          (item) => {
            return { ...item, value: item.id };
          }
        );
      } else {
        this.aroundOption = CESIUM_TREE_EVENT_AROUND_ANALYSE_OPTION.children.map(
          ({ label, resourceType }) => {
            return { value: resourceType, label };
          }
        );
      }
      this.initSelectSourceLayer();
      this.initDistanceOption();
    },
    initSelectSourceLayer() {
      this.selectSourceLayer = this.aroundOption.map((v) => v.label);
    },
    initDistanceOption() {
      this.distanceObj = {};
      this.aroundOption.map((v) => {
        this.distanceObj[v.label] = {};
        this.distanceObj[v.label].option = [
          { value: 250, label: "250m" },
          { value: 500, label: "500m" },
          { value: 1000, label: "1000m" },
        ];
        if (v.label == '医疗场所' || v.label == '消防站') {
          this.distanceObj[v.label].option.push({value: 200000000, label: "最近"})
        }
        //  默认展示1000米范围
        this.distanceObj[v.label].distance = 1000;
      });
      this.isLoaded = true;
    },
    //  周边分析画圆
    initCircle() {
      const AroundCircleEntityCollection = new Cesium.CustomDataSource(
        "around"
      );
      window.earth.dataSources.add(AroundCircleEntityCollection);
      window.labelMap["pathRoute_analyse_labels"] = window.earth.scene.primitives.add(
        new Cesium.LabelCollection()
      );
      const lng = this.forceEntity.geometry.x;
      const lat = this.forceEntity.geometry.y;
      aroundSourceAnalyseCircle(lng, lat, 250);
      aroundSourceAnalyseCircle(lng, lat, 500);
      aroundSourceAnalyseCircle(lng, lat, 1000);
    },
    //  重新分析
    sourceUpdateHandler() {
      if (this.forceEntity.type == "source") {
        this.fetchSourceAround(this.forceEntity);
      } else {
        this.fetchEventSourceAround(this.forceEntity);
      }
    },
    //  重新分析
    distanceUpdateHandler() {
      if (this.forceEntity.type == "source") {
        this.fetchSourceAround(this.forceEntity);
      } else {
        this.fetchEventSourceAround(this.forceEntity);
      }
    },
    //  关闭周边分析
    closeAroundSourceAnalyse() {
      this.aroundOption.map(({ value }) => initPrimitivesCollection(value));
      this.aroundOption.forEach((item) => hideVisible(item));
      this.isLoaded = false;
      this.forceEntity = undefined;
      this.selectSourceLayer = [];
      this.aroundSourceAnalyseList = [];
      clearPath();
      this.locationBillboard &&
        window.earth.entities.remove(this.locationBillboard);
      removeAroundSourceAnalyseCircle();
    },
    // 选择类型
    sourceClick(source) {
      this.locationBillboard &&
          window.earth.entities.remove(this.locationBillboard);
      clearPath()
      this.aroundSourceAnalyseList.forEach((v) => {
        if (v.title == source) {
          this.selectedSourceObj = v;
        }
      });
    },
    // 路线规划
    navigate(item, type) {
      let x;
      let y;
      if (type == "event") {
        x = item.lng;
        y = item.lat;
        clearPath()
        this.locationBillboard &&
          window.earth.entities.remove(this.locationBillboard);
        let originPosition = Cesium.Cartesian3.fromDegrees(
          +item.lng,
          +item.lat,
          4
        );
        let originGCJ02 = gcoord.transform(
          [Number(item.lng).toFixed(6), Number(item.lat).toFixed(6)],
          gcoord.WGS84,
          gcoord.GCJ02
        );
        let destinationGCJ02 = gcoord.transform(
          [
            this.forceEntity.geometry.x.toFixed(6),
            this.forceEntity.geometry.y.toFixed(6),
          ],
          gcoord.WGS84,
          gcoord.GCJ02
        );
        dealPathWithXhr(gcoord, originGCJ02, destinationGCJ02, () => {
          this.locationBillboard = window.earth.entities.add({
            name: "目的地",
            position: originPosition,
            billboard: {
              image: `/static/images/map-ico/location.png`,
              width: 34,
              height: 35,
            },
          });
          if (item.resourceType == "fire_station") {
            carModelMove(window.billboardMap["pathRoute_analyse_lines"]);
          }
        });
      }
      window.earth.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(+x + 0.01, +y - 0.02, 1450),
        orientation: {
          heading: 5.9232943303067405,
          pitch: -0.574668319401269,
          roll: 0
        },
        maximumHeight: 450,
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./AroundSourceAnalyse.less");
</style>
