<!--
 * @Author: eds
 * @Date: 2020-07-07 09:41:22
 * @LastEditTime: 2020-08-06 14:12:52
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\cesium_map.vue
-->
<template>
  <div class="cesiumContainer">
    <div id="cesiumContainer" />
    <div v-if="mapLoaded">
      <Coverage />
      <RegionSimulateFlood
        ref="regionsimulateflood"
        v-if="showSubFrame == '3d1'"
      />
      <BimAnalyse ref="bimanalyse" v-if="showSubFrame == '3d2'" />
      <StationTour ref="stationtour" v-if="showSubFrame == '3d3'" />
      <UnderGround ref="underground" v-if="showSubFrame == '3d4'" />
      <trackBIM ref="trackbim" v-if="showSubFrame == '3d5'" />
      <NanTangModel v-if="showSubFrame == '3d6'" />
      <Riversline ref="riversline" v-if="showSubFrame == '3d7'" />
      <KgBoxAnalyse ref="kgboxanalyse" v-if="showSubFrame == '3d10'" />
      <CivilizationCenter
        ref="civilizationcenter"
        v-if="showSubFrame == '3d11'"
      />
      <BayonetPopup ref="bayonetPopup" v-if="showSubFrame == '3d12'" />
      <GeologyAnalyse ref="geologyanalyse" v-if="showSubFrame == '3d13'" />
      <Chaogc ref="chaogc" v-if="showSubFrame == '3d14'" />
      <Gxgl ref="gxgl" v-if="showSubFrame == '3d15'" />
      <Bimsmzx ref="bimsmzx" v-if="showSubFrame == '3d8'" />
      <CesiumMapTool ref="cesiummaptool" v-if="showSubTool == '3t1'" />
      <VisualizationAnalyse
        ref="visualizationanalyse"
        v-if="showSubTool == '3t2'"
      />
      <SectionAnalyse ref="sectionanalyse" v-if="showSubTool == '3t3'" />
      <sightline ref="sightline" v-if="showSubTool == '3t4'" />
      <ShadowQuery ref="ShadowQuery" v-if="showSubTool == '3t5'" />
      <InfoFrame ref="infoframe" />
      <Tsaddress ref="tsaddress" />
      <Jingmoqipao ref="jingmoqipao" />
      <MedicalPopup ref="medicalPopup" />
      <MedicalInfoFrame ref="medicalInfoFrame" v-show="isMedicalInfoFrame" />
      <DetailPopup ref="detailPopup" />
      <RtmpVideo />
      <Videojiankon />
      <Population />
      <!--注意这边是两个 "==" 而不是一个 ↑-->
    </div>
  </div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
