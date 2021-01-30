import * as types from './mutation-types'
import { uuid } from 'common/js/util'
// 设置折叠2
export const SetCollapse = function({ commit }, bool) {
  commit(types.SET_COLLAPSE, bool)
}
// 设置台风详情
export const SetTyphoonInfo = function({ commit }, data) {
  commit(types.SET_TYPHOON_INFO, data)
}
// 设置监测类型
export const SetMonitorType = function({ commit }, data) {
  commit(types.SET_MONITOR_TYPE, data)
}
// 设置当前监测类型
export const SetCurrentMonitorType = function({ commit }, data) {
  commit(types.SET_CURRENT_MONITOR_TYPE, data)
}
// 设置当前监测类型
export const SetCurrentMonitorTypeArr = function({ commit }, data) {
  const arr = [...data]
  commit(types.SET_CURRENT_MONITOR_TYPE_ARR, arr)
}
// 设置给地图的点
export const SetSpecalPoint = function({ commit }, data) {
  const obj = JSON.parse(JSON.stringify(data))
  obj.t = uuid()
  commit(types.SET_SPECAL_POINT, obj)
}
// 设置当前水情监测类型
export const SetCurrentWaterState = function({ commit }, data) {
  commit(types.SET_WATER_STATE, data)
}
// 设置需展示点图层
export const SetCurrentPoints = function({ commit }, data) {
  commit(types.SET_CURRENT_POINTS, data)
}
// 删除需展示点图层
export const DeleteCurrentPoints = function({ commit }, data) {
  commit(types.DELETE_CURRENT_POINTS, data)
}
// 设置
export const SetMapLoaded = function({ commit }, data) {
  commit(types.SET_MAP_LOADED, data)
}
// 清空所有图层
export const SetClearAllLayers = function({ commit }, data) {
  commit(types.SET_CLEAR_ALL_LAYERS, data)
}
// 跳转到预警
export const SetJumpWarning = function({ commit }, data) {
  commit(types.SET_JUMP_WARNING, data)
}
// 单兵列表数据
export const SetDanbingList = function({ commit }, data) {
  commit(types.SET_DANBINGLIST, data)
}
// 气象信息预警
export const SetQixiangWarning = function({ commit }, data) {
  commit(types.SET_QIXIANG_WARNING, data)
}
//视频监控一级目录id
export const SetVideoFirstMenuID  = function({ commit },data){
  commit(types.SET_FIRST_MENU_ID,data)
}
