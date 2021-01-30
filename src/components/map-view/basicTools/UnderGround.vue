<!--
 * @Author: eds
 * @Date: 2020-07-28 15:58:33
 * @LastEditTime: 2020-09-03 15:35:00
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\UnderGround.vue
-->
<template>
  <div class="ThreeDContainer ThreeToTop" :style="{ width: '290px' }">
    <div class="underground tframe" id="toolbar">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item class="elformbtns">
              <el-button class="elformbtn" id="eventRegsiter"
                >倾斜开挖</el-button
              >
              <el-button class="elformbtn" @click="clearUnderGround"
                >清除</el-button
              >
              <el-button class="elformbtn" @click="closeUnderGround"
                >关闭</el-button
              >
              <br />
              <label class="UnderGroundTitle">图层透明:</label>
              <input
                type="range"
                style="width: 70%; margin-top: 13px"
                value="0"
                min="0"
                max="1"
                step="0.02"
                title="调整地上图层透明度"
                data-bind="value: overGroundAlpha, valueUpdate: 'input'"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { BimSourceURL } from "config/server/mapConfig";
import { ServiceUrl } from "config/server/mapConfig";
const Cesium = window.Cesium;
const LAYER_NAME = [
  "DongFangGuanXian_translate",
  // "GSFuShuSheShi",
  // "GSLineNode",
  // "GSLine"
];
export default {
  name: "UnderGround",
  data() {
    return {
      // cesium Object
      
      handlerPolygon: undefined,
      overGroundLayer: undefined,
      globe: undefined,
      scene: undefined,
      tooltip: undefined,
      promise: undefined,
      notclick: "1",
    };
  },
  created() {
    this.scene = window.earth.scene;
    this.scene = window.earth.globe;
    this.handlerPolygon = new Cesium.DrawHandler(
      window.earth,
      Cesium.DrawMode.Polygon
    );
    //this.tooltip = this.createTooltip(viewer._element)
  },
  async mounted() {
    this.initBimScene();
    //this.eventtouming();
    this.eventRegsiter();
  },
  beforeDestroy() {
    //this.clearUnderGround();
    this.handlerPolygon.destroy;
    this.overGroundLayer = undefined;
    this.scene = undefined;
    this.promise = undefined;
  },
  methods: {
    //  事件绑定
    eventRegsiter() {
      const that = this;
      //监听滑动条变化，改变alpha的值，设置地表透明度
      var viewModel = {
        color: "#ffffff",
        overGroundAlpha: 0,
      };
      Cesium.when(this.promise, function (layers) {
        //这里要跟图层一起加载，不能放到场景初始化的时候，否则会找不到这个图层导致没有效果进行
        //window.earth.scene.globe.globeAlpha = 0;
        //获取地球表面的透明度 默认为1 1为不透明 0为完全透明
        //const abc = window.earth.scene.globe.globeAlpha;
        //这里是用来找到这个场景里的所有图层
        const imageryLayers = window.earth.scene.imageryLayers;
        //console.log("images", imageryLayers);
        //找到 YX_2019_SW 图层 这个方法等同于scene.find
        that.overGroundLayer = imageryLayers.get(1);
        //进行图层的透明控制
        Cesium.knockout.track(viewModel);
        var tlbar = document.getElementById("toolbar");
        Cesium.knockout.applyBindings(viewModel, tlbar);
        Cesium.knockout.getObservable(viewModel, "overGroundAlpha").subscribe(
          // 设置地表图层透明度 1为不透明 0为透明
          function (newValue) {
            that.overGroundLayer.transparentBackColorTolerance = newValue;
            if (newValue == 1) {
              window.earth.scene.globe.globeAlpha = 0;
            } else if (newValue != 1) {
              window.earth.scene.globe.globeAlpha = 1;
            }
          }
        );
        $("#eventRegsiter").on("click", function () {
          that.handlerPolygon.activeEvt.addEventListener(function (isActive) {
            if (isActive == true) {
              window.earth.enableCursorStyle = false;
              window.earth._element.style.cursor = "";
              $("body").removeClass("drawCur").addClass("drawCur");
            } else {
              window.earth.enableCursorStyle = true;
              $("body").removeClass("drawCur");
            }
          });
          that.handlerPolygon.movingEvt.addEventListener(function (
            windowPosition
          ) {
            if (windowPosition.x < 2000 && windowPosition.y < 2000) {
              //this.tooltip.setVisible(false);
              return;
            }
          });
          that.handlerPolygon.drawEvt.addEventListener(function (result) {
            if (!result.object.positions) {
              // this.tooltip.showAt(result, "<p>请绘制正确的多边形</p>");
              that.handlerPolygon.polygon.show = false;
              that.handlerPolygon.polyline.show = false;
              that.handlerPolygon.deactivate();
              that.handlerPolygon.activate();
              return;
            }
            var array = [].concat(result.object.positions);
            //this.tooltip.setVisible(false);
            var positions = [];
            for (var i = 0, len = array.length; i < len; i++) {
              //获取经纬度和高度
              var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
              var longitude = Cesium.Math.toDegrees(cartographic.longitude);
              var latitude = Cesium.Math.toDegrees(cartographic.latitude);
              var height = cartographic.height;
              if (
                positions.indexOf(longitude) == -1 &&
                positions.indexOf(latitude) == -1
              ) {
                positions.push(longitude);
                positions.push(latitude);
                positions.push(height);
              }
            }
            window.earth.scene.globe.removeAllExcavationRegion();
            //开挖深度
            window.earth.scene.globe.addExcavationRegion({
              name: "ggg",
              position: positions,
              height: 50,
              transparent: false,
            });
            that.handlerPolygon.polygon.show = false;
            that.handlerPolygon.polyline.show = false;
            that.handlerPolygon.deactivate();
            that.handlerPolygon.activate();
          });
          that.handlerPolygon.activate();
        });
      });
    },
    //  初始化BIM场景
    initBimScene() {
      const that = this;
      // const azf = window.earth.scene.layers.find("Block1");
      // if (azf) {
      //   window.earth.scene.layers.find("Block1").visible = true;
      //   window.earth.scene.layers.find("Block2").visible = true;
      //   window.earth.scene.layers.find("Block3").visible = true;
      //   window.earth.scene.layers.find("Block4").visible = true;
      // }
      const _LAYER_ = window.earth.scene.layers.find(LAYER_NAME[0]);
      if (_LAYER_) {
        LAYER_NAME.map(
          (d) => (window.earth.scene.layers.find(d).visible = true)
        );
        that.globe = window.earth.scene.globe;
        //设置相机最小缩放距离,距离地表-1000米
        window.earth.scene.screenSpaceCameraController.minimumZoomDistance = -1000;
        // 关闭裙边
        window.earth.scene.terrainProvider.isCreateSkirt = false;
        window.earth.scene.camera.setView({
          destination: {
            x: -2875539.090787695,
            y: 4842735.556374235,
            z: 2993566.8100139066,
          },
          orientation: {
            heading: 0.00000410168472608774,
            pitch: -0.5655332606839059,
            roll: 0,
          },
        });
      } else {
        const { UNDERGROUND_SCENE_URL } = BimSourceURL;
        //that.promise = window.earth.scene.open(UNDERGROUND_SCENE_URL);
        that.promise = window.earth.scene.addS3MTilesLayerByScp(
          "http://172.20.83.223:8098/iserver/services/3D-DongFangGuanXian_translate/rest/realspace/datas/DongFangGuanXian_translate/config",
          {
            name: "DongFangGuanXian_translate",
          }
        );
        Cesium.when(that.promise, async (layers) => {
          const _LAYERJM_ = window.earth.scene.layers.find(
            "DongFangGuanXian_translate"
          );
          _LAYERJM_.setQueryParameter({
            url:
              "http://172.20.83.223:8098/iserver/services/data-DongFangGuanXian_translate/rest/data",
            dataSourceName: "东方管线_平移_table",
            isMerge: true,
          });
        });
        that.globe = window.earth.scene.globe;
        //设置相机最小缩放距离,距离地表-1000米
        window.earth.scene.screenSpaceCameraController.minimumZoomDistance = -1000;
        // 关闭裙边
        window.earth.scene.terrainProvider.isCreateSkirt = false;
        window.earth.scene.camera.setView({
          destination: {
            x: -2875539.090787695,
            y: 4842735.556374235,
            z: 2993566.8100139066,
          },
          orientation: {
            heading: 0.00000410168472608774,
            pitch: -0.5655332606839059,
            roll: 0,
          },
        });
      }

      //打开地下管线
      //that.promise = window.earth.scene.open(UNDERGROUND_SCENE_URL);
      //console.log("管线",that.promise);
    },
    //  倾斜开挖
    digUnderGround() {
      this.notclick = "2";
      this.eventRegsiter();
    },
    //  关闭地下管线分析模块
    closeUnderGround() {
      console.log("相机参数1", window.earth.scene.camera.position);
      console.log("相机参数2", window.earth.scene.camera.heading);
      console.log("相机参数3", window.earth.scene.camera.pitch);
      console.log("相机参数4", window.earth.scene.camera.roll);
      this.clearUnderGround();
      // 设置地表图层透明度
      window.earth.scene.globe.globeAlpha = 1;
      LAYER_NAME.map((d) => (window.earth.scene.layers.find(d).visible = false));
      const imageryLayers = window.earth.scene.imageryLayers;
      this.overGroundLayer = imageryLayers.get(1);
      this.overGroundLayer.transparentBackColorTolerance = 0;
      this.$bus.$emit("cesium-3d-event", { value: null });
      window.earth.scene.camera.setView({
        destination: {
          //方位(direction)
          x: -2885689.43805791,
          y: 4865993.322893596,
          z: 2977614.8110983055,
        },
        orientation: {
          heading: 0.003115109744838307, //方位角(heading)
          pitch: -0.5846590801356228, //俯仰角(pitch)
          roll: 0, //滚动角(roll)
        },
      });
    },
    //  清除选中内容
    clearUnderGround() {
      const that = this;
      window.earth.scene.globe.removeAllExcavationRegion();

      //that.handlerPolygon.polygon.show = false;
      //that.handlerPolygon.polyline.show = false;
    },
  },
};
</script>
<style>
.UnderGroundTitle {
  margin-left: 2px;
  float: left;
}
</style>


