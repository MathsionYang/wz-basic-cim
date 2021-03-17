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
const SW_DATA_NAME = "erweidata:";
const SERVER_DEFAULT_DATA = SERVER_HOST + SW_DATA;

//  行政区
const TOUR_TOPIC = [
  {
    label: "国家行政区",
    url: ``,
    type: "image"
  },
  {
    label: "省级行政区",
    url: ``,
    type: "image"
  },
  {
    label: "地级行政区",
    url: ``,
    type: "image"
  },
  {
    label: "县级行政区",
    url: `http://172.20.83.223:8090/iserver/services/map-CIMERWEI/rest/maps/XZQH_XS_M`,
    type: "image"
  },
  {
    label: "乡级行政区",
    url: `http://172.20.83.223:8090/iserver/services/map-CIMERWEI/rest/maps/XZQH_XZJD_M`,
    type: "image"
  },
  {
    label: "其他行政区",
    url: `http://172.20.83.223:8090/iserver/services/map-CIMERWEI/rest/maps/XZQH_CSQ`,
    type: "image"
  },
];
//  测绘
const TRAFFIC_TOPIC = [
  {
    label: "数字正射影像图",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "",
    url: '',
    type: 'model'
  },
  {
    label: "2017年倾斜摄影",
    componentEvent: "cesium-3d-qxsy",
    componentKey: "3d5",
    url: 'true',
    type: 'model'
  },
  {
    label: "2021年倾斜摄影",
    componentEvent: "cesium-3d-2021qxsy",
    componentKey: "3d21",
    url: 'true',
    type: 'model'
  },
  {
    label: "激光点云数据",
    componentEvent: "",
    componentKey: "",
    url: '',
    type: 'model'
  }
];

//电子地图
const DZ_TOPIC = [
  {
    label: "政务地图",
    url: `http://172.20.83.223:8091/iserver/services/map-agscachev2-YJSGBZBDemD2019CGCS2000/rest/maps/YJ_SG_BZB_DemD_2019_CGCS2000`,
    type: "image"
  },
];
//三维模型
const SW_TOPIC = [
  {
    label: "数字高程模型",
    componentEvent: "cesium-3d-szgc",
    componentKey: "3d18",
    url: 'true',
    type: 'model'
  },
  {
    label: "数字地表模型",
    componentEvent: "cesium-3d-szdb",
    componentKey: "3d17",
    url: 'true',
    type: 'model'
  },
  {
    label: "简易模型",
    componentEvent: "cesium-3d-bm",
    componentKey: "3d19",
    url: 'true',
    type: 'model'
  },
  // {
  //   label: "三维精细模型",
  //   componentEvent: "cesium-3d-ouhai",
  //   componentKey: "3d20",
  //   url: 'true',
  //   type: 'model'
  // },
  {
    label: "建筑三维模型",
    componentEvent: "cesium-3d-jz",
    componentKey: "3d6",
    url: 'true',
    type: 'model'
  },
  {
    label: "交通三维模型",

    componentEvent: "cesium-3d-gd",
    componentKey: "3d4",
    url: 'true',
    type: 'model'
  },
  // {
  //   label: "轨道交通模型",
  //   componentEvent: "cesium-3d-hub-event",
  //   componentKey: "",
  //   url: '',
  //   type: 'model'
  // },
  {
    label: "水利三维模型",
    componentEvent: "",
    componentKey: "",
    url: '',
    type: 'model'
  },
  {
    label: "管线管廊模型",
    componentEvent: "cesium-3d-gx",
    componentKey: "3d15",
    url: 'true',
    type: 'model'
  },
  {
    label: "地下空间模型",
    componentEvent: "cesium-3d-dx",
    componentKey: "3d16",
    url: 'true',
    type: 'model'
  },
  {
    label: "地质体模型",
    componentEvent: "cesium-3d-dzt",
    componentKey: "3d3",
    url: 'true',
    type: 'model'
  },
  {
    label: "场地三维模型",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "",
    url: '',
    type: 'model'
  },
  {
    label: "植被三维模型",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "",
    url: '',
    type: 'model'
  },
  {
    label: "其他三维模型",
    componentEvent: "cesium-3d-hub-event",
    componentKey: "",
    url: '',
    type: 'model'
  },
];
const BIM_TOPIC = [
  {
    label: "市民中心",
    componentEvent: "cesium-3d-smzx",
    componentKey: "3d11",
    url: 'true',
    type: 'model'
  },
  {
    label: "超高层",
    componentEvent: "cesium-3d-cgc",
    componentKey: "3d14",
    url: 'true',
    type: 'model'
  },
];
const JC_TOPIC = [
  {
    label: "全景VR数据",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "quanjin"
  }
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
        url: v.url,
        type: v.type,
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
        url: v.url,
        type: v.type,
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
        url: v.url,
        type: v.type,
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
        url: v.url,
        type: v.type,
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
        url: v.url,
        type: v.type,
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
        url: v.url,
        type: v.type,
        newdataset: `${v.dataname}${v.dataset}`
      };
    })
  },
];

