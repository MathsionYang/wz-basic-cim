<template>
  <div class="around-source-analyse" v-show="forceEntity">
    <span class="header"
      >周边分析
      <i class="around-source-close" @click="closeAroundSourceAnalyse">x</i>
    </span>
    <div class="around-source-pick">
      <el-select
        class="around-source-select-source"
        v-model="selectSourceLayer"
        multiple
        collapse-tags
        :clearable="true"
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
      <el-collapse accordion>
        <el-collapse-item
          v-for="(item, index) in aroundSourceAnalyseList"
          :key="index"
        >
          <template slot="title">
            <img
              class="around-source-list-icon"
              :src="`/static/images/map-ico/${item.title}.png`"
            /><span>{{ `${item.title} (${item.list.length})` }}</span>
          </template>
          <div
            class="around-source-list-single"
            v-for="(value, subIndex) in item.list"
            :key="subIndex"
            @click="navigate(value)"
          >
            <img
              class="single-location"
              src="/static/images/common/location.png"
            />
            <span>{{ value.resourceName }}</span>
            <span class="single-distance"
              >{{ (+value.distance).toFixed(2) }}米</span
            >
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import gcoord from "gcoord";
import { mapGetters } from "vuex";
import { CESIUM_TREE_AROUND_ANALYSE_OPTION } from "config/server/sourceTreeOption";
import {
  aroundSourceAnalyseDraw,
  initPrimitivesCollection,
  aroundSourceAnalyseCircle,
} from "./AroundSourceAnalyseDraw";
import { getAroundSourceAnalyse } from "@/api/layerServerAPI";
const aroundOption = CESIUM_TREE_AROUND_ANALYSE_OPTION.children.map(
  ({ label, resourceType }) => {
    return { value: resourceType, label };
  }
);
export default {
  name: "aroundSourceAnalyse",
  data() {
    return {
      // forceEntity: { lng: 120.654218, lat: 28.016064 },
      forceEntity: undefined,
      distance: 250,
      distanceOption: [
        { value: 250, label: "250m" },
        { value: 500, label: "500m" },
        { value: 1000, label: "1000m" },
      ],
      selectSourceLayer: [],
      aroundOption,
      aroundSourceAnalyseList: [],
      navigateLine: undefined,
      carModel: undefined,
    };
  },
  props: ["force"],
  computed: {
    ...mapGetters("map", []),
  },
  created() {
    this.initSelectSourceLayer();
  },
  mounted() {
    this.eventRegsiter();
    // this.fetchSourceAround(this.forceEntity);
  },
  beforeDestroy() {},
  methods: {
    eventRegsiter() {
      this.$bus.$off("cesium-3d-around-analyse-pick");
      this.$bus.$on("cesium-3d-around-analyse-pick", (forceEntity) => {
        this.initSelectSourceLayer();
        this.forceEntity = forceEntity;
        this.fetchSourceAround(forceEntity);
      });
    },
    /**
     * 获取周边分析圈,执行周边分析
     * @param {object} forceEntity 分析点
     */
    fetchSourceAround(forceEntity) {
      const { lng, lat } = forceEntity;
      const distance = this.distance;
      const aroundSourceAnalyseList = [];
      //  统一清除 circle label icon
      aroundOption.map(({ value }) => initPrimitivesCollection(value));
      //  周边分析
      aroundOption
        .filter((v) => ~this.selectSourceLayer.indexOf(v.value))
        .map(async ({ label, value }) => {
          const { data } = await getAroundSourceAnalyse({
            resourceType: value,
            lng,
            lat,
            distance,
          });
          const sourceAnalyseResult = { title: label, key: value, list: data };
          aroundSourceAnalyseList.push(sourceAnalyseResult);
          //  周边分析画点
          aroundSourceAnalyseDraw(sourceAnalyseResult);
        });
      //  周边分析画圆
      aroundSourceAnalyseCircle(lng, lat, distance);
      this.aroundSourceAnalyseList = aroundSourceAnalyseList;
    },
    initSelectSourceLayer() {
      this.selectSourceLayer = aroundOption.map((v) => v.value);
    },
    //  重新分析
    sourceUpdateHandler() {
      this.fetchSourceAround(this.forceEntity);
    },
    //  重新分析
    distanceUpdateHandler() {
      this.fetchSourceAround(this.forceEntity);
    },
    //  关闭周边分析
    closeAroundSourceAnalyse() {
      aroundOption.map(({ value }) => initPrimitivesCollection(value));
      this.forceEntity = undefined;
      this.selectSourceLayer = [];
      this.aroundSourceAnalyseList = [];
      this.navigateLine && window.earth.entities.remove(this.navigateLine);
    },
    navigate(item) {
      this.navigateLine && window.earth.entities.remove(this.navigateLine);
      console.log("item", item);
      let destinationGCJ02 = gcoord.transform([this.forceEntity.lng.toFixed(6), this.forceEntity.lat.toFixed(6)], gcoord.WGS84, gcoord.GCJ02);
      let originGCJ02 = gcoord.transform([Number(item.lng).toFixed(6), Number(item.lat).toFixed(6)], gcoord.WGS84, gcoord.GCJ02);
      $.ajax({
        url: "https://restapi.amap.com/v3/direction/driving",
        dataType: "json",
        async: true,
        data: {
          origin: `${originGCJ02[0].toFixed(6)},${originGCJ02[1].toFixed(6)}`,
          destination: `${destinationGCJ02[0].toFixed(6)},${destinationGCJ02[1].toFixed(6)}`,
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
            this.navigateLine = window.earth.entities.add({
              //加载线路到三维球
              name: "navigateLine",
              polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray(positionsWGS84),
                width: 6,
                material: Cesium.Color.GREEN,
                clampToGround: true,
              },
            });
            // window.earth.flyTo(greenLine);
            if (item.resourceName == '消防站') {
              this.carMove(this.navigateLine)
            }
          }
        },
        // error: function () {
        //   callback(null);
        // },
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
        name: 'carModel',
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
