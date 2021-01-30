<template>
  <div class="ThreeDContainer ThreeToTop" :style="{ width: '557px' }">
    <div class="trackbim tframe">
      <el-form>
        <el-row>
          <el-col :span="96">
            <el-form-item class="elformbtns">
              <el-button class="elformbtn" @click="cameraMove1"
                >动车南站视角</el-button
              >
              <el-button class="elformbtn" @click="cameraMove2"
                >候车轨道视角</el-button
              >
              <el-button class="elformbtn" @click="cameraMove3"
                >检票大厅视角</el-button
              >
              <el-button class="elformbtn" @click="cameraMove4"
                >轨道近览视角</el-button
              >
              <el-button
                class="elformbtn"
                v-show="false"
                @click="closeStationTour"
                >关闭</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { BimSourceURL } from "config/server/mapConfig";
const Cesium = window.Cesium;
import { mapActions } from "vuex";
const LAYER_NAME = ["市域轨道"];
export default {
  name: "trackBIM",
  data() {
    return {
      shallTree: false,
      keys: [],
      tourOn: false,
      // cesium Object
      
      flyManager: undefined,
      count: 0,
      fnScroll: () => {},
    };
  },
  watch: {},
  created() {
  },
  async mounted() {
    this.initBimScene();
    this.cameraMove();
  },
  beforeDestroy() {
    this.clearStationTour();
  },
  methods: {
    ...mapActions("map", ["SetForceBimData", "SetForceRoomData"]),
    fnThrottle(fn, delay, atleast) {
      //节流函数
      let timer = null;
      let previous = null;
      return function () {
        let now = +new Date();
        if (!previous) previous = now;
        if (atleast && now - previous > atleast) {
          fn();
          previous = now;
          clearTimeout(timer);
        } else {
          clearTimeout(timer);
          timer = setTimeout(() => {
            fn();
            previous = null;
          }, delay);
        }
      };
    },
    //  相机移动
    cameraMove1() {
      window.earth.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          120.57898273709611,
          27.971097001460446,
          65.32540639352919
        ), //经度、纬度、高度
        orientation: {
          heading: 2.282500769302837,
          pitch: -0.4671839295639062,
          roll: 6.283185307179586,
        },
        duration: 3,
      });
      // window.earth.scene.camera.setView({
      //   destination: {
      //     x: -2866030.9448004854,
      //     y: 4849762.68619831,
      //     z: 2991379.081976952,
      //   },
      //   orientation: {
      //     heading: 5.276883674010309,
      //     pitch: -0.6268642470390189,
      //     roll: 0,
      //   },
      // });
    },
    cameraMove2() {
      window.earth.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          120.57991555978263,
          27.97044997236902,
          11.372518600580083
        ), //经度、纬度、高度
        orientation: {
          heading: 2.3557559666364236,
          pitch: -0.19637071602058143,
          roll: 6.283185307179586,
        },
        duration: 3,
      });
    },
    cameraMove3() {
      window.earth.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          120.57956398613196,
          27.97045669202681,
          10.106798329482134
        ), //经度、纬度、高度
        orientation: {
          heading: 1.693130241780219,
          pitch: -0.20149960051658589,
          roll: 6.283185307179586,
        },
        duration: 3,
      });
    },
    cameraMove4() {
      window.earth.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          120.69797256177654,
          27.982161772889526,
          46.1676467119629
        ), //经度、纬度、高度
        orientation: {
          heading: 5.108524070999667,
          pitch: -0.3759603806485572,
          roll: 6.283185307179579,
        },
        duration: 3,
      });
    },
    //  初始化BIM场景
    initBimScene(fn) {
      window.earth.scene.undergroundMode = true;
      const _LAYER_ = window.earth.scene.layers.find(LAYER_NAME[0]);
      console.log("_LAYER_", _LAYER_);
      if (_LAYER_) {
        LAYER_NAME.map(
          (d) => (window.earth.scene.layers.find(d).visible = true)
        );
      } else {
        const { track_URL } = BimSourceURL;
        const promise = window.earth.scene.open(track_URL);
        Cesium.when(promise, async (layers) => {
          window.earth.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
              120.57898273709611,
              27.971097001460446,
              65.32540639352919
            ), //经度、纬度、高度
            orientation: {
              heading: 2.282500769302837,
              pitch: -0.4671839295639062,
              roll: 6.283185307179586,
            },
            duration: 3,
          });
          LAYER_NAME.map((d, index) => {
            if (index > 2) return undefined;
            const layer = window.earth.scene.layers.find(d);
            const color = new Cesium.Color.fromCssColorString(
              "rgba(23,92,239,0.3)"
            );
            layer.selectedColor = color;
            layer.datasetInfo().then((result) => {
              this.keys = [...this.keys, ...result.map((v) => v.datasetName)];
              this.StationTreeData[0].children.push({
                id: d,
                label: d,
                children: result.map((v, index) => {
                  return {
                    id: `${d}_${index}`,
                    label: v.datasetName,
                    k: d,
                    startID: v.startID,
                    endID: v.endID,
                  };
                }),
              });
            });
          });
        });
      }
    },
    closeStationTour() {
      this.clearStationTour();
      this.$bus.$emit("cesium-3d-event", { value: null });
    },
    //  清除BIM模块
    clearStationTour() {
      console.log("S1", LAYER_NAME[0]);
      var dddddd = window.earth.scene.layers.find(LAYER_NAME[0]);
      console.log("LAYER_NAME", dddddd);
      window.earth.scene.layers.find(LAYER_NAME[0]).visible = false;
      //LAYER_NAME.map((LAYER_NAME) => (window.earth.scene.layers.find(LAYER_NAME).visible = false));
      //this.flyManager && (this.flyManager = undefined);
      //LAYER_NAME.map((d) => (window.earth.scene.layers.find(d).visible = false));
    },
  },
};
</script>