const GT_TOPIC = [
  {
    label: "国土调查",
    url: `http://172.20.83.223:8090/iserver/services/map-CIMERWEI/rest/maps/GTDC`,
    type: "image"
  },
];
const DZDC_TOPIC = [
  {
    label: "基础地质",
    type: 'mvt',
    dataname: ':',
    url: '',
    dataset: ""
  },
  {
    label: "地质环境",
    type: 'mvt',
    dataname: ':',
    url: '',
    dataset: ""
  },
  {
    label: "地质灾害",
    type: 'mvt',
    dataname: ':',
    url: '',
    dataset: ""
  }
];
const GD_TOPIC = [
  {
    label: "耕地资源",
    url: `http://172.20.83.223:8090/iserver/services/map-CIMERWEI/rest/maps/GDZY`,
    type: "image"
  },
  {
    label: "永久基本农田",
    url: ``,
    type: "image"
  },
];
const WATER_TOPIC = [
  {
    label: "水系水文",
    url: `http://172.20.83.223:8090/iserver/services/map-CIMERWEI/rest/maps/river`,
    type: "image"
  },
  {
    label: "水利工程",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "river_sz"
  },
  {
    label: "防汛抗旱",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  }

];
const CITYBJ_TOPIC = [
  {
    label: "公用设施类",
    type: 'mvt',
    dataname: '',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "",
    moreurl: [{
      label: '路灯',
      type: 'mvt',
      dataset: 'JMSS_LD',
      dataname: 'erweidata:',
      icon: "路灯",
      id: "路灯",
      newdataset: "erweidata:JMSS_LD",
      url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
      hiddenLabel: true
    }, {
      label: '电杆',
      type: 'mvt',
      dataset: 'SZSS_DG',
      dataname: 'erweidata:',
      icon: "电杆",
      id: "电杆",
      newdataset: "erweidata:SZSS_DG",
      url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
      hiddenLabel: true
    }, {
      label: '消防栓',
      type: 'mvt',
      dataset: 'SZSS_XFS',
      dataname: 'erweidata:',
      icon: "消防栓",
      id: "消防栓",
      newdataset: "erweidata:SZSS_XFS",
      url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
      hiddenLabel: true
    },
    {
      label: '天然气管线检修井',
      type: 'mvt',
      dataset: 'SZSS_RQGXJXJ',
      dataname: 'erweidata:',
      icon: "天然气管线检修井",
      id: "天然气管线检修井",
      newdataset: "erweidata:SZSS_RQGXJXJ",
      url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
      hiddenLabel: true
    },
    {
      label: '污水检修井',
      type: 'mvt',
      dataset: 'SZSS_WSJXJ',
      dataname: 'erweidata:',
      icon: "污水检修井",
      id: "污水检修井",
      newdataset: "erweidata:SZSS_WSJXJ",
      url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
      hiddenLabel: true
    },
    {
      label: '电力检修井',
      type: 'mvt',
      dataset: 'SZSS_DLJXJ',
      dataname: 'erweidata:',
      icon: "电力检修井",
      id: "电力检修井",
      newdataset: "erweidata:SZSS_DLJXJ",
      url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
      hiddenLabel: true
    },
    {
      label: '给水管线检修井',
      type: 'mvt',
      dataset: 'SZSS_JSGXJXJ',
      dataname: 'erweidata:',
      icon: "给水管线检修井",
      id: "给水管线检修井",
      newdataset: "erweidata:SZSS_JSGXJXJ",
      url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
      hiddenLabel: true
    },
    {
      label: '雨水检修井',
      type: 'mvt',
      dataset: 'SZSS_YSJXJ',
      dataname: 'erweidata:',
      icon: "雨水检修井",
      id: "雨水检修井",
      newdataset: "erweidata:SZSS_YSJXJ",
      url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
      hiddenLabel: true
    }
  ]
  },
  {
    label: "道路交通类",
    type: 'mvt',
    dataname: '',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "",
    moreurl:[{
      label: '停车场',
      type: 'mvt',
      dataset: 'Parkinglot_CBD',
      dataname: 'erweidata:',
      icon: "停车场",
      id: "停车场库",
      newdataset: "erweidata:Parkinglot_CBD",
      url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
      // hiddenLabel: true
    }]
  },
  {
    label: "市容环境类",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "GCLD_GCPTSS"
  },
  {
    label: "园林绿化类",
    url: `http://172.20.83.223:8090/iserver/services/map-CIMERWEI/rest/maps/YLLH_LDXZ`,
    type: "image"
  },
  {
    label: "房屋土地类",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
  {
    label: "其他设施类",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
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
        url: v.url,
        type: v.type,
        newdataset: `${v.dataname}${v.dataset}`
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
        url: v.url,
        type: v.type,
        newdataset: `${v.dataname}${v.dataset}`
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
        url: v.url,
        type: v.type,
        newdataset: `${v.dataname}${v.dataset}`
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
        url: v.url,
        type: v.type,
        newdataset: `${v.dataname}${v.dataset}`
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
        url: v.url,
        type: v.type,
        newdataset: `${v.dataname}${v.dataset}`
      };
    })
  },
];
//社会数据
const SH_TOPIC = [
  {
    label: "就业和失业登记",
    type: 'mvt',
    dataname: '',
    url: '',
    dataset: ""
  },
  {
    label: "人员和单位社保",
    type: 'mvt',
    dataname: '',
    url: '',
    dataset: ""
  }
];
//法人数据
const FR_TOPIC = [
  {
    label: "机关",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "POI_JGDW"
  },
  {
    label: "事业单位",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "POI_QSYDW"
  },
  {
    label: "企业",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
  {
    label: "社团",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
];
const HGJJ_TOPIC = [
  {
    label: "国内生产总值",
    type: 'mvt',
    dataname: '',
    url: '',
    dataset: ""
  },
];
const RK_TOPIC = [
  {
    label: "人口基本信息",
    type: 'mvt',
    dataname: '',
    url: '',
    dataset: ""
  },
  {
    label: "人口统计",
    type: 'mvt',
    dataname: '',
    url: '',
    dataset: ""
  },
  {
    label: "人口结构",
    type: 'mvt',
    dataname: '',
    url: '',
    dataset: ""
  }
];
const XQD_TOPIC = [
  {
    label: "兴趣点",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "POI"
  },
];
const DMDZ_TOPIC = [
  {
    label: "地名地址",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "DMDZ_ML"
  },
];
const SHH_TOPIC = [
  {
    label: "楼宇经济",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "Mansion_points"
  },
  {
    label: "服务大数据",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
  {
    label: "城市运行数据",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
];
//公共专题
const BASIC_TOPIC = [
  {
    id: "社会数据",
    label: "社会数据",
    children: SH_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: v.url,
        type: v.type,
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "法人数据",
    label: "法人数据",
    children: FR_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: v.url,
        type: v.type,
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "宏观经济数据",
    label: "宏观经济数据",
    children: HGJJ_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: v.url,
        type: v.type,
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "人口数据",
    label: "人口数据",
    children: RK_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: v.url,
        type: v.type,
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
        url: v.url,
        type: v.type,
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
        url: v.url,
        type: v.type,
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
        url: v.url,
        type: v.type,
        newdataset: `${v.dataname}${v.dataset}`
      };
    })
  },

];
//开发评价
const KFPJ_TOPIC = [
  {
    label: "资源环境承载能力评价",
    url: ``,
    type: "image"
  },
  {
    label: "国土空间开发适宜性评价",
    url: ``,
    type: "image"
  }
];
const ZYKZJ_TOPIC = [
  {
    label: "生态保护红线",
    url: ``,
    type: "image"
  },
  {
    label: "永久基本农田",
    url: ``,
    type: "image"
  },
  {
    label: "城镇开发边界",
    url: ``,
    type: "image"
  }
];
const GTKJGH_TOPIC = [
  {
    label: "总体规划",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`,
    type: "image"
  },
  {
    label: "详细规划",
    componentEvent: "cesium-3d-kggx",
    componentKey: "3d12",
    url: 'true',
    type: 'model'
  },
  {
    label: "村庄规划",
    url: ``,
    type: "image"
  }
];
const ZXGH_TOPIC = [
  {
    label: "自然资源行业专项规划",
    type: 'mvt',
    dataname: '172.20.83.196_ersjdata:',
    url: '',
    dataset: ""
  },
  {
    label: "环保规划",
    type: 'mvt',
    dataname: '172.20.83.196_ersjdata:',
    url: '',
    dataset: ""
  },
  {
    label: "水利规划",
    type: 'mvt',
    dataname: '172.20.83.196_ersjdata:',
    url: '',
    dataset: ""
  },
  {
    label: "交通规划",
    type: 'mvt',
    dataname: '172.20.83.196_ersjdata:',
    url: '',
    dataset: ""
  },
  {
    label: "历史文化名城保护规划",
    type: 'mvt',
    dataname: '172.20.83.196_ersjdata:',
    url: '',
    dataset: ""
  },
  {
    label: "商业服务",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "商业设施"
  },
  {
    label: "教育设施",
    type: 'mvt',
    dataname: '',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "",
    moreurl: [{
      label: '幼儿园',
      type: 'mvt',
      dataset: 'NurserySchool',
      dataname: 'swdata:',
      icon: "幼儿园",
      id: "幼儿园",
      newdataset: "swdata:NurserySchool",
      url: 'https://ditu.wzcitybrain.com/iserver/services/data-SW_DATA/rest/data',
    }, {
      label: '小学',
      type: 'mvt',
      dataset: 'PrimarySchool',
      dataname: 'swdata:',
      icon: "小学",
      id: "小学",
      newdataset: "swdata:PrimarySchool",
      url: 'https://ditu.wzcitybrain.com/iserver/services/data-SW_DATA/rest/data',
    }, {
      label: '初中',
      type: 'mvt',
      dataset: 'JuniorHighSchool',
      dataname: 'swdata:',
      icon: "初中",
      id: "初中",
      newdataset: "swdata:JuniorHighSchool",
      url: 'https://ditu.wzcitybrain.com/iserver/services/data-SW_DATA/rest/data',
    },
    {
      label: '高中',
      type: 'mvt',
      dataset: 'HighSchool',
      dataname: 'swdata:',
      icon: "高中",
      id: "高中",
      newdataset: "swdata:HighSchool",
      url: 'https://ditu.wzcitybrain.com/iserver/services/data-SW_DATA/rest/data',
    },
    {
      label: '中职',
      type: 'mvt',
      dataset: 'VocationalSchool',
      dataname: 'swdata:',
      icon: "中职",
      id: "中职",
      newdataset: "swdata:VocationalSchool",
      url: 'https://ditu.wzcitybrain.com/iserver/services/data-SW_DATA/rest/data',
    },
    {
      label: '高校',
      type: 'mvt',
      dataset: 'UniversitySchool',
      dataname: 'swdata:',
      icon: "高校",
      id: "高校",
      newdataset: "swdata:UniversitySchool",
      url: 'https://ditu.wzcitybrain.com/iserver/services/data-SW_DATA/rest/data',
    }]
  },
  {
    label: "体育设施",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "体育设施"
  },
  {
    label: "文化设施",
    type: 'mvt',
    dataname: '',
    url: 'https://ditu.wzcitybrain.com/iserver/services/data-SW_DATA/rest/data',
    dataset: "",
    moreurl: [{
      label: '爱国义务教育基地',
      type: 'mvt',
      dataset: '爱国主义教育基地',
      dataname: 'swdata:',
      icon: "爱国义务教育基地",
      id: "爱国义务教育基地",
      newdataset: "swdata:爱国主义教育基地",
      url: 'https://ditu.wzcitybrain.com/iserver/services/data-SW_DATA/rest/data',
    }, {
      label: '市区阅读',
      type: 'mvt',
      dataset: '温州市阅读',
      dataname: 'swdata:',
      icon: "市区阅读",
      id: "市区阅读",
      newdataset: "swdata:温州市阅读",
      url: 'https://ditu.wzcitybrain.com/iserver/services/data-SW_DATA/rest/data',
    }, {
      label: '文化礼堂',
      type: 'mvt',
      dataset: '文化礼堂',
      dataname: 'swdata:',
      icon: "文化礼堂",
      id: "文化礼堂",
      newdataset: "swdata:文化礼堂",
      url: 'https://ditu.wzcitybrain.com/iserver/services/data-SW_DATA/rest/data',
    },
    {
      label: '文化生活',
      type: 'mvt',
      dataset: '温州文化生活',
      dataname: 'swdata:',
      icon: "文化生活",
      id: "文化生活",
      newdataset: "swdata:温州文化生活",
      url: 'https://ditu.wzcitybrain.com/iserver/services/data-SW_DATA/rest/data',
    },
    {
      label: '百姓健身房',
      type: 'mvt',
      dataset: '百姓健身房',
      dataname: 'swdata:',
      icon: "百姓健身房",
      id: "百姓健身房",
      newdataset: "swdata:百姓健身房",
      url: 'https://ditu.wzcitybrain.com/iserver/services/data-SW_DATA/rest/data',
    },
    {
      label: '文化场所',
      type: 'mvt',
      dataset: 'D_HAZARDS_CULTURALPLACE',
      dataname: 'swdata:',
      icon: "文化场所",
      id: "文化场所",
      newdataset: "swdata:D_HAZARDS_CULTURALPLACE",
      url: 'https://ditu.wzcitybrain.com/iserver/services/data-SW_DATA/rest/data',
    }]
  },
  {
    label: "停车泊位",
    type: 'mvt',
    dataname: '172.20.83.196_ersjdata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-EW_DATA/rest/data',
    dataset: "JCSS_TCC"
  },
  {
    label: "公园绿地",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "绿化设施"
  },
  {
    label: "养老助残",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "养老设施"
  },
];
const YYGGGH_TOPIC = [
  {
    label: "原主体功能规划",
    type: 'mvt',
    dataname: '172.20.83.196_ersjdata:',
    url: '',
    dataset: ""
  },
  {
    label: "原土地利用总体规划",
    type: 'mvt',
    dataname: '',
    url: '',
    dataset: ""
  },
  {
    label: "原城乡规划",
    type: 'mvt',
    dataname: '172.20.83.196_ersjdata:',
    url: '',
    dataset: ""
  },
  
];
// 规划管控数据
const CULTURE_TOPIC = [
  {
    id: "开发评价",
    label: "开发评价",
    children: KFPJ_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: v.url,
        type: v.type,
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "重要控制线",
    label: "重要控制线",
    children: ZYKZJ_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: v.url,
        type: v.type,
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
        url: v.url,
        type: v.type,
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
        url: v.url,
        type: v.type,
        newdataset: `${v.dataname}${v.dataset}`
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
        url: v.url,
        type: v.type,
        newdataset: `${v.dataname}${v.dataset}`
      };
    })
  },
];

const GCJSXM_TOPIC = [
  // {
  //   label: "集团项目",
  //   type: 'mvt',
  //   dataname: '172.20.83.196_ersjdata:',
  //   url: 'http://172.20.83.223:8090/iserver/services/data-EW_DATA/rest/data',
  //   dataset: "JTXM"
  // },
  {
    label: "工程项目",
    type: "mvt",
    dataset: "erweidata:V_TM_PROJECT_P",
    url: "http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data",
    withImage: [{
      name: "ydhx",
      url: "http://172.20.83.223:8090/iserver/services/map-CIMERWEI/rest/maps/JSGC_DJDM",
    }]
  },
  {
    label: "老旧小区",
    componentEvent: "cesium-3d-ljxq",
    componentKey: "3d2",
    url: 'true',
    type: 'model'
  },

];

const SZSJJC_TOPIC = [
  {
    label: "设备运行监测",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
  {
    label: "能耗监测",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
];
const JZJC_TOPIC = [
  {
    label: "城市道路桥梁",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
  {
    label: "轨道交通",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
  {
    label: "供水",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
  {
    label: "排水",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "V_PS_WATER_QUALITY_MONITOR_P"
  },
  {
    label: "燃气",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
  {
    label: "热力",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
  {
    label: "环境卫生",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
  {
    label: "道路照明",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
  {
    label: "垃圾处理设施",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
  {
    label: "附属设施",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
];
const QXJC_TOPIC = [
  {
    label: "雨量",
    url: `http://10.36.234.83:8090/iserver/services/map-Short_Near_Pr-1/rest/maps/ShortNearQPFClipLC%4010.36.234.85_Weather_RainFall`,
    type: "image"
  },
  {
    label: "气温",
    url: ``,
    type: "image"
  },
  {
    label: "气压",
    url: ``,
    type: "image"
  },
  {
    label: "湿度",
    url: ``,
    type: "image"
  },

];
const JTJC_TOPIC = [
  {
    label: "交通卡口",
    type: 'mvt',
    dataname: 'swdata:',
    url: 'https://ditu.wzcitybrain.com/iserver/services/data-SW_DATA/rest/data',
    dataset: "KaKouDianWei",
    withExtraData: "bayonetList",
    withExtraDataGeometry: "bayonetListWithGeometry",
    saveExtraDataByGeometry: "setBayonetListWithGeometry",
    withExtraKey: "MC",
    hiddenLabel: true
  },
];
//  应急专题
const EMERGENCY_TOPIC = [
  { label: "消防站", dataname: 'swdata:', dataset: "JZJZNL_XFJYNL_XFZ" },
];
const STHJ_TOPIC = [
  {
    label: "生态监测",
    type: 'mvt',
    dataname: 'erweidata:',
    url: '',
    dataset: ""
  },
];
const CSAF_TOPIC = [
  {
    label: "视频监控",
    type: 'mvt',
    dataname: '172.20.83.196_swdata:',
    url: 'http://172.20.83.223:8098/iserver/services/data-SW_DATA/rest/data',
    dataset: "cbd_video"
  },
];
//工程建设项目
const GCXX_TOPIC = [
  {
    id: "工程建设项目",
    label: "工程建设项目",
    children: GCJSXM_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: v.url,
        type: v.type,
        // newdataset: `${v.dataname}${v.dataset}`
        newdataset: `${v.dataname ? `${v.dataname}${v.dataset}` : `${v.dataset}`}`
      };
    })
  },
];

