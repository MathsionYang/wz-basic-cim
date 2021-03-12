<template>
  <div class="ThreeDContainer" v-drag>
    <div
      class="sightline tframe"
      style="background-color: rgba(5, 41, 110, 0.78)"
    >
      <div>
        <div class="gjllabel">地表开挖</div>
        <div style="margin-top: 1vh;color: white;">透明度：{{ aValue }}%</div>
        <div class="slider-wrapper" @click.stop>
          <el-slider
            @change="change_Alpha_Value"
            :min="aMin"
            :max="aMax"
            v-model="aValue"
          ></el-slider>
        </div>
        <div class="buttons" @click="eventRegsiter">
          <span class="bt">地表开挖</span>
        </div>
        <div class="buttons" @click="sightlineClear">
          <span class="bt">清除</span>
        </div>
        <div class="buttons" @click="sightlineClose">
          <span class="bt">关闭</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const Cesium = window.Cesium;
let handlerPolygon = undefined;
let handlerBox = undefined;
let editorBox = undefined;
let boxEntity = undefined;
export default {
  name: "RZFX",
  data: function() {
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
      aMin: 0,
      aMax: 100,
      aValue: 0
    };
  },
  created() {},
  async mounted() {
    this.initExcavate();
    this.change_Alpha_Value(0);
    //this.eventRegsiter(); //监听eventDraw方法
  },
  beforeDestroy() {
    this.viewPosition = [];
    this.HandlerFlag = undefined;
    this.sightLineHandler = undefined;
    this.pointHandler = undefined;
    this.screenSpaceEventHandler = undefined;
    this.handlerPolygon = undefined;
    this.sightlineClear();
    this.change_Alpha_Value(0);
  },
  methods: {
    //事件绑定
    eventRegsiter() {
      handlerPolygon.activate();
    },
    change_Alpha_Value(val) {
      window.earth.scene.globe.globeAlpha = (100 - val) / 100;
    },
    initExcavate() {
      handlerPolygon = new Cesium.DrawHandler(
        window.earth,
        Cesium.DrawMode.Polygon
      );
      handlerPolygon.activeEvt.addEventListener(isActive => {
        if (isActive) {
          window.earth.enableCursorStyle = false;
          window.earth._element.style.cursor = "";
          $("body")
            .removeClass("drawCur")
            .addClass("drawCur");
        } else {
          window.earth.enableCursorStyle = true;
          $("body").removeClass("drawCur");
        }
      });
      handlerPolygon.movingEvt.addEventListener(windowPosition => {
        if (windowPosition.x < 2000 && windowPosition.y < 2000) {
          return;
        }
      });
      handlerPolygon.drawEvt.addEventListener(result => {
        if (!result.object.positions) {
          handlerPolygon.polygon.show = false;
          handlerPolygon.polyline.show = false;
          handlerPolygon.deactivate();
          handlerPolygon.activate();
          return;
        }
        let array = [].concat(result.object.positions);
        let positions = [];
        for (let i = 0, len = array.length; i < len; i++) {
          let cartographic = Cesium.Cartographic.fromCartesian(array[i]);
          let longitude = Cesium.Math.toDegrees(cartographic.longitude);
          let latitude = Cesium.Math.toDegrees(cartographic.latitude);
          if (
            positions.indexOf(longitude) == -1 &&
            positions.indexOf(latitude) == -1
          ) {
            positions.push(longitude, latitude, cartographic.height);
          }
        }
        console.log("positions", positions);
        window.earth.scene.globe.removeAllExcavationRegion();
        window.earth.scene.globe.addExcavationRegion({
          name: "excavate",
          position: positions,
          height: 100,
          transparent: false
        });
        handlerPolygon.polygon.show = false;
        handlerPolygon.polyline.show = false;
        handlerPolygon.deactivate();
        // handlerPolygon.activate();
      });
    },
    sightlineClear() {
      handlerPolygon.deactivate();
      window.earth.scene.globe.removeAllExcavationRegion();
      if (handlerPolygon.polygon) {
        handlerPolygon.polygon.show = false;
        handlerPolygon.polyline.show = false;
      }

      this.$bus.$emit("dzt-clear");
      //window.earth.entities.removeAll();
    },
    sightlineClose() {
      this.sightlineClear();
      this.$bus.$emit("cesium-3d-maptool", { value: null });
      this.$bus.$emit("cesium-3d-imgs", { value: "清除" });
    }
  },
  directives: {
    drag: {
      // 指令的定义
      bind: function(el) {
        let odiv = el; //获取当前元素
        el.onmousedown = e => {
          //算出鼠标相对元素的位置
          let disX = e.clientX - odiv.offsetLeft;
          let disY = e.clientY - odiv.offsetTop;
          let left = "";
          let top = "";
          document.onmousemove = e => {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            left = e.clientX - disX;
            top = e.clientY - disY;
            //绑定元素位置到positionX和positionY上面
            //移动当前元素
            odiv.style.left = left + "px";
            odiv.style.top = top + "px";
          };
          document.onmouseup = e => {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      }
    }
  }
};
</script>
<style>
.el-slider__runway {
  width: 100%;
  height: 6px;
  margin: 6px 0;
  background-color: #e4e7ed;
  border-radius: 3px;
  position: relative;
  cursor: pointer;
  vertical-align: middle;
}
.ThreeDContainer {
  position: absolute;
  z-index: 7;
  top: 8vh;
  left: 16vw;
  border: 27px solid transparent;
  -moz-border-image: url("/static/images/common/框.png") 30 30 round; /* Old Firefox */
  -webkit-border-image: url("/static/images/common/框.png") 30 30 round; /* Safari and Chrome */
  -o-border-image: url("/static/images/common/框.png") 30 30 round; /* Opera */
  border-image: url("/static/images/common/框.png") 30 30 round;
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
