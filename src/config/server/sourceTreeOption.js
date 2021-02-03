/*
 * @Author: eds
 * @Date: 2020-07-29 16:10:06
 * @LastEditTime: 2020-09-15 10:45:53
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\config\server\sourceTreeOption.js
 */
const SERVER_HOST = "https://ditu.wzcitybrain.com/iserver/services";
const SW_DATA = "/data-SW_DATA/rest/data";
const SW_DATA_NAME = "swdata:";
const SERVER_DEFAULT_DATA = SERVER_HOST + SW_DATA;
//  行政区
const TOUR_TOPIC = [
  {
    label: "国家行政区",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  },
  {
    label: "省级行政区",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  },
  {
    label: "地级行政区",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  },
  {
    label: "县级行政区",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  },
  {
    label: "乡级行政区",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  },
  {
    label: "其他行政区",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  },
  // {
  //   label: "重点景区", dataset: "JingQu",
  //   withExtraData: "tourPointList",
  //   withExtraDataGeometry: "tourPointListWithGeometry",
  //   saveExtraDataByGeometry: "setTourPointListWithGeometry",
  //   withExtraKey: "NAME",
  // },
  // { label: "星级酒店", dataset: "XingJiJiuDian" },
  // { label: "精品农家乐", dataset: "温州农家乐" },
  // { label: "旅游景点", dataset: "永嘉旅游景点地图" },
  // { label: "温州民宿", dataset: "温州民宿" },
  // { label: "森林康养基地", dataset: "温州市森林康养基地" },
  // { label: "夜光经济", dataset: "夜景" },
  // {
  //   label: "AAA级景区村",
  //   dataset: "AAAJiFengJingQuCunZhuang"
  // },
  // { label: "A级风景区", dataset: "AJiFengJingQu" },
  // { label: "其他景点", dataset: "QiTaJingDIan" },
  // { label: "星级旅行社", dataset: "XingJiLvXingShe" },
  // { label: "民宿客栈", dataset: "MinSuKeZhan" },
  // { label: "公厕", dataset: "PublicToilet" }
];
//  交通专题
const TRAFFIC_TOPIC = [
  {
    label: "数字正射影像图",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "3d4",
    type: 'model'
  },
  {
    label: "倾斜摄影",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "3d4",
    type: 'model'
  },
  
  // {
  //   label: "S1线路",
  //   componentEvent: "cesium-3d-hub-event",
  //   componentKey: "3d4",
  //   type: 'model'
  // },
  // {
  //   label: "S1站点",
  //   dataset: "T2_WZ_S1_Station_2019",
  //   withExtraData: "stationList",
  //   withExtraDataGeometry: "stationListWithGeometry",
  //   saveExtraDataByGeometry: "setStationListWithGeometry",
  //   withExtraKey: "NAME",
  // },
];
const DZ_TOPIC = [
  {
    label: "政务地图",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  },
];
const SW_TOPIC = [
  {
    label: "数字高程模型",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "3d4",
    type: 'model'
  },
  {
    label: "数字地表模型",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "3d4",
    type: 'model'
  },
  {
    label: "建筑三维模型",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "3d4",
    type: 'model'
  },
  {
    label: "交通三维模型",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "3d4",
    type: 'model'
  },
  {
    label: "轨道交通模型",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "3d4",
    type: 'model'
  },
  {
    label: "管线管廊模型",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "3d4",
    type: 'model'
  },
  {
    label: "地下空间模型",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "3d4",
    type: 'model'
  },
  {
    label: "场地三维模型",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "3d4",
    type: 'model'
  },
  {
    label: "植被三维模型",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "3d4",
    type: 'model'
  },
  {
    label: "其他三维模型",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "3d4",
    type: 'model'
  },
];
const BIM_TOPIC = [
  {
    label: "市民中心",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "3d4",
    type: 'model'
  },
  {
    label: "超高层",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "3d4",
    type: 'model'
  },
];
const JC_TOPIC = [
  { label: "全景VR数据", dataset: "PublicToilet" }
];
// 时空基础数据
const MEDICAL_TOPIC = [
  {
    id: "行政区",
    label: "行政区",
    children: TOUR_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "电子地图",
    label: "电子地图",
    children: DZ_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "测绘遥感数据",
    label: "测绘遥感数据",
    children: TRAFFIC_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: v.type || "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "三维模型",
    label: "三维模型",
    children: SW_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: v.type || "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "BIM模型",
    label: "BIM模型",
    children: BIM_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: v.type || "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "基础数据",
    label: "基础数据",
    children: JC_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: v.type || "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
];

const GT_TOPIC = [
  {
    label: "国土调查",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  },
];
const DZDC_TOPIC = [
  { label: "基础地质", dataset: "PublicToilet" },
  { label: "地质灾害", dataset: "PublicToilet" }
];
const GD_TOPIC = [
  {
    label: "耕地资源",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  },
  {
    label: "永久基本农田",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  },
];
const WATER_TOPIC = [
  {
    label: "水系水文",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  },
  { label: "水利工程", dataset: "PublicToilet" }
];
const CITYBJ_TOPIC = [
  { label: "公用设施类", dataset: "PublicToilet" },
  { label: "道路交通类", dataset: "PublicToilet" },
  { label: "市容环境类", dataset: "PublicToilet" },
  {
    label: "园林绿化类",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  },
  { label: "房屋土地类", dataset: "PublicToilet" },
  { label: "其他设施类", dataset: "PublicToilet" },
];
//  资源调查数据
const EDUCATION_TOPIC = [
  {
    id: "国土调查",
    label: "国土调查",
    children: GT_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "地质调查",
    label: "地质调查",
    children: DZDC_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "耕地资源",
    label: "耕地资源",
    children: GD_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "水资源",
    label: "水资源",
    children: WATER_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "城市部件",
    label: "城市部件",
    children: CITYBJ_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
]
const FR_TOPIC =[
  { label: "机关", dataset: "PublicToilet" },
  { label: "事业单位", dataset: "PublicToilet" },
  { label: "企业", dataset: "PublicToilet" },
  { label: "社团", dataset: "PublicToilet" },
];
const XQD_TOPIC=[
  { label: "兴趣点", dataset: "PublicToilet" },
];
const DMDZ_TOPIC=[
  { label: "地名地址", dataset: "PublicToilet" },
];
const SHH_TOPIC=[
  { label: "服务大数据", dataset: "PublicToilet" },
  { label: "城市运行数据", dataset: "PublicToilet" },
  // {
  //     label: "控规信息",
  //     url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
  //     type: "image"
  //   }
];
// 规划专题
const BASIC_TOPIC = [
  {
    id: "法人数据",
    label: "法人数据",
    children: FR_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "兴趣点数据",
    label: "兴趣点数据",
    children: XQD_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "地名地址数据",
    label: "地名地址数据",
    children: DMDZ_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "社会化大数据",
    label: "社会化大数据",
    children: SHH_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },

];
const ZYKZJ_TOPIC=[
  {
    label: "生态保护红线",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  },
  {
    label: "永久基本农田",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  },
  {
    label: "城镇开发边界",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  }
];
const GTKJGH_TOPIC=[
  {
    label: "总体规划",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  },
  {
    label: "详细规划",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  },
  {
    label: "村庄规划",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  }
];
const ZXGH_TOPIC=[
  { label: "自然资源行业专项规划", dataset: "PublicToilet" },
  { label: "环保规划", dataset: "PublicToilet" },
  { label: "水利规划", dataset: "PublicToilet" },
  { label: "交通规划", dataset: "PublicToilet" },
  { label: "历史文化名城保护规划", dataset: "PublicToilet" },
  { label: "商业服务", dataset: "PublicToilet" },
  { label: "教育设施", dataset: "PublicToilet" },
  { label: "体育设施", dataset: "PublicToilet" },
  { label: "文化设施", dataset: "PublicToilet" },
  { label: "停车泊位", dataset: "PublicToilet" },
  { label: "公园绿地", dataset: "PublicToilet" },
  { label: "养老助残", dataset: "PublicToilet" },
];
const YYGGGH_TOPIC=[
  { label: "原主体功能规划", dataset: "PublicToilet" },
  { label: "原城乡规划", dataset: "PublicToilet" },
];
// 规划管控数据
const CULTURE_TOPIC = [
  {
    id: "重要控制线",
    label: "重要控制线",
    children: ZYKZJ_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "国土空间规划",
    label: "国土空间规划",
    children: GTKJGH_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "专项规划",
    label: "专项规划",
    children: ZXGH_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "已有相关规划",
    label: "已有相关规划",
    children: YYGGGH_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
];

const GCJSXM_TOPIC=[
  { label: "集团项目", dataset: "PublicToilet" },
  { label: "工程项目", dataset: "PublicToilet" },
];

const SZSJJC_TOPIC=[
  { label: "设备运行监测", dataset: "PublicToilet" },
  { label: "能耗监测", dataset: "PublicToilet" },
];
const JZJC_TOPIC=[
  { label: "城市道路桥梁", dataset: "PublicToilet" },
  { label: "轨道交通", dataset: "PublicToilet" },
  { label: "供水", dataset: "PublicToilet" },
  { label: "排水", dataset: "PublicToilet" },
  { label: "燃气", dataset: "PublicToilet" },
  { label: "热力", dataset: "PublicToilet" },
  { label: "环境卫生", dataset: "PublicToilet" },
  { label: "道路照明", dataset: "PublicToilet" },
  { label: "垃圾处理设施", dataset: "PublicToilet" },
  { label: "附属设施", dataset: "PublicToilet" },
];
const QXJC_TOPIC=[
  { label: "雨量", dataset: "PublicToilet" },
  { label: "气温", dataset: "PublicToilet" },
  { label: "气压", dataset: "PublicToilet" },
  { label: "湿度", dataset: "PublicToilet" },

];
const JTJC_TOPIC=[
{
    label: "交通卡口",
    dataset: "KaKouDianWei",
    withExtraData: "bayonetList",
    withExtraDataGeometry: "bayonetListWithGeometry",
    saveExtraDataByGeometry: "setBayonetListWithGeometry",
    withExtraKey: "MC",
    hiddenLabel: true
  },
];
const STHJ_TOPIC=[
  { label: "生态监测", dataset: "PublicToilet" },
];
const GCXX_TOPIC=[
  {
    id: "工程建设项目",
    label: "工程建设项目",
    children: GCJSXM_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
];

const WLGZ_TOPIC=[
  {
    id: "建筑监测数据",
    label: "建筑监测数据",
    children: JZJC_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "市政设施监测数据",
    label: "市政设施监测数据",
    children: SZSJJC_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "气象监测数据",
    label: "气象监测数据",
    children: QXJC_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "交通监测数据",
    label: "交通监测数据",
    children: JTJC_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "生态环境监测数据",
    label: "生态环境监测数据",
    children: STHJ_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  }
];

const CITY_TOPIC = [
  {
    label: "城市总览",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "3d1",
    type: 'model'
  },
]

/**
 * 对应需要额外数据的点位
 */
export const SET_CESIUM_TREE_EXTRA_DATA_WITH_GEOMETRY = [
  "setMedicalListWithGeometry", "setBayonetListWithGeometry",
  "setStationListWithGeometry", "setTourPointListWithGeometry"
];
export const CESIUM_TREE_EXTRA_DATA_WITH_GEOMETRY = ["medicalListWithGeometry", "bayonetListWithGeometry", "stationListWithGeometry", "tourPointListWithGeometry"];
export const CESIUM_TREE_EXTRA_DATA = ["medicalList", "bayonetList", "stationList", "tourPointList"];
export const CESIUM_TREE_OPTION = [
  {
    id: "城市总览",
    label: "城市总览",
    children: CITY_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
      };
    })
  },
  {
    id: "时空基础数据",
    label: "时空基础数据",
    children: MEDICAL_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "资源调查数据",
    label: "资源调查数据",
    children: EDUCATION_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "规划管控数据",
    label: "规划管控数据",
    children: CULTURE_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "工程建设项目数据",
    label: "工程建设项目数据",
    children: GCXX_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: SERVER_DEFAULT_DATA,
        type: v.type || "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "公共专题数据",
    label: "公共专题数据",
    children: [...BASIC_TOPIC].map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: v.url || SERVER_DEFAULT_DATA,
        type: v.type || "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
];
export const CESIUM_TREE_TRAFFIC_OPTION = [{
  id: "物联感知数据",
  label: "物联感知数据",
  children: WLGZ_TOPIC.map(v => {
    return {
      ...v,
      id: v.label,
      icon: v.label,
      url: SERVER_DEFAULT_DATA,
      type: v.type || "mvt",
      newdataset: `${SW_DATA_NAME}${v.dataset}`
    };
  })
}]
