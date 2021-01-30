<template>
  <div class="ThreeDContainer dsm-analyse" />
</template>
<script>
import { BimSourceURL } from "config/server/mapConfig";
import { mapActions } from "vuex";
export default {
  name: "DSMAnalyse",
  data() {
    return {};
  },
  async mounted() {
    this.initScene();
    this.cameraMove();
  },
  beforeDestroy() {
    window.extraHash.dsmMap.show = false;
    window.earth.terrainProvider = window.extraHash.mainDem;
  },
  methods: {
    ...mapActions("map", []),
    initScene() {
      if (window.extraHash.demMap && window.extraHash.demGem) {
        window.extraHash.dsmMap.show = true;
        window.earth.terrainProvider = window.extraHash.dsmDem;
      } else {
        const { DSM_DEM, DSM_MAP } = BimSourceURL;
        window.extraHash.dsmMap = window.earth.imageryLayers.addImageryProvider(
          new Cesium.SuperMapImageryProvider({ url: DSM_MAP })
        );
        window.extraHash.dsmDem = new Cesium.CesiumTerrainProvider({
          url: DSM_DEM, // 政务网永嘉地形
        });
        window.earth.terrainProvider = window.extraHash.dsmDem;
      }
    },
    cameraMove() {
      window.earth.camera.flyTo({
        destination: {
          x: -2878027.796349179,
          y: 4843488.14999402,
          z: 2993577.603640676,
        },
        orientation: {
          heading: 0.003336768850279448,
          pitch: -0.5808830390057418,
          roll: 0.0,
        },
        maximumHeight: 450,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.civilization-center {
  padding: 10px;
  background: rgba(11, 20, 35, 0.8);
  border: 1px solid rgba(81, 161, 201, 0.6);
  .el-divider--horizontal {
    margin: 8px 0;
    background-color: #ccc;
    > .el-divider__text {
      color: #ccc;
      padding: 0 10px;
      background: rgba(11, 20, 35, 1);
    }
  }
  > .civilization-frame {
    width: 100%;
    display: flex;

    > div {
      display: inline-block;
      vertical-align: middle;
      padding: 0 4px;
      color: #fff;
      line-height: 38px;
      &:first-child {
        width: 120px;
      }
      &:last-child {
        flex: 1;
      }
    }
  }
}
</style>
