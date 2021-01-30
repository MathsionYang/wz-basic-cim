<template>
  <div class="page-map">
    <MapCenterBtn
      ref="mapCenterBtn"
      class="no-print"
      @setMapTollBar="setMapTollBar"
      :currentBaseMapType="currentBaseMapType"
    ></MapCenterBtn>
    <div class="cesium-map" v-if="currentMapType == 'cesiumMap'">
      <CesiumMap />
    </div>
  </div>
</template>
<script>
import MapCenterBtn from "./modules/map-center-btn/map-center-btn";
import CesiumMap from "components/map-view/cesium_map";
import { mapGetters, mapActions } from "vuex";
import { uuid } from "common/js/util";

export default {
  name: "Map",
  data() {
    return {
      treeSearchValue: "", // 树的搜索值
      treeChecked: {}, // 点击左侧树的数据
      collapse2First: false,
      tableNum: 0, // 表格的搜索条数
      mapTollBar: {}, // 地图按钮操作
      tableSearchValue: "", // 表格的搜索值
      onePoint: {}, // 一个企业的数据
      exactQuery: { key: "", value: "" }, // 表格精确查询
      exactBarQuery: { key: "", value: "" }, // 表格精确查询
      exactScreen: { key: "", value: "" },
      spaceDataValue: [], // 空间查询的数据
      aroundDataValue: [], // 周边分析的数据
      kmAround: { km: 1000, data: "all" }, // 周边分析的选择框
      isCloseSpace: {
        data: true,
        t: "0",
      },
      timer: true,
      currentBaseMapType: "",
      isShowTableBtn: false, // 是否显示详细表格
      firstShowLoading: true, // 第一次显示loading
      isShowSearch: true,
    };
  },
  // mixins: [loading],
  computed: {
    ...mapGetters("map", [
      "tree", // 左侧的树
      "currentMapType", // 地图类型
      "treeCheckedList", // 所有的页签
      "typeIndex", // 页签下标
      "collapse1", // 是否折叠
      "collapse2", // 是否折叠
      "currentOnePoint",
    ]),
  },
  mounted() {
    window.onresize = () => {
      if (this.timer) {
        this.timer = false;
      }
    };
  },
  methods: {
    print() {
      window.print();
    },
    closeLoading() {
      this.$refs.checkItem.isLoading = false;
    },
    changeTitleBtn(bool) {
      this.isShowTableBtn = bool;
      if (bool) {
        this.$refs.mapTableFull.isSmall = false;
        this.$refs.mapTableFull.$refs.wrapper.style = null;
      }
    },
    clearCurrentTableRow() {
      this.$refs.mapTable.clearCurrentTableRow();
    },
    baseMapType(data) {
      this.currentBaseMapType = data;
    },
    // 设置新的onePoint
    setonePoint(data) {
      const upperCaseObj = JSON.parse(JSON.stringify(data));
      const lowerCaseObj = {};
      for (const i in upperCaseObj) {
        lowerCaseObj[i.toLowerCase()] = upperCaseObj[i];
      }
      this.onePoint = lowerCaseObj;
    },
    clearAround() {
      this.$refs.around.allData = [];
    },
    // 周边分析的距离改变
    aroundSelectChange(data) {
      this.kmAround = data;
    },
    // 关闭空间查询
    closeSpace(data) {
      this.isCloseSpace = {
        data: data,
        t: uuid(),
      };
    },
    // 空间查询的数据
    spaceData(data) {
      this.spaceDataValue = data.mapData.features;
      this.$refs.space.show();
      this.$refs.around.close();
    },
    //  echart图表被点击之后 传值给表格
    echartClick(data) {
      this.exactQuery = data;
      this.$refs.tableSearch.clear();
    },
    echartBarClick(data) {
      if (data.key == "district") {
        this.exactQuery = data; //主要控制遮盖面的显示
      } else {
        this.exactScreen = data; //除筛选区域外设施点的显示
        this.exactQuery = data;
      }
      this.exactBarQuery = data;
      this.$refs.tableSearch.clear();
    },
    // 设置表格数据的总数
    setTableCount(count) {
      // 判断是不是数组  简单判断了
      if (typeof count === "object") {
        this.tableNum = count[0];
      } else {
        this.tableNum = count;
      }
    },
    // 点击地图按钮的操作传值给地图
    setMapTollBar(obj) {
      this.mapTollBar = obj;
    },
    // 设置tree的搜索值
    treeSearch(value) {
      this.treeSearchValue = value;
    },
    // 设置所有选中的tree数据
    treeCheckedItem(res) {
      const data = JSON.parse(JSON.stringify(res));
      if (this.firstShowLoading) {
        this.firstShowLoading = false;
      } else {
        if (data.checked) {
          // this.$refs.checkItem.isLoading = true
        }
      }
      if (!data.checked) {
        // 删除
        this.DeleteTreeCheckedList(data);
        if (this.treeCheckedList.length === 0) {
          this.changeCollapse2(true);
          this.$refs.baseMap.smallLegend();
        }
        data.allCheckData = [...this.treeCheckedList];
        this.treeChecked = data;
      } else {
        // 增加
        // var allData = this.$refs.tree.getTreeCheckNodes()
        // allData = allData.filter(item => item.level - 0 === 3)
        // data.allCheckData = allData
        // data.allCheckData = this.quchong(data.allCheckData, this.treeCheckedList)
        if (data.level - 0 === 3) {
          data.allCheckData = this.quchong([data], this.treeCheckedList);
          this.treeChecked = data; // 传给给地图拿数据
        } else if (data.level - 0 === 2) {
          data.allCheckData = this.quchong(data.children, this.treeCheckedList);
          this.treeChecked = data; // 传给给地图拿数据
        }
        this.SetTreeCheckedList(data); // 添加页签
      }
      // 是否展开右侧的判断
      if (!this.collapse2First) {
        this.collapse2First = !this.collapse2First;
      } else {
        if (res.checked) {
          this.changeCollapse2(false);
        }
      }
      if (this.$refs.enterprise) {
        this.$refs.enterprise.close();
      }
      this.$refs.tree.rollBack();
      this.$refs.tree.initTreeHeight();
    },
    changeCollapse1(data) {
      this.SetCollapse1(data);
    },
    changeCollapse2(data) {
      this.SetCollapse2(data);
      if (data && this.$refs.enterprise) {
        this.$refs.enterprise.close();
      }
    },
    // 清除地图所有数据 包括页签
    clearALL() {
      this.$refs.around.allClose();
      this.$refs.space.close();
      this.collapse2First = false;
      this.$refs.baseMap.closeLegend();
      this.DeleteTreeCheckedList();
      this.SetTypeIndex(0);
      this.changeCollapse2(true);
      this.$refs.tree.clearCheck();
      this.$refs.baseMap.smallLegend();
    },
    // 显示某个企业
    showEnterprise() {
      if (this.$refs.enterprise) {
        this.$refs.enterprise.show();
      }
    },
    showEnterprise2() {
      if (this.$refs.enterprise) {
        this.$refs.enterprise.show(true);
      }
    },
    // 显示周边分析
    aroundData(data) {
      if (this.$refs.around) {
        this.aroundDataValue = data.mapData.features;
        this.$refs.around.show();
        this.$refs.space.close();
        this.$refs.around.selectValue = data.distance;
      }
    },
    // 页签被点击之后
    itemClick(index) {
      this.SetCollapse2(false);
      if (this.$refs.enterprise) {
        this.$refs.enterprise.close();
      }
      // if (this.treeCheckedList[index] && !this.treeCheckedList[index].allCheckData) {
      var allData = this.$refs.tree.getTreeCheckNodes();
      allData = allData.filter((item) => item.level - 0 === 3);
      const dtreeCheckedList = JSON.parse(JSON.stringify(this.treeCheckedList[index]));
      dtreeCheckedList.allCheckData = this.quchong(allData, this.treeCheckedList);
      // }
      dtreeCheckedList.noAddMapPoint = true; // 不让地图刷新点
      this.treeChecked = dtreeCheckedList;
      this.tableSearchValue = "";
      this.exactQuery = {
        key: "",
        value: "",
      };
      this.exactbarQuery = {
        key: "",
        value: "",
      };
    },
    quchong(arr1, arr2) {
      const jsonArr = arr1.slice();
      const jsonArr2 = arr2.slice();
      let length1 = jsonArr.length;
      const length2 = jsonArr2.length;
      for (let i = 0; i < length1; i++) {
        for (let j = 0; j < length2; j++) {
          // 判断添加的数组是否为空了
          if (jsonArr.length > 0) {
            if (!jsonArr[i] || !jsonArr2[j]) {
              i = length1;
              j = length2;
              continue;
            }
            if (jsonArr[i]["key"] === jsonArr2[j]["key"]) {
              jsonArr.splice(i, 1); // 利用splice函数删除元素，从第i个位置，截取长度为1的元素
              length1--;
            }
          }
        }
      }
      for (let n = 0; n < jsonArr2.length; n++) {
        jsonArr.push(jsonArr2[n]);
      }
      return jsonArr;
    },
    // 页签删除
    delItem(data) {
      this.treeChecked = data;
      var allData = this.$refs.tree.getTreeCheckNodes();
      const keyArr = [data.key];
      if (data.children) {
        data.children.forEach((item) => {
          keyArr.push(item.key);
        });
      }
      allData = allData.filter((item) => {
        return item.level - 0 >= 3 && keyArr.indexOf(item.key) === -1;
      });
      this.$refs.tree.setCheckedNodes(allData);
      this.treeCheckedItem(data);
    },
    // 设置企业个数
    getTableNum(num) {
      this.tableNum = num;
    },
    // 表格的搜索值
    tableSearch(value) {
      this.tableSearchValue = value;
    },
    // 表格行被点击之后
    tableRowClick(data) {
      const obj = {};
      for (const i in data) {
        obj[i.toLowerCase()] = data[i];
      }
      obj.goToCenter = true;
      this.onePoint = obj;
      // if (obj.latitude) {
      //   this.showEnterprise()
      //   this.$refs.enterprise.show()
      // }
    },
    ...mapActions("map", [
      "SetTree",
      "SetCollapse1",
      "SetCollapse2",
      "SetTreeCheckedList",
      "DeleteTreeCheckedList",
      "SetTypeIndex",
    ]),
    ...mapActions(["SetResize"]),
  },
  components: {
    MapCenterBtn,
    CesiumMap,
  },
  watch: {
    timer() {
      if (!this.timer) {
        setTimeout(() => {
          this.timer = !this.timer;
          this.SetResize({
            width: document.body.offsetWidth,
            height: document.body.offsetHeight,
          });
        }, 300);
      }
    },
  },
};
</script>
<style scoped lang="less">
.print {
  position: fixed;
  top: 0.58rem;
  right: 4rem;
  z-index: 1;
  width: 0.3rem;
  height: 0.3rem;
  display: block;
  border: 1px solid #5ab0e5;
  border-radius: 6px;
  background: #03315a;
  font-style: normal;
  transition: all 0.3s linear;
  cursor: pointer;
  > span {
    display: block;
    width: 0.26rem;
    height: 0.26rem;
    .bg-image("./images/print");
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  &.collapse {
    right: 0.14rem;
  }
}
.page-map {
  .map {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    .cover-map {
      width: 100%;
      height: 100%;
    }
  }
  .cesium-map {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: "#204f77";
  }
  .InternetThings {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: "#162445";
  }
  .box {
    z-index: 2;
  }
  .tree {
    overflow: auto;
  }
}
.right-title {
  text-align: center;
  color: @color-text;
  margin-bottom: 0.05rem;
  height: 0.3rem;
  line-height: 0.3rem;
  font-size: 0.2rem;
  margin-top: -0.1rem;
  font-family: "黑体";
}
.statistics {
  height: 50%;
  position: relative;
  /*&:before {
      content: '';
      display: block;
      width: 3.8rem;
      height: 0.04rem;
      position: absolute;
      right: 50%;
      bottom: 0;
      transform: translate(50%, 0);
      .bg-image('./modules/map-box/images/line');
    }
    &:after {
      content: '';
      display: block;
      width: 3.8rem;
      height: 0.04rem;
      position: absolute;
      left: -0.1rem;
      bottom: 0;
      .bg-image('./modules/map-box/images/line');
      transform-origin: left bottom;
      transform: rotate(-90deg);
    }*/
}
.details {
  height: 50%;
  padding-top: 0.2rem;
}
.title-btn-wrapper {
  width: 0.34rem;
  height: 0.34rem;
  position: relative;
  > img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.26rem;
    height: 0.26rem;
    cursor: pointer;
  }
}
// 地图标志按钮
/deep/ .mapboxgl-ctrl-bottom-left {
  z-index: 0;
  left: 4rem;
  bottom: 0.5rem;
  transition: left 0.3s linear;
}
/deep/ .mapboxgl-ctrl-scale {
  background: rgba(0, 0, 0, 0.4);
  border: none;
  color: #fff;
  float: left;
}
/deep/ .mapboxgl-ctrl-lngLat {
  background: rgba(0, 0, 0, 0.4);
  border: none;
  color: #fff;
  margin: 0 0 10px 10px;
  float: none;
  display: inline-block;
  padding: 0 5px;
}
.map.collapse {
  /deep/ .mapboxgl-ctrl-bottom-left {
    left: 0.04rem;
  }
}
// 隐藏地图自己的按钮
/deep/ .mapboxgl-ctrl-top-left {
  left: 4.1rem !important;
  top: 1rem !important;
  visibility: hidden;
}
// 修改地图poptip样式
/deep/ .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip,
/deep/ .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip,
/deep/ .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip {
  border-top-color: rgba(3, 67, 106, 0.9);
}
/deep/ .mapboxgl-popup-anchor-top .mapboxgl-popup-tip,
/deep/ .mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip,
/deep/ .mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip {
  border-bottom-color: rgba(3, 67, 106, 0.9);
}
/deep/ .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
  border-right-color: rgba(3, 67, 106, 0.9);
}
/deep/ .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
  border-left-color: rgba(3, 67, 106, 0.9);
}
/deep/ .mapboxgl-popup-content {
  background: rgba(3, 67, 106, 0.9);
  color: #fff;
}
/deep/ .mapboxgl-popup {
  top: -0.14rem;
  min-width: 1.5rem;
  max-width: 3.5rem !important;
}
/deep/ .mapboxgl-popup-close-button {
  right: 0.05rem;
  z-index: 1;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0;
  position: absolute;
  top: 0.1rem;
  width: 0.2rem;
  height: 0.2rem;
  display: block;
  .bg-image("./images/zoom-in");
  transform: rotate(-45deg);
  transition: all 0.1s linear;
  outline: none;
  text-indent: -9999rem;
  &:hover {
    transform: rotate(45deg);
  }
}
@media print {
  .no-print {
    display: none;
  }
  /deep/ .is-print {
    .legend-box {
      right: 0.14rem !important;
      .panel-body {
        /*max-height: calc(50vh - 0.3rem) !important;*/
        overflow: hidden;
      }
      .isSmall {
        display: none !important;
      }
    }
    .mapboxgl-ctrl-bottom-left {
      left: 0.04rem !important;
      bottom: 0.05rem;
    }
    .search-body,
    .longitudeSearch,
    .mapboxgl-ctrl-lngLat {
      display: none !important;
    }
    .slider-wrapper,
    .toCenterRight,
    .closeMap {
      display: none;
    }
    #base-map {
      background: transparent !important;
      canvas {
        display: none;
      }
    }
  }
}
</style>
