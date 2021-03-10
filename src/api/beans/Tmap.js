const TO_CONFIG = {
  ARCGIS_API_URL:
    "http://172.20.89.68:5001/lc/libs/arcgis_js_v412_api/arcgis_js_api/library/4.12/dojo/dojo.js",
  LOCAL_DOMAIN: "https://server.lcmap.com",
  LOCAL_HOST: "http://172.20.89.59/server/rest/services",
  FORWARD_HOST: "http://172.20.89.59/server/rest/services",
  OTHER_HOST: "https://services.wzmap.gov.cn/server/rest/services",
  SERVER_HOST: "http://172.20.89.68:5001/s/lc",
  API_HOST: "http://172.20.89.68:5001",
  LOGIN_HOST: "http://lysb.lucheng.gov.cn"
};

const {
  ARCGIS_API_URL,
  LOCAL_DOMAIN,
  LOCAL_HOST,
  FORWARD_HOST,
  OTHER_HOST,
  SERVER_HOST,
  API_HOST,
  LOGIN_HOST
} = TO_CONFIG;

export const WRT_config = {
  server: SERVER_HOST,
  serverCompatible: API_HOST,
  etag: "+mOUb1hDtJA=",
  token: "",
  login: LOGIN_HOST
};

//  经济特色    [0.产业平台 1.重点项目 2.重点楼宇 3.专业市场 4.招商地块 5.百强企业]
export const JJTS = `${FORWARD_HOST}/lcjjdt/jjts/MapServer`;