<template>
  <div class="ThreeDContainer" v-drag>
    <div
      class="sightline tframe"
      style="background-color: rgba(5, 41, 110, 0.78)"
    >
      <div>
        <div class="gjllabel">通视分析</div>
        <div class="gjllabels">可见区域颜色</div>
        <div class="divcolor"></div>
        <div class="gjllabels">不可见区域颜色</div>
        <div class="divcolors"></div>
        <br />
        <div class="buttons" @click="eventRegsiter">
          <span class="bt">分析</span>
        </div>
        <div class="buttons" @click="sightlineClear">
          <span class="bt">清除</span>
        </div>
        <div class="buttons" @click="sightlineClose">
          <span class="bt">关闭</span>
        </div>
      </div>
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
      viewer: undefined, //
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
    this.viewer = window.earth;
    this.sightLineHandler = new Cesium.DrawHandler(
      this.viewer,
      Cesium.DrawMode.Line
    );
    this.screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
    this.sightline = new Cesium.Sightline(this.viewer.scene);
    this.pointHandler = new Cesium.PointHandler(this.viewer);
  },
  mounted() {
    this.eventRegsiter(); //监听eventDraw方法
  },
  beforeDestroy() {
    this.sightline = undefined;
    this.viewPosition = [];
    this.viewer = undefined;
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
          that.viewer.enableCursorStyle = false;
          that.viewer._element.style.cursor = "";
          document.body.classList.add("drawCur");
        } else {
          that.viewer.enableCursorStyle = true;
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
            const pick = that.viewer.scene.pickPosition(evt.position);
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
      that.viewer.entities.removeAll();
      that.sightline && this.sightline.removeAllTargetPoint();
    },
    sightlineClose() {
      this.sightlineClear();
      this.$bus.$emit("cesium-3d-maptool", { value: null });
      this.$bus.$emit("cesium-3d-imgs", { value: "清除" });
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
.ThreeDContainer {
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
