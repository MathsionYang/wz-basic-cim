<template>
  <div class="around-source-analyse" v-show="forceEntity">
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
          :value="item.value"
        />
      </el-select>
      <el-select
        class="around-source-select-distance"
        v-model="distance"
        @change="distanceUpdateHandler"
      >
        <el-option
          v-for="item in distanceOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="around-source-list">
      <!-- <div class="around-source-item" @click="toggleXFZ" v-show="forceEntity && forceEntity.type == 'event'">
        <img
          class="around-source-list-icon"
          :src="
            xfzSelected
              ? `/static/images/aroundSource/消防站选中@2x.png`
              : `/static/images/aroundSource/消防站@2x.png`
          "
        />
        <div v-show="xfzSelected" class="around-source-list-shine"></div>
      </div>
      <div class="around-source-item" @click="toggleKakou" v-show="forceEntity && forceEntity.type == 'event'">
        <img
          class="around-source-list-icon"
          :src="
            kakouSelected
              ? `/static/images/aroundSource/交通卡口选中@2x.png`
              : `/static/images/aroundSource/交通卡口@2x.png`
          "
        />
        <div v-show="kakouSelected" class="around-source-list-shine"></div>
      </div> -->
      <div
        class="around-source-item"
        v-for="(item, index) in aroundSourceAnalyseList"
        :key="index"
        @click="itemClick(item)"
      >
        <img
          class="around-source-list-icon"
          :src="
            selectedSourceObj.title == item.title
              ? `/static/images/aroundSource/${item.title}选中@2x.png`
              : `/static/images/aroundSource/${item.title}@2x.png`
          "
        />
        <div v-show="selectedSourceObj.title == item.title" class="around-source-list-shine"></div>
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
        @click="navigate(item, forceEntity.type)"
      >
        <img
          class="single-location"
          src="/static/images/common/location2.png"
        />
        <span class="name">{{
          forceEntity.type == "source"
            ? item.attributes.NAME
            : item.resourceName
        }}</span>
        <span class="single-distance">{{ (+item.distance).toFixed(2) }}米</span>
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
  // CESIUM_TREE_TRAFFIC_OPTION,
  // CESIUM_TREE_EMERGENCY_OPTION,
  CESIUM_TREE_AROUND_ANALYSE_OPTION,
  CESIUM_TREE_EVENT_AROUND_ANALYSE_OPTION,
} from "config/server/sourceTreeOption";
import {
  aroundSourceAnalyseDraw,
  initPrimitivesCollection,
  hideVisible,
  aroundSourceAnalyseCircle,
} from "./AroundSourceAnalyseDraw";
import { getAroundSourceAnalyse } from "@/api/layerServerAPI";
import { arrayCompareWithParam } from "common/js/util";

