<template>
  
</template>
<script>
import { mapActions } from "vuex";
import { CIVILIZATION_CENTER_URL } from "config/server/mapConfig";
const _ABOVEGROUND1_HASH_ = {
  B2土建: "给水管线",
  B1土建: "B1土建_table",
  Roof: "Roof_table",
};
export default {
  name: "Dxkj",
  data() {
    return {
      //  透明度
      aMin: 0,
      aMax: 100,
      aValue: 75,
    };
  },
  async mounted() {
    //this.$parent.$refs.roadline.doPolylineTrailVisible(false)
    this.initScene();
    this.cameraMove();
    this.change_Alpha_Value(75);
  },
  beforeDestroy() {
    //this.$parent.$refs.roadline.doPolylineTrailVisible(true)
    this.change_Alpha_Value(0);
    this.doCivilizationCenterVisible(_ABOVEGROUND1_HASH_, false);
  },
  methods: {
    ...mapActions("map", []),
    //  场景初始化
    initScene() {
      if (window.extraHash.dxkj) {
        this.doCivilizationCenterVisible(_ABOVEGROUND1_HASH_, true);
      } else {
        const {
          ABOVEGROUND1,
          ABOVEGROUND_DATA1
        } = CIVILIZATION_CENTER_URL;
        this.doGroundInit(_ABOVEGROUND1_HASH_, ABOVEGROUND1, ABOVEGROUND_DATA1);
        window.earth.scene.screenSpaceCameraController.minimumZoomDistance = -100;   //使镜头可进入地下
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
            layer.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame; //线框加填充
            layer.wireFrameMode = Cesium.WireFrameType.EffectOutline;  
            layer.style3D.lineColor = Cesium.Color.fromCssColorString("rgb(204,204,204)");  //线框颜色
            layer.style3D.lineWidth = 1;  //线框粗细
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
            layer.datasetInfo().then((result) => {
              // console.log('result', result)
            })
          });
        }
        //  做全局标识，不保存图层指针了
        window.extraHash.dxkj = true;
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
  },
};
</script>

<style lang="less" scoped>
.dxkj-analyse {
  z-index: 7;
  position: absolute;
  // left: 26vw;
  left: 52vh;
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
</style>
