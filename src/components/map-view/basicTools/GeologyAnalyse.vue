<template>
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
</template>
<script>
import { mapActions } from "vuex";
import { CIVILIZATION_CENTER_URL } from "config/server/mapConfig";
const _ABOVEGROUND_HASH_ = {
  B2土建: "给水管线",
  B1土建: "B1土建_table",
};
const _GEOLOGY_HASH_ = {
  CIM_Geology: "地质体7",
};
export default {
  name: "GeologyAnalyse",
  data() {
    return {
      //  透明度
      aMin: 0,
      aMax: 100,
      aValue: 75,
    };
  },
  async mounted() {
    this.initBimScene();
    this.cameraMove();
    this.change_Alpha_Value(75);
  },
  beforeDestroy() {
    this.change_Alpha_Value(0);
    this.doCivilizationCenterVisible(_GEOLOGY_HASH_, false);
    this.doCivilizationCenterVisible(_ABOVEGROUND_HASH_, false);
  },
  methods: {
    ...mapActions("map", []),
    //  初始化BIM场景
    initBimScene() {
      if (window.extraHash.geology) {
        this.doCivilizationCenterVisible(_GEOLOGY_HASH_, true);
        this.doCivilizationCenterVisible(_ABOVEGROUND_HASH_, true);
      } else {
        const {
          GEOLOGY,
          ABOVEGROUND,
          ABOVEGROUND_DATA,
          GEOLOGY_DATA,
        } = CIVILIZATION_CENTER_URL;
        this.doGroundInit(_ABOVEGROUND_HASH_, ABOVEGROUND, ABOVEGROUND_DATA);
        this.doGroundInit(_GEOLOGY_HASH_, GEOLOGY, GEOLOGY_DATA);
      }
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
        const promise = window.earth.scene.addS3MTilesLayerByScp(
          `${_SCENE_URL_}/datas/${key}/config`,
          { name: _KEY_ }
        );
        if (_DATA_) {
          Cesium.when(promise, async () => {
            const { url, dataSourceName } = _DATA_;
            const layer = window.earth.scene.layers.find(_KEY_);
            layer.setQueryParameter({
              url,
              isMerge: true,
              ...(dataSourceName
                ? {
                    dataSourceName,
                    dataSetName: _HASH_[key],
                  }
                : {
                    dataSourceName: _HASH_[key],
                  }),
            });
          });
        }
        //  做全局标识，不保存图层指针了
        window.extraHash.geology = true;
      });
    },
    /**
     * 显隐控制
     * @param {object} _HASH_ hash
     * @param {boolean} boolean 开关
     */
    doCivilizationCenterVisible(_HASH_, boolean) {
      Object.keys(_HASH_).map((key) => {
        const _KEY_ = `geology_${key}`;
        const layer = window.earth.scene.layers.find(_KEY_);
        layer.visible = boolean;
      });
    },
    change_Alpha_Value(val) {
      window.earth.scene.globe.globeAlpha = (100 - val) / 100;
    },
    cameraMove() {
      window.earth.camera.flyTo({
        destination: {
          x: -2877159.4295731103,
          y: 4841534.134246617,
          z: 2994874.2246890087,
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
.geology-analyse {
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