const WLGZ_TOPIC = [
  {
    id: "建筑监测数据",
    label: "建筑监测数据",
    children: SZSJJC_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: v.url,
        type: v.type,
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "市政设施监测数据",
    label: "市政设施监测数据",
    children: JZJC_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: v.url,
        type: v.type,
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
        url: v.url,
        type: v.type,
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
        url: v.url,
        type: v.type,
        newdataset: `${v.dataname}${v.dataset}`
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
        url: v.url,
        type: v.type,
        newdataset: `${v.dataname}${v.dataset}`
      };
    })
  },
  {
    id: "城市安防数据",
    label: "城市安防数据",
    children: CSAF_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        icon: v.label,
        url: v.url,
        type: v.type,
        newdataset: `${v.dataname}${v.dataset}`
      };
    })
  }
];

const EVENT_AROUND_ANALYSE_TOPIC = [
  { label: "医疗场所", resourceType: "medical_care", dataname: "swdata:", dataset: "JZJZNL_YLJH_JHCS", },
  { label: "消防站", resourceType: "fire_station", dataname: "swdata:", dataset: "JZJZNL_XFJYNL_XFZ" },
  { label: "消防栓", resourceType: "fire_hydrant", dataname: "swdata:", dataset: "JZJZNL_XFJYNL_XFS" },
  { label: "交通卡口", resourceType: "bayonet", dataname: "swdata:", dataset: "KaKouDianWei" }
]

