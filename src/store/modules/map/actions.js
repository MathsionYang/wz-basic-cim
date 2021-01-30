import * as types from "./mutation-types";
import router from "../../../router/index";
import { getMedicalList, getBayonetList } from "api/layerServerAPI";

//  设置卡口数据
export const fetchBayonetList = async ({ commit }) => {
  const { result } = await getBayonetList();
  commit(types.SET_BAYONET_LIST, result);
};
// 设置bim单层物体id
export const SetForceBimIDS = function ({ commit }, data) {
  commit(types.SET_FORCE_BIM_IDS, data);
};
// 设置bim详细数据
export const SetForceBimData = function ({ commit }, data) {
  console.log('SetForceBimDatadata', data);
  commit(types.SET_FORCE_BIM_DATA, data);
};
//点击查看视频监控
export const SetForceBimSP = function ({ commit }, data) {
  console.log("视频监控SetForceBimSP", data);
  commit(types.SET_FORCE_BIM_SP, data);
}
export const SetForceVideo = function ({ commit }, data) {
  console.log("视频监控SetForceVideo", data);
  commit(types.SET_FORCE_Video, data);
}
//点击精模弹出对应地名地址框
export const SetForceBimName = function ({ commit }, data) {
  console.log("白模点击实现", data);
  commit(types.SET_FORCE_BIM_NAME, data);
}
//详情面板有问题
export const SetForceJMData = function ({ commit }, data) {
  console.log('SetForceBimDatadata', data);
  commit(types.SET_FORCE_BIM_DATA, data);
};
//设置biim右侧面板点击事件
export const SetForceBimDataByType = function ({ commit }, data) {
  // console.log('我被调用到了');
  //本来应该在这里进行调用操作的，但是已经写完了，我就不改了
  commit(types.SET_FORCE_BIM_DATABYTYPE, data);
};
// 设置bim房间数据
export const SetForceRoomData = function ({ commit }, data) {
  commit(types.SET_FORCE_ROOM_DATA, data);
};
// 设置折叠1
export const SetCollapse1 = function ({ commit }, bool) {
  commit(types.SET_COLLAPSE1, bool);
};
// 设置折叠2
export const SetCollapse2 = function ({ commit }, bool) {
  commit(types.SET_COLLAPSE2, bool);
};
// 设置图例
export const SetLegendShow = function ({ commit }, bool) {
  commit(types.SET_LEGEND_SHOW, bool);
};
// 设置树
export const SetTree = function ({ commit }, data) {
  commit(types.SET_TREE, data);
};
// 设置地图类型
export const SetCurrentMapType = function ({ commit }, data) {
  commit(types.SET_CURRENT_MAP_TYPE, data);
  commit(types.SET_COLLAPSE1, false);
};
// 设置页签
export const SetTreeCheckedList = function ({ commit, state }, res) {
  const data = [...state.treeCheckedList];
  const needPushArr = [];
  if (res.level === "3") {
    needPushArr.push(res);
  } else if (res.level === "2") {
    res.children.forEach(item => {
      if (!(item.num - 0 === 0 && item.geotype !== "polygon")) {
        item.checked = true;
        needPushArr.push(item);
      }
    });
  }
  needPushArr.forEach(item => {
    for (let i = 0; i < data.length; i++) {
      if (item.alias === data[i].alias) {
        data.splice(i, 1);
        i = data.length;
      }
    }
  });
  commit(types.SET_TREE_CHECKED_LIST, [...needPushArr, ...data]);
  commit(types.SET_TYPE_INDEX, 0);
};
// 删除页签
export const DeleteTreeCheckedList = function ({ commit, state }, res) {
  if (res) {
    const arr = [...state.treeCheckedList];
    const needDelArr = [];
    if (res.level === "3") {
      needDelArr.push(res);
    } else if (res.level === "2") {
      res.children.forEach(item => {
        needDelArr.push(item);
      });
    }
    // 删除页签
    var oldIndex = state.typeIndex;
    needDelArr.forEach(item => {
      let index = -1;
      for (var i in arr) {
        if (item.alias === arr[i].alias) {
          index = i - 0;
          i = arr.length;
        }
      }
      if (index >= 0) {
        arr.splice(index, 1);
        if (index <= oldIndex) {
          oldIndex--;
          if (oldIndex < 0) {
            oldIndex = 0;
          }
          commit(types.SET_TYPE_INDEX, oldIndex);
        }
      }
    });
    commit(types.SET_TREE_CHECKED_LIST, arr);
  } else {
    commit(types.SET_TREE_CHECKED_LIST, []);
  }
};
// 设置页签下标
export const SetTypeIndex = function ({ commit }, data) {
  commit(types.SET_TYPE_INDEX, data);
};
// 设置当前页签的数据
export const SetCurrentOnePoint = function ({ commit }, data) {
  commit(types.SET_CURRENT_ONE_POINT, data);
};
// 设置地图底图是否加载完毕
export const SetMapLoaded = function ({ commit }, data) {
  commit(types.SET_MAP_LOADED, data);
};
// 设置特别的树的勾选的名称
export const SetSpecalTreeName = function ({ commit }, data) {
  if (data) {
    commit(types.SET_CURRENT_MAP_TYPE, "sandian");
    commit(types.SET_SPECAL_TREE_NAME, data);
  }
  commit(types.SET_COLLAPSE1, false);
  commit(types.SET_COLLAPSE2, false);
};
// 设置四色图特别的树的勾选的名称
export const SetFourColorSpecalTreeName = function ({ commit }, data) {
  if (data) {
    commit(types.SET_CURRENT_MAP_TYPE, "fourColorMap");
    commit(types.SET_SPECAL_TREE_NAME, data);
  }
  commit(types.SET_COLLAPSE1, false);
  commit(types.SET_COLLAPSE2, false);
};
// 清空特别的树的勾选的名称
export const clearSpecalTreeName = function ({ commit }, data) {
  if (data === undefined) {
    data = "";
  }
  commit(types.SET_SPECAL_TREE_NAME, data);
};

