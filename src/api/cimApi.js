import axios from "axios";
const BASEURL = "http://10.36.198.161:3000";
const serverInstanec = axios.create();
serverInstanec.defaults.baseURL = BASEURL;

/**
 * axios default
 * @param {*} url
 * @param {*} data
 */
const getAxios = (url = "", params = {}, method = "get") => {
    const option = { url, method };
    method == 'get' ? option.params = params : option.data = params;
    return serverInstanec.request(option).then(res => {
        return res.data ? Promise.resolve(res.data.data) : Promise.reject(res);
    });
};

/**
 * 获取额外视频
 */
const getExtraVideoaa = (data) => {
    return getAxios("/forward/getExtraVideo", data, 'post');
}

export default {
    getExtraVideoaa
}