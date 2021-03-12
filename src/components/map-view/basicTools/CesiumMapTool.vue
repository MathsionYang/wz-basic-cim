<!--
 * @Author: eds
 * @Date: 2020-07-21 18:38:39
 * @LastEditTime: 2020-07-28 11:00:21
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\CesiumMapTool.vue
-->
<template>
  <div class="ThreeDContainercl" v-drag>
    <div
      class="cesiummaptool tframe"
      style="background-color: rgba(5, 41, 110, 0.78); padding-top: 7px"
    >
      <div>
        <div class="gjllabelcl">测量工具</div>
        <div class="buttons" @click="gaugeDistance">
          <span class="bt">测距</span>
        </div>
        <div class="buttons" @click="gaugeArea">
          <span class="bt">测面</span>
        </div>
        <div class="buttons" @click="gaugeHeight">
          <span class="bt">测高</span>
        </div>
        <div class="buttons" @click="clearGauge">
          <span class="bt">清除</span>
        </div>
        <div class="buttons" @click="closeGauge">
          <span class="bt">关闭</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const Cesium = window.Cesium;
export default {
  name: "CesiumMapTool",
  data() {
    return {
      toolTypeRules: {
        rivername: [
          { required: true, message: "请选择测量类型", trigger: "change" }
        ]
      },
      toolTypes: [
        { label: "空间测量", value: "空间测量" },
        { label: "贴地测量", value: "贴地测量" }
      ],
      toolType: "空间测量",
      // cesium Object
      viewer: undefined,
      handlerDis: undefined,
      handlerArea: undefined,
      handlerHeight: undefined,
      clampMode: 0
    };
  },
  created() {
    this.viewer = window.earth;
    this.handlerDis = new Cesium.MeasureHandler(
      this.viewer,
      Cesium.MeasureMode.Distance,
      this.clampMode
    );
    this.handlerArea = new Cesium.MeasureHandler(
      this.viewer,
      Cesium.MeasureMode.Area,
      this.clampMode
    );
    this.handlerHeight = new Cesium.MeasureHandler(
      this.viewer,
      Cesium.MeasureMode.DVH
    );
  },
  mounted() {
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.viewer = undefined;
    this.handlerDis = undefined;
    this.handlerArea = undefined;
    this.handlerHeight = undefined;
    this.clearGauge();
  },
  methods: {
    //  事件绑定
    eventRegsiter() {
      const that = this;
      that.handlerDis.measureEvt.addEventListener(function(result) {
        var dis = Number(result.distance);
        var positions = result.positions;
        var distance =
          dis > 1000 ? (dis / 1000).toFixed(2) + "km" : dis.toFixed(2) + "m";
        that.handlerDis.disLabel.text = "距离:" + distance;
      });
      that.handlerDis.activeEvt.addEventListener(function(isActive) {
        if (isActive == true) {
          that.viewer.enableCursorStyle = false;
          that.viewer._element.style.cursor = "";
          $("body")
            .removeClass("measureCur")
            .addClass("measureCur");
        } else {
          that.viewer.enableCursorStyle = true;
          $("body").removeClass("measureCur");
        }
      });
      that.handlerArea.measureEvt.addEventListener(function(result) {
        var mj = Number(result.area);
        var positions = result.positions;
        var area =
          mj > 1000000
            ? (mj / 1000000).toFixed(2) + "km²"
            : mj.toFixed(2) + "㎡";
        that.handlerArea.areaLabel.text = "面积:" + area;
      });
      that.handlerArea.activeEvt.addEventListener(function(isActive) {
        if (isActive == true) {
          that.viewer.enableCursorStyle = false;
          that.viewer._element.style.cursor = "";
          $("body")
            .removeClass("measureCur")
            .addClass("measureCur");
        } else {
          that.viewer.enableCursorStyle = true;
          $("body").removeClass("measureCur");
        }
      });
      that.handlerHeight.measureEvt.addEventListener(function(result) {
        var distance =
          result.distance > 1000
            ? (result.distance / 1000).toFixed(2) + "km"
            : result.distance + "m";
        var vHeight =
          result.verticalHeight > 1000
            ? (result.verticalHeight / 1000).toFixed(2) + "km"
            : result.verticalHeight + "m";
        var hDistance =
          result.horizontalDistance > 1000
            ? (result.horizontalDistance / 1000).toFixed(2) + "km"
            : result.horizontalDistance + "m";
        that.handlerHeight.disLabel.text = "空间距离:" + distance;
        that.handlerHeight.vLabel.text = "垂直高度:" + vHeight;
        that.handlerHeight.hLabel.text = "水平距离:" + hDistance;
      });
      that.handlerHeight.activeEvt.addEventListener(function(isActive) {
        if (isActive == true) {
          that.viewer.enableCursorStyle = false;
          that.viewer._element.style.cursor = "";
          $("body")
            .removeClass("measureCur")
            .addClass("measureCur");
        } else {
          that.viewer.enableCursorStyle = true;
          $("body").removeClass("measureCur");
        }
      });
    },
    //  改变select
    changeMapType(prov) {
      this.handlerArea.clampMode = prov == "空间测量" ? 0 : 1;
      this.handlerDis.clampMode = prov == "空间测量" ? 0 : 1;
    },
    //  测距
    gaugeDistance() {
      this.deactiveAll();
      this.handlerDis && this.handlerDis.activate();
    },
    //  测面
    gaugeArea() {
      this.deactiveAll();
      this.handlerArea && this.handlerArea.activate();
    },
    //  测高
    gaugeHeight() {
      this.deactiveAll();
      this.handlerHeight && this.handlerHeight.activate();
    },
    //  关闭地图测量
    closeGauge() {
      this.clearGauge();
      this.$bus.$emit("cesium-3d-maptool", { value: null });
    },
    //  清除分析结果
    clearGauge() {
      this.handlerDis && this.handlerDis.clear();
      this.handlerArea && this.handlerArea.clear();
      this.handlerHeight && this.handlerHeight.clear();
    },
    deactiveAll() {
      this.handlerDis && this.handlerDis.deactivate();
      this.handlerArea && this.handlerArea.deactivate();
      this.handlerHeight && this.handlerHeight.deactivate();
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
.ThreeDContainercl {
  position: absolute;
  z-index: 7;
  top: 8vh;
  left: 16vw;
  border-top: 10px solid transparent;
  border-right: 30px solid transparent;
  border-left: 33px solid transparent;
  border-bottom: 30px solid transparent;
  border: 5px 20px 5px 5px;
  -o-border-image: url(/static/images/mode-ico/通用框.png) 30 30 round;
  border-image: url(/static/images/mode-ico/通用框.png) 10 30 30 30 round;
}
.gjllabelcl {
  font-size: 18px;
  font-family: YouSheBiaoTiHei;
  font-weight: 400;
  line-height: 17px;
  color: #ffffff;
  letter-spacing: 10px;
  opacity: 1;
  display: inline-block;
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
</style>