// 分屏
export const setSplitScreen = function ({ commit }, data) {
  commit(types.SET_SPLIT_SCREEN, data);
};
// 设置一张图目录名
export const SetNameList = function ({ commit }, data) {
  // console.log(router)
  // router.push({ path: '/map' })
  commit(types.SET_NAME_LIST, data);
};
// 跳转
export const clickme = function ({ commit, state }, data) {
  // console.log(router)
  // router.push({ path: '/map' })
  // commit(types.SET_NAME_LIST, data)
  if (data === undefined) {
    data = "";
  }
  console.log("跳转", state.nameList.indexOf(data));
  if (state.nameList.indexOf(data) > -1) {
    commit(types.SET_SPECAL_TREE_NAME, data);
    commit(types.SET_COLLAPSE1, false);
    router.push({ path: "/map" });
  }
};

//  设置医院数据
export const SetHospitalList = ({ commit }, data) => {
  commit(types.SET_HOSPITAL_LIST, data);
};

/**
 * 设置带空间参数的医院信息
 * @param {*} param0
 * @param {*} data
 */
export const setMedicalListWithGeometry = ({ commit }, data) => {
  commit(types.SET_MEDICAL_LIST_WITH_GEOMETRY, data);
};

//  设置发热数据
export const fetchMedicalList = async ({ commit }) => {
  const result = await getMedicalList();
  const res = result.result;
  commit(types.SET_MEDICAL_LIST, res);
};

//  设置监控视频
export const SetRtmpList = ({ commit }, data) => {
  commit(types.SET_RTMP_LIST, data);
};
//  设置弹窗显隐
export const SetIsInfoFrame = ({ commit }, data) => {
  commit(types.SET_IS_INFO_FRAME, data);
};
