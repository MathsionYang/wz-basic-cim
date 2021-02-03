<template>
  <div class="ThreeDContainer civilization-center" :style="{ width: '400px' }">
    <!-- <el-divider content-position="left">范围裁剪</el-divider>
    <div class="civilization-frame">
      <el-button class="elformbtn" @click="doTailor">开始裁剪</el-button>
      <el-button class="elformbtn" @click="clearTailor">清除</el-button>
    </div>
    <el-divider content-position="left">地表透明度</el-divider>
    <div class="civilization-frame">
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
    <el-divider content-position="left">倾斜开挖</el-divider>
    <div class="civilization-frame">
      <el-button class="elformbtn" @click="doExcavate">倾斜开挖</el-button>
      <el-button class="elformbtn" @click="clearExcavate">清除</el-button>
    </div>
    <el-divider content-position="left">停车场</el-divider>
    <div class="civilization-frame">
      <el-button class="elformbtn" @click="doFpf">智慧停车系统</el-button>
    </div> -->
    <div class="bimanalayse tframe">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item class="elformbtns">
              <el-popover placement="top" title="楼层控制" width="300" trigger="click">
                <div class="bim-analyse-tree" v-if="true">
                  <!--楼层控制树-->
                  <el-tree
                    :check-on-click-node="true"
                    :data="BimTreeData"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    :default-expanded-keys="['all']"
                    :default-checked-keys="['all']"
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
const _UNDERGROUND_HASH_ = {
  RQLINE: "燃气管线",
  WSLINE: "污水管线",
  JSLINE: "给水管线",
  YSLINE: "雨水管线",
};
const _ABOVEGROUND_HASH_ = {
  // B2机电: "燃气管线",
  // B1机电: "B1机电_table",
  B2土建: "给水管线",
  B1土建: "B1土建_table",
  Roof: "Roof_table",
  Block: "citizens_table",
};
const _LAYERS_HASH_ = {
  第1层: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_1F_1206/config',
  第2层: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_2F_1206/config',
  第3层: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_3F_1206/config',
  第4层: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_4F_1206/config',
  第5层: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_5F_1206/config',
  第6层: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_6F_1206/config',
  第7层: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_7F_1206/config',
  第8层: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_8F_1206/config',
  第9层: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_9F_1206/config',
  第10层: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_10F_1206/config',
  第11层: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_11F_1206/config',
  第12层: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_12F_1206/config',
  第13层: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_13F_1206/config',
  第14层: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_14F_1206/config',
  第15层: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_15F_1206/config',
  第16层: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_16F_1206/config',
  第17层: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_17F_1206/config',
  屋顶: 'http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace/datas/AS_WD_1206/config',
};
let handlerPolygon = undefined;
let handlerBox = undefined;
let editorBox = undefined;
let boxEntity = undefined;
import { CIVILIZATION_CENTER_URL } from "config/server/mapConfig";
import { mapActions } from "vuex";
export default {
  name: "CivilizationCenter",
  data() {
    return {
      //  透明度
      // aMin: 0,
      // aMax: 100,
      // aValue: 0,

      BimTreeData: [
        {
          label: "楼层控制",
          id: 1,
          children: [],
        },
      ],
    };
  },
  async mounted() {
    this.initScene();
    // this.initExcavate();
    // this.initTailor();
    this.cameraMove();
  },
  beforeDestroy() {
    //  透明度
    this.change_Alpha_Value(0);
    //  句柄销毁
    // handlerPolygon.clear();
    // handlerPolygon = undefined;
    //  图层开关
    this.doCivilizationCenterVisible(_UNDERGROUND_HASH_, false);
    this.doCivilizationCenterVisible(_ABOVEGROUND_HASH_, false);
  },
  methods: {
    ...mapActions("map", []),
    /**
     * 场景初始化
     */
    initScene() {
      if (window.extraHash.civilization) {
        this.doCivilizationCenterVisible(_UNDERGROUND_HASH_, true);
        this.doCivilizationCenterVisible(_ABOVEGROUND_HASH_, true);
      } else {
        const {
          ABOVEGROUND,
          UNDERGROUND,
          UNDERGROUND_DATA,
          ABOVEGROUND_DATA,
        } = CIVILIZATION_CENTER_URL;
        this.doGroundInit(_UNDERGROUND_HASH_, UNDERGROUND, UNDERGROUND_DATA);
        this.doGroundInit(_ABOVEGROUND_HASH_, ABOVEGROUND, ABOVEGROUND_DATA);
      }
      this.getTreeData()
    },
    // /**
    //  * 开挖初始化
    //  */
    // initExcavate() {
    //   handlerPolygon = new Cesium.DrawHandler(window.earth, Cesium.DrawMode.Polygon);
    //   handlerPolygon.activeEvt.addEventListener((isActive) => {
    //     if (isActive) {
    //       window.earth.enableCursorStyle = false;
    //       window.earth._element.style.cursor = "";
    //       $("body").removeClass("drawCur").addClass("drawCur");
    //     } else {
    //       window.earth.enableCursorStyle = true;
    //       $("body").removeClass("drawCur");
    //     }
    //   });
    //   handlerPolygon.movingEvt.addEventListener((windowPosition) => {
    //     if (windowPosition.x < 2000 && windowPosition.y < 2000) {
    //       return;
    //     }
    //   });
    //   handlerPolygon.drawEvt.addEventListener((result) => {
    //     if (!result.object.positions) {
    //       handlerPolygon.polygon.show = false;
    //       handlerPolygon.polyline.show = false;
    //       handlerPolygon.deactivate();
    //       handlerPolygon.activate();
    //       return;
    //     }
    //     let array = [].concat(result.object.positions);
    //     let positions = [];
    //     for (let i = 0, len = array.length; i < len; i++) {
    //       let cartographic = Cesium.Cartographic.fromCartesian(array[i]);
    //       let longitude = Cesium.Math.toDegrees(cartographic.longitude);
    //       let latitude = Cesium.Math.toDegrees(cartographic.latitude);
    //       if (positions.indexOf(longitude) == -1 && positions.indexOf(latitude) == -1) {
    //         positions.push(longitude, latitude, cartographic.height);
    //       }
    //     }
    //     window.earth.scene.globe.removeAllExcavationRegion();
    //     window.earth.scene.globe.addExcavationRegion({
    //       name: "excavate",
    //       position: positions,
    //       height: 100,
    //       transparent: false,
    //     });
    //     handlerPolygon.polygon.show = false;
    //     handlerPolygon.polyline.show = false;
    //     handlerPolygon.deactivate();
    //     handlerPolygon.activate();
    //   });
    // },
    // initTailor() {
    //   handlerBox = new Cesium.DrawHandler(window.earth, Cesium.DrawMode.Box);
    //   handlerBox.drawEvt.addEventListener((e) => {
    //     boxEntity = e.object;
    //     var newDim = boxEntity.box.dimensions.getValue();
    //     var position = boxEntity.position.getValue(0);
    //     var boxOption = {
    //       dimensions: newDim,
    //       position,
    //       clipMode: "clip_behind_all_plane",
    //       heading: 0,
    //     };

    //     //box编辑
    //     editorBox = new Cesium.BoxEditor(window.earth, boxEntity);
    //     editorBox.editEvt.addEventListener((e) => {
    //       boxEntity.box.dimensions = e.dimensions;
    //       boxEntity.position = e.position;
    //       boxEntity.orientation = e.orientation;
    //       this.setClipBox();
    //     });
    //     editorBox.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(0, 950);
    //     editorBox.activate();
    //     this.setAllLayersClipOptions(boxOption);
    //     handlerBox.clear();
    //     handlerBox.deactivate();
    //   });
    // },
    // setClipBox() {
    //   var newDim = boxEntity.box.dimensions.getValue();
    //   var position = boxEntity.position.getValue(0);
    //   var heading = 0;
    //   if (typeof boxEntity.orientation != "undefined") {
    //     let rotationM3 = Cesium.Matrix3.fromQuaternion(
    //       boxEntity.orientation._value,
    //       new Cesium.Matrix3()
    //     );
    //     let localFrame = Cesium.Matrix4.fromRotationTranslation(
    //       rotationM3,
    //       Cesium.Cartesian3.ZERO,
    //       new Cesium.Matrix4()
    //     );
    //     let inverse = Cesium.Matrix4.inverse(
    //       Cesium.Transforms.eastNorthUpToFixedFrame(position),
    //       new Cesium.Matrix4()
    //     );
    //     let hprm = Cesium.Matrix4.multiply(inverse, localFrame, new Cesium.Matrix4());
    //     var rotation = Cesium.Matrix4.getMatrix3(hprm, new Cesium.Matrix3());
    //     let hpr = Cesium.HeadingPitchRoll.fromQuaternion(
    //       Cesium.Quaternion.fromRotationMatrix(rotation)
    //     );
    //     heading = hpr.heading;
    //   }
    //   var boxOptions = {
    //     dimensions: newDim,
    //     position,
    //     clipMode: "clip_behind_all_plane",
    //     heading,
    //   };
    //   this.setAllLayersClipOptions(boxOptions);
    // },
    // setAllLayersClipOptions(boxOptions) {
    //   Object.keys({ ..._UNDERGROUND_HASH_, ..._ABOVEGROUND_HASH_ }).map((key) => {
    //     const _KEY_ = `civilization_center_${key}`;
    //     const layer = window.earth.scene.layers.find(_KEY_);
    //     layer.setCustomClipBox(boxOptions);
    //   });
    // },
    // doTailor() {
    //   handlerBox.activate();
    // },
    // clearTailor() {
    //   Object.keys({ ..._UNDERGROUND_HASH_, ..._ABOVEGROUND_HASH_ }).map((key) => {
    //     const _KEY_ = `civilization_center_${key}`;
    //     const layer = window.earth.scene.layers.find(_KEY_);
    //     layer.clearCustomClipBox();
    //   });
    //   editorBox.deactivate();
    //   handlerBox.clear();
    //   handlerBox.deactivate();
    //   window.earth.entities.removeAll();
    // },
    /**
     * 图层控制
     * @param {object} _HASH_ hash
     * @param {object} _SCENE_URL_ 模型服务地址
     * @param {object} _DATA_ 数据服务地址
     */
    doGroundInit(_HASH_, _SCENE_URL_, _DATA_) {
      Object.keys(_HASH_).map((key) => {
        const _KEY_ = `civilization_center_${key}`;
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
        const _KEY_ = `civilization_center_${key}`;
        const layer = window.earth.scene.layers.find(_KEY_);
        layer.visible = boolean;
      });
    },
    // change_Height_Value(val) {},
    change_Alpha_Value(val) {
      window.earth.scene.globe.globeAlpha = (100 - val) / 100;
    },
    // doExcavate() {
    //   handlerPolygon.activate();
    // },
    // clearExcavate() {
    //   handlerPolygon.deactivate();
    //   window.earth.scene.globe.removeAllExcavationRegion();
    //   handlerPolygon.polygon.show = false;
    //   handlerPolygon.polyline.show = false;
    // },
    // /**
    //  * 漫游
    //  * @param {number} val 地下室B_
    //  */
    // doFpf() {
    //   window.open("http://125.124.19.162:8888");
    // },
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
      let floors = [];
      for (let i = 1; i < 18; i++) {
        floors.push({
          label: `第${i}层`,
          id: i,
        });
      }
      floors.push({
        label: '屋顶',
        id: 'WD',
      })
      this.BimTreeData[0].children = floors;
    },

    treeHandler(node, checked) {
      console.log('node', node)
      console.log('checked', checked)
      const _KEY_ = `single_${node.label}`;
      const layer = window.earth.scene.layers.find(_KEY_);
      if (checked) {
        // let ids = this.$refs.tree.getCheckedKeys();
        console.log(node.label)
        this.doCivilizationCenterVisible(_ABOVEGROUND_HASH_, false);
        if (layer) {
          layer.visible = true;
        } else {
          let layerUrl = _LAYERS_HASH_[node.label]
          window.earth.scene.addS3MTilesLayerByScp(
            layerUrl,
            { name: _KEY_ }
          );
        }
      } else {
        layer && (layer.visible = false);
      }
    }
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
  .tframe {
    position: fixed;
    top: 80px !important;
    bottom: unset!important;
    left: 0;
    right: 40% !important;
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