const AROUND_ANALYSE_TOPIC = [
  {
    label: "商业服务",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "商业设施"
  },
  {
    label: "教育设施",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "教育设施"
  },
  {
    label: "体育设施",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "体育设施"
  },
  {
    label: "文化设施",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "文化设施"
  },
  {
    label: "停车泊位",
    type: 'mvt',
    dataname: '172.20.83.196_ersjdata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-EW_DATA/rest/data',
    dataset: "JCSS_TCC"
  },
  {
    label: "公园绿地",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "绿化设施"
  },
  {
    label: "养老助残",
    type: 'mvt',
    dataname: 'erweidata:',
    url: 'http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data',
    dataset: "养老设施"
  },
]

//  事件专题
const EVENT_TOPIC = [
  { label: "消防事件", event: "eventLayer_fire" },
];

/**
 * 对应需要额外数据的点位
 */
export const SET_CESIUM_TREE_EXTRA_DATA_WITH_GEOMETRY = [
  "setMedicalListWithGeometry", "setBayonetListWithGeometry",
  "setStationListWithGeometry", "setTourPointListWithGeometry"
];
export const CESIUM_TREE_EXTRA_DATA_WITH_GEOMETRY = ["medicalListWithGeometry", "bayonetListWithGeometry", "stationListWithGeometry", "tourPointListWithGeometry"];
export const CESIUM_TREE_EXTRA_DATA = ["ljxqlist","medicalList", "bayonetList", "stationList", "tourPointList"];
export const CESIUM_TREE_OPTION = [
  {
    id: "时空基础数据",
    label: "时空基础数据",
    children: MEDICAL_TOPIC
    // children: MEDICAL_TOPIC.map(v => {
    //   return {
    //     ...v,
    //     id: v.label,
    //     icon: v.label,
    //     url: v.url,
    //     type: v.type,
    //     newdataset: `${v.dataname}${v.dataset}`
    //   };
    // })
  },
  {
    id: "资源调查数据",
    label: "资源调查数据",
    children: EDUCATION_TOPIC
    // children: EDUCATION_TOPIC.map(v => {
    //   return {
    //     ...v,
    //     id: v.label,
    //     icon: v.label,
    //     url: v.url,
    //     type: v.type,
    //     newdataset: `${v.dataname}${v.dataset}`
    //   };
    // })
  },
  {
    id: "规划管控数据",
    label: "规划管控数据",
    children: CULTURE_TOPIC
    // children: CULTURE_TOPIC.map(v => {
    //   return {
    //     ...v,
    //     id: v.label,
    //     icon: v.label,
    //     url: v.url,
    //     type: v.type,
    //     newdataset: `${v.dataname}${v.dataset}`
    //   };
    // })
  },
  {
    id: "工程建设项目数据",
    label: "工程建设项目数据",
    children: GCXX_TOPIC
    // children: GCXX_TOPIC.map(v => {
    //   return {
    //     ...v,
    //     id: v.label,
    //     icon: v.label,
    //     url: v.url,
    //     type: v.type,
    //     newdataset: `${v.dataname}${v.dataset}`
    //   };
    // })
  },
  {
    id: "公共专题数据",
    label: "公共专题数据",
    children: BASIC_TOPIC
    // children: BASIC_TOPIC.map(v => {
    //   return {
    //     ...v,
    //     id: v.label,
    //     icon: v.label,
    //     url: v.url,
    //     type: v.type,
    //     newdataset: `${v.dataname}${v.dataset}`
    //   };
    // })
  },
  {
    id: "物联感知数据",
    label: "物联感知数据",
    children: WLGZ_TOPIC
    // children: WLGZ_TOPIC.map(v => {
    //   return {
    //     ...v,
    //     id: v.label,
    //     icon: v.label,
    //     url: v.url,
    //     type: v.type,
    //     newdataset: `${v.dataname}${v.dataset}`
    //   };
    // })
  }
];

