/*
 * @Author: eds
 * @Date: 2020-08-11 20:39:44
 * @LastEditTime: 2020-09-14 16:38:02
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\config\server\mapConfig.js
 */
export const ServiceUrl = {
  //  温州全市域白模
  //WZBaimo: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-RESPYQSY/rest/realspace/datas/RES_PY_QSY/config",
  WZBaimo: "http://172.20.83.223:8098/iserver/services/3D-mongodb14/rest/realspace/datas/RES_PY_QSY/config",
  //  夜间模型
  WZBaimo_OBJ: [
    {
      KEY: 'WZBaimo_POINT_AROUND',
      URL: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-BaiMo/rest/realspace/datas/BaiMo/config",
      FLOW: true,
    },
    {
      KEY: "WZBaimo_WITHOUT_FIX",
      URL: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-BaiMoQiTaModel/rest/realspace/datas/BaiMoQiTaModel/config",
      withoutFix: true
    },
    {
      KEY: 'WZBaimo_POINT_JZ',
      URL: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb4/rest/realspace/datas/JZ/config",
      FLOW: false,
    },
    {
      KEY: 'WZBaimo_POINT_QT',
      URL: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb4/rest/realspace/datas/QT/config",
      FLOW: false,
      d: 2200
    },
    {
      KEY: 'WZBaimo_POINT_DX',
      URL: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb4/rest/realspace/datas/DX/config",
      FLOW: false,
      d: 2400
    },
    {
      KEY: 'WZBaimo_POINT_DL',
      URL: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb4/rest/realspace/datas/DL/config",
      FLOW: false,
      d: 3000
    },
    {
      KEY: 'WZBaimo_POINT_ZB',
      URL: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb4/rest/realspace/datas/ZB/config",
      FLOW: false,
      d: 2200
    }
  ],
  //  动态水面模型
  RIVER: "https://ditu.wzcitybrain.com/iserver/services/3D-River_CityBrain/rest/realspace/datas/River_CityBrain/config",
  //  静态水面模型
  STATIC_RIVER: "https://ditu.wzcitybrain.com/iserver/services/3D-River_Static/rest/realspace/datas/River@River/config",
  //  影像底图
  SWImage:
    //"https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-YX2019SW/rest/realspace/datas/YX_2019_SW",
    "http://10.36.245.203:8090/iserver/services/map-agscachev2-YXYX2020CGCS2000/rest/maps/YX_YX_2020_CGCS2000",
  //  大数据底图
  DataImage:
    "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-DSJCGS2000SW/rest/realspace/datas/DSJ_CGS2000_SW",
  // BCD矢量面
  BJImage:
    "http://172.20.83.223:8098/iserver/services/data-SW_DATA/rest/data",
  LJxqImage:
    "http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data",
  YJDem:
    "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-DEMLC/rest/realspace/datas/DEM_LC",
  // mvt矢量服务
  YJMVT:
    "https://ditu.wzcitybrain.com/iserver/services/map-mongodbMvt-Routesdata3/restjsr/v1/vectortile/maps/Routes_data3",
  //  重要地物注记
  KEYMVT: "https://ditu.wzcitybrain.com/iserver/services/map-mongodbMvt-ZhongYaoDiWu/restjsr/v1/vectortile/maps/ZhongYaoDiWu",
  //  全市区精模
  WZMODEL:
    "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-JMLC20121/rest/realspace/datas/JM_LC_2012_1/config",
  SCENE_WZMODEL: [
    //  市区
    { key: "ZGDYP_ZB", d: 1400, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_ZB/config" },
    { key: "ZGDYP_DL", d: 5500, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_DL/config" },
    { key: "ZGDYP_QT", d: 1400, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_QT/config" },
    { key: "ZGDYP_SX", d: 1400, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_SX/config" },
    { key: "ZGDYP_JZ", d: 5500, s: true, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_JZ/config" },
    { key: "ZGDYP_DX", d: 5500, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_DX/config" },
    { key: "MaxShijuJZ", d: 5500, s: true, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/MaxShijuJZ/config" },
    { key: "MaxShijuQT", d: 1400, s: true, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/MaxShijuQT/config" },
    //  瓯江口
    { key: "OJK_BUILDING", d: 5500, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb/rest/realspace/datas/JZ/config" },
    { key: "OJK_DMG", d: 1400, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb/rest/realspace/datas/DX/config" },
    { key: "OJK_RIVER", d: 1400, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb/rest/realspace/datas/SX/config" },
    { key: "OJK_ROAD", d: 1400, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb/rest/realspace/datas/DL/config" },
    { key: "OJK_PLANT", d: 1400, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb/rest/realspace/datas/ZB/config" }
  ],
  ROAD_LAMP: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-LightModel/rest/realspace/datas/LightModel/config"
};

export const ImagesURL = [
  { year: 2019, url: "https://sourceserver.wzcitybrain.com/iserver/services/map-agscachev2-YJYX2019CGCS2000/rest/maps/YJ_YX_2019_CGCS2000" },
  { year: 2018, url: "https://sourceserver.wzcitybrain.com/iserver/services/map-agscachev2-YX2018CGC2000/rest/maps/YX_2018_CGC2000" },
  { year: 2017, url: "https://sourceserver.wzcitybrain.com/iserver/services/map-agscachev2-Layers/rest/maps/Layers" },
  { year: 2014, url: "https://sourceserver.wzcitybrain.com/iserver/services/map-agscachev2-YX2014CGC2000/rest/maps/YX_2014_CGC2000" },
  { year: 2012, url: "https://sourceserver.wzcitybrain.com/iserver/services/map-agscachev2-Layers2/rest/maps/Layers" },
]

export const ExtraSourceURL = {
  S1:
    "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-S1/rest/realspace/datas/S1/config",
  BJSWQ:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb11/rest/realspace/datas/BinJiangShangWuQu/config",
  BJSWQNEW:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb11/rest/realspace/datas/BinJiangShangWuQu_0320/config",
  //"http://172.20.83.223:8098/iserver/services/3D-mongodb11/rest/realspace/datas/BinJiangShangWuQu_new/config",  
  JFJ:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb11/rest/realspace/datas/JieFangJie/config",
  BJJM:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb-maxcimsample/rest/realspace/datas/max_cim_sample/config",
  OUHAI:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb-maxouhaiqufu/rest/realspace/datas/max_ouhai_qufu/config",
  LJxq:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb-maxcimpuxieshi/rest/realspace/datas/max_cim_puxieshi/config",
  LJxqXQ:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb11/rest/realspace/datas/PuXieShi/config",
  LIGHT: "http://172.20.83.223:8098/iserver/services/3D-mongodb15/rest/realspace",
  LIGHT_DATA: {
    url: "http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data",
    dataSourceName: "erweidata"
  },
};


export const BimSourceURL = {
  SCENE_URL:
    "http://172.20.83.223:8098/iserver/services/3D-Placement_house_0728/rest/realspace",
  SCENE_DATA_URL:
    "http://172.20.83.223:8098/iserver/services/data-Placement_house_0728/rest/data",
  SCENE_SQL_URL:
    "http://172.20.83.223:8098/iserver/services/data-SW_Data/rest/data/featureResults.rjson?returnContent=true",
  STATION_SCENE_URL:
    "http://172.20.83.223:8098/iserver/services/3D-Airport_Station/rest/realspace",
  STATION_DATA_URL:
    "http://172.20.83.223:8098/iserver/services/data-Airport_Station/rest/data",
  UNDERGROUND_SCENE_URL:
    "http://172.20.83.223:8098/iserver/services/3D-GSLINE/rest/realspace",
  SZGC:
    "http://172.20.83.223:8098/iserver/services/3D-DEM_TT/rest/realspace/datas/2018gddem",
  WZDEM:
    "http://172.20.83.223:8098/iserver/services/3D-mongodb-DSMDEM/rest/realspace/datas/DSM_DEM",
};

export const CIVILIZATION_CENTER_URL = {
  //市民中心地下管线
  UNDERGROUND: "http://172.20.83.223:8098/iserver/services/3D-mongodb3/rest/realspace",
  //市民中心地下管线数据
  UNDERGROUND_DATA: {
    url: "http://172.20.83.223:8098/iserver/services/data-Pipes/rest/data",
    dataSourceName: "Pipes_table"
  },
  ZSUNDERGROUND: "http://172.20.83.223:8098/iserver/services/3D-mongodb3/rest/realspace",
  ZSUNDERGROUND_DATA: {
    url: "http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data",
    dataSourceName: "erweidata"
  },
  //市民中心地上地下
  ABOVEGROUND1: "http://172.20.83.223:8098/iserver/services/3D-mongodb7/rest/realspace",
  //地上模型数据绑定
  ABOVEGROUND_DATA1: {
    url: "http://172.20.83.223:8098/iserver/services/data-Citizens_Parkinglot_table/rest/data",
  },
  //市民中心地上分层
  ABOVEGROUND2: "http://172.20.83.223:8098/iserver/services/3D-mongodb9/rest/realspace",
  //地上模型数据绑定
  ABOVEGROUND_DATA2: {
    url: "http://172.20.83.223:8098/iserver/services/data-AS_table/rest/data",
    dataSourceName: "AS_table"
  },
  //地上模型
  ABOVEGROUND3: "http://172.20.83.223:8098/iserver/services/3D-mongodb10/rest/realspace",
  //地上模型数据绑定
  ABOVEGROUND_DATA3: {
    url: "http://172.20.83.223:8098/iserver/services/data-AS_table/rest/data",
    dataSourceName: "AS_table"
  },
  GEOLOGY: "http://172.20.83.223:8098/iserver/services/3D-mongodb-CIMGeology/rest/realspace",
  GEOLOGY_DATA: {
    url: "http://172.20.83.223:8098/iserver/services/data-DiZhiTi_table/rest/data",
    dataSourceName: "地质体_table"
  },
}
export const CHAO_CENTER_URL = {
  //超高层
  ABOVEGROUND: "http://172.20.83.223:8098/iserver/services/3D-mongodb8/rest/realspace",
  //地上模型数据绑定
  ABOVEGROUND_DATA: {
    url: "http://172.20.83.223:8098/iserver/services/data-Citizens_Parkinglot_table/rest/data",
  },
}
