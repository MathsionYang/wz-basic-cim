/*
 * @Author: eds
 * @Date: 2020-08-20 09:03:09
 * @LastEditTime: 2020-09-09 16:21:53
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\api\layerServerAPI.js
 */
import axios from "axios";
const BASEURL = "https://sourceserver.wzcitybrain.com";
const serverInstanec = axios.create();
serverInstanec.defaults.baseURL = BASEURL;

/**
 * axios default
 * @param {*} url
 * @param {*} data
 */
const getAxios = (url = "", data = {}) => {
  return serverInstanec.request({ url, data, method: "get" }).then(res => {
    return res.data ? Promise.resolve(res.data) : Promise.reject(res);
  });
};

/**
 * 获取全市各模块数据
 * @param {*} type 
 * 1.交通
 * 2.医疗
 * 3.
 * 4.经济
 * 5.
 * 8.卡口
 * 11.重点景点流量数据
 * 12.应急体征
 */
const getWzKindsData = (type) => {
  return getAxios(`/statistics/GetCityBraainData?time=202008&type=${type}&businessType=1&workTime=20200101`)
}

/**
 * 获取医院各类数据
 */
export const getMedicalList = () => {
  return getAxios("/statistics/getDataDic");
};

/**
 * 获取卡口各类数据
 */
export const getBayonetList = () => {
  return getWzKindsData(8);
};