export const CESIUM_TREE_TRAFFIC_OPTION = [{
  id: "物联感知数据",
  label: "物联感知数据",
  children: WLGZ_TOPIC
}]

export const CESIUM_TREE_EMERGENCY_OPTION = [{
  id: "应急专题",
  label: "应急专题",
  children: EMERGENCY_TOPIC.map(v => {
    return {
      ...v,
      id: v.label,
      icon: v.label,
      url: SERVER_DEFAULT_DATA,
      type: v.type || "mvt",
      newdataset: `${v.dataname}${v.dataset}`
    };
  })
}]

export const CESIUM_TREE_EVENT_AROUND_ANALYSE_OPTION = {
  id: "周边查询",
  label: "周边查询",
  children: EVENT_AROUND_ANALYSE_TOPIC.map(v => {
    return {
      ...v,
      id: v.label,
      icon: v.label,
      url: SERVER_DEFAULT_DATA,
      newdataset: `${v.dataname}${v.dataset}`
    };
  })
}

export const CESIUM_TREE_AROUND_ANALYSE_OPTION = {
  id: "周边查询",
  label: "周边查询",
  children: AROUND_ANALYSE_TOPIC.map(v => {
    return {
      ...v,
      id: v.label,
      icon: v.label,
      newdataset: `${v.dataname}${v.dataset}`
    };
  })
}

export const CESIUM_TREE_EVENT_OPTION = [{
  id: "事件专题",
  label: "事件专题",
  children: EVENT_TOPIC.map(v => {
    return {
      ...v,
      id: v.label,
      icon: v.label,
      url: SERVER_DEFAULT_DATA,
      type: v.type || "mvt",
    };
  })
}]