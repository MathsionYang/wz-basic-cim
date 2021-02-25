<!--
 * @Author: eds
 * @Date: 2020-08-20 18:52:41
 * @LastEditTime: 2020-09-15 11:01:20
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\cesium_map.vue
-->
<template>
  <div class="cesiumContainer">
    <div id="cesiumContainer" />
    <!-- 气泡框 -->
    <div class="popup-groups">
      <BayonetPopup ref="bayonetPopup" />
      <TourPointPopup ref="tourPointPopup" />
      <MedicalPopup ref="medicalPopup" />
      <DetailPopup ref="detailPopup" />
      <StationPopup ref="stationPopup" />
    </div>
    <!-- 城市各类指标 -->
    <CityIndex ref="totalTarget" />
    <!-- 搜索框 -->
    <div v-show="true"><SearchBox ref="searchBox" /></div>
    <!-- 模块切换 -->
    <LayerHub ref="layerHub" v-if="initDataLoaded" />
    <!-- 时间转盘 -->
    <Roulette />
    <!-- 功能组件 -->
    <div v-if="mapLoaded && validated">
      <DetailedModel v-if="showSubFrame == '3d1'" />
      <!-- <CesiumMapVideo v-if="showSubFrame == '3d1'" /> -->
      <Overview ref="overview" v-if="showSubHubFrame == '3d1'" />
      <TrafficSubwayModel
        ref="trafficSubwayModel"
        v-if="showgdFrame == '3d4'"
      />
      <BJSWQModel ref="bjswqmodel" v-if="showqxsyFrame == '3d5'" />
      <BJJM ref="bjjm" v-if="showjzFrame == '3d6'" />
      <CivilizationCenter
        ref="civilizationcenter"
        v-if="showsmzxFrame == '3d11'"
      />
      <KgBoxAnalyse ref="kgboxanalyse" v-if="showKgFrame == '3d12'" />
      <Chaogc ref="Chaogc" v-if="showcgcFrame == '3d14'" />
      <Gxgl ref="gxgl" v-if="showgxFrame == '3d15'" />
      <Dxkj ref="dxkj" v-if="showdxFrame == '3d16'" />
      <WZDem v-if="showDem == '3d17'" />
      <SZgc v-if="showSZGC == '3d18'" />
      <JYmx v-if="showJYmx == '3d19'" />

      <CesiumMapTool ref="cesiummaptool" v-if="showSubTool == '长度测量'" />
      <VisualizationAnalyse
        ref="visualizationanalyse"
        v-if="showSubTool == '视野分析'"
      />
      <Sightline ref="sightline" v-if="showSubTool == '通视分析'" />
      <TJXline ref="tjxline" v-if="showSubTool == '天际线分析'" />
      <RZFx ref="rzfx" v-if="showSubTool == '日照分析'" />
      <Pq ref="pq" v-if="showSubTool == '剖切'" />

      <VideoCircle ref="videoCircle" />
      <RoadLine ref="roadline" />
      <InfoFrame ref="infoframe" v-show="isInfoFrame" />
      <BIMinfoFrame ref="biminfoFrame" />
      <AroundSourceAnalyse ref="aroundSourceAnalyse" />
      <div v-show="true">
        <RtmpVideo />
        <Population />
      </div>
    </div>
    <AuthFailPopup ref="authFailPopup" v-if="authFailshallPop" />
  </div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
