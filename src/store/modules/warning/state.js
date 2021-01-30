const state = {
  collapse: false, // 折叠
  typhoonInfo: {}, // 台风详情
  monitorType: [], // 监测类型
  currentMonitorType: {}, // 当前的监测类型
  currentMonitorTypeArr: [], // 当前的监测类型数组
  specalPoint: {}, // 点击传给地图的点
  waterState: '水利', // 水情监测
  currentPoints: [], // 当前需展示的点图层
  mapLoaded: false,
  qixiangWarning: [], // 气象信息预警
  jumpWarning: { value: '', index: 0, t: null }, // 跳转到预警
  clearAllLayers: { value: false, t: null }, // 清空所有图层
  danbingList: {},
  videoFirstMenuID:{},
}
export default state
