<!--
 * @Author: eds
 * @Date: 2020-07-21 14:49:17
 * @LastEditTime: 2020-09-16 16:21:51
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\BimAnalyse.vue
-->
<template>
  <div class="ThreeDContainer ThreeToTop BimThreeLeft" :style="{ width: '125px' }">
    <div class="bimanalayse tframe">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item class="elformbtns">
              <el-popover placement="top" title="楼层控制" width="300" trigger="click">
                <div class="bim-analyse-tree" v-if="true">
                  <!--整栋楼层门窗显隐-->
                  <el-tree
                    :data="wholeBuildingTreeData"
                    show-checkbox
                    node-key="id"
                    ref="tree1"
                    :default-expanded-keys="['all']"
                    :default-checked-keys="['all']"
                    @check-change="checkChange"
                  />
                  <!--楼层控制树-->
                  <el-tree
                    :check-on-click-node="true"
                    :data="BimTreeData"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    :default-expanded-keys="['all']"
                    :default-checked-keys="['all']"
                    @check="treeHandler"
                  />
                </div>
                <el-button slot="reference">楼层控制</el-button>
              </el-popover>
              <el-button v-show="false" class="elformbtn" @click="closeBimAnalyse"
                >关闭</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { BimSourceURL } from "config/server/mapConfig";
import { queryFloorByBottom } from "./BimAnalyseFloorSection";
import floors from "./floors.json";
import parts from "./parts.json";
const Cesium = window.Cesium;
import { mapGetters, mapActions } from "vuex";
const LAYER_NAME = "Block1";
const DATASOURCE_NAME = "第一栋";
const DATA_SETS = "门@窗@墙@楼板@结构柱@结构框架@梯段@平台"
  .split("@")
  .map((v) => `${DATASOURCE_NAME}:${v}`);
