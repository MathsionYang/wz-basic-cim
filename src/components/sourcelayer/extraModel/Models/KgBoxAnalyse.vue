<template>
  <div class="ThreeDContainer kg-box-analyse" :style="{ width: '300px' }">
    <KgLegend />
  </div>
</template>
<script>
import { mapActions } from "vuex";
// import KgLegend from "./components/KgLegend";
export default {
  name: "KgBoxAnalyse",
  data() {
    return {
      min: 0,
      max: 100,
      sliderValue: 1,
      dataDone: false,
    };
  },
  components: {  },
  async mounted() {
    this.initBimScene();
  },
  beforeDestroy() {
    this.entityVisible(false);
  },
  methods: {
    ...mapActions("map", []),
    //  初始化BIM场景
    initBimScene() {
      const layer = window.earth.scene.layers.find("kgbox");
      if (layer) {
        this.entityVisible(true);
      } else {
        const promise = window.earth.scene.addS3MTilesLayerByScp(
          `http://172.20.83.223:8098/iserver/services/3D-kongui/rest/realspace/datas/konggui/config`,
          { name: "kgbox" }
        );
        Cesium.when(promise, async () => {
          const _layer_ = window.earth.scene.layers.find("kgbox");
          var s = new Cesium.Style3D();
          s.fillForeColor = new Cesium.Color(1.0, 1.0, 1.0, 0.3);
          _layer_.style3D = s;
        });
      }
    },
    entityVisible(boolean) {
      const layer = window.earth.scene.layers.find("kgbox");
      layer.visible = boolean;
    },
  },
};
</script>

<style lang="less" scoped>
.kg-box-analyse {
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
</style>
