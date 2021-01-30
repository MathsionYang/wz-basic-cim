/*
 * @Author: eds
 * @Date: 2020-07-01 15:22:07
 * @LastEditTime: 2020-08-06 10:45:18
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\store\modules\map\getters.js
 */

import state from "./state";

// 获取state
export const collapse1 = state => state.collapse1;
export const collapse2 = state => state.collapse2;
export const splitScreen = state => state.splitScreen;
export const legendShow = state => state.legendShow;
export const tree = state => state.tree;
export const forceMapTypeBase = state => state.forceMapTypeBase;
export const currentMapType = state => state.currentMapType;
export const treeCheckedList = state => state.treeCheckedList;
export const typeIndex = state => state.typeIndex;
export const currentOnePoint = state => state.currentOnePoint;
export const mapLoaded = state => state.mapLoaded;
export const specalTreeName = state => state.specalTreeName;
export const forceBimIDS = state => state.forceBimIDS;
export const forceBimData = state => state.forceBimData;
export const forceBimSP  = state => state.forceBimSP;
export const forceVideo  = state => state.forceVideo;
export const forceBimName = state => state.forceBimName;
export const forceRoomData = state => state.forceRoomData;
export const isInfoFrame = state => state.isInfoFrame;
export const rtmpList = state => state.rtmpList;
export const bayonetList = state => state.bayonetList;
export const medicalList = state => state.medicalList;
export const medicalListWithGeometry = state => state.medicalListWithGeometry;
export const hospitalList = state => state.hospitalList;
export const forceBimDataByType = state => state.forceBimDataByType;
