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
      <TrafficSubwayModel ref="trafficSubwayModel" v-if="showgdFrame == '3d4'" />
      <BJSWQModel ref="bjswqmodel" v-if="showqxsyFrame == '3d5'" />
      <BJJM ref="bjjm" v-if="showjzFrame == '3d6'" />
      <CivilizationCenter ref="civilizationcenter"  v-if="showsmzxFrame == '3d11'" />
      <KgBoxAnalyse ref="kgboxanalyse" v-if="showKgFrame == '3d12'" />
      <Chaogc ref="Chaogc" v-if="showcgcFrame == '3d14'" />
      <Gxgl ref="gxgl" v-if="showgxFrame == '3d15'" />
      <Dxkj v-if="showdxFrame == '3d16'" />
      <WZDem v-if="showDem =='3d17'"/>
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
      showqxsyFrame:null,
      showjzFrame:null,
      showgdFrame:null,
      showgxFrame:null,
      showdxFrame:null,
      showsmzxFrame:null,
      showcgcFrame:null,
      showDem:null,
      showSubHubFrame: "3d1",
      mapLoaded: false,
      validated: false,
      isInfoFrame: false,
      authFailshallPop: false,
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
    AroundSourceAnalyse
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
      });
    },
    initHandler() {
      const handler = new Cesium.ScreenSpaceEventHandler(
        window.earth.scene.canvas
      );
      // 监听左键点击事件
      handler.setInputAction((e) => {
        const pick = window.earth.scene.pick(e.position);
        console.log("点击事件", pick);
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
          //  *****[detailPopup]  资源详情点*****
          if (~["label", "billboard"].indexOf(_TYPE_)) {
            this.$refs.detailPopup.getForceEntity({
              ...window.featureMap[_NODEID_][_SMID_],
              position: pick.primitive.position,
            });
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // 模型点击事件
      window.earth.pickEvent.addEventListener((feature) => {
        console.log("pickEvent", feature);
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
        if (building) {
          let url = 'http://172.20.83.223:8098/iserver/services/data-AS_table/rest/data'
          let datasetName = `AS_table:${feature['部件']}`
          var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
          getFeatureParam = new SuperMap.REST.FilterParameter({
            // attributeFilter: `SMID <= 1000`,
            attributeFilter: `ElementID = ${feature['ELEMENTID']}`,
          });
          getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
            queryParameter: getFeatureParam,
            toIndex: -1,
            datasetNames: [datasetName],
          });
          getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
            eventListeners: {
              processCompleted: async (res) => {
                // const fields = await getIserverFields(url, datasetName);
                // console.log('fields', fields)
                // console.log('res', res)
                let tempObj = res.result.features[0].attributes
                let detailData = Object.keys(tempObj).map((k) => {
                  return { k, v: tempObj[k] };
                });
                this.SetForceBimData(detailData);
              },
              processFailed: (msg) => console.log(msg),
            },
          });
          getFeatureBySQLService.processAsync(getFeatureBySQLParams);
        }
      });
    },
    /**
     * 事件注册
     */
    eventRegsiter() {
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
      this.$bus.$off("cesium-3d-szdb");
      this.$bus.$on("cesium-3d-szdb",({value}) =>{
        this.showDem = value;
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
        //mapRoadLampLayerTurn(!value ? false : true);
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
        shadows: false,
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
