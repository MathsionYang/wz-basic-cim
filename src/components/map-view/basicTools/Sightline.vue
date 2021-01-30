<template>
  <div class="ThreeDContainer" :style="{width:'400px'}">
    <div class="sightline tframe">
      <el-form label-width="110px">
        <el-form-item label="通视分析" :style="'margin-left:111px'"></el-form-item>
        <el-form-item label="可见区域颜色">
          <el-tag type="success" color="green"></el-tag>
        </el-form-item>
        <el-form-item label="不可见区域颜色">
          <el-tag type="success" color="red"></el-tag>
        </el-form-item>
        <el-form-item>
          <el-button class="elformbtn" type="button" @click="eventRegsiter">分析</el-button>
          <el-button class="elformbtn" type="button" @click="sightlineClear">清除</el-button>
          <el-button class="elformbtn" type="button" @click="sightlineClose">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
    <canvas
      style="position : fixed;z-index: 10, right : 2%; bottom : 2%;background-color:rgba(65, 65, 65, 0.5)"
      id="pro"
      height="0"
      width="0"
    ></canvas>
  </div>
</template>
<script>
// let sightline;
const Cesium = window.Cesium;
export default {
  name: "Sightline",
  data: function () {
    return {
      sightline: undefined,
      visibleColor: "rbg(0,200,0)", // 可见区域显示的颜色
      hiddenColor: "rbg(255,0,0)", // 不可见区域显示的颜色
      viewPosition: {}, //获取或设置观察者的位置，位置由经度、纬度和高程组成的数组表示
       //
      HandlerFlag: true,
      sightLineHandler: undefined, //通视分析
      pointHandler: undefined,
      screenSpaceEventHandler: undefined,
      tooltip: null,
      handlerPolygon: undefined,
    };
  },
  created() {
    //let that =this;
    this.sightLineHandler = new Cesium.DrawHandler(
      window.earth,
      Cesium.DrawMode.Line
    );
    this.screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
      window.earth.scene.canvas
    );
    this.sightline = new Cesium.Sightline(window.earth.scene);
    this.pointHandler = new Cesium.PointHandler(window.earth);
  },
  mounted() {
    this.eventRegsiter(); //监听eventDraw方法
  },
  beforeDestroy() {
    this.sightline = undefined;
    this.viewPosition = [];
    this.HandlerFlag = undefined;
    this.sightLineHandler = undefined;
    this.pointHandler = undefined;
    this.screenSpaceEventHandler = undefined;
    this.handlerPolygon = undefined;
    this.sightlineClear();
  },
  methods: {
    //事件绑定
    eventRegsiter() {
      const that = this;
      //that.tooltip = createTooltip(document.body);
      that.sightLineHandler.activeEvt.addEventListener((isActive) => {
        if (isActive == true) {
          window.earth.enableCursorStyle = false;
          window.earth._element.style.cursor = "";
          document.body.classList.add("drawCur");
        } else {
          window.earth.enableCursorStyle = true;
          document.body.classList.remove("drawCur");
        }
      });
      // that.sightLineHandler.movingEvt.addEventListener((windowPosition) => {
      //   that.sightLineHandler.polyline &&
      //     (that.sightLineHandler.polyline.show = false);
      //   // that.tooltip.showAt(windowPosition, "<p>点击鼠标左键添加观察点</p>");
      //   // if (sightLineHandler.isDrawing) {
      //   //   that.tooltip.showAt(
      //   //     windowPosition,
      //   //     "<p>点击鼠标左键可添加多个目标点</p><p>点击鼠标右键结束</p>"
      //   //   );
      //   // }
      // });
      that.sightLineHandler.drawEvt.addEventListener(function (result) {
        that.HandlerFlag = false; //移除监听
        that.sightLineHandler.polyline.show = false;
        that.tooltip.setVisible(false);
      });
      that.sightline.build();
      //鼠标点击第一下，调用drawEvt；再点击，调用screenSpaceEventHandler.setInputAction
      that.pointHandler.drawEvt.addEventListener(function (result) {
        const point = result.object;
        point.show = true;
        that.viewPosition = point;
        const position = point.position;
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        const height = cartographic.height;
        that.viewlongitude = longitude.toFixed(6);
        that.viewlatitude = latitude.toFixed(6);
        that.viewheight = height.toFixed(6);
        that.sightline.viewPosition = [longitude, latitude, height];

        //可以添加多个目标点
        that.screenSpaceEventHandler.setInputAction(function (evt) {
          if (that.HandlerFlag) {
            that.sightLineHandler.polyline &&
              (that.sightLineHandler.polyline.show = false);
            const pick = window.earth.scene.pickPosition(evt.position);
            const ecartographic = Cesium.Cartographic.fromCartesian(pick);
            const elongitude = Cesium.Math.toDegrees(ecartographic.longitude);
            const elatitude = Cesium.Math.toDegrees(ecartographic.latitude);
            const eheight = ecartographic.height;
            that.sightline.addTargetPoint({
              position: [elongitude, elatitude, eheight],
              name: "point" + new Date(),
            });
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      });

      that.pointHandler.activate();
      that.sightLineHandler.activate();
      that.flag = true;
    },
    sightlineClear() {
      const that = this;
      that.viewlongitude = 0;
      that.viewlatitude = 0;
      that.viewheight = 0;
      that.visibleColor = "rgb(0, 200, 0)";
      that.hiddenColor = "rgb(200, 0, 0)";
      that.highlightBarrierColor = "rgba(255, 186, 1, 1)";
      that.highlightBarrier = false;
      that.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      );
      that.HandlerFlag = true;
      if (that.sightLineHandler) {
        this.sightLineHandler.deactivate();
      }
      if (that.pointHandler) {
        this.pointHandler.deactivate();
      }
      window.earth.entities.removeAll();
      that.sightline && this.sightline.removeAllTargetPoint();
    },
    sightlineClose() {
      this.sightlineClear();
      this.$bus.$emit("cesium-3d-maptool", { value: null });
    },
  },
};
</script>
<style>
.el-form:nth-child(1) {
  padding: 0px 0px 0px 0px !important;
}
.el-tag.el-tag--success {
  width: 160px;
  margin-top: 5px;
}
</style>