export default {
  name: "BimAnalyse",
  data() {
    return {
      shallTree: false,
      keys: [],
      //这个树节点是楼层控制树节点
      BimTreeData: [
        {
          label: "楼层控制",
          id: 1,
          children: [],
        },
      ],
      //这个树节点是整栋楼的部件显隐
      wholeBuildingTreeData: [
        {
          label: "整栋楼控制",
          id: 1,
          children: [
            // {
            //   label: "门",
            //   id: 2,
            // },
            // {
            //   label: "窗",
            //   id: 3,
            // },
            // {
            //   label: "墙",
            //   id: 4,
            // },
            // {
            //   label: "楼板",
            //   id: 5,
            // },
            // {
            //   label: "结构柱",
            //   id: 6,
            // },
            // {
            //   label: "结构框架",
            //   id: 7,
            // },
            // {
            //   label: "楼梯",
            //   id: 8,
            // },
            // {
            //   label: "平台",
            //   id: 9,
            // },
          ],
        },
      ],
      BimHash: {},
      endID: 0,
      //  floor IDS
      IDS: [],
      FLOOR_ON: false,
      //  cesium Object
      
      handler: undefined,
      lastHouseEntity: undefined,
      //  节流
      count: 0,
      fnScroll: () => {},
    };
  },
  computed: {
    ...mapGetters("map", ["forceBimIDS", "forceBimData"]),
  },
  watch: {
    // BimTreeData: {
    //   handler(n, o) {
    //     n[0].children.length == 1 && (this.shallTree = true);
    //   },
    //   deep: true,
    // },
  },
  created() {
    this.handler = new Cesium.ScreenSpaceEventHandler(window.earth.scene.canvas);
  },
  async mounted() {
    this.initBimScene();
    // this.eventRegsiter();
    this.cameraMove();
  },
  beforeDestroy() {
    this.clearBimAnalyse();
    this.handler.destroy();
  },
  methods: {
    ...mapActions("map", ["SetForceBimData", "SetForceRoomData", "SetForceBimIDS"]),
    // ...mapGetters("map", ["forceBimIDS","forceBimData"]),
    //树节点点击的时候触发的事件
    treeHandler() {
      window.earth.entities.removeAll();
      var ids1 = this.$refs.tree.getCheckedKeys();
      var result = [];
      for (const item of ids1) {
        //这段循环填充result
        if (item > 100) {
          //如果item大于100
          //由于节点里面的item值是101,102,103,104 所以需要除100 对他进行获得层数的操作
          result.push(parseInt(item / 100)); //取层数
          //进行取余 精确获得是第几层的门，第几层的窗···
          switch (item % 100) {
            case 1: //门
              result.push("doors");
              break;
            case 2: //窗
              result.push("windows");
              break;
            case 3: //墙
              result.push("walls");
              break;
            case 4: //地板
              result.push("floors");
              break;
            case 5: //结构柱
              result.push("struct");
              break;
            case 6: //结构框架
              result.push("structframework");
              break;
            case 7: //楼梯
              result.push("stairs");
              break;
            case 8: //平台
              result.push("platform");
              break;
            default:
              break;
          }
        }
      }
      result = [...new Set(result)]; //进行数组的去重
      var IDS = [];
      var floorids = [];
      var partsids = [];
      for (const item of result) {
        if (typeof item == "number") {
          //这里用来进行item的类型判断 如果为number类型
          floors["f" + item].forEach((el) => {
            floorids.push(el);
          });
        } else {
          //如果是string类型
          parts[item].forEach((el) => {
            partsids.push(el);
          });
        }
      }
      //对这个floorids进行数组进行过滤，查找最大的那个数组中包含的小数组的元素取相同的
      IDS = floorids.filter((item) => partsids.indexOf(item) > -1);
      //找到这个楼层
      this.layer = window.earth.scene.layers.find(LAYER_NAME);
      //让此时这个IDS数组里面的部件为true，就可以显示出对应的楼层
      this.layer.setObjsVisible(IDS, true);
    },
    //获取第几层
    getFloors() {
      let floors = [];
      for (let i = 1; i < 19; i++) {
        floors.push({
          label: `第${i}层`,
          id: i,
          children: this.getFloorParts(i),
        });
      }
      this.BimTreeData[0].children = floors;
    },
    //获取到当前节点已经被勾选上的楼层
    doSqlQuery(arr) {
      let IDS = [];
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element > 0 && element < 19) {
          for (const key in floors) {
            floors["f" + element].forEach((item) => {
              IDS.push(item);
            });
          }
        }
      }
      console.log("安置房", IDS);
      this.layer = window.earth.scene.layers.find(LAYER_NAME);
      this.layer.setObjsVisible(IDS, true);
    },
    //直接写死门、窗、户····
    getFloorParts(i) {
      let floors = [
        {
          label: `门`,
          id: i * 100 + 1,
        },
        {
          label: `窗`,
          id: i * 100 + 2,
        },
        {
          label: `墙`,
          id: i * 100 + 3,
        },
        {
          label: `楼板`,
          id: i * 100 + 4,
        },
        {
          label: `结构柱`,
          id: i * 100 + 5,
        },
        {
          label: `结构框架`,
          id: i * 100 + 6,
        },
        {
          label: `梯段`,
          id: i * 100 + 7,
        },
        {
          label: `平台`,
          id: i * 100 + 8,
        },
      ];
      return floors;
    },
    fnThrottle(fn, delay, atleast) {
      //节流函数
      let timer = null;
      let previous = null;
      return function () {
        let now = +new Date();
        if (!previous) previous = now;
        if (atleast && now - previous > atleast) {
          fn();
          previous = now;
          clearTimeout(timer);
        } else {
          clearTimeout(timer);
          timer = setTimeout(() => {
            fn();
            previous = null;
          }, delay);
        }
      };
    },
    //  事件绑定
    eventRegsiter() {
      console.log("调用成功");
      const that = this;
      this.$bus.$off("cesium-3d-floorDIS");
      this.$bus.$on("cesium-3d-floorDIS", (value) => {
        const layer = window.earth.scene.layers.find(LAYER_NAME);
        if (value) {
          layer.setObjsVisible(this.forceBimIDS, true);
        } else {
          const IDS = [];
          const endID = this.endID;
          for (let i = 0; i < endID + 1; i++) {
            IDS.push(i);
          }
          layer.setObjsVisible(IDS, true);
        }
      });
      let position = window.position;
      !position && (position = Cesium.Cartesian3.fromDegrees(0, 0, 0));
      const cartographic = Cesium.Cartographic.fromCartesian(position);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      const height = cartographic.height;
      that.bindDataSQL({ x: longitude, y: latitude, z: height });
    },
    //  相机移动
    cameraMove() {
      window.earth.scene.camera.setView({
        destination: {
          x: -2875539.090787695,
          y: 4842735.556374235,
          z: 2993566.8100139066,
        },
        orientation: {
          heading: 0.00000410168472608774,
          pitch: -0.5655332606839059,
          roll: 0,
        },
      });
    },
    //  初始化BIM场景
    initBimScene(fn) {
      const _LAYER_ = window.earth.scene.layers.find(LAYER_NAME);
      if (_LAYER_) {
        _LAYER_.visible = true;
        window.earth.scene.layers.find("Block2").visible = true;
        window.earth.scene.layers.find("Block3").visible = true;
        window.earth.scene.layers.find("Block4").visible = true;
      } else {
        const { SCENE_URL, SCENE_DATA_URL } = BimSourceURL;
        const promise1 = window.earth.scene.addS3MTilesLayerByScp(
          `http://172.20.83.223:8098/iserver/services/3D-Placement_house/rest/realspace/datas/Block2/config`,
          { name: "Block2" }
        );
        const promise2 = window.earth.scene.addS3MTilesLayerByScp(
          `http://172.20.83.223:8098/iserver/services/3D-Placement_house/rest/realspace/datas/Block3/config`,
          { name: "Block3" }
        );
        const promise3 = window.earth.scene.addS3MTilesLayerByScp(
          `http://172.20.83.223:8098/iserver/services/3D-Placement_house/rest/realspace/datas/Block4/config`,
          { name: "Block4" }
        );
        const promise = window.earth.scene.addS3MTilesLayerByScp(
          `${SCENE_URL}/datas/${LAYER_NAME}/config`,
          { name: LAYER_NAME }
        );
        Cesium.when(promise, async (layers) => {
          const layer = window.earth.scene.layers.find(LAYER_NAME);
          layer.setQueryParameter({
            url: SCENE_DATA_URL,
            dataSourceName: "第一栋",
            isMerge: true,
          });
          const color = new Cesium.Color.fromCssColorString("rgba(23,92,239,0.3)");
          layer.selectedColor = color;
          layer.datasetInfo().then((result) => {
            console.log("result", result);
            const bimHash = {};
            let endID = 0;
            this.keys = [...this.keys, ...result.map((v) => v.datasetName)];
            this.getFloors();
            this.wholeBuildingTreeData[0].children.push({
              id: 0, //DATASOURCE_NAME,
              label: "第1栋", //DATASOURCE_NAME,
              children: result.map((v, index) => {
                bimHash[v.datasetName] = v.startID;
                endID = endID <= v.endID ? v.endID : endID;
                return {
                  id: `${DATASOURCE_NAME}_${index}`,
                  label: v.datasetName,
                  startID: v.startID,
                  endID: v.endID,
                };
              }),
            });
            this.endID = endID;
            this.bimHash = bimHash;
            //console.log(bimHash);
          });
        });
      }
    },
    //  属性表SQL查询（三维每）
    bindDataSQL({ x, y, z }) {
      console.log("sql", x, y, z);
      const that = this;
      const { SCENE_SQL_URL } = BimSourceURL;
      $.ajax({
        type: "post",
        url: SCENE_SQL_URL,
        data: JSON.stringify({
          getFeatureMode: "SPATIAL",
          spatialQueryMode: "INTERSECT",
          datasetNames: ["Block_2D:Block1_2D"],
          geometry: {
            id: 0,
            parts: [1],
            points: [{ x, y }],
            type: "POINT",
          },
        }),
        success: (result) => {
          console.log("安置房贴图查询成功",result);
          //console.log("result",JSON.parse(result).features)
          that.onQueryComplete(JSON.parse(result).features, z);
        },
        error: (msg) => {
          console.log("安置房贴图查询失败", msg);
        },
      });
    },
    //  楼层贴皮
    onQueryComplete(features, height) {
      console.log("贴片", features);
      const layer = window.earth.scene.layers.find(LAYER_NAME);
      if (this.lastHouseEntity) {
        window.earth.entities.remove(this.lastHouseEntity);
        this.lastHouseEntity = null;
        this.SetForceRoomData([]);
      }
      var louceng = "";
      for (let i = 0; i < window.a.length; i++) {
        if (window.a[i].k == "所属楼层") {
          louceng = window.a[i].v;
        }
      }
      console.log("所属楼层", louceng);
      const selectedFloors = features.filter(({ fieldNames, fieldValues }) => {
        // const BOTTOM = fieldNames.indexOf("BOTTOM");
        const LSG = fieldNames.indexOf("LSG");
        // const isTheFloor =
        //   BOTTOM > -1 &&
        //   LSG > -1 &&
        //   parseFloat(fieldValues[BOTTOM]) <= height &&
        //   parseFloat(fieldValues[BOTTOM]) + parseFloat(fieldValues[LSG]) >=
        //     height;
        const longFloor = fieldNames.indexOf("所属楼层");
        console.log("楼层", longFloor);
        const isTheFloor = fieldValues[longFloor] == louceng && LSG > -1;
        return isTheFloor;
      });
      const selectedFeature = selectedFloors.length ? selectedFloors[0] : null;
      if (
        !selectedFeature ||
        !selectedFeature.geometry ||
        !selectedFeature.geometry.points
      )
        return;
      var bottomHeight = Number(
        selectedFeature.fieldValues[selectedFeature.fieldNames.indexOf("BOTTOM")]
      );
      var extrudeHeight = Number(
        selectedFeature.fieldValues[selectedFeature.fieldNames.indexOf("LSG")]
      ); // 层高（拉伸高度）
      //  获取该楼层所有ids
      console.log(" this.bimHash", this.bimHash);
      queryFloorByBottom(
        this,
        //Math.floor(bottomHeight / extrudeHeight) + "F",
        louceng,
        // "7F",
        this.bimHash,
        layer
      );
      Cesium.GroundPrimitive.bottomAltitude = bottomHeight;
      Cesium.GroundPrimitive.extrudeHeight = extrudeHeight;
      var points3D = [];
      for (var pt of selectedFeature.geometry.points) {
        points3D.push(pt.x, pt.y);
      }
      this.lastHouseEntity = window.earth.entities.add({
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(points3D),
          material: new Cesium.Color(223 / 255, 199 / 255, 0 / 255, 0.4),
        },
        clampToS3M: true, // 贴在S3M模型表面
      });
      this.SetForceRoomData(
        selectedFeature.fieldNames.map((k, i) => {
          return { k, v: selectedFeature.fieldValues[i] };
        })
      );
    },
    //  树结构改变
    checkChange(...params) {
      window.earth.entities.removeAll();
      const array = [];
      const nodes = this.$refs.tree1
        .getCheckedNodes()
        .filter((v) => !v.children)
        .map((v) => {
          for (let i = v.startID; i < v.endID + 1; i++) {
            array.push(i);
          }
        });
      const layer = window.earth.scene.layers.find(LAYER_NAME);
      this.fnThrottle(layer.setObjsVisible(array, true), 1000);
    },
    //  关闭BIM分析模块
    closeBimAnalyse() {
      this.clearBimAnalyse();
      this.$bus.$emit("cesium-3d-event", { value: null });
    },
    //  清除BIM模块
    clearBimAnalyse() {
      console.log("调用安置房");
      console.log(window.earth.scene.layers);
      window.earth.scene.layers.find(LAYER_NAME).visible = false;
      window.earth.scene.layers.find("Block2").visible = false;
      window.earth.scene.layers.find("Block3").visible = false;
      window.earth.scene.layers.find("Block4").visible = false;
    },
    //  关闭详情框
    closeBimFrame() {
      this.SetForceBimData([]);
      this.SetForceRoomData([]);
      this.SetForceBimIDS([]);
    },
  },
};
</script>
