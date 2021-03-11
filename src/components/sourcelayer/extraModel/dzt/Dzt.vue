<template>
  <div>
    <div class="ThreeDContainer geology-analyse" :style="{ width: '300px' }">
      <div>透明度：{{ aValue }}%</div>
      <div class="slider-wrapper" @click.stop>
        <el-slider
          @change="change_Alpha_Value"
          :min="aMin"
          :max="aMax"
          v-model="aValue"
        ></el-slider>
      </div>
    </div>
    <div
      class="legend-popup"
      :style="{
        transform: `translate3d(${forcePosition.x}px,${forcePosition.y}px, 0)`,
      }"
    >
      <img src="/static/images/common/地质体图例.png" />
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { CIVILIZATION_CENTER_URL } from "config/server/mapConfig";
const _GEOLOGY_HASH_ = {
  CIM_Geology: "地质体",
};
export default {
  name: "dzt",
  data() {
    return {
      //  透明度
      aMin: 0,
      aMax: 100,
      aValue: 75,
      position: Cesium.Cartesian3.fromDegrees(120.7271, 28.01, 4),
      forcePosition: {},
      solidModelsProfile: undefined,
    };
  },
  async mounted() {
    console.log("mounted");
    this.eventRegsiter();
    this.$parent.$refs.roadline.doPolylineTrailVisible(false);
    this.initBimScene();
    this.cameraMove();
    this.change_Alpha_Value(75);
  },
  beforeDestroy() {
    console.log("beforeDestroy");
    this.$parent.$refs.roadline.doPolylineTrailVisible(true);
    this.change_Alpha_Value(0);
    this.solidModelsProfile.clear();
  },
  methods: {
    ...mapActions("map", []),
    eventRegsiter() {
      //  监听工具栏剖切
      this.$bus.$off("dzt-clip");
      this.$bus.$on("dzt-clip", (boxOptions) => {
        // let newDim = boxEntity.box.dimensions.getValue();
        // let position = Cesium.Cartographic.fromCartesian(boxEntity.position.getValue(0));
        console.log("boxOptions", boxOptions);
        this.solidModelsProfile.clearProfile();
        let newDim = boxOptions.dimensions;
        let position = Cesium.Cartographic.fromCartesian(boxOptions.position);
        let geoBox = new Cesium.GeoBox(newDim.x, newDim.y, newDim.z);
        geoBox.geoPosition = new Cesium.Point3D(
          Cesium.Math.toDegrees(position.longitude),
          Cesium.Math.toDegrees(position.latitude),
          position.height
        );
        console.log("geoBox", geoBox);
        this.solidModelsProfile.addProfileGeometry(geoBox);
        this.solidModelsProfile.build();
      });
      this.$bus.$off("dzt-clear");
      this.$bus.$on("dzt-clear", () => {
        this.solidModelsProfile.clearProfile();
      });
    },
    //  初始化BIM场景
    initBimScene() {
      const { GEOLOGY, GEOLOGY_DATA } = CIVILIZATION_CENTER_URL;
      this.doGroundInit(_GEOLOGY_HASH_, GEOLOGY, GEOLOGY_DATA);
    },
    /**
     * 图层控制
     * @param {object} _HASH_ hash
     * @param {object} _SCENE_URL_ 模型服务地址
     * @param {object} _DATA_ 数据服务地址
     */
    doGroundInit(_HASH_, _SCENE_URL_, _DATA_) {
      Object.keys(_HASH_).map((key) => {
        const _KEY_ = `geology_${key}`;
        this.solidModelsProfile = new Cesium.SolidModelsProfile(
          window.earth.scene
        );
        // let modelUrls = [
        //   "http://172.20.83.223:8098/iserver/services/data-DiZhiTi/rest/data/datasources/%E5%9C%B0%E8%B4%A8%E4%BD%93%E4%B8%8A%E5%9B%BE/datasets/layer_clip/features/1.stream",
        // ];
        var baseUrl = "http://172.20.83.223:8098/iserver/services/data-DiZhiTi/rest/data/datasources/%E5%9C%B0%E8%B4%A8%E4%BD%93%E4%B8%8A%E5%9B%BE/datasets/layer_clip_dig/features/"
        let models = [];
        // 也可以不设置纹理，设置颜色
        // models.push({
        //   id: 1,
        //   model: modelUrls[0],
        // });
        for (let i = 1; i <= 990; i++) {
          models.push({
            id: i,
            model: `${baseUrl}${i}.stream`,
          });
        }
        this.solidModelsProfile.addModels(models);
      });
    },
    change_Alpha_Value(val) {
      window.earth.scene.globe.globeAlpha = (100 - val) / 100;
    },
    cameraMove() {
      // window.earth.camera.flyTo({
      //   destination: {
      //     x: -2877358.4295731103,
      //     y: 4841834.134246617,
      //     z: 2994574.2246890087,
      //   },
      //   orientation: {
      //     heading: 0.003336768850279448,
      //     pitch: -0.5808830390057418,
      //     roll: 0.0,
      //   },
      //   maximumHeight: 450,
      // });
      window.earth.camera.flyTo({
        destination: {
          x: -2876906.002533756,
          y: 4841075.198844643,
          z: 2995213.4453336787,
        },
        orientation: {
          heading: 0.003336768850279448,
          pitch: -0.5808830390057418,
          roll: 0.0,
        },
        maximumHeight: 450,
      });
    },
    renderForceEntity() {
      const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        window.earth.scene,
        this.position
      );
      if (
        this.forcePosition.x !== pointToWindow.x ||
        this.forcePosition.y !== pointToWindow.y
      ) {
        this.forcePosition = pointToWindow;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.geology-analyse {
  z-index: 7;
  position: absolute;
  left: 26vw;
  -webkit-transform: translateX(-50%);
  top: 10vh;
  overflow: hidden;
  padding: 0 10px;
  display: flex;
  background: rgba(11, 20, 35, 0.8);
  border: 1px solid rgba(81, 161, 201, 0.6);
  > div {
    display: inline-block;
    vertical-align: middle;
    padding: 0 4px;
    color: #fff;
    line-height: 38px;
    &:first-child {
      width: 120px;
    }
    &:nth-child(2) {
      flex: 1;
    }
  }
}
.legend-popup {
  top: 5vh;
  left: 0;
  position: absolute;
  z-index: 2;
}
</style>
