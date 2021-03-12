<template>
  <div class="ThreeDContainer civilization-center">
    <div class="bimanalayse tframe">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item class="elformbtns">
              <el-popover
                placement="top"
                title="楼层控制"
                width="300"
                trigger="click"
              >
                <div class="bim-analyse-tree" v-if="true">
                  <!--楼层控制树-->
                  <el-tree
                    :check-on-click-node="true"
                    :data="BimTreeData"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    @check-change="treeHandler"
                  />
                </div>
                <el-button slot="reference">楼层控制</el-button>
              </el-popover>
              <!-- <el-button v-show="false" class="elformbtn" @click="closeBimAnalyse"
                >关闭</el-button> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { CIVILIZATION_CENTER_URL } from "config/server/mapConfig";
import { mapActions } from "vuex";

const _UNDERGROUND_HASH_ = {
  RQLINE: "燃气管线",
  WSLINE: "污水管线",
  JSLINE: "给水管线",
  YSLINE: "雨水管线",
};
const _ABOVEGROUND1_HASH_ = {
  // B2机电: "燃气管线",
  // B1机电: "B1机电_table",
  B2土建: "给水管线",
  B1土建: "B1土建_table",
  Roof: "Roof_table",
  // Block: "citizens_table",
};
const _ABOVEGROUND2_HASH_ = {
  第1层: "AS_1F_1206",
  第2层: "AS_2F_1206",
  第3层: "AS_3F_1206",
  第4层: "AS_4F_1206",
  第5层: "AS_5F_1206",
  第6层: "AS_6F_1206",
  第7层: "AS_7F_1206",
  第8层: "AS_8F_1206",
  第9层: "AS_9F_1206",
  第10层: "AS_10F_1206",
  第11层: "AS_11F_1206",
  第12层: "AS_12F_1206",
  第13层: "AS_13F_1206",
  第14层: "AS_14F_1206",
  第15层: "AS_15F_1206",
  第16层: "AS_16F_1206",
  第17层: "AS_17F_1206",
  屋顶: "AS_WD_1206",
  
};
const _ABOVEGROUND3_HASH_ = {
  第1层: "AS_1F_1204",
  第2层: "AS_2F_1204",
  第3层: "AS_3F_1204",
  第4层: "AS_4F_1204",
  第5层: "AS_5F_1204",
  第6层: "AS_6F_1204",
  第7层: "AS_7F_1204",
  第8层: "AS_8F_1204",
  第9层: "AS_9F_1204",
  第10层: "AS_10F_1204",
  第11层: "AS_11F_1204",
  第12层: "AS_12F_1204",
  第13层: "AS_13F_1204",
  第14层: "AS_14F_1204",
  第15层: "AS_15F_1204",
  第16层: "AS_16F_1204",
  第17层: "AS_17F_1204",
  屋顶: "AS_WD_1204",
  墙:"AS_WALL_1204",
};
const _AS1206LAYERS_HASH_ = {
  第1层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_1F_1206/config",
  第2层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_2F_1206/config",
  第3层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_3F_1206/config",
  第4层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_4F_1206/config",
  第5层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_5F_1206/config",
  第6层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_6F_1206/config",
  第7层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_7F_1206/config",
  第8层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_8F_1206/config",
  第9层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_9F_1206/config",
  第10层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_10F_1206/config",
  第11层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_11F_1206/config",
  第12层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_12F_1206/config",
  第13层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_13F_1206/config",
  第14层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_14F_1206/config",
  第15层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_15F_1206/config",
  第16层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_16F_1206/config",
  第17层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_17F_1206/config",
  屋顶:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_WD_1206/config",
};
const _AS1204LAYERS_HASH_ = {
  第1层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_1F_1204/config",
  第2层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_2F_1204/config",
  第3层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_3F_1204/config",
  第4层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_4F_1204/config",
  第5层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_5F_1204/config",
  第6层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_6F_1204/config",
  第7层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_7F_1204/config",
  第8层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_8F_1204/config",
  第9层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_9F_1204/config",
  第10层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_10F_1204/config",
  第11层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_11F_1204/config",
  第12层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_12F_1204/config",
  第13层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_13F_1204/config",
  第14层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_14F_1204/config",
  第15层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_15F_1204/config",
  第16层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_16F_1204/config",
  第17层:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_17F_1204/config",
  屋顶:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_WD_1204/config",
  墙:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace/datas/AS_WALL_1204/config"
};

