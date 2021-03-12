<template>
  <div class="ThreeDContainer" v-drag>
    <div
      class="sightline tframe"
      style="background-color: rgba(5, 41, 110, 0.78)"
    >
      <div>
        <div class="gjllabel">剖切裁剪</div>
        <div class="buttons" @click="eventRegsiter">
          <span class="bt">开始</span>
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
  created() {},
  async mounted() {
    this.initTailor();
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
  },
  methods: {
    //事件绑定
    eventRegsiter() {
      handlerBox.activate();
    },
    initTailor() {
      handlerBox = new Cesium.DrawHandler(window.earth, Cesium.DrawMode.Box);
      handlerBox.drawEvt.addEventListener((e) => {
        boxEntity = e.object;
        var newDim = boxEntity.box.dimensions.getValue();
        var position = boxEntity.position.getValue(0);
        var boxOption = {
          dimensions: newDim,
          position: position,
          clipMode: "clip_behind_all_plane",
          heading: 0,
        };

        //box编辑
        editorBox = new Cesium.BoxEditor(window.earth, boxEntity);
        editorBox.editEvt.addEventListener((e) => {
          boxEntity.box.dimensions = e.dimensions;
          boxEntity.position = e.position;
          boxEntity.orientation = e.orientation;
          this.setClipBox();
        });
        // editorBox.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(
        //   0,
        //   950
        // );
        editorBox.activate();
        this.setAllLayersClipOptions(boxOption);
        handlerBox.clear();
        handlerBox.deactivate();
      });
    },
    setClipBox() {
      var newDim = boxEntity.box.dimensions.getValue();
      var position = boxEntity.position.getValue(0);
      var heading = 0;
      if (typeof boxEntity.orientation != "undefined") {
        let rotationM3 = Cesium.Matrix3.fromQuaternion(
          boxEntity.orientation._value,
          new Cesium.Matrix3()
        );
        let localFrame = Cesium.Matrix4.fromRotationTranslation(
          rotationM3,
          Cesium.Cartesian3.ZERO,
          new Cesium.Matrix4()
        );
        let inverse = Cesium.Matrix4.inverse(
          Cesium.Transforms.eastNorthUpToFixedFrame(position),
          new Cesium.Matrix4()
        );
        let hprm = Cesium.Matrix4.multiply(
          inverse,
          localFrame,
          new Cesium.Matrix4()
        );
        var rotation = Cesium.Matrix4.getMatrix3(hprm, new Cesium.Matrix3());
        let hpr = Cesium.HeadingPitchRoll.fromQuaternion(
          Cesium.Quaternion.fromRotationMatrix(rotation)
        );
        heading = hpr.heading;
      }
      var boxOptions = {
        dimensions: newDim,
        position: position,
        clipMode: "clip_behind_all_plane",
        heading: heading,
      };
      this.setAllLayersClipOptions(boxOptions);
    },
    setAllLayersClipOptions(boxOptions) {
      var layers = window.earth.scene.layers;
      for (let i = 0; i < layers.layerQueue.length; i++) {
        const layer = layers.layerQueue[i];
        layer.setCustomClipBox(boxOptions);
      }
      //  地质体剖切单独处理
      this.$bus.$emit("dzt-clip", boxOptions);
    },
    sightlineClear() {
      var layers = window.earth.scene.layers;
      for (let i = 0; i < layers.layerQueue.length; i++) {
        const layer = layers.layerQueue[i];
        layer.clearCustomClipBox();
      }
      try {
        editorBox.deactivate();
        handlerBox.clear();
        handlerBox.deactivate();
      } catch (error) {}
      this.$bus.$emit("dzt-clear");
      //window.earth.entities.removeAll();
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
