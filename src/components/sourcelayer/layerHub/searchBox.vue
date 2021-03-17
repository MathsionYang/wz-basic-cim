<!--
 * @Author: eds
 * @Date: 2020-07-07 10:57:45
 * @LastEditTime: 2020-09-15 11:07:30
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\treeTool\searchBox.vue
-->
<template>
  <div>
    <div class="search-box" v-show="searchBoxVisible">
      <!-- <img src="/static/images/mode-ico/资源选择_未选中.png" class="ziyuan"/>
     <img src="/static/images/mode-ico/图层控制_未选中.png"/> -->
      <div
        class="ziyuan"
        :class="{ active: layerclick == true }"
        @click="layerclicks()"
      ></div>
      <div
        class="tuceng"
        :class="{ active: layerclick == false }"
        @click="layerclicks()"
      ></div>
      <div class="zst"></div>

      <div class="searchHeader" v-show="layerclick == true">
        <el-input
          v-model="searchText"
          class="searchFilterInput"
          :placeholder="`附近的${forceTrueTopicLabelId}有哪些？`"
          size="small"
          @keyup.enter.native="searchFilter"
        />
        <div class="button-container">
          <div class="button-item">
            <i class="icon-common icon-clear" @click="searchClear"></i>
          </div>
          <div class="button-item">
            <i class="icon-common icon-search" @click="searchFilter"></i>
          </div>
        </div>
      </div>
      <div
        class="result-wrapper"
        v-show="searchBoxResult && layerclick == true"
      >
        <ul class="result-list">
          <li
            class="result-item"
            :class="{
              checked: ~hospitalChecked.indexOf(i),
            }"
            v-for="(item, i) in extraSearchList"
            :key="`sitem-${i}`"
          >
            <div class="left">
              <div class="address">
                <!-- <i class="icon-position"></i> -->
                <span>{{i+1}}.</span>
                <p class="name">
                  {{ item.name }}
                </p>
              </div>
            </div>
            <div class="right">
              <input
                type="checkbox"
                :checked="hospitalChecked.indexOf(i) >= 0"
                @click="checkedOne(item,i)"
              />
            </div>
          </li>
        </ul>
      </div>
      <div class="layerTreeContainer" v-show="!layerclick">
        <el-tree
          ref="tree"
          :data="layerdata"
          show-checkbox
          node-key="id"
          :default-checked-keys="checkedkeys"
          :filter-node-method="filterNode"
          default-expand-all
          @check-change="checkChange"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="tulibackground" v-show="checkedkeys != ''">
      <div class="bjs">
        <div v-for="(item, i) in checkedkeys" :key="i">
          <img :src="'/static/images/map-ico/' + item + '.png'" class="imgs" />
          <label class="labels">{{ item }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { treeDrawTool, fixTreeWithExtra } from "./TreeDrawTool";
import { getIserverFields } from "api/iServerAPI";
import {
  CESIUM_TREE_OPTION,
  CESIUM_TREE_EXTRA_DATA,
} from "config/server/sourceTreeOption";
const Cesium = window.Cesium;

export default {
  name: "searchBox",
  data() {
    return {
      searchBoxVisible: false,
      searchBoxResult: true,
      searchText: "",
      forceNode: {},
      extraSearchList: [],
      hospitalChecked: [],
      menuImg: "/static/images/common/menu-un.png",
      menuSelImg: "/static/images/common/menu-sel.png",
      layerclick: true,
      layerdata: [],
      checkedkeys: [],
    };
  },
  computed: {
    ...mapGetters("map", [...CESIUM_TREE_EXTRA_DATA, "forceTrueTopicLabelId"]),
  },
  async mounted() {
    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {
      /**
       * 事件传递打开对应专题图层
       */
      this.$bus.$off("cesium-3d-switch-searchBox");
      this.$bus.$on("cesium-3d-switch-searchBox", ({ shall, node }) => {
        this.searchClear();
        this.searchBoxVisible = shall;
        this.forceNode = node || {};
        shall ? this.searchFilter() : undefined;
        this.layerdata = window.layersdata;
        console.log('layerdata', this.layerdata)
        this.checkedkeys = window.checkedkey;
        console.log("checkedkeys", this.checkedkeys);
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.checkedkeys); //
        });
      });
    },
    toogleVisible() {
      this.searchBoxResult = !this.searchBoxResult;
    },
    filterNode(value, data) {
      return !value ? true : data.label.indexOf(value) !== -1;
    },
    checkChange(node, checked, c) {
      if (checked) {
        if (node.children == undefined) {
          if (window.checkedkey.indexOf(node.id) == -1) {
            //添加对应图例
            window.checkedkey.push(node.id);
            this.checkedkeys = window.checkedkey;
            this.$nextTick(() => {
              this.$refs.tree.setCheckedKeys(this.checkedkeys); 
            });
            //显示对应图层
            window.billboardMap[node.id]._billboards.map(
              (v) => (v.show = true)
            );
            window.labelMap[node.id].setAllLabelsVisible(true);
          }
        }
      } else {
        if (node.children == undefined) {
          //删除对应图例
          for (var i = 0; i < window.checkedkey.length; i++) {
            if (window.checkedkey[i] == node.id) {
              window.checkedkey.splice(i, 1);
            }
          }
          this.checkedkeys = window.checkedkey;
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(this.checkedkeys);
          });
          //隐藏对应图层
          window.billboardMap[node.id]._billboards.map((v) => (v.show = false));
          window.labelMap[node.id].setAllLabelsVisible(false);
        }
      }
    },
    layerclicks() {
      this.layerclick = !this.layerclick;
    },
    searchClear() {
      this.searchText = "";
      this.extraSearchList = [];
      this.hospitalChecked = [];
      this.searchFilter();
    },
    searchFilter() {
      if (!this.searchBoxVisible) return;
      const featureMap = window.featureMap[this.forceNode.id];
      // const withExtraData = this[this.forceNode.withExtraData];
      const allSearchList = [];
      for (let key in featureMap) {
        const item = window.featureMap[this.forceNode.id][key];
        allSearchList.push(item);
      }
      this.extraSearchList = this.searchText
        ? allSearchList.filter((item) => ~item.name.indexOf(this.searchText))
        : allSearchList;
      //this.layerdata = window.layersdata;
      //console.log("aaa", this.layerdata);
    },
    checkedOne(item,i) {
      this.$bus.$emit("cesium-3d-detail-pop-clear");
      let idIndex = this.hospitalChecked.indexOf(item.name);
      if (idIndex >= 0) {
        // 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
        this.hospitalChecked.splice(idIndex, 1);
      } else {
        // 选中该checkbox
        this.hospitalChecked = [];
        this.hospitalChecked.push(i);
        // 移动到对应实例位置
        const { x, y } = item.geometry;
        window.earth.camera.flyTo({
          // window.earth.scene.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(x, y - 0.005, 450),
          orientation: {
            heading: 0.003336768850279448,
            pitch: -0.5808830390057418,
            roll: 0.0,
          },
          maximumHeight: 450,
        });
      }
    },
  },
};
</script>

<style lang="less">
@import url("./searchBox.less");
</style>