// import CesiumMapVideo from "components/sourcelayer/extraModel/CesiumMapVideo/CesiumMapVideo";
import LayerHub from "components/sourcelayer/layerHub/layerHub";
import SearchBox from "components/sourcelayer/layerHub/searchBox";
import CityIndex from "components/sourcelayer/CityIndex/index";
import Roulette from "components/sourcelayer/roulette/roulette";
import DetailedModel from "components/sourcelayer/extraModel/Models/DetailedModel";
import AroundSourceAnalyse from "components/sourcelayer/extraModel/AroundSourceAnalyse/AroundSourceAnalyse";
import TrafficSubwayModel from "components/sourcelayer/extraModel/Models/TrafficSubwayModel";
import BJSWQModel from "components/sourcelayer/extraModel/Models/BjswqModel.vue";
import BJJM from "components/sourcelayer/extraModel/Models/BJJM";
import Dxkj from "components/sourcelayer/extraModel/Models/Dxkj";
import WZDem from "components/sourcelayer/extraModel/Models/WzDem";
import SZgc from "components/sourcelayer/extraModel/Models/SZgc";
import JYmx from "components/sourcelayer/extraModel/Models/JYmx";
import KgBoxAnalyse from "components/sourcelayer/extraModel/Models/KgBoxAnalyse";
import InfoFrame from "components/sourcelayer/commonFrame/InfoFrame/InfoFrame";
import MedicalPopup from "components/sourcelayer/commonFrame/Popups/medicalPopup";
import BayonetPopup from "components/sourcelayer/commonFrame/Popups/bayonetPopup";
import StationPopup from "components/sourcelayer/commonFrame/Popups/stationPopup";
import DetailPopup from "components/sourcelayer/commonFrame/Popups/DetailPopup";
import TourPointPopup from "components/sourcelayer/commonFrame/Popups/tourPointPopup";
import RtmpVideo from "components/sourcelayer/extraModel/RtmpVideo/RtmpVideo";
import Population from "components/sourcelayer/extraModel/Population/Population";
import RoadLine from "components/sourcelayer/extraModel/PolylineTrailLink/RoadLine";
import VideoCircle from "components/sourcelayer/commonFrame/postMessage/videoCircle";
import AuthFailPopup from "components/sourcelayer/commonFrame/AuthFailPopup/AuthFailPopup";
import Overview from "components/sourcelayer/extraModel/Overview/Overview.vue";

import CesiumMapTool from "components/map-view/basicTools/CesiumMapTool";
import Sightline from "components/map-view/basicTools/Sightline";
import VisualizationAnalyse from "components/map-view/basicTools/VisualizationAnalyse";
import TJXline from "components/map-view/basicTools/TJXline";
import RZFx from "components/map-view/basicTools/RZFX";
import Pq from "components/map-view/basicTools/PQ";

import BIMinfoFrame from "components/sourcelayer/commonFrame/BIMinfoFrame/BIMinfoFrame";
import Gxgl from "components/sourcelayer/extraModel/Gxgl/Gxgl";
import CivilizationCenter from "components/sourcelayer/extraModel/CivilizationCenter/CivilizationCenter";
import Chaogc from "components/sourcelayer/extraModel/Chaogc/Chaogc";

import {
  getCurrentExtent,
  isContainByExtent,
} from "components/sourcelayer/commonFrame/mapTool";
import { CenterPoint } from "mock/overview.js";
import {
  mapConfigInit,
  mapImageLayerInit,
  mapMvtLayerInit,
  mapRiverLayerInit,
  mapBJSWQLayerInit,
  mapBaimoLayerInit,
  mapRoadLampLayerInit,
  mapRoadLampLayerTurn,
  mapShadowInit,
} from "components/sourcelayer/cesium_map_init";
import { doValidation } from "api/validation/validation";
import { mapGetters, mapActions } from "vuex";
import { getIserverFields } from "api/iServerAPI";

const Cesium = window.Cesium;

