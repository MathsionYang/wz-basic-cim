<!--
 * @Author: eds
 * @Date: 2020-07-21 14:49:26
 * @LastEditTime: 2020-07-28 10:59:15
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\VisualizationAnalyse.vue
-->
<template>
  <div class="ThreeDContainerts" v-drag>
    <div
      class="visualizationanalyse tframe"
      style="background-color: rgba(5, 41, 110, 0.78)"
    >
      <div>
        <div class="gjllabel">视野分析</div>
        <div class="gjllabels">可见区域颜色</div>
        <div class="divcolor"></div>
        <div class="gjllabels">不可见区域颜色</div>
        <div class="divcolors"></div>
        <br />
        <div class="buttons" @click="startVisualize">
          <span class="bt">开始</span>
        </div>
        <div class="buttons" @click="clearVisualize">
          <span class="bt">清除</span>
        </div>
        <div class="buttons" @click="closeVisualize">
          <span class="bt">关闭</span>
        </div>
      </div>
     
    </div>
  </div>
</template>
<script>
const Cesium = window.Cesium;
const viewModel = {
  direction: 1.0,
  pitch: 1.0,
  distance: 1.0,
  verticalFov: 1.0,
  horizontalFov: 1.0,
  visibleAreaColor: "#ffffffff",
  invisibleAreaColor: "#ffffffff",
};
export default {
  name: "VisualizationAnalyse",
  data: {
    pointHandler: undefined,
    handler: undefined,
    viewshed3D: undefined,
    viewPosition: undefined,
    viewer: undefined,
  },
  created() {
    this.viewer = window.earth;
    this.pointHandler = new Cesium.DrawHandler(
      this.viewer,
      Cesium.DrawMode.Point
    );
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.viewshed3D = new Cesium.ViewShed3D(this.viewer.scene);
  },
  mounted() {
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.pointHandler = undefined;
    this.handler.destroy();
    this.viewshed3D && this.viewshed3D.destroy();
    this.viewPosition = undefined;
    this.viewer = undefined;
    this.clearVisualize();
    1;
  },
  methods: {
    //  事件绑定
    eventRegsiter() {
      const that = this;
      that.handler.setInputAction(function (e) {
        if (!that.viewPosition) return;
        // 若此标记为false，则激活对可视域分析对象的操作
        if (!that.viewer.scene.viewFlag) {
          //获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
          const position = e.endPosition;
          const last = that.viewer.scene.pickPosition(position);
          //计算该点与视口位置点坐标的距离
          const distance = Cesium.Cartesian3.distance(that.viewPosition, last);
          if (distance > 0) {
            // 将鼠标当前点坐标转化成经纬度
            const cartographic = Cesium.Cartographic.fromCartesian(last);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            const height = cartographic.height;
            // 通过该点设置可视域分析对象的距离及方向
            that.viewshed3D.setDistDirByPoint([longitude, latitude, height]);
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      that.handler.setInputAction(function (e) {
        //鼠标右键事件回调，不再执行鼠标移动事件中对可视域的操作
        that.viewer.scene.viewFlag = true;
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      that.pointHandler.drawEvt.addEventListener(function (result) {
        const point = result.object;
        const position = point.position;
        that.viewPosition = position;

        // 将获取的点的位置转化成经纬度
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        const height = cartographic.height + 1.8;
        point.position = Cesium.Cartesian3.fromDegrees(
          longitude,
          latitude,
          height
        );
        if (that.viewer.scene.viewFlag) {
          // 设置视口位置
          that.viewshed3D.viewPosition = [longitude, latitude, height];
          that.viewshed3D.build();
          // 将标记置为false以激活鼠标移动回调里面的设置可视域操作
          that.viewer.scene.viewFlag = false;
        }
      });
    },
    //  可视域分析
    startVisualize() {
      if (this.pointHandler.active) return;
      //先清除之前的可视域分析
      this.viewer.entities.removeAll();
      this.viewshed3D.distance = 0.1;
      this.viewer.scene.viewFlag = true;
      //激活绘制点类
      this.pointHandler.activate();
    },
    //  关闭可视域分析
    closeVisualize() {
      this.clearVisualize();
      this.viewshed3D && this.viewshed3D.destroy();
      this.$bus.$emit("cesium-3d-maptool", { value: null });
        this.$bus.$emit("cesium-3d-imgs", { value: "清除" });
    },
    //  清除分析结果
    clearVisualize() {
      this.viewer && this.viewer.entities.removeAll();
      this.viewshed3D && (this.viewshed3D.distance = 0.1);
      this.viewer && (this.viewer.scene.viewFlag = true);
    },
  },
    directives: {
    drag: {
      // 指令的定义
      bind: function (el) {
        let odiv = el; //获取当前元素
        el.onmousedown = (e) => {
          //算出鼠标相对元素的位置
          let disX = e.clientX - odiv.offsetLeft;
          let disY = e.clientY - odiv.offsetTop;
          let left = "";
          let top = "";
          document.onmousemove = (e) => {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            left = e.clientX - disX;
            top = e.clientY - disY;
            //绑定元素位置到positionX和positionY上面
            //移动当前元素
            odiv.style.left = left + "px";
            odiv.style.top = top + "px";
          };
          document.onmouseup = (e) => {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      },
    },
  },
};
</script>
<style>
.ThreeDContainerts {
  position: absolute;
  z-index: 7;
  top: 16vh;
  left: 22vw;
  border: 27px solid transparent;
  -moz-border-image: url("/static/images/mode-ico/通用框.png") 30 30 round; /* Old Firefox */
  -webkit-border-image: url("/static/images/mode-ico/通用框.png") 30 30 round; /* Safari and Chrome */
  -o-border-image: url("/static/images/mode-ico/通用框.png") 30 30 round; /* Opera */
  border-image: url("/static/images/mode-ico/通用框_1.png") 30 30 round;
}
.gjllabel {
  font-size: 18px;
  font-family: YouSheBiaoTiHei;
  font-weight: 400;
  line-height: 17px;
  color: #ffffff;
  letter-spacing: 10px;
  opacity: 1;
}
.gjllabels {
  font-size: 14px;
  color: #ffffff;
  letter-spacing: 4px;
  width: 7vw;
  display: inline-block;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 37px;
  opacity: 1;
}
.divcolor {
  width: 1vw;
  height: 2vh;
  margin-right: 0.5vw;
  background-color: green;
  display: inline-block;
  vertical-align: middle;
}
.divcolors {
  background-color: red;
  width: 1vw;
  height: 2vh;
  display: inline-block;
  vertical-align: middle;
}
.buttons {
  height: 2vw;
  opacity: 1;
  z-index: 7;
  margin-right: 10px;
  margin-top: 5px;
  width: 10vh;
  background-size: 100% 100%;
  border: 0;
  display: inline-block;
  background-image: url(/static/images/mode-ico/工具栏按钮.png);
}
.buttons:hover {
  height: 2vw;
  opacity: 1;
  z-index: 7;
  margin-right: 10px;
  margin-top: 5px;
  width: 10vh;
  background-size: 100% 100%;
  border: 0;
  display: inline-block;
  background-image: url(/static/images/mode-ico/工具栏按钮选中.png);
}

.bt {
  font-size: 18px;
  font-family: YouSheBiaoTiHei;
  color: rgb(255, 255, 255);
  text-shadow: rgb(4 36 39 / 40%) 0px 2px 4px;
  opacity: 1;
  margin: 0.5vh 0vw;
  display: block;
  width: 100%;
  height: 100%;
  text-align: center;
}
.bt:hover {
  font-size: 18px;
  font-family: YouSheBiaoTiHei;
  color: #ffff08;
  text-shadow: rgb(4 36 39 / 40%) 0px 2px 4px;
  opacity: 1;
  margin: 0.5vh 0vw;
  display: block;
  width: 100%;
  height: 100%;
  text-align: center;
}

.el-form:nth-child(1) {
  padding: 0px 0px 0px 0px !important;
}
.el-tag.el-tag--success {
  width: 160px;
  margin-top: 5px;
}
</style>
