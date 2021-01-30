/*
 * @Author: eds
 * @Date: 2020-07-01 15:22:07
 * @LastEditTime: 2020-08-06 15:17:38
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\store\modules\map\state.js
 */
const state = {
  collapse1: false, // 折叠左侧
  collapse2: true, // 折叠右侧
  forceMapTypeBase: true,
  splitScreen: false, // 分屏是否开启
  legendShow: true, // 显示图例
  tree: [], // 左侧树数据
  // currentMapType: 'juhe', // 'fourColorMap', // 地图类型  四色图
  currentMapType: "cesiumMap", // 地图类型  四色图 sandian cesiumMap
  treeCheckedList: [], // 所有选中的树和地图点的数据
  typeIndex: 0, // 底部初始激活下标
  currentOnePoint: {}, // 地图当前图层的数据
  mapLoaded: false, // 地图底图是否加载完毕
  nameList: [],
  specalTreeName: "", // 根据名称展示指定tree节点
  //  3d
  primitivelist: [],
  //  bim
  forceBimIDS: [],
  forceBimData: [],
  forceBimSP:[],
  forceVideo:[],
  forceBimName:[],
  forceBimDataByType:[],
  forceRoomData: [],
  //  详情
  isInfoFrame: false,
  //  视频列表
  rtmpList: [],
  //  医院数据
  medicalList: {},
  medicalListWithGeometry: [],
  //  医院
  hospitalList: [],
  //  卡口数据
  bayonetList: {},
};
export default state;
