/*
 * @Author: eds
 * @Date: 2020-07-28 11:19:46
 * @LastEditTime: 2020-08-27 16:27:02
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\BimAnalyseFloorSection.js
 */
import { BimSourceURL } from "config/server/mapConfig";
const { SCENE_DATA_URL } = BimSourceURL;
const DATASOURCE_NAME = "第一栋";
const DATA_SETS = "门@窗@墙@楼板@结构柱@结构框架@梯段@平台"
  .split("@")
  .map(v => `${DATASOURCE_NAME}:${v}`);

/**
 * async SQL query
 * @param {*} datasetNames
 * @param {*} bimHash
 * @param {*} selectedFloors_number
 */
const do_SQL_QUERY = (bimHash, selectedFloors_number) => {
  return new Promise((resolve, reject) => {
    console.log("bimHash",bimHash)
    var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
    getFeatureParam = new SuperMap.REST.FilterParameter({
      attributeFilter: `所属楼层='${selectedFloors_number}'`
    });
    getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
      queryParameter: getFeatureParam,
      toIndex: -1,
      datasetNames: DATA_SETS
    });
    getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(
      SCENE_DATA_URL,
      {
        eventListeners: {
          processCompleted: queryEventArgs => {
            const IDS = [];
            const selectedFeatures = queryEventArgs.originResult.features;
            console.log("selectedFeatures",selectedFeatures);
            for (let i = 0; i < selectedFeatures.length; i++) {
              const CategoryName = selectedFeatures[i].fieldValues[selectedFeatures[i].fieldNames.indexOf('部件')]
              //const CategoryName = selectedFeatures[i].fieldValues["8"];
              console.log("CategoryName",CategoryName);
              const value = selectedFeatures[i].fieldValues["0"]; //获取SMID值
              IDS.push(parseInt(value) + bimHash[CategoryName] - 1);
            }
            resolve(IDS);
          },
          processFailed: () => {
            resolve([]);
          }
        }
      }
    );
    getFeatureBySQLService.processAsync(getFeatureBySQLParams);
  });
};

/**
 * get SMIDS by floor
 * @param {*} context
 * @param {*} selectedFloors_number
 * @param {*} bimHash
 * @param {*} layer (none)
 */
export const queryFloorByBottom = async (
  context,
  selectedFloors_number,
  bimHash
) => {
  const IDS = await do_SQL_QUERY(bimHash, selectedFloors_number);
  context.SetForceBimIDS(IDS);
  // const PROMISES = [];
  // DATA_SETS.map(async v => {
  //   PROMISES.push(do_SQL_QUERY([v], bimHash, selectedFloors_number));
  // });
  // Promise.all(PROMISES).then(values => {
  //   let IDS = [];
  //   values.map(({ key, value }) => {
  //     key && (IDS = IDS.concat(value));
  //   });
  //   context.SetForceBimIDS(IDS);
  // });
};