export default {
  name: "CivilizationCenter",
  data() {
    return {
      BimTreeData: [
        {
          id: "AS1206",
          label: "土建1206地块楼层控制",
          children: [],
        },
        {
          id: "AS1204",
          label: "土建1204地块楼层控制",
          children: [],
        },
      ],
    };
  },
  async mounted() {
    this.initScene();
    this.cameraMove();
  },
  beforeDestroy() {
    //  透明度
    // this.change_Alpha_Value(0);
    //  图层开关
    // this.doCivilizationCenterVisible(_UNDERGROUND_HASH_, false);
    // this.doCivilizationCenterVisible(_ABOVEGROUND1_HASH_, false);
    this.doCivilizationCenterVisible(_ABOVEGROUND2_HASH_, false);
    this.doCivilizationCenterVisible(_ABOVEGROUND3_HASH_, false);
    // 清空树
    this.closeTreeVisible();
  },
  methods: {
    ...mapActions("map", []),
    /**
     * 场景初始化
     */
    initScene() {
      if (window.extraHash.civilization) {
        // this.doCivilizationCenterVisible(_UNDERGROUND_HASH_, true);
        // this.doCivilizationCenterVisible(_ABOVEGROUND1_HASH_, true);
        this.doCivilizationCenterVisible(_ABOVEGROUND2_HASH_, true);
        this.doCivilizationCenterVisible(_ABOVEGROUND3_HASH_, true);
      } else {
        const {
          ABOVEGROUND1,
          ABOVEGROUND2,
          ABOVEGROUND3,
          UNDERGROUND,
          UNDERGROUND_DATA,
          ABOVEGROUND_DATA1,
          ABOVEGROUND_DATA2,
          ABOVEGROUND_DATA3,
        } = CIVILIZATION_CENTER_URL;
        // this.doGroundInit(_UNDERGROUND_HASH_, UNDERGROUND, UNDERGROUND_DATA);
        // this.doGroundInit(_ABOVEGROUND1_HASH_, ABOVEGROUND1, ABOVEGROUND_DATA1);
        this.doGroundInit(_ABOVEGROUND2_HASH_, ABOVEGROUND2, ABOVEGROUND_DATA2);
        this.doGroundInit(_ABOVEGROUND3_HASH_, ABOVEGROUND3, ABOVEGROUND_DATA3);
      }
      this.getTreeData();
    },
    /**
     * 图层控制
     * @param {object} _HASH_ hash
     * @param {object} _SCENE_URL_ 模型服务地址
     * @param {object} _DATA_ 数据服务地址
     */
    doGroundInit(_HASH_, _SCENE_URL_, _DATA_) {
      Object.keys(_HASH_).map((key) => {
        let _KEY_
        if (~_HASH_[key].indexOf("1206")) {
          _KEY_ = `civilization_center_AS1206${key}`;
        } else {
          _KEY_ = `civilization_center_AS1204${key}`;
        }
        const promise = window.earth.scene.addS3MTilesLayerByScp(
          `${_SCENE_URL_}/datas/${_HASH_[key]}/config`,
          { name: _KEY_ }
        );
        if (_DATA_) {
          Cesium.when(promise, async () => {
            const { url, dataSourceName } = _DATA_;
            const layer = window.earth.scene.layers.find(_KEY_);
            //layer.orderIndependentTranslucency=false,
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
        window.extraHash.civilization = true;
      });
    },
    /**
     * 显隐控制
     * @param {object} _HASH_ hash
     * @param {boolean} boolean 开关
     */
    doCivilizationCenterVisible(_HASH_, boolean) {
      Object.keys(_HASH_).map((key) => {
        let _KEY_
        if (~_HASH_[key].indexOf("1206")) {
          _KEY_ = `civilization_center_AS1206${key}`;
        } else {
          _KEY_ = `civilization_center_AS1204${key}`;
        }
        const layer = window.earth.scene.layers.find(_KEY_);
        layer.visible = boolean;
      });
    },
    // change_Height_Value(val) {},
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

    getTreeData() {
      let floorsA = [];
      let floorsB = [];
      Object.keys(_AS1206LAYERS_HASH_).map((key) => {
        floorsA.push({
          label: key,
          id: `AS1206_${key}`,
        })
      })
      Object.keys(_AS1204LAYERS_HASH_).map((key) => {
        floorsB.push({
          label: key,
          id: `AS1204_${key}`,
        })
      })
      this.BimTreeData[0].children = floorsA;
      this.BimTreeData[1].children = floorsB;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(['AS1206', 'AS1204']);
      })
    },

    treeHandler(node, checked) {
      console.log("node", node);
      console.log("checked", checked);
      let _KEY_;
      let layerUrl;
      if (!node.children) {
        if (~node.id.indexOf("AS1206_")) {
          _KEY_ = `civilization_center_AS1206${node.label}`;
          layerUrl = _AS1206LAYERS_HASH_[node.label];
        }
        if (~node.id.indexOf("AS1204_")) {
          _KEY_ = `civilization_center_AS1204${node.label}`;
          layerUrl = _AS1204LAYERS_HASH_[node.label];
        }
        const layer = window.earth.scene.layers.find(_KEY_);
        if (checked) {
          if (layer) {
            layer.visible = true;
          } else {
            window.earth.scene.addS3MTilesLayerByScp(layerUrl, { name: _KEY_ });
          }
        } else {
          layer && (layer.visible = false);
          return;
        }
      } else {

      }
    },

    closeTreeVisible() {
      Object.keys(_AS1206LAYERS_HASH_).map((key) => {
        const _KEY_ = `AS1206${key}`;
        const layer = window.earth.scene.layers.find(_KEY_);
        layer && (layer.visible = false);
      });
      Object.keys(_AS1204LAYERS_HASH_).map((key) => {
        const _KEY_ = `AS1204${key}`;
        const layer = window.earth.scene.layers.find(_KEY_);
        layer && (layer.visible = false);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.civilization-center {
  //padding: 10px;
  //background: rgba(11, 20, 35, 0.8);
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
  .tframe {
    position: fixed;
    top: 80px !important;
    bottom: unset !important;
    /* left: 0; */
    right: 25vw;
    width: 125px;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    background: rgba(11, 20, 35, 0.8);
    border: 1px solid rgba(81, 161, 201, 0.6);
  }
}
.ThreeDContainer .el-button {
  height: 24px;
  line-height: 22px;
  padding: 0 18px;
  background-color: #003354;
  border: 2px solid #00687d;
  border-radius: 4px;
  color: #2e7ecc;
}
.ThreeDContainer .el-form-item {
  margin-bottom: 0px;
  color: #00f2ff;
}
</style>
