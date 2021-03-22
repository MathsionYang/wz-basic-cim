<template>
</template>

<script>
const _UNDERGROUND_HASH_ = {
  PLAN_WSLINE:"CIM规划管线",
  PLAN_WSWELL:"",
};
let handlerPolygon = undefined;
import { CIVILIZATION_CENTER_URL } from "config/server/mapConfig";
import { mapActions } from "vuex";
export default {
  name: "Gxgl",
  data() {
    return {
      //  透明度
      aMin: 0,
      aMax: 100,
      aValue: 80,
    };
  },
  async mounted() {
    this.initScene();
    this.cameraMove();
    //this.change_Alpha_Value(this.aValue);
  },
  beforeDestroy() {
    console.log("aa");
    //  图层开关
    this.doCivilizationCenterVisible(_UNDERGROUND_HASH_, false);
  },
  methods: {
    ...mapActions("map", []),
    /**
     * 场景初始化
     */
    initScene() {
      if (window.extraHash.Kggx) {
        this.doCivilizationCenterVisible(_UNDERGROUND_HASH_, true);
      } else {
        console.log("开关柜");
        const { Pipeline, Pipeline_DATA1 } = CIVILIZATION_CENTER_URL;
        this.doGroundInit(_UNDERGROUND_HASH_, Pipeline, Pipeline_DATA1);
      }
    },
    /**
     * 图层控制
     * @param {object} _HASH_ hash
     * @param {object} _SCENE_URL_ 模型服务地址
     * @param {object} _DATA_ 数据服务地址
     */
    doGroundInit(_HASH_, _SCENE_URL_, _DATA_) {
      console.log("数据服务",_DATA_)
      Object.keys(_HASH_).map((key) => {
        const _KEY_ = `Kggx_${key}`;
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
        window.extraHash.Kggx = true;
      });
    },
    /**
     * 显隐控制
     * @param {object} _HASH_ hash
     * @param {boolean} boolean 开关
     */
    doCivilizationCenterVisible(_HASH_, boolean) {
      Object.keys(_HASH_).map((key) => {
        const _KEY_ = `Kggx_${key}`;
        const layer = window.earth.scene.layers.find(_KEY_);
        layer.visible = boolean;
        layer.lodRangeScale = 100;
      });
    },
    cameraMove() {
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
       // maximumHeight: 450,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.civilization-center {
  z-index: 7;
  position: absolute;
  // left: 26vw;
  left: 52vh;
  -webkit-transform: translateX(-50%);
  top: 10vh;
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
