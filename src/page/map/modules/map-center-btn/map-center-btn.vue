<template>
  <div class="wrapper map-tools">
    <div
      class="map-toolbar-box map-toolbar-spc"
      :class="currentMapType != 'sandian' || this.collapse1 ? 'collapse' : ''"
      v-if="currentMapType != 'internetthings'"
    >
      <div class="map-type" style="display: none">
        <div
          class="item"
          :class="
            'item' +
            (index + 1) +
            ' ' +
            (item.value === currentMapType ? 'active' + (index + 1) : '')
          "
          @click="changeMapType(item)"
          :title="item.name"
          :key="index"
          v-for="(item, index) in mapType"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <!--  物联网使用 -->
    <div
      class="map-toolbar-box1 map-toolbar-spc"
      :class="this.collapse1 ? 'collapse' : ''"
      v-if="currentMapType == 'internetthings'"
    >
      <div class="map-type">
        <div
          class="item"
          :class="
            'item' +
            (index + 1) +
            ' ' +
            (item.value === currentMapType ? 'active' + (index + 1) : '')
          "
          @click="changeMapType(item)"
          :title="item.name"
          :key="index"
          v-for="(item, index) in mapType"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div
      class="toCenter1"
      :class="{
        collapse: currentMapType == 'cesiumMap' || collapse1,
        moveRight2: currentMapType == 'cesiumMap',
      }"
      title="全图"
      v-if="currentMapType != 'internetthings'"
    >
      <i
        style="width: 100%; height: 0.42rem"
        @click="changeMapTollBar({ name: '地图居中', value: 'map_init' })"
      ></i>
    </div>
    <div
      class="toCenter2"
      :class="{
        collapse: currentMapType == 'cesiumMap' || collapse1,
        moveRight2: currentMapType == 'cesiumMap',
      }"
      title="物联网"
      v-if="currentMapType != 'internetthings'"
    >
      <i
        style="width: 100%; height: 0.42rem"
        @click="changeMapType({ name: '物联网', value: 'internetthings' })"
      ></i>
    </div>
    <div
      class="toCenter"
      :class="{
        collapse: currentMapType == 'cesiumMap' || collapse1,
        active: centerShow,
        moveRight1: currentMapType == 'cesiumMap',
      }"
      title="底图"
      v-if="currentMapType != 'internetthings'"
    >
      <i style="width: 100%; height: 0.42rem" @click="showTool"></i>
      <!-- 3d地图工具 -->
      <div
        v-show="currentMapType == 'cesiumMap'"
        class="map-toolbar-box"
        :class="{ active: centerShow }"
      >
        <div class="map-type tool-detail">
          <div
            class="item item-spc"
            :class="'btn' + (index + 1)"
            :key="index"
            :title="item.name"
            v-for="(item, index) in map3D"
            @click="changeMap3D(item, index)"
          >
            {{ item.abbrev }}
          </div>
        </div>
      </div>
      <!-- 2d地图工具 -->
      <div
        v-show="currentMapType != 'cesiumMap'"
        class="map-toolbar-box"
        :class="{ active: centerShow }"
      >
        <div
          class="center-item"
          :class="'btn' + (index + 1)"
          :key="index"
          :title="item.name"
          v-for="(item, index) in mapNew"
          @click="changeMapTollBarTop(item, index)"
        >
          {{ item.abbrev }}
        </div>
      </div>
    </div>
    <div
      class="toCenter3"
      :class="{
        collapse: currentMapType == 'cesiumMap' || collapse1,
        active: DcenterShow,
        moveRight1: currentMapType == 'cesiumMap',
      }"
      title="淹没和管线分析"
      v-if="currentMapType == 'cesiumMap'"
    >
      <i style="width: 100%; height: 0.42rem" @click="show3Dmap"></i>
      <!-- 3d地图工具 -->
      <div
        v-show="currentMapType == 'cesiumMap'"
        class="map-toolbar-box"
        :class="{ active: DcenterShow }"
      >
        <div class="map-type tool-detail">
          <div
            class="item item-spc"
            :class="'btn' + (index + 1)"
            :key="index"
            :title="item.name"
            v-for="(item, index) in map3DBtn"
            @click="changeMap3DEventBar(item, index)"
          >
            {{ item.abbrev }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="map-toolbar-box-map"
      :class="{
        collapse: currentMapType == 'cesiumMap' || collapse1,
        active: toolShow,
      }"
      v-if="currentMapType != 'internetthings'"
    >
      <span class="collapse-btn" :class="{ active: toolShow }" title="地图工具">
        <i style="width: 32px; height: 32px" @click="mapTool"></i>
      </span>
      <!-- 3d地图工具 -->
      <div
        v-show="currentMapType == 'cesiumMap'"
        class="map-toolbar-box"
        :class="{ active: toolShow }"
      >
        <div class="map-type tool-detail">
          <div
            class="item item-spc"
            :class="'btn' + (index + 1)"
            :key="index"
            :title="item.name"
            v-for="(item, index) in map3DTool"
            @click="changeMap3DToolBar(item, index)"
          >
            {{ item.abbrev }}
          </div>
        </div>
      </div>

      <!-- 2d地图工具 -->
      <div
        v-if="currentMapType != 'cesiumMap'"
        class="map-toolbar-box"
        :class="{ active: toolShow }"
      >
        <div class="map-type tool-detail">
          <div
            class="item item-spc"
            :class="'btn' + (index + 1)"
            :key="index"
            :title="item.name"
            v-for="(item, index) in mapBtn"
            @click="changeMapTollBar(item, index)"
          >
            {{ item.abbrev }}
          </div>
          <!-- <div
            class="item item-spc"
            :class="{ active: isSetOpacity, disabled: !isCoverToolbarShow }"
            title="透明度"
            @click="setOpacity"
          >
            透明度
          </div> -->
          <div class="item item-spc" title="打印" @click="printMap">打印</div>
        </div>
        <div
          ref="slider"
          class="children_opacity"
          v-show="isSetOpacity && isCoverToolbarShow"
        >
          <Slider></Slider>
        </div>
        <div ref="longitudeSearch" class="children_point" v-show="isPointSearch">
          <LongitudeSearch></LongitudeSearch>
        </div>
      </div>
    </div>
    <div
      @mouseover="mapChildMouseover(0)"
      @mouseout="mapChildMouseout(0)"
      @click.stop
      v-if="mapNew[selectIndex].children"
      v-show="mapNew[selectIndex].childrenShow && centerShow"
      class="item-child"
      :class="collapse1 ? 'collapse' : ''"
      :style="{ top: mapNew[selectIndex].top }"
    >
      <div>
        <div :key="'b' + index2" v-for="(item2, index2) in mapNew[selectIndex].children">
          <label
            :class="{ active: dituType === item2.value }"
            @click="changedituType(item2)"
          >
            <span></span>
            {{ item2.name }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import LongitudeSearch from "components/map-view/longitude_search";
import Slider from "components/map-view/slider";

export default {
  name: "MapCenterBtn",
  props: {
    currentBaseMapType: {
      type: String,
      defaule() {
        return "";
      },
    },
  },
  data() {
    return {
      datalayer: "",
      canCilckMapType: true, // 可以点击切换底图类型
      dituType: "standard-raster",
      // 地图类型
      mapType: [
        { name: "二维", value: "sandian" },
        { name: "三维", value: "cesiumMap" },
      ],
      selectIndex: 0,
      toolShow: false,
      centerShow: false,
      DcenterShow: false,
      // 地图工具按钮
      map3DBtn: [
        { name: "淹没分析", value: "3d1", abbrev: "淹没分析" },
        { name: "地下管线", value: "3d4", abbrev: "地下管线" },
      ],
      map3D: [
        { name: "标准底图", value: "standard-raster", abbrev: "标准底图" },
        { name: "大数据底图", value: "bigdata-raster", abbrev: "大数据底图" },
      ],
      map3DTool: [
        { name: "测量工具", value: "3t1", abbrev: "测量工具" },
        { name: "可视分析", value: "3t2", abbrev: "可视分析" },
        { name: "剖面分析", value: "3t3", abbrev: "剖面分析" },
        { name: "通视分析", value: "3t4", abbrev: "通视分析" },
        { name: "阴影分析", value: "3t5", abbrev: "阴影分析" },
      ],
      mapBtn: [
        { name: "测距离", value: "line_string", abbrev: "测距" },
        { name: "测面积", value: "polygon", abbrev: "测面" },
        { name: "空间查询", value: "spatialQuery", abbrev: "空间查询" },
        { name: "分屏管理", value: "split_screen", abbrev: "分屏" },
        { name: "一键清空", value: "clearMapFeature", abbrev: "清空" },
      ],
      mapNew: [
        {
          name: "矢量",
          abbrev: "矢量",
          value: "changeMap",
          top: "1.5rem",
          childrenShow: false,
          childrenFocus: false,
          children: [
            {
              name: "标准底图",
              value: "standard-raster",
              inputName: "dituType",
            },
            {
              name: "大数据底图",
              value: "bigdata-raster",
              inputName: "dituType",
            },
          ],
        },
        {
          name: "影像",
          abbrev: "影像",
          value: "changeMap",
          top: "1.9rem",
          childrenShow: false,
          childrenFocus: false,
          children: [
            { name: "2012影像", value: "2012YX", inputName: "dituType" },
            { name: "2014影像", value: "2014YX", inputName: "dituType" },
            { name: "2017影像", value: "2017YX", inputName: "dituType" },
            { name: "2018影像", value: "2018YX", inputName: "dituType" },
            { name: "2019影像", value: "2019YX", inputName: "dituType" },
          ],
        },
      ],
      isPointSearch: false,
      isSetOpacity: false,
      isCoverToolbarShow: false,
    };
  },
  computed: {
    ...mapGetters("map", ["currentMapType", "collapse1", "mapLoaded"]),
  },
  watch: {
    mapLoaded() {
      this.canCilckMapType = true;
    },
    currentBaseMapType(currentBaseMapType) {
      this.dituType = currentBaseMapType;
      for (var i = 0; i < 2; i++) {
        if (this.mapNew[i].children.value === currentBaseMapType) {
          this.changedituType(this.mapNew[i].children);
          break;
        }
      }
    },
  },
  methods: {
    setOpacity(event) {
      if (!this.isCoverToolbarShow) {
        return;
      }
      this.isSetOpacity = !this.isSetOpacity;
      if (this.isSetOpacity) {
        const client = event.target.getBoundingClientRect();
        const style = window.getComputedStyle(event.currentTarget);
        const l = parseInt(style.marginLeft) + parseInt(style.width);
        this.$refs.slider.style.top =
          client.y +
          parseInt(window.getComputedStyle(this.$refs.slider).height) / 2 +
          "px";
        this.$refs.slider.style.left = client.x + l + 8 + "px";
      }
    },
    pointSearch(event) {
      this.isPointSearch = !this.isPointSearch;
      if (this.isPointSearch) {
        const client = event.target.getBoundingClientRect();
        const style = window.getComputedStyle(event.currentTarget);
        const l = parseInt(style.marginLeft) + parseInt(style.width);
        this.$refs.longitudeSearch.style.top =
          client.y +
          parseInt(window.getComputedStyle(this.$refs.longitudeSearch).height) / 2 +
          "px";
        this.$refs.longitudeSearch.style.left = client.x + l + 4 + "px";
      }
    },
    printMap() {
      // window.print()
      this.$parent.$refs.baseMap.map._preserveDrawingBuffer = true;
      this.$parent.$refs.baseMap.map._render();
      const data = this.$parent.$refs.baseMap.map.getCanvas().toDataURL("image/png");
      const img = document.createElement("img");
      img.src = data;
      var __this = this;
      this.$parent.$refs.baseMap.print(img).then(() => {
        __this.$parent.$refs.baseMap.map._preserveDrawingBuffer = false;
        __this.$parent.$refs.baseMap.map._render();
      });
    },
    showTool() {
      this.centerShow = !this.centerShow;
    },
    show3Dmap() {
      this.DcenterShow = !this.DcenterShow;
    },
    mapTool() {
      this.toolShow = !this.toolShow;
    },
    mapChildMouseover(index) {
      this.mapBtn[index].childrenFocus = true;
    },
    mapChildMouseout(index) {
      this.mapBtn[index].childrenFocus = false;
    },
    changedituType(item) {
      this[item.inputName] = item.value;
      const obj = {
        t: Math.random(), // 这个随机数不能删
        value: item.value,
      };
      this.$emit("setMapTollBar", obj);
    },
    // 修改地图类型
    changeMapType(item) {
      if (item.value === this.currentMapType) return;
      this.SetCurrentMapType(item.value);
      this.SetCollapse1(item.value == "cesiumMap");
      //  点击三维地图,切出地图工具
      // this.toolShow = item.value == "cesiumMap";
    },
    // 点击地图按钮
    changeMapTollBar(item, index) {
      // if (typeof index === 'number') this.selectIndex = index
      this.mapBtn = this.mapBtn.map((val, i) => {
        if (i !== index) val.childrenShow = false;
        return val;
      });
      if (item && item.children) {
        // this.mapBtn[0].childrenShow = !item.childrenShow
        item.childrenShow = !item.childrenShow;
        return;
      }
      const obj = {
        t: Math.random(), // 这个随机数不能删
        value: item.value,
      };
      this.$emit("setMapTollBar", obj);
    },
    changeMap3DEventBar(item, index) {
      this.$bus.$emit("cesium-3d-event", item);
    },
    changeMap3DToolBar(item, index) {
      this.$bus.$emit("cesium-3d-maptool", item);
    },
    changeMap3D(item, index) {
      if (item.name == "大数据底图") {
        //console.log("底图服务",window.earth.imageryLayers)
        if (window.earth.imageryLayers.get(3) == undefined) {
          window.earth.imageryLayers.get(1).show = false;
          this.datalayer = window.earth.imageryLayers.addImageryProvider(
            new Cesium.SuperMapImageryProvider({
              layers: "DSJ",
              url:
                "http://172.20.83.223:8091/iserver/services/map-agscachev2-YJDSJCGCS2000/rest/maps/YJ_DSJ_CGCS2000",
            })
          );
        }
      } else {
        //console.log(window.earth.imageryLayers.get(1))
        window.earth.imageryLayers.get(1).show = true;
        window.earth.imageryLayers.remove(this.datalayer);
      }
    },
    changeMapTollBarTop(item, index) {
      if (typeof index === "number") this.selectIndex = index;
      this.mapNew = this.mapNew.map((val, i) => {
        if (i !== index) val.childrenShow = false;
        return val;
      });
      if (item && item.children) {
        item.childrenShow = !item.childrenShow;
        if (!item.childrenShow) return;
        // 当前是聚合散点图时
        let stand, bigData, newYX;
        this.mapNew.forEach((val) => {
          val.children.forEach((v) => {
            switch (v.name) {
              case "标准底图":
                stand = v;
                break;
              case "大数据底图":
                bigData = v;
                break;
              case "2019影像":
                newYX = v;
                break;
              default:
                break;
            }
          });
        });
        if (this.currentMapType === "juhe" || this.currentMapType === "sandian") {
          // item.name === '矢量'
          if (item.name === "矢量") {
            const result = this.mapNew[0].children.filter((val) => {
              return val.value === this.dituType;
            });
            result.length ? console.log("无需切换") : this.changedituType(stand);
          } else if (item.name === "影像") {
            const result = this.mapNew[1].children.filter((val) => {
              return val.value === this.dituType;
            });
            result.length ? console.log("无需切换") : this.changedituType(newYX);
          }
        } else {
          if (item.name === "矢量") {
            const result = this.mapNew[0].children.filter((val) => {
              return val.value === this.dituType;
            });
            result.length ? console.log("无需切换") : this.changedituType(bigData);
          } else if (item.name === "影像") {
            const result = this.mapNew[1].children.filter((val) => {
              return val.value === this.dituType;
            });
            result.length ? console.log("无需切换") : this.changedituType(newYX);
          }
        }
        return;
      }
      const obj = {
        t: Math.random(), // 这个随机数不能删
        value: item.value,
      };
      this.$emit("setMapTollBar", obj);
    },
    ...mapActions("map", ["SetCurrentMapType", "SetCollapse1"]),
  },
  components: {
    LongitudeSearch,
    Slider,
  },
};
</script>

<style scoped lang="less">
.map-tools {
  > * {
    z-index: 2;
  }
}
.toCenter {
  width: 0.5rem;
  height: 0.46rem;
  display: block;
  background: #03315a !important;
  position: absolute;
  transition: all 0.3s linear;
  top: 0.5rem;
  border-radius: 6px;
  left: 4.7rem;
  /*box-shadow: 0 0 0 0.02rem rgba(0, 0, 0, 0.1);*/
  border: 1px #5ab0e5 solid !important;
  cursor: pointer;
  overflow: hidden;
  &.active {
    height: auto;
    > i {
      .bg-image("images/qiehuan-act");
      background-size: 0.34rem;
      color: #0d6aad;
      background-color: rgba(0, 0, 0, 0.4) !important;
    }
  }
  .center-item {
    width: 0.32rem;
    height: 0.46rem;
    margin-left: 7px;
    text-align: center;
    line-height: 0.46rem;
    color: #fff;
  }
  .center-item:hover {
    color: #00baff;
  }
  .center-item.active {
    color: #00baff;
  }
  > i {
    width: 0.16rem;
    height: 0.16rem;
    display: block;
    .bg-image("images/qiehuan");
    background-size: 0.34rem;
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }
  > i:hover {
    .bg-image("images/qiehuan-act");
    background-size: 0.34rem;
    color: #0d6aad;
    background-color: rgba(0, 0, 0, 0.4) !important;
  }
  &.collapse {
    left: 0.16rem;
  }
  .map-toolbar-box {
    height: 0;
    padding: 0 0.06rem;
    position: relative;
    top: -0.1rem;
    left: 0;
    margin: 0;
    overflow-y: hidden;
  }
  .map-toolbar-box.active {
    transition: height 0.3s linear;
    padding: 0.06rem 0;
    height: 100%; // 多
    padding-top: 0px;
  }
}
.toCenter:hover {
  /*background-color: rgba(0, 0, 0, 0.4) !important;*/
}
.toCenter1 {
  width: 0.5rem;
  height: 0.46rem;
  display: block;
  background: #03315a !important;
  position: absolute;
  transition: all 0.3s linear;
  top: 0.5rem;
  border-radius: 6px;
  left: 5.9rem;
  /*box-shadow: 0 0 0 0.02rem rgba(0, 0, 0, 0.1);*/
  border: 1px #5ab0e5 solid !important;
  cursor: pointer;
  overflow: hidden;
  &.active {
    height: 1.4rem;
    > i {
      .bg-image("images/draw_type-act");
      background-size: 0.34rem;
      color: #0d6aad;
      background-color: rgba(0, 0, 0, 0.4) !important;
    }
  }
  .center-item {
    width: 0.32rem;
    height: 0.46rem;
    margin-left: 7px;
    text-align: center;
    line-height: 0.46rem;
    color: #fff;
  }
  .center-item:hover {
    color: #00baff;
  }
  .center-item.active {
    color: #00baff;
  }
  > i {
    width: 0.16rem;
    height: 0.16rem;
    display: block;
    .bg-image("images/earth");
    background-size: 0.34rem;
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }
  > i:hover {
    .bg-image("images/earth-act");
    background-size: 0.34rem;
    color: #0d6aad;
    background-color: rgba(0, 0, 0, 0.4) !important;
  }
  &.collapse {
    left: 0.16rem;
  }
}
.toCenter3 {
  width: 0.5rem;
  height: 0.46rem;
  display: block;
  background: #03315a !important;
  position: absolute;
  transition: all 0.3s linear;
  top: 0.5rem;
  border-radius: 6px;
  left: 5.9rem;
  /*box-shadow: 0 0 0 0.02rem rgba(0, 0, 0, 0.1);*/
  border: 1px #5ab0e5 solid !important;
  cursor: pointer;
  overflow: hidden;
  &.active {
    height: 1.6rem;
    > i {
      .bg-image("images/draw_type-act");
      background-size: 0.34rem;
      color: #0d6aad;
      background-color: rgba(0, 0, 0, 0.4) !important;
    }
  }
  .center-item {
    width: 0.32rem;
    height: 0.46rem;
    margin-left: 7px;
    text-align: center;
    line-height: 0.46rem;
    color: #fff;
  }
  .center-item:hover {
    color: #00baff;
  }
  .center-item.active {
    color: #00baff;
  }
  > i {
    width: 0.16rem;
    height: 0.16rem;
    display: block;
    .bg-image("images/draw_type");
    background-size: 0.34rem;
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }
  > i:hover {
    .bg-image("images/draw_type-act");
    background-size: 0.34rem;
    color: #0d6aad;
    background-color: rgba(0, 0, 0, 0.4) !important;
  }
  &.collapse {
    left: 1.5rem;
  }
  .map-toolbar-box {
    height: 0;
    padding: 0 0.06rem;
    position: relative;
    top: -0.1rem;
    left: 0;
    margin: 0;
    overflow-y: hidden;
  }
  .map-toolbar-box.active {
    transition: height 0.3s linear;
    padding: 0.06rem 0;
    height: 100%; // 多
    padding-top: 0px;
  }
}
.toCenter2 {
  width: 0.5rem;
  height: 0.46rem;
  display: block;
  background: #03315a !important;
  position: absolute;
  transition: all 0.3s linear;
  top: 0.5rem;
  border-radius: 6px;
  left: 5.3rem;
  border: 1px #5ab0e5 solid !important;
  cursor: pointer;
  overflow: hidden;
  &.active {
    height: 1.4rem;
    > i {
      .bg-image("images/draw_type-act");
      background-size: 0.34rem;
      color: #0d6aad;
      background-color: rgba(0, 0, 0, 0.4) !important;
    }
  }
  .center-item {
    width: 0.32rem;
    height: 0.46rem;
    margin-left: 7px;
    text-align: center;
    line-height: 0.46rem;
    color: #fff;
  }
  .center-item:hover {
    color: #00baff;
  }
  .center-item.active {
    color: #00baff;
  }
  > i {
    width: 0.16rem;
    height: 0.16rem;
    display: block;
    .bg-image("images/wlw");
    background-size: 0.34rem;
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }
  > i:hover {
    .bg-image("images/wlw-act");
    background-size: 0.34rem;
    color: #0d6aad;
    background-color: rgba(0, 0, 0, 0.4) !important;
  }
  &.collapse {
    left: 0.16rem;
  }
}
.map-toolbar-box-map.active {
  height: auto;
}
.toCenter.moveRight1 {
  left: 0.8rem !important;
}
.toCenter1.moveRight2 {
  left: 2.16rem !important;
}
.map-toolbar-box-map {
  overflow: hidden;
  position: absolute;
  top: 0.5rem;
  left: 4.1rem;
  width: 0.5rem;
  height: 0.46rem;
  transition: all 0.3s linear;
  border-radius: 6px;
  background: #03315a !important;
  border: 1px #5ab0e5 solid !important;
  &.collapse {
    left: 0.16rem;
    .item-child {
      left: 0.54rem !important;
    }
  }
  /*.map-toolbar-box {*/
  /*  transition: height .3s linear !important;*/
  /*  padding: 0.06rem !important;*/
  /*  height: 3.94rem !important;*/
  /*}*/
  .collapse-btn:hover {
    background: rgba(0, 0, 0, 0.4);
  }
  .collapse-btn.active {
    background: rgba(0, 0, 0, 0.4);
    > i {
      .bg-image("images/tool-act");
    }
  }
  .collapse-btn {
    width: 0.5rem;
    height: 0.46rem;
    display: inline-block;
    background: #03315a;
    cursor: pointer;
    > i {
      width: 0.16rem;
      height: 0.16rem;
      display: block;
      .bg-image("images/tool");
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    > i:hover {
      .bg-image("images/tool-act");
    }
  }
  .map-toolbar-box {
    height: 0;
    padding: 0 0.06rem;
    position: relative;
    top: -0.1rem;
    left: 0;
    margin: 0;
    overflow-y: hidden;
  }
  .map-toolbar-box.active {
    transition: height 0.3s linear;
    padding: 0.06rem 0;
    height: 100%; // 多
    padding-top: 0px;
  }
}
.toCenter.active ~ .map-toolbar-box-map {
  // top: 3.2rem;
}
.toCenter div:nth-child(3) {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
.map-toolbar-spc {
  background: #03315a !important;
  /*box-shadow: 0 0 0 0.02rem rgba(0, 0, 0, 0.1);*/
  border: 1px #5ab0e5 solid !important;
  padding: 0rem 0rem !important;
}
.map-toolbar-box1 {
  position: absolute;
  padding: 0.05rem 0.06rem;
  margin: 0.1rem 0 0 0;
  background: rgba(0, 0, 0, 0);
  /*box-shadow: 0 0 0 0.02rem rgba(0, 0, 0, 0.1);*/
  /*border:1px #5ab0e5 solid;*/
  border-radius: 6px;
  left: 4.4rem;
  top: 0rem;
  z-index: 2;
  transition: left 0.3s linear;
  &.collapse {
    left: 0.16rem;
  }
  .tool-detail {
    .item {
      margin-top: 0.08rem !important;
      line-height: 0.18rem !important;
      padding-top: 0.12rem;
      padding-bottom: 0.05rem;
      & + .item {
        &:after {
          top: -0.04rem;
        }
      }
    }
  }
  .map-type {
    .item {
      width: 0.34rem;
      margin-left: 8px;
      cursor: pointer;
      border-radius: 2px;
      position: relative;
      line-height: 0.26rem;
      color: #fff;
      text-align: center;
      & + .item {
        margin-top: 0rem;
        &:after {
          content: "";
          height: 0.01rem;
          width: 80%;
          position: absolute;
          // top: -0.1rem;
          left: 50%;
          top: 0rem;
          transform: translate(-50%, 0);
          background: rgba(255, 255, 255, 0.3);
        }
      }
      /*&:hover > .item-child {*/
      /*  display: block;*/
      /*}*/
    }
    .item:hover,
    .item.active {
      color: #00baff;
    }
    .item.disabled:hover,
    .item.disabled {
      color: #999;
      cursor: default;
    }
    .item1 {
      float: left;
      width: 0.8rem !important;
      height: 0.28rem !important;
      border-right: 1px #5ab0e5 solid;
      text-align: center;
      margin-left: 0px !important;
    }
    .item2 {
      float: left;
      width: 0.8rem !important;
      height: 0.28rem !important;
      border-right: 1px #5ab0e5 solid;
      margin-left: 0px !important;
      text-align: center;
    }
    .item3 {
      float: left;
      width: 1.5rem !important;
      height: 0.28rem !important;
      margin-left: 0px !important;
      border-right: 1px #5ab0e5 solid;
      text-align: center;
    }
    .item4 {
      float: left;
      width: 0.8rem !important;
      height: 0.28rem !important;
      margin-left: 0px !important;
      text-align: center;
    }
    .item1:hover {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .item2:hover {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .item3:hover {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .item4:hover {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .active1 {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .active2 {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .active3 {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .active4 {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
  }
  .item-child {
    transition: left 0.3s linear !important;
    position: fixed;
    left: 4.44rem;
    color: #fff;
    z-index: 9999;
    > div {
      margin-left: 0.24rem;
      padding: 0.12rem 0.25rem;
      border-radius: 4px;
      background-color: rgba(0, 47, 87, 0.9);
      box-shadow: rgb(46, 208, 255, 0.4) 0px 0px 12px inset;
      > div {
        line-height: 0.25rem;
        white-space: nowrap;
        label {
          margin: 0;
          display: inline-block;
          span {
            background-color: rgba(0, 0, 0, 0);
            border: 2px solid #007ce4;
            border-radius: 0;
            display: inline-block;
            height: 0.16rem;
            margin-right: 0.1rem;
            margin-top: -0.02rem;
            vertical-align: middle;
            width: 0.16rem;
            line-height: 1;
          }
          &.active {
            span:after {
              background-color: #1167af;
              border-radius: 0;
              content: "";
              display: inline-block;
              height: 0.08rem;
              margin: 0rem 0.02rem 0.04rem 0.02rem;
              width: 0.08rem;
            }
          }
        }
      }
    }
  }
}
.map-toolbar-box {
  position: absolute;
  padding: 0.05rem 0.06rem;
  margin: 0.1rem 0 0 0;
  background: rgba(0, 0, 0, 0);
  /*box-shadow: 0 0 0 0.02rem rgba(0, 0, 0, 0.1);*/
  /*border:1px #5ab0e5 solid;*/
  border-radius: 6px;
  left: 4.1rem;
  top: 0rem;
  z-index: 2;
  transition: left 0.3s linear;
  &.collapse {
    left: 0.16rem;
  }
  .tool-detail {
    .item {
      margin-top: 0.08rem !important;
      line-height: 0.18rem !important;
      padding-top: 0.12rem;
      padding-bottom: 0.05rem;
      & + .item {
        &:after {
          top: -0.04rem;
        }
      }
    }
  }
  .map-type {
    .item {
      width: 0.34rem;
      margin-left: 8px;
      cursor: pointer;
      border-radius: 2px;
      position: relative;
      line-height: 0.26rem;
      color: #fff;
      text-align: center;
      & + .item {
        margin-top: 0rem;
        &:after {
          content: "";
          height: 0.01rem;
          width: 80%;
          position: absolute;
          // top: -0.1rem;
          left: 50%;
          top: 0rem;
          transform: translate(-50%, 0);
          background: rgba(255, 255, 255, 0.3);
        }
      }
      /*&:hover > .item-child {*/
      /*  display: block;*/
      /*}*/
    }
    .item:hover,
    .item.active {
      color: #00baff;
    }
    .item.disabled:hover,
    .item.disabled {
      color: #999;
      cursor: default;
    }
    .item1 {
      float: left;
      width: 0.8rem !important;
      height: 0.28rem !important;
      border-right: 1px #5ab0e5 solid;
      text-align: center;
      margin-left: 0px !important;
    }
    .item2 {
      float: left;
      width: 0.8rem !important;
      height: 0.28rem !important;
      border-right: 1px #5ab0e5 solid;
      margin-left: 0px !important;
      text-align: center;
    }
    .item3 {
      float: left;
      width: 1.5rem !important;
      height: 0.28rem !important;
      margin-left: 0px !important;
      border-right: 1px #5ab0e5 solid;
      text-align: center;
    }
    .item4 {
      float: left;
      width: 0.8rem !important;
      height: 0.28rem !important;
      margin-left: 0px !important;
      text-align: center;
    }
    .item1:hover {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .item2:hover {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .item3:hover {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .item4:hover {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .active1 {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .active2 {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .active3 {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .active4 {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
  }
  .item-child {
    transition: left 0.3s linear !important;
    position: fixed;
    left: 4.44rem;
    color: #fff;
    z-index: 9999;
    > div {
      margin-left: 0.24rem;
      padding: 0.12rem 0.25rem;
      border-radius: 4px;
      background-color: rgba(0, 47, 87, 0.9);
      box-shadow: rgb(46, 208, 255, 0.4) 0px 0px 12px inset;
      > div {
        line-height: 0.25rem;
        white-space: nowrap;
        label {
          margin: 0;
          display: inline-block;
          span {
            background-color: rgba(0, 0, 0, 0);
            border: 2px solid #007ce4;
            border-radius: 0;
            display: inline-block;
            height: 0.16rem;
            margin-right: 0.1rem;
            margin-top: -0.02rem;
            vertical-align: middle;
            width: 0.16rem;
            line-height: 1;
          }
          &.active {
            span:after {
              background-color: #1167af;
              border-radius: 0;
              content: "";
              display: inline-block;
              height: 0.08rem;
              margin: 0rem 0.02rem 0.04rem 0.02rem;
              width: 0.08rem;
            }
          }
        }
      }
    }
  }
}
.item-child {
  transition: left 0.3s linear !important;
  position: fixed;
  left: 5rem;
  color: #fff;
  z-index: 9999;
  &.collapse {
    left: 0.5rem;
  }
  > div {
    margin-left: 0.24rem;
    padding: 0.12rem 0.25rem;
    border-radius: 4px;
    background-color: rgba(0, 47, 87, 0.9);
    box-shadow: rgb(46, 208, 255, 0.4) 0px 0px 12px inset;
    > div {
      line-height: 0.25rem;
      white-space: nowrap;
      label {
        margin: 0;
        display: inline-block;
        span {
          background-color: rgba(0, 0, 0, 0);
          border: 2px solid #007ce4;
          border-radius: 0;
          display: inline-block;
          height: 0.16rem;
          margin-right: 0.1rem;
          margin-top: -0.02rem;
          vertical-align: middle;
          width: 0.16rem;
          line-height: 1;
        }
        &.active {
          span:after {
            background-color: #1167af;
            border-radius: 0;
            content: "";
            display: inline-block;
            height: 0.08rem;
            margin: 0rem 0.02rem 0.04rem 0.02rem;
            width: 0.08rem;
          }
        }
      }
    }
  }
}
.children_point {
  position: fixed;
  left: -100%;
  top: -100%;
  height: 0.3rem;
  z-index: 999;
}
.children_opacity {
  position: fixed;
  left: -100%;
  top: -100%;
  height: 0.3rem;
  z-index: 999;
}
</style>