export default {
  name: "aroundSourceAnalyse",
  data() {
    return {
      forceEntity: undefined,
      distance: 1000,
      distanceOption: [
        { value: 250, label: "250m" },
        { value: 500, label: "500m" },
        { value: 1000, label: "1000m" },
      ],
      selectSourceLayer: [],
      aroundOption: [],
      aroundSourceAnalyseList: [],
      locationBillboard: undefined,
      navigateLine: undefined,
      carModel: undefined,
      selectedSourceObj: {
        title: "",
        key: "",
        list: [],
      },
      // kakouSelected: false,
      // xfzSelected: false,
    };
  },
  props: ["force"],
  computed: {
    ...mapGetters("map", []),
  },
  // created() {
  //   this.initSelectSourceLayer();
  // },
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
        if (this.forceEntity.type == "source") {
          this.fetchSourceAround(this.forceEntity);
        } else {
          this.fetchEventSourceAround(this.forceEntity);
          // this.toggleKakou();
          // this.toggleXFZ();
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
      const distance = this.distance;
      const aroundSourceAnalyseList = [];
      //  统一清除 circle label icon
      this.aroundOption.map(({ value }) => initPrimitivesCollection(value));
      //  周边分析
      this.aroundOption
        .filter((v) => ~this.selectSourceLayer.indexOf(v.value))
        .map(async ({ label, value }) => {
          const { data } = await getAroundSourceAnalyse({
            resourceType: value,
            lng,
            lat,
            distance,
          });
          // let list;
          // if (value == "fire_hydrant") {
          //   list = data.slice(0, 20).sort(arrayCompareWithParam("distance"));
          // } else {
          //   list = data.sort(arrayCompareWithParam("distance"));
          // }
          let list = data.sort(arrayCompareWithParam("distance")).slice(0, 20);
          const sourceAnalyseResult = {
            title: label,
            key: value,
            list,
            dataset: CESIUM_TREE_EVENT_AROUND_ANALYSE_OPTION.children.filter(
              ({ resourceType }) => resourceType == value
            )[0],
          };
          if (!aroundSourceAnalyseList.length) {
            this.selectedSourceObj = sourceAnalyseResult;
          }
          aroundSourceAnalyseList.push(sourceAnalyseResult);
          //  周边分析画点
          aroundSourceAnalyseDraw(sourceAnalyseResult);
        });
      //  周边分析画圆
      aroundSourceAnalyseCircle(lng, lat, distance);
      this.aroundSourceAnalyseList = aroundSourceAnalyseList;
    },
    fetchSourceAround(forceEntity) {
      const lng = forceEntity.geometry.x;
      const lat = forceEntity.geometry.y;
      const distance = this.distance;
      const aroundSourceAnalyseList = [];

      this.aroundOption.forEach((item) => hideVisible(item));
      this.aroundOption
        .filter((v) => ~this.selectSourceLayer.indexOf(v.value))
        .forEach((item) => {
          let getFeatureParameter, getFeatureService;
          getFeatureParameter = new SuperMap.REST.GetFeaturesByBufferParameters(
            {
              // 缓冲距离单位疑似十万米！！！图形单位米！！！
              bufferDistance: this.distance / 100000,
              toIndex: -1,
              datasetNames: [`${item.newdataset}`],
              returnContent: true,
              geometry: this.forceEntity.geometry,
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
                      let distance = geodesic.surfaceDistance;
                      return Object.assign(v, { distance: distance });
                    });
                  }
                  const sourceAnalyseResult = {
                    title: item.label,
                    key: item.value,
                    list: res.result.features.sort(
                      arrayCompareWithParam("distance")
                    ),
                  };
                  if (!aroundSourceAnalyseList.length) {
                    this.selectedSourceObj = sourceAnalyseResult;
                  }
                  aroundSourceAnalyseList.push(sourceAnalyseResult);
                },
                processFailed: (msg) => console.log(msg),
              },
            }
          );
          getFeatureService.processAsync(getFeatureParameter);
        });
      aroundSourceAnalyseCircle(lng, lat, distance);
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
    },
    initSelectSourceLayer() {
      this.selectSourceLayer = this.aroundOption.map((v) => v.value);
    },
    //  切换交通卡口图层
    // toggleKakou() {
    //   this.kakouSelected = !this.kakouSelected;
    //   const topic = CESIUM_TREE_TRAFFIC_OPTION[0].children.filter(
    //     (item) => item.label == "交通监测数据"
    //   );
    //   this.$parent.$refs.layerHub.doForceTrueTopicLabels(
    //     CESIUM_TREE_TRAFFIC_OPTION[0].label,
    //     topic[0].children,
    //     topic[0].children[0].id
    //   );
    // },
    // //  切换消防站图层
    // toggleXFZ() {
    //   this.xfzSelected = !this.xfzSelected;
    //   const topic = CESIUM_TREE_EMERGENCY_OPTION
    //   this.$parent.$refs.layerHub.doForceTrueTopicLabels(
    //     CESIUM_TREE_TRAFFIC_OPTION[0].label,
    //     topic[0].children,
    //     topic[0].children[0].id
    //   );
    // },
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
      this.forceEntity = undefined;
      this.selectSourceLayer = [];
      this.aroundSourceAnalyseList = [];
      this.navigateLine && window.earth.entities.remove(this.navigateLine);
      this.locationBillboard &&
        window.earth.entities.remove(this.locationBillboard);
      // this.kakouSelected && this.toggleKakou();
      // this.xfzSelected && this.toggleXFZ();
    },
    // 选择类型
    itemClick(item) {
      this.selectedSourceObj = item;
    },
    // 路线规划
    navigate(item, type) {
      let x
      let y
      if (type == "event") {
        x = item.lng;
        y = item.lat;
        this.navigateLine && window.earth.entities.remove(this.navigateLine);
        this.locationBillboard &&
          window.earth.entities.remove(this.locationBillboard);
        let originPosition = Cesium.Cartesian3.fromDegrees(
          +item.lng,
          +item.lat,
          4
        );
        let destinationGCJ02 = gcoord.transform(
          [
            this.forceEntity.geometry.x.toFixed(6),
            this.forceEntity.geometry.y.toFixed(6),
          ],
          gcoord.WGS84,
          gcoord.GCJ02
        );
        let originGCJ02 = gcoord.transform(
          [Number(item.lng).toFixed(6), Number(item.lat).toFixed(6)],
          gcoord.WGS84,
          gcoord.GCJ02
        );
        $.ajax({
          url: "https://restapi.amap.com/v3/direction/driving",
          dataType: "json",
          async: true,
          data: {
            origin: `${originGCJ02[0].toFixed(6)},${originGCJ02[1].toFixed(6)}`,
            destination: `${destinationGCJ02[0].toFixed(
              6
            )},${destinationGCJ02[1].toFixed(6)}`,
            key: "81b836fbf5c7523ea1d5ef934b87603f",
          },
          success: (data) => {
            console.log("data", data);
            if (data.status < 1) {
            } else {
              let result = data.route;
              let paths = result.paths[0].steps;
              let positions = [];
              for (let index = 0; index < paths.length; index++) {
                const path = paths[index];
                let polyline = path.polyline;
                let polylinePoints = polyline.split(/[,]|;/);
                positions = positions.concat(polylinePoints);
              }
              positions = positions.map(Number);
              let positionsWGS84 = [];
              for (let index = 0; index < positions.length - 1; index += 2) {
                const pos = positions[index];
                const pos2 = positions[index + 1];
                let coordWGS84 = gcoord.transform(
                  [pos, pos2],
                  gcoord.GCJ02,
                  gcoord.WGS84
                );
                positionsWGS84 = positionsWGS84.concat(coordWGS84);
              }
              this.locationBillboard = window.earth.entities.add({
                name: "目的地",
                position: originPosition,
                billboard: {
                  image: `/static/images/map-ico/location.png`,
                  width: 34,
                  height: 35,
                },
              });
              this.navigateLine = window.earth.entities.add({
                name: "navigateLine",
                polyline: {
                  positions: Cesium.Cartesian3.fromDegreesArray(positionsWGS84),
                  width: 12,
                  material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED),
                  clampToGround: true,
                },
              });
              // window.earth.flyTo(this.navigateLine);
              if (item.resourceType == "fire_station") {
                this.carMove(this.navigateLine);
              }
            }
          },
          // error: function () {
          //   callback(null);
          // },
        });
      } else {
        x = item.geometry.x;
        y = item.geometry.y;
      }
      console.log('item!!!', item)
      window.earth.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(+x, +y - 0.005, 450),
        orientation: {
          heading: 0.003336768850279448,
          pitch: -0.5808830390057418,
          roll: 0.0,
        },
        maximumHeight: 450,
      });
    },
    carMove(lineEntity) {
      if (!lineEntity) return;
      let positions = lineEntity.polyline.positions.getValue();
      if (!positions) return;
      let allDis = 0;
      for (let index = 0; index < positions.length - 1; index++) {
        let dis = Cesium.Cartesian3.distance(
          positions[index],
          positions[index + 1]
        );
        allDis += dis;
      }
      let playTime = 10;
      let v = allDis / playTime;
      let startTime = window.earth.clock.currentTime;
      let endTime = Cesium.JulianDate.addSeconds(
        startTime,
        playTime,
        new Cesium.JulianDate()
      );
      let property = new Cesium.SampledPositionProperty();
      let t = 0;
      for (let i = 1; i < positions.length; i++) {
        if (i == 1) {
          property.addSample(startTime, positions[0]);
        }
        let dis = Cesium.Cartesian3.distance(positions[i], positions[i - 1]);
        let time = dis / v + t;
        let julianDate = Cesium.JulianDate.addSeconds(
          startTime,
          time,
          new Cesium.JulianDate()
        );
        property.addSample(julianDate, positions[i]);
        t += dis / v;
      }
      if (this.carModel) {
        window.earth.entities.remove(this.carModel);
        this.carModel = null;
      }
      this.carModel = window.earth.entities.add({
        name: "carModel",
        position: property,
        orientation: new Cesium.VelocityOrientationProperty(property),
        model: {
          uri: "/static/gltf/Firetruck_rotate_270.gltf",
          scale: 6,
        },
      });
      window.earth.clock.currentTime = startTime;
      window.earth.clock.multiplier = 1;
      window.earth.clock.shouldAnimate = true;
      window.earth.clock.stopTime = endTime;
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./AroundSourceAnalyse.less");
</style>