export default {
  data() {
    return {
      showSubFrame: null,
      showDXFrame: null,
      showKgFrame: null,
      showqxsyFrame: null,
      showjzFrame: null,
      showgdFrame: null,
      showgxFrame: null,
      showdxFrame: null,
      showsmzxFrame: null,
      showcgcFrame: null,
      showSubTool: null,
      showSZGC: null,
      showDem: null,
      showJYmx: null,
      showSubHubFrame: "3d1",
      mapLoaded: false,
      validated: false,
      isInfoFrame: false,
      authFailshallPop: false,
      ispartsclick: false,
    };
  },
  computed: {
    ...mapGetters("map", ["initDataLoaded", "forceTreeLabel"]),
    isOverview() {
      return this.showSubHubFrame == "3d1";
    },
  },
  created() {
    // this.forceTreeLabel == "城市总览" && (this.showSubHubFrame = "3d1");
  },
  components: {
    // CesiumMapVideo,
    LayerHub,
    SearchBox,
    CityIndex,
    Roulette,
    DetailedModel,
    BJSWQModel,
    BJJM,
    Dxkj,
    WZDem,
    SZgc,
    JYmx,
    KgBoxAnalyse,
    TrafficSubwayModel,
    InfoFrame,
    MedicalPopup,
    BayonetPopup,
    StationPopup,
    TourPointPopup,
    DetailPopup,
    RtmpVideo,
    Population,
    RoadLine,
    VideoCircle,
    AuthFailPopup,
    Overview,
    BIMinfoFrame,
    Gxgl,
    CivilizationCenter,
    Chaogc,
    AroundSourceAnalyse,
    CesiumMapTool,
    Sightline,
    VisualizationAnalyse,
    TJXline,
    RZFx,
    Pq,
  },
  created() {
    window.extraHash = {};
    //  点位信息 hash
    window.featureMap = {};
    //  点位icon hash
    window.billboardMap = {};
    //  点位label hash
    window.labelMap = {};
    //  特殊信息 hash
    window.entityMapGeometry = {};
  },
  async mounted() {
    await this.init3DMap(() => {
      this.mapLoaded = true;
      this.initPostRender();
      this.initHandler();
      this.validate();
    });
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", ["SetForceBimData"]),
    async validate() {
      // let authorCode = this.$route.query.authorCode;
      // if (!authorCode) return (this.authFailshallPop = true);
      // const res = await doValidation(authorCode);
      // res ? (this.validated = true) : (this.authFailshallPop = true);
      this.validated = true;
    },
    initPostRender() {
      window.earth.scene.postRender.addEventListener(() => {
        if (!window.earth || !this.mapLoaded || !this.validated) return;
        //  *****[medicalList] 医疗点位*****
        if (this.$refs.medicalPopup) {
          this.$refs.medicalPopup.fixPopup();
        }
        //  *****[bayonetList] 卡口点位*****
        if (this.$refs.bayonetPopup) {
          this.$refs.bayonetPopup.fixPopup();
        }
        //  *****[stationList] 站点点位*****
        if (this.$refs.stationPopup) {
          this.$refs.stationPopup.fixPopup();
        }
        //  *****[stationList] 景区点位*****
        if (this.$refs.tourPointPopup) {
          this.$refs.tourPointPopup.fixPopup();
        }
        //  *****[indexPoints]  城市总览指标*****
        if (this.isOverview && this.$refs.overview.$refs.overviewNow) {
          this.$refs.overview.$refs.overviewNow.doIndexPoints();
        }
        //  *****[videoCircle]  事件传递点位*****
        if (this.$refs.videoCircle && this.$refs.videoCircle.shallPop) {
          this.$refs.videoCircle.doPopup();
        }
        //  *****[detailPopup]  详情查看点位*****
        if (this.$refs.detailPopup) {
          this.$refs.detailPopup.renderForceEntity();
        }
        //  *****[dxkj]  地下图例*****
        if (this.$refs.dxkj) {
          this.$refs.dxkj.renderForceEntity();
        }
      });
    },
    sqlQuery(SQL) {
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: SQL,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: ["CIM_2D:" + "JZ_2D_buffer"], // 本例中“户型面”为数据源名称，“专题户型面2D”为楼层面相应的数据集名称
      });
      var url =
        "http://172.20.83.223:8098/iserver/services/data-CIM_2D/rest/data"; // 数据服务地址
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: async (queryEventArgs) => {
            console.log("新分层", queryEventArgs);
            if (window.lastHouseEntity) {
              window.earth.entities.remove(window.lastHouseEntity);
              window.lastHouseEntity = null;
            }
            if (queryEventArgs.originResult.features.length != 0) {
              var selectedFeature = queryEventArgs.originResult.features[0]; //选中楼层的楼层面信息对象
              var Feacturedata = {};
              for (let a = 0; a < selectedFeature.fieldNames.length; a++) {
                Feacturedata[selectedFeature.fieldNames[a]] =
                  selectedFeature.fieldValues[a];
              }
              const datas = Object.keys(Feacturedata).map((k) => {
                return { k, v: Feacturedata[k] };
              });
              var fangwu = "";
              //var fangwu = datas.concat(window.jingmo);
              if (!selectedFeature.geometry.points) {
                return;
              }
              var bottomHeight = Number(
                selectedFeature.fieldValues[
                  selectedFeature.fieldNames.indexOf("BOTTOMATTITUDE")
                ]
              ); // 底部高程
              var extrudeHeight = Number(
                selectedFeature.fieldValues[
                  selectedFeature.fieldNames.indexOf("HEIGHT")
                ]
              ); // 层高（拉伸高度）
              Cesium.GroundPrimitive.bottomAltitude = bottomHeight; // 矢量面贴对象的底部高程
              Cesium.GroundPrimitive.extrudeHeight = extrudeHeight; // 矢量面贴对象的拉伸高度
              var points3D = []; // [经度, 纬度, 经度, 纬度, ...]的形式，存放楼层面上的点坐标
              for (var pt of selectedFeature.geometry.points) {
                points3D.push(pt.x, pt.y);
              }
              if (!window.ispartsclick) {
                window.lastHouseEntity = window.earth.entities.add({
                  polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray(points3D),
                    material: getColorRamp([0.0, 0.8], true),
                  },
                  classificationType: Cesium.ClassificationType.S3M_TILE, // 贴在S3M模型表面
                });
              } else {
                if (window.lastHouseEntity) {
                  window.earth.entities.remove(window.lastHouseEntity);
                  window.lastHouseEntity = null;
                }
              }

              function getColorRamp(elevationRamp) {
                var ramp = document.createElement("canvas");
                ramp.width = 1;
                ramp.height = 100;
                var ctx = ramp.getContext("2d");
                var values = elevationRamp;
                var grd = ctx.createLinearGradient(0, 0, 100, 50);
                grd.addColorStop(values[0], "#E84929"); //black
                grd.addColorStop(values[1], "#FFFF08"); //blue
                ctx.fillStyle = grd;
                ctx.fillRect(0, 0, 1, 100);
                return ramp;
              }
              let url =
                "http://172.20.83.223:8098/iserver/services/data-CIM_2D/rest/data";
              let newdataset = "CIM_2D:JZ_2D_buffer";
              const fields = await getIserverFields(url, newdataset);
              const fieldHash = {};
              fields.map(({ name, caption }) => {
                const reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
                reg.test(caption)
                  ? (fieldHash[name.toLowerCase()] = caption)
                  : undefined;
              });
              let tempObj = queryEventArgs.result.features[0].attributes;
              const fixAttributes = {};
              for (let v in tempObj) {
                const V = v.toLowerCase();
                fieldHash[V] ? (fixAttributes[fieldHash[V]] = tempObj[v]) : undefined;
              }
              console.log("别名组", fixAttributes);

              let detailData = Object.keys(fixAttributes).map((k) => {
                return { k, v: fixAttributes[k] };
              });
              console.log("源数据",detailData)
              this.SetForceBimData(detailData);
            }
          }, // 查询成功时的回调函数
          processFailed: (msg) => console.log("查询失败分层分户", msg), // 查询失败时的回调函数
        },
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },
    initHandler() {
      const handler = new Cesium.ScreenSpaceEventHandler(
        window.earth.scene.canvas
      );
      // 监听左键点击事件
      handler.setInputAction((e) => {
        const pick = window.earth.scene.pick(e.position);
        const position = window.earth.scene.pickPosition(e.position);
        window.position = position;
        console.log("点击pick.id", pick);
        if (!pick || !pick.id) return;
        if (typeof pick.id == "object") {
          //  *****[videoCircle]  监控视频点*****
          if (pick.id.id && ~pick.id.id.indexOf("videopoint_")) {
            this.$bus.$emit("cesium-3d-videoPointClick", {
              mp_id: pick.id.id,
              mp_name: pick.id.name,
            });
          }
          if (pick.id.id && ~pick.id.id.indexOf("normalpoint_")) {
            this.$bus.$emit("cesium-3d-normalPointClick", {
              mp_id: pick.id.id,
              mp_name: pick.id.name,
            });
          }
        } else if (typeof pick.id == "string") {
          const [_TYPE_, _SMID_, _NODEID_] = pick.id.split("@");
          console.log("参数", window.featureMap);
          //  *****[detailPopup]  资源详情点*****
          if (~["label", "billboard"].indexOf(_TYPE_)) {
            this.$refs.detailPopup.getForceEntity({
              ...window.featureMap[_NODEID_][_SMID_],
              position: pick.primitive.position,
              _NODEID_
            });
          } else {
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
            var height = cartographic.height;
            if (window.lastHouseEntity == undefined) {
              window.lastHouseEntity = null;
            }
            var sqls = `BottomAttitude < ${height} and ${height} < (BottomAttitude + Height) and ${longitude} > SmSdriW and ${longitude} < SmSdriE and ${latitude} > SmSdriS and ${latitude} < SmSdriN`;
            this.sqlQuery(sqls);
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      // 模型点击事件
      window.earth.pickEvent.addEventListener((feature) => {
        console.log('abc!!!')
        const _data_ = Object.keys(feature).map((k) => {
          return { k, v: feature[k] };
        });
        console.log("data", _data_);
        let gx = false;
        let building = false;
        for (let f = 0; f < _data_.length; f++) {
          if (
            _data_[f].k == "直径" ||
            _data_[f].k == "长度" ||
            _data_[f].k == "地质层"
          ) {
            gx = true;
            break;
          }
        }
        for (let i = 0; i < _data_.length; i++) {
          if (_data_[i].k == "所属楼层") {
            building = true;
            break;
          }
        }
        if (gx) {
          this.SetForceBimData(_data_);
        }
        if (building && window.ispartsclick) {
          let url =
            "http://172.20.83.223:8098/iserver/services/data-AS_table/rest/data";
          let datasetName = `AS_table:${feature["部件"]}`;
          var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
          getFeatureParam = new SuperMap.REST.FilterParameter({
            attributeFilter: `ElementID = ${feature["ELEMENTID"]}`,
          });
          getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
            queryParameter: getFeatureParam,
            toIndex: -1,
            datasetNames: [datasetName],
          });
          getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(
            url,
            {
              eventListeners: {
                processCompleted: async (res) => {
                  console.log("数据", res);
                  let tempObj = res.result.features[0].attributes;
                  let detailData = Object.keys(tempObj).map((k) => {
                    return { k, v: tempObj[k] };
                  });
                  this.SetForceBimData(detailData);
                },
                processFailed: (msg) => console.log(msg),
              },
            }
          );
          getFeatureBySQLService.processAsync(getFeatureBySQLParams);
        }
      });
    },
    /**
     * 事件注册
     */
    eventRegsiter() {
      window.ispartsclick = false;
      this.$bus.$off("cesium-3d-event");
      this.$bus.$on("cesium-3d-event", ({ value }) => {
        this.showSubFrame = value;
      });
      //倾斜摄影
      this.$bus.$off("cesium-3d-qxsy");
      this.$bus.$on("cesium-3d-qxsy", ({ value }) => {
        this.showqxsyFrame = value;
      });
      //建筑三维
      this.$bus.$off("cesium-3d-jz");
      this.$bus.$on("cesium-3d-jz", ({ value }) => {
        this.showjzFrame = value;
      });
      //轨道交通
      this.$bus.$off("cesium-3d-gd");
      this.$bus.$on("cesium-3d-gd", ({ value }) => {
        this.showgdFrame = value;
      });
      //管线管廊
      this.$bus.$off("cesium-3d-gx");
      this.$bus.$on("cesium-3d-gx", ({ value }) => {
        this.showgxFrame = value;
      });
      //地下空间
      this.$bus.$off("cesium-3d-dx");
      this.$bus.$on("cesium-3d-dx", ({ value }) => {
        this.showdxFrame = value;
      });
      //市民中心
      this.$bus.$off("cesium-3d-smzx");
      this.$bus.$on("cesium-3d-smzx", ({ value }) => {
        this.showsmzxFrame = value;
      });
      //超高层
      this.$bus.$off("cesium-3d-cgc");
      this.$bus.$on("cesium-3d-cgc", ({ value }) => {
        this.showcgcFrame = value;
      });
      //详细规划
      this.$bus.$off("cesium-3d-kggx");
      this.$bus.$on("cesium-3d-kggx", ({ value }) => {
        this.showKgFrame = value;
      });
      //数字高程
      this.$bus.$off("cesium-3d-szgc");
      this.$bus.$on("cesium-3d-szgc", ({ value }) => {
        this.showSZGC = value;
      });
      //数字地表
      this.$bus.$off("cesium-3d-szdb");
      this.$bus.$on("cesium-3d-szdb", ({ value }) => {
        this.showDem = value;
      });
      //简易模型
      this.$bus.$off("cesium-3d-bm");
      this.$bus.$on("cesium-3d-bm", ({ value }) => {
        console.log("简易模型", value);
        this.showJYmx = value;
      });
      //工具栏
      this.$bus.$off("cesium-3d-maptool");
      this.$bus.$on("cesium-3d-maptool", ({ label }) => {
        console.log("工具栏点击", label);
        this.showSubTool = label;
      });
      this.$bus.$on("cesium-3d-switch", ({ value }) => {
        this.$bus.$emit("cesium-3d-event", { value: !value ? "3d1" : null });
        ServiceUrl.WZBaimo_OBJ.map(({ KEY }) => {
          const _LAYER_ = window.earth.scene.layers.find(KEY);
          _LAYER_.visible = !value ? false : true;
        });
        //  鼠标缩放限制
        // window.earth.scene.screenSpaceCameraController.maximumZoomDistance = !value
        //   ? 800
        //   : Infinity;
        //  底图切换
        window.datalayer.show = !value ? false : true;
        window.imagelayer
          ? (window.imagelayer.show = !value ? true : false)
          : !value
          ? (window.imagelayer = mapImageLayerInit(ServiceUrl.SWImage))
          : undefined;
        //  光源显示
        mapRoadLampLayerTurn(!value ? false : true);
        //  河流显示
        window.earth.scene.layers.find("RIVER").visible = !value ? true : false;
        //  历史页面做回调
        this.$bus.$emit("cesium-3d-switch-pass");
      });
      this.$bus.$on("cesium-3d-hub-event", ({ value }) => {
        this.showSubHubFrame = value;
      });
    },
    /**
     * 地图初始化
     * @param {function} fn 回调函数
     */
    async init3DMap(fn) {
      window.earth = new Cesium.Viewer("cesiumContainer", {
        infoBox: false,
        selectionIndicator: false,
        // timeline:true,
        shadows: true,
        // contextOptions: {
        //   maxDrawingBufferWidth: 15360,
        //   maxDrawingBufferHeight: 4320,
        // },
      });
      //  地图配置
      mapConfigInit();
      //  相机位置
      this.cameraMove();
      //  大数据地图
      window.datalayer = mapImageLayerInit(ServiceUrl.SWImage);
      //window.datalayer = mapImageLayerInit(ServiceUrl.DataImage);
      //  地图注记
      const mapMvt = mapMvtLayerInit("mapMvt", ServiceUrl.YJMVT);
      //  重要地物注记
      //const keyMvt = mapMvtLayerInit("keyMvt", ServiceUrl.KEYMVT);
      await mapBJSWQLayerInit("BJImage", ServiceUrl.BJImage);

      //  水面
      // await mapRiverLayerInit("RIVER", ServiceUrl.STATIC_RIVER);
      //  白模叠加
      // await mapBaimoLayerInit(ServiceUrl.WZBaimo_OBJ);
      //  路灯、光源叠加
      //mapRoadLampLayerInit();
      //  阴影
      // mapShadowInit();
      //  回调钩子
      fn && fn();
    },
    /**
     * move your fat ass bro
     */
    cameraMove() {
      window.earth.scene.camera.setView(CenterPoint);
    },
  },
};
</script>

<style lang="less">
.cesiumContainer {
  height: 100%;
  width: 100%;
  #cesiumContainer {
    height: 100%;
    width: 100%;
  }
}
.mapCover {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 8;
}
.cesium-viewer-navigationContainer {
  display: none;
}
</style>
