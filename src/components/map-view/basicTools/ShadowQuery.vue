<template>
  <div class="ThreeDContainer" :style="{width:'350px'}">
    <div class="ShadowQuery tframe">
      <el-form label-width="95px">
        <el-row>
          <el-col class="ShadowQueryStyle">
            <el-form-item label="开始时间">
              <el-select size="small" v-model="startTime">
                <el-option
                  v-for="item in Times"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-select size="small" v-model="endTime">
                <el-option
                  v-for="item in Times"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间间隔">
              <el-input-number v-model="timeInterval" :min="1" :max="60" label="时间间隔" size="mini"></el-input-number>
            </el-form-item>
            <el-form-item label="间距(米)">
              <el-input-number v-model="spacing" :min="1" :max="60" label="spacing" size="mini"></el-input-number>
            </el-form-item>
            <el-form-item label="底部高程(米)">
              <el-input-number
                v-model="bottomHeight"
                :min="1"
                :max="60"
                label="bottomHeight"
                size="mini"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="拉伸高度(米)">
              <el-input-number
                v-model="extrudeHeight"
                :min="1"
                :max="60"
                label="extrudeHeight"
                size="mini"
              ></el-input-number>
            </el-form-item>
            <el-form>
              <el-button class="elformbtn" type="button" @click="ShadowQueryAnalysis">分析</el-button>
              <el-button class="elformbtn" type="button" @click="ShadowQueryClear">清除</el-button>
              <el-button class="elformbtn" type="button" @click="ShadowQueryClose">关闭</el-button>
            </el-form>
          </el-col>
        </el-row>
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
const Cesium = window.Cesium;
export default {
  name: "ShadowQuery",
  data: function () {
    return {
      //设定开始时间默认值
      startTime: "10:00",
      //设定结束时间默认值
      endTime: "14:00",
      //optipons里面的下拉选择
      Times: [
        { label: "0:00", value: "0:00" },
        { label: "2:00", value: "2:00" },
        { label: "4:00", value: "4:00" },
        { label: "6:00", value: "6:00" },
        { label: "8:00", value: "8:00" },
        { label: "10:00", value: "10:00" },
        { label: "12:00", value: "12:00" },
        { label: "14:00", value: "14:00" },
        { label: "16:00", value: "16:00" },
        { label: "18:00", value: "18:00" },
        { label: "20:00", value: "20:00" },
        { label: "22:00", value: "22:00" },
        { label: "24:00", value: "24:00" },
      ],
      handlerPolygon: undefined,
      positions: [],
      points: [], //临时数组
      timeInterval: 60, //时间间隔
      spacing: 5, //间距
      selDate: new Date(),
      bottomHeight: 10, //底部高度
      extrudeHeight: 15, //拉伸高度
      ShadowQuery: undefined,
      
      show: true,
      polygon: undefined,
      layers: undefined,
    };
  },
  created() {
    // //首先要初始化viewer 不然会报错
    // //开启场景倒影
    // if (window.earth.shadows == false) {
    //   window.earth.shadows = true;
    // }
    // var scene = window.earth.scene;
    // this.scene = scene;
    // var layers = this.scene.layers.layerQueue;
    // for (var i = 0; i < layers.length; i++) {
    //   layers[i].shadowType = 2;
    //   layers[i].refresh();
    // }
    // this.setCurrentTime();
    // this.handlerPolygon = new Cesium.DrawHandler(
    //   window.earth,
    //   Cesium.DrawMode.Polygon,
    //   0
    // );
  },
  mounted() {
    //监听methods里的方法
    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {
      const that = this;
      //首先要初始化viewer 不然会报错
      //开启场景倒影
      if (window.earth.shadows == false) {
        window.earth.shadows = true;
      }
      var scene = window.earth.scene;
      this.scene = scene;
      var layers = this.scene.layers.layerQueue;
      for (var i = 0; i < layers.length; i++) {
        layers[i].shadowType = 2;
        layers[i].refresh();
      }
      if (!that.ShadowQuery) {
        that.ShadowQuery = new Cesium.ShadowQueryPoints(window.earth.scene);
        that.ShadowQuery.build();
      }
      this.setCurrentTime();
      this.handlerPolygon = new Cesium.DrawHandler(
        window.earth,
        Cesium.DrawMode.Polygon,
        0
      );
      //创建阴影查询对象 ShadowQuery
      that.handlerPolygon.activeEvt.addEventListener(function (isActive) {
        if (isActive == true) {
          window.earth.enableCursorStyle = false;
          window.earth._element.style.cursor = "";
          document.body.classList.add("drawCur");
        } else {
          window.earth.enableCursorStyle = true;
          document.body.classList.remove("drawCur");
        }
      });
      that.handlerPolygon.drawEvt.addEventListener(function (result) {
        let positions = that.positions;
        let points = that.points;
        points.length = 0;
        var polygon = result.object;
        if (!polygon) {
          return;
        }
        polygon.show = false;
        that.handlerPolygon.polyline.show = false;
        positions = [].concat(polygon.positions);
        positions = Cesium.arrayRemoveDuplicates(
          positions,
          Cesium.Cartesian3.equalsEpsilon
        );
        //遍历多边形 取出所有的点
        for (var i = 0, len = positions.length; i < len; i++) {
          //转化为经纬度，并加入临时数组
          //var position = positions[i];
          var cartographic = Cesium.Cartographic.fromCartesian(
            polygon.positions[i]
            //position
          );
          var longitude = Cesium.Math.toDegrees(cartographic.longitude);
          var latitude = Cesium.Math.toDegrees(cartographic.latitude);
          points.push(longitude);
          points.push(latitude);
        }
        //设置分析对象的开始结束时间
        const dataValue = new Date();
        const st = dataValue;
        //st.setHours(Number(that.startTime));
        //转换时间
        that.ShadowQuery.startTime = Cesium.JulianDate.fromDate(st);
        const et = dataValue;
        //et.setHours(Number(that.endTime));
        that.ShadowQuery.endTime = Cesium.JulianDate.fromDate(et);
        //设置当前的时间
        that.setCurrentTime();
        that.ShadowQuery.spacing = that.spacing;
        that.ShadowQuery.timeInterval = that.timeInterval;
        //设置分析区域、底部高程和拉伸高度
        var bh = Number(that.bottomHeight);
        var eh = Number(that.extrudeHeight);
        that.ShadowQuery.qureyRegion({
          position: points,
          bottom: bh,
          extend: eh,
        });
        that.ShadowQuery.build();
      });
    },
    //不知道用来设定什么的时间
    setCurrentTime() {
      const et = new Date();
      //et.setHours(Number(this.endTime));
      window.earth.clock.currentTime = Cesium.JulianDate.fromDate(et);
      window.earth.clock.multiplier = 1;
      window.earth.clock.shouldAnimate = true;
    },
    ShadowQueryAnalysis() {
      this.handlerPolygon.deactivate();
      this.handlerPolygon.activate();
    },
    ShadowQueryClear() {
      //初始化参数
      if (this.handlerPolygon) {
        this.handlerPolygon.deactivate();
      }
      window.earth.entities.removeAll();
      let layers = this.scene.layers.layerQueue;
      for (var i = 0; i < layers.length; i++) {
        layers[i].shadowType = 0;
      }
      if (this.ShadowQuery) {
        this.ShadowQuery.qureyRegion({
          position: [0, 0],
          bottom: 0,
          extend: 0,
        });
      }
      //把设置恢复成默认设置
      this.positions = [];
      this.points = [];
      //this.selDate = new Date();
      this.startTime = "10:00";
      this.endTime = "14:00";
      this.timeInterval = 60;
      this.spacing = 10;
      this.bottomHeight = 20;
      this.extrudeHeight = 20;
    },
    ShadowQueryClose(){
      this.ShadowQueryClear();
      this.$bus.$emit("cesium-3d-maptool", { value: null });
    }
  },
  //监听事件 用于监听上面的值改变
  watch: {
    selDate: function (newValue) {},
    startTime: function (newValue) {
      const st = new Date();
      //st.setHours(Number(newValue));
      this.ShadowQuery.startTime = Cesium.JulianDate.fromDate(st);
    },
    endTime: function (newValue) {
      const et = new Date();
      //et.setHours(Number(newValue));
      this.ShadowQuery.endTime = Cesium.JulianDate.fromDate(et);
    },
    timeInterval: function (newValue) {
      this.ShadowQuery.timeInterval = Number(newValue);
      this.ShadowQuery.build();
    },
    spacing: function (newValue) {
      this.ShadowQuery.spacing = Number(newValue);
      this.ShadowQuery.build();
    },
    bottomHeight: function (newValue) {
      const bh = Number(newValue);
      const eh = Number(this.extrudeHeight);
      this.ShadowQuery.qureyRegion({
        //报错
        position: this.points,
        bottom: bh,
        extend: eh,
      });
      this.ShadowQuery.build();
    },
    extrudeHeight: function (newValue) {
      const bh = Number(this.bottomHeight);
      var eh = Number(newValue);
      this.ShadowQuery.qureyRegion({
        //报错
        position: this.points,
        bottom: bh,
        extend: eh,
      });
      this.ShadowQuery.build();
    },
  },
  beforeDestroy() {
    //销毁
    this.ShadowQuery = undefined;
    this.handlerPolygon = undefined;
    this.timeInterval = null;
    this.spacing = null;
    this.bottomHeight = null;
    this.extrudeHeight = null;
  },
};
</script>
<style>
.ShadowQueryStyle{
  width: 75%;
  margin-left: 36px;
}
.el-input-number--mini .el-input-number__decrease, .el-input-number--mini .el-input-number__increase{
  background-color: rgba(41, 104, 146, 12);
  color: white;
  height: 28px;
}
</style>