import "./basicTools/ThreeTools.less";
import Coverage from "./treeTool/TreeTool";
import RegionSimulateFlood from "./basicTools/RegionSimulateFlood";
import BimAnalyse from "./basicTools/BimAnalyse";
import Bimsmzx from "./basicTools/Bimsmsz";
import StationTour from "./basicTools/StationTour";
import GeologyAnalyse from "./basicTools/GeologyAnalyse";
import Chaogc from "./basicTools/Chaogc";
import Gxgl from "./basicTools/Gxgl";
import trackBIM from "./basicTools/trackBIM";
import Riversline from "./basicTools/Riversline";
import KgBoxAnalyse from "./basicTools/KgBoxAnalyse";
import CivilizationCenter from "./basicTools/CivilizationCenter";
import DSMAnalyse from "./basicTools/DSMAnalyse";
import UnderGround from "./basicTools/UnderGround";
import VisualizationAnalyse from "./basicTools/VisualizationAnalyse";
import SectionAnalyse from "./basicTools/SectionAnalyse";
import CesiumMapTool from "./basicTools/CesiumMapTool";
import BayonetPopup from "./basicTools/BayonetPopup";
import InfoFrame from "./commonFrame/InfoFrame";
import Tsaddress from "./commonFrame/tsaddress";
import Jingmoqipao from "./commonFrame/jingmoqipao";
import Sightline from "@/components/map-view/basicTools/Sightline";
import ShadowQuery from "@/components/map-view/basicTools/ShadowQuery";
import NanTangModel from "./extraModel/NanTangModel";
import MedicalPopup from "./commonFrame/medicalPopup";
import MedicalInfoFrame from "./commonFrame/MedicalInfoFrame";
import DetailPopup from "./commonFrame/DetailPopup/DetailPopup";
import RtmpVideo from "./extraModel/RtmpVideo/RtmpVideo";
import Population from "./extraModel/Population/Population";
import { getCurrentExtent, isContainByExtent } from "./commonFrame/mapTool";
import Videojiankon from "./commonFrame/rtmpVideo";
const Cesium = window.Cesium;
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      showSubFrame: null,
      showSubTool: null,
      mapLoaded: false,
      handler: undefined,
      datalayer: undefined,
      isMedicalInfoFrame: false,
    };
  },
  computed: {
    ...mapGetters("map", ["medicalListWithGeometry"]),
  },
  components: {
    Coverage,
    RegionSimulateFlood,
    BimAnalyse,
    Bimsmzx,
    StationTour,
    trackBIM,
    KgBoxAnalyse,
    CivilizationCenter,
    DSMAnalyse,
    UnderGround,
    GeologyAnalyse,
    Chaogc,
    Gxgl,
    Riversline,
    VisualizationAnalyse,
    SectionAnalyse,
    CesiumMapTool,
    InfoFrame,
    BayonetPopup,
    Tsaddress,
    Jingmoqipao,
    Sightline,
    ShadowQuery,
    NanTangModel,
    MedicalPopup,
    MedicalInfoFrame,
    DetailPopup,
    RtmpVideo,
    Videojiankon,
    Population,
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
  mounted() {
    this.init3DMap(() => {
      this.mapLoaded = true;
      this.initPostRender();
      this.initHandler();
    });
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", ["SetForceBimData", "SetForceJMData"]),
    initPostRender() {
      window.earth.scene.postRender.addEventListener(() => {
        if (!window.earth || !this.mapLoaded || !Object.keys(this.$refs).length)
          return;
        //  *****[medicalList] 医疗点位*****
        const medicalList = this.medicalListWithGeometry;
        if (medicalList && medicalList.length) {
          const extent = getCurrentExtent();
          const G_medicalList = [];
          medicalList.map((item) => {
            if (item.geometry && isContainByExtent(extent, item.geometry)) {
              const { x, y } = item.geometry;
              const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                window.earth.scene,
                Cesium.Cartesian3.fromDegrees(x, y, 0)
              );
              G_medicalList.push({ ...item, pointToWindow });
            }
          });
          this.$refs.medicalPopup &&
            this.$refs.medicalPopup.doPopup(G_medicalList);
        } else {
          this.$refs.medicalPopup && this.$refs.medicalPopup.doPopup([]);
        }
        //  *****[detailPopup]  详情查看点位*****
        const forceEntity = this.$refs.detailPopup.forceEntity;
        if (forceEntity.extra_data) {
          const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            window.earth.scene,
            forceEntity.position
          );
          this.$refs.detailPopup.renderForceEntity(pointToWindow);
        }
        //  *****[bayonetList] 卡口点位*****
        if (this.$refs.bayonetPopup) {
          this.$refs.bayonetPopup.fixPopup();
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
        datasetNames: ["JinFengYuan:" + "金丰园2栋_户型面"], // 本例中“户型面”为数据源名称，“专题户型面2D”为楼层面相应的数据集名称
      });
      var url =
        "http://172.20.83.223:8098/iserver/services/data-JinFengYuan/rest/data"; // 数据服务地址
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
              var fangwu = datas.concat(window.jingmo);
              if (!selectedFeature.geometry.points) {
                return;
              }
              var bottomHeight = Number(
                selectedFeature.fieldValues[
                  selectedFeature.fieldNames.indexOf("BOTTOM")
                ]
              ); // 底部高程
              var extrudeHeight = Number(
                selectedFeature.fieldValues[
                  selectedFeature.fieldNames.indexOf("LSG")
                ]
              ); // 层高（拉伸高度）
              Cesium.GroundPrimitive.bottomAltitude = bottomHeight; // 矢量面贴对象的底部高程
              Cesium.GroundPrimitive.extrudeHeight = extrudeHeight; // 矢量面贴对象的拉伸高度
              var points3D = []; // [经度, 纬度, 经度, 纬度, ...]的形式，存放楼层面上的点坐标
              for (var pt of selectedFeature.geometry.points) {
                points3D.push(pt.x, pt.y);
              }
              window.lastHouseEntity = window.earth.entities.add({
                polygon: {
                  hierarchy: Cesium.Cartesian3.fromDegreesArray(points3D),
                  material: new Cesium.Color(1, 0, 0 / 255, 0.4),
                },
                classificationType: Cesium.ClassificationType.S3M_TILE, // 贴在S3M模型表面
              });
              var result = [];
              var obj = {};
              for (var i = 0; i < fangwu.length; i++) {
                if (!obj[fangwu[i].k]) {
                  result.push(fangwu[i]);
                  obj[fangwu[i].k] = true;
                }
              }
              this.SetForceJMData(result);
            } else {
              this.SetForceJMData(window.jingmo);
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
        //console.log("精模",e)
        const pick = window.earth.scene.pick(e.position);
        console.log("点击事件", pick);
        var position = window.earth.scene.pickPosition(e.position);
        window.position = position;
        if (pick.id.extra_data) {
          console.log("资源点");
          // const _data_ = Object.keys(pick.id.extra_data).map((k) => {
          //   return { k, v: pick.id.extra_data[k] };
          // });
          // 修改
          const _data_ = Object.keys(pick.id.fix_data).map((k) => {
            return { k, v: pick.id.fix_data[k] };
          });
          this.SetForceBimData(_data_);
          window.a = _data_;
          // this.$refs.detailPopup.getForceEntity({
          //   extra_data: pick.id.extra_data,
          //   fix_data: pick.id.fix_data,
          //   position: pick.id._position._value,
          // });
        } else if (
          pick.primitive &&
          pick.primitive.queryParameter.dataSetName ==
            "%E5%BB%BA%E7%AD%91_table"
        ) {
          console.log("ceshi1");
          // console.log("相机参数1", window.earth.scene.camera.position);
          // console.log("相机参数2", window.earth.scene.camera.heading);
          // console.log("相机参数3", window.earth.scene.camera.pitch);
          // console.log("相机参数4", window.earth.scene.camera.roll);
          var cartographic = Cesium.Cartographic.fromCartesian(position);
          //console.log("笛卡尔坐标之后", window.earth.scene.canvas.height,position);
          var longitude = Cesium.Math.toDegrees(cartographic.longitude);
          var latitude = Cesium.Math.toDegrees(cartographic.latitude);
          var height = cartographic.height;
          if (window.lastHouseEntity == undefined) {
            window.lastHouseEntity = null;
          }
          var scenePosition = null;
          var sqls = `bottom < ${height} and ${height} < (bottom + LSG) and ${longitude} > SmSdriW and ${longitude} < SmSdriE and ${latitude} > SmSdriS and ${latitude} < SmSdriN`;
          this.sqlQuery(sqls);
          var centeroptX = parseFloat(longitude);
          var centeroptY = parseFloat(latitude);
          var arg1 = centeroptY;
          var arg2 = 0.004054;
          var r1, r2, m, n;
          try {
            r1 = arg1.toString().split(".")[1].length;
          } catch (e) {
            r1 = 0;
          }
          try {
            r2 = arg2.toString().split(".")[1].length;
          } catch (e) {
            r2 = 0;
          }
          m = Math.pow(10, Math.max(r1, r2));
          //动态控制精度长度
          n = (r1 = r2) ? r1 : r2;
          var b = ((arg1 * m - arg2 * m) / m).toFixed(n);
          var centeropt = {
            y: parseFloat(b),
            x: parseFloat(centeroptX),
            z: 200,
            heading: 6.174710006191949,
            pitch: -0.2350783651746684,
            roll: 6.283185307179577,
          };
          if (window.gj == undefined || window.gj == true) {
            window.earth.scene.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(
                centeropt.x,
                centeropt.y,
                centeropt.z
              ), //经度、纬度、高度
              orientation: {
                heading: centeropt.heading,
                pitch: centeropt.pitch,
                roll: centeropt.roll,
              },
              duration: 3,
            });
          }

          var canvasHeight = window.earth.scene.canvas.height;
          var scenePosition = window.earth.scene.camera.position;
          var windowPosition = new Cesium.Cartesian2();
          // console.log("window.earth.scene",window.earth.scene);
          // console.log("scenePosition",scenePosition);
          // console.log("windowPosition",windowPosition);
          Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            window.earth.scene,
            scenePosition,
            windowPosition
          );
          //console.log("坐标测试",windowPosition.y);
        } else if (pick.id.id && ~pick.id.id.indexOf("videopoint_")) {
          console.log("点击视频监控点");
          this.$bus.$emit("cesium-3d-Video", {
            mp_id: pick.id.id,
            mp_name: pick.id.name,
            mp_url: pick.id.url,
          });
        }

        if (!pick.id || typeof pick.id != "object") return;
        //  *****[detailPopup]  资源详情点*****
        if (pick.id.extra_data) {
          this.$refs.detailPopup.getForceEntity({
            extra_data: pick.id.extra_data,
            fix_data: pick.id.fix_data,
            position: pick.id._position._value,
          });
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    eventRegsiter() {
      this.$bus.$off("cesium-3d-event");
      this.$bus.$on("cesium-3d-event", ({ value }) => {
        this.SetForceBimData([]);
        this.showSubFrame = value;
      });
      this.$bus.$off("cesium-3d-maptool");
      this.$bus.$on("cesium-3d-maptool", ({ value }) => {
        this.showSubTool = value;
      });
      this.$bus.$off("cesium-3d-switch");
      this.$bus.$on("cesium-3d-switch", ({ value }) => {
        const _LAYER_ = window.earth.scene.layers.find("白模");
        if (_LAYER_) {
          _LAYER_.visibleDistanceMin = !value ? 1400 : 0;
        }
      });
    },
    init3DMap(fn) {
      const that = this;
      window.extraHash.mainDem = new Cesium.CesiumTerrainProvider({
        url: ServiceUrl.YJDem, // 政务网永嘉地形
      });
      var viewer = new Cesium.Viewer("cesiumContainer", {
        infoBox: false, // 是否显示信息框
        selectionIndicator: false, // 是否显示选取指示器组件
        // 创建地形服务提供者的实例，url为SuperMap iServer发布的TIN地形服务
        terrainProvider: window.extraHash.mainDem,
      });
      window.earth = viewer; // 全局变量（优化性能）
      //开启地下模式
      window.earth.scene.undergroundMode = true;
      // 添加三维影像
      var imagelayer = viewer.imageryLayers.addImageryProvider(
        new Cesium.SuperMapImageryProvider({
          url: ServiceUrl.SWImage,
        })
      );
      imagelayer.transparentBackColor = new Cesium.Color(0.0, 0.0, 0.0, 1);
      imagelayer.transparentBackColorTolerance = 0.1;
      // 叠加四大流域范围
      var promiseroute11 = Cesium.GeoJsonDataSource.load(
        "/static/yjjson/四大流域.json"
      );
      promiseroute11
        .then(function (dataSource) {
          viewer.dataSources.add(dataSource);
          var Routes11 = dataSource.entities.values;

          for (var i = 0; i < Routes11.length; i++) {
            var pg = Routes11[i];
            // pg.polygon.material = Cesium.Color.ALICEBLUE.withAlpha(0.0)
            pg.polygon.fill = false;
            pg.polygon.Width = 2;
            // pg.polygon.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND
            pg.polygon.outline = false;
            // pg.polygon.outlineWidth = 5
            // pg.polygon.outlineColor = Cesium.Color.YELLOW

            var linePositions = pg.polygon.hierarchy._value.positions;
            viewer.entities.add({
              polyline: {
                positions: linePositions,
                material: Cesium.Color.YELLOW,
                width: 2,
                clampToGround: true,
              },
              name: pg.name,
            });
          }
        })
        .otherwise(function (error) {
          window.alert(error);
        });

      // 叠加mvt图层
      var mvtMap = viewer.scene.addVectorTilesMap({
        url: ServiceUrl.YJMVT,
        canvasWidth: 512,
        name: "testMVT",
        viewer: viewer,
      });
      // var styles = new Cesium.Style3D();
      // styles.bottomAltitude = 50;
      // mvtMap.style3D = styles;
      // mvtMap.refresh();
      window.mvtmaps = mvtMap;
      // 移除缓冲圈
      $(".cesium-widget-credits").hide();
      //viewer.scene.globe.depthTestAgainstTerrain = false;
      this.cameraMove();
      fn && fn();
      viewer.pickEvent.addEventListener((feature) => {
        console.log("pickEvent", feature);
        console.log("window.selectedFeatures", window.selectedFeatures);
        if (window.selectedFeatures != undefined) {
          if (window.selectedFeatures.ID != null) {
            console.log("分层", window.selectedFeatures.fieldNames);
          }
        }

        //console.log("点的位置", window.earth.scene.pickPosition(e.position));
        const _data_ = Object.keys(feature).map((k) => {
          return { k, v: feature[k] };
        });
        console.log("data", _data_);
        var azf = false;
        var gx = false;
        for (let i = 0; i < _data_.length; i++) {
          if (_data_[i].k == "所属楼层") {
            azf = true;
            break;
          }
        }
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
        if (azf) {
          console.log("安置房", _data_);
          that.SetForceBimData(_data_);
          window.a = _data_;
          this.$refs.bimanalyse.eventRegsiter(); //先调用详细信息后在调用房间信息防止楼板信息不再同一层的
          //console.log("安置房",_data_);
          //console.log("window.a初始化",window.position);
        } else if (gx) {
          that.SetForceJMData(_data_);
        } else {
          console.log("精模点击事件", _data_);
          var nums = _data_[0].v;
          var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
          getFeatureParam = new SuperMap.REST.FilterParameter({
            attributeFilter: "SMID="+nums,
          });
          getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
            queryParameter: getFeatureParam,
            toIndex: -1,
            datasetNames: ["jingmo:" + "max_cim_sample_table"], // 本例中“户型面”为数据源名称，“专题户型面2D”为楼层面相应的数据集名称
          });
          var url =
            "http://172.20.83.223:8098/iserver/services/data-jingmotable/rest/data"; // 数据服务地址
          getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(
            url,
            {
              eventListeners: {
                processCompleted: async (queryEventArgs) => {
                  console.log("精模查询成功",queryEventArgs)
                  for(let i = 0;i<_data_.length;i++){
                    for(let j =0;j<queryEventArgs.originResult.features[0].fieldNames.length;j++){
                      if(_data_[i].k=="地址"){
                       if(queryEventArgs.originResult.features[0].fieldNames[j]=="ADDRESS"){
                         _data_[i].v=queryEventArgs.originResult.features[0].fieldValues[j]
                       }
                      }
                       if(_data_[i].k=="小区名称"){
                       if(queryEventArgs.originResult.features[0].fieldNames[j]=="XIOAQUNAME"){
                         _data_[i].v=queryEventArgs.originResult.features[0].fieldValues[j]
                       }
                      }
                       if(_data_[i].k=="幢数"){
                       if(queryEventArgs.originResult.features[0].fieldNames[j]=="HOURSENUMBER"){
                         _data_[i].v=queryEventArgs.originResult.features[0].fieldValues[j]
                       }
                      }
                       if(_data_[i].k=="所在地区"){
                       if(queryEventArgs.originResult.features[0].fieldNames[j]=="CITY"){
                         _data_[i].v=queryEventArgs.originResult.features[0].fieldValues[j]
                       }
                      }
                       if(_data_[i].k=="省级区划名"){
                       if(queryEventArgs.originResult.features[0].fieldNames[j]=="PROVINCE"){
                         _data_[i].v=queryEventArgs.originResult.features[0].fieldValues[j]
                       }
                      }
                       if(_data_[i].k=="设区市区划名"){
                       if(queryEventArgs.originResult.features[0].fieldNames[j]=="CITY"){
                         _data_[i].v=queryEventArgs.originResult.features[0].fieldValues[j]
                       }
                      }
                       if(_data_[i].k=="县级区划名"){
                       if(queryEventArgs.originResult.features[0].fieldNames[j]=="DISTRICT"){
                         _data_[i].v=queryEventArgs.originResult.features[0].fieldValues[j]
                       }
                      }
                      if(_data_[i].k=="乡镇（街道）区划名"){
                       if(queryEventArgs.originResult.features[0].fieldNames[j]=="STREET"){
                         _data_[i].v=queryEventArgs.originResult.features[0].fieldValues[j]
                       }
                      }
                    }
                  }

                }, // 查询成功时的回调函数
                processFailed: (msg) => console.log("查询失败", msg), // 查询失败时的回调函数
              },
            }
          );
          getFeatureBySQLService.processAsync(getFeatureBySQLParams);
          window.jingmo = _data_;
          //that.SetForceJMData(_data_);
          //console.log("精模");
        }
        //console.log("数据服务参数",_data_);
        //that.SetForceBimData(_data_);
      });
    },
    cameraMove() {
      window.earth.scene.camera.setView({
        destination: {
          x: -2885689.43805791,
          y: 4865993.322893596,
          z: 2977614.8110983055,
        },
        orientation: {
          heading: 0.003115109744838307, //方位角(heading)
          pitch: -0.5846590801356228, //俯仰角(pitch)
          roll: 0, //滚动角(roll)
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.cesiumContainer {
  height: 100%;
  width: 100%;
  #cesiumContainer {
    height: 100%;
    width: 100%;
  }
}
</style>
