// 定义修改操作
import * as types from './mutation-types'

const mutations = {
  [types.SET_COLLAPSE](state, bool) {
    state.collapse = bool
  },
  [types.SET_TYPHOON_INFO](state, data) {
    state.typhoonInfo = data
  },
  [types.SET_MONITOR_TYPE](state, data) {
    state.monitorType = data
  },
  [types.SET_CURRENT_MONITOR_TYPE](state, data) {
    state.currentMonitorType = data
  },
  [types.SET_CURRENT_MONITOR_TYPE_ARR](state, data) {
    state.currentMonitorTypeArr = data
  },
  [types.SET_SPECAL_POINT](state, data) {
    state.specalPoint = data
  },
  [types.SET_FIRST_MENU_ID](state,data){
    state.videoFirstMenuID = data;
  },
  [types.SET_WATER_STATE](state, data) {
    state.waterState = data
  },
  [types.SET_CURRENT_POINTS](state, data) {
    if (state.currentPoints.indexOf(data) === -1) {
      state.currentPoints = state.currentPoints.concat([data])
    }
  },
  [types.DELETE_CURRENT_POINTS](state, data) {
    if (state.currentPoints.indexOf(data) > -1) {
      state.currentPoints.splice(state.currentPoints.indexOf(data), 1)
    }
  },
  [types.SET_MAP_LOADED](state, data) {
    state.mapLoaded = data
  },
  [types.SET_CLEAR_ALL_LAYERS](state, data) {
    state.clearAllLayers = data
  },
  [types.SET_JUMP_WARNING](state, data) {
    state.jumpWarning = data
  },
  [types.SET_DANBINGLIST](state, data) {
    state.danbingList = data
  },
  [types.SET_QIXIANG_WARNING](state, data) {
    state.qixiangWarning = data
  }
}

export default mutations
