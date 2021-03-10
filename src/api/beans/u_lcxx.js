import { getDefaultAxios } from "@/api/beans/index.js";
/**
 * [u_canvass]楼层信息
 * @param {*} _option
 */
async function ds(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "name",
          //  lcxx表录入信息没有固定id，故先与lyjbxx联表获取固定id,再通过lyxx表左联获取列表，最后与qyzc联表获取入驻企业信息
          name:"(select distinct b.uuid,b.status,b.rzqy,b.fjh,convert(float,b.jzmj) as jzmj,b.mpfmzj,b.mpfmwy,b.szlc,b.fr,b.lxdh1,c.ssjd,c.name,c.gdid,b.hy from u_lyxx as c left join u_lcxx as b on b.exid = c.gdid)"
        }
      ],
      cols: [ 
        { name: "status", raw: "a.status" },
        { name: "rzqy", raw: "a.rzqy" },
        { name: "fjh", raw: "a.fjh" },
        { name: "jzmj", raw: "a.jzmj" },
        { name: "mpfmzj", raw: "a.mpfmzj" },
        { name: "mpfmwy", raw: "a.mpfmwy" },
        { name: "szlc", raw: "a.szlc" },
        { name: "fr", raw: "a.fr" },
        { name: "lxdh1", raw: "a.lxdh1" },
        { name: "gdid", raw: "a.gdid" },
        { name: "ssjd", raw: "a.ssjd" },
        { name: "name", raw: "a.name" },
        { name: "hy", raw: "a.hy" },
        { name: "uuid", raw: "a.uuid" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "jzmj desc,fjh desc,szlc asc",
      groupby: "",
      having: "",
      distinct: false,
      rowlimit: 0,
      childs: [],
      page: {},
      params: [],
      control: {},
      ..._option
    }
  };
  return await axios.post("/dw/ds", option);
}
async function lyList(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "name",
          //  lcxx表录入信息没有固定id，故先与lyjbxx联表获取固定id,再通过lyxx表左联获取列表，最后与qyzc联表获取入驻企业信息
          name:
            "(select d.*from (select distinct b.uuid,b.status,b.rzqy,b.fjh,convert(float,b.jzmj) as jzmj,b.mpfmzj,b.mpfmwy,b.szlc,b.fr,b.lxdh1,c.ssjd,c.name,c.gdid from u_lyxx as c left join ( select x.*,y.exid as _exid from u_lcxx as x left join u_lyjbxx as y on x.lyid = y.lyxxid) as b on b._exid = c.gdid) as d )"
        }
      ],
      cols: [
        { name: "status", raw: "a.status" },
        { name: "rzqy", raw: "a.rzqy" },
        { name: "fjh", raw: "a.fjh" },
        { name: "jzmj", raw: "a.jzmj" },
        { name: "mpfmzj", raw: "a.mpfmzj" },
        { name: "mpfmwy", raw: "a.mpfmwy" },
        { name: "szlc", raw: "a.szlc" },
        { name: "fr", raw: "a.fr" },
        { name: "lxdh1", raw: "a.lxdh1" },
        { name: "gdid", raw: "a.gdid" },
        { name: "ssjd", raw: "a.ssjd" },
        { name: "name", raw: "a.name" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "jzmj desc,fjh desc,szlc asc",
      groupby: "",
      having: "",
      distinct: false,
      rowlimit: 0,
      childs: [],
      page: {},
      params: [],
      control: {},
      ..._option
    }
  };
  return await axios.post("/dw/ds", option);
}
async function rzqy(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "name",
          name:
            "(select distinct d.rzqy,d.name,d.ssjd from (select distinct b.uuid,b.status,b.rzqy,b.fjh,convert(float,b.jzmj) as jzmj,b.mpfmzj,b.mpfmwy,b.szlc,b.fr,b.lxdh1,c.ssjd,c.name,c.gdid from u_lyxx as c left join u_lcxx as b on b.exid = c.gdid) as d )"
        }
      ],
      cols: [
        { name: "rzqy", raw: "a.rzqy" },
        { name: "ssjd", raw: "a.ssjd" },
        { name: "name", raw: "a.name" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "",
      groupby: "ssjd,rzqy,name",
      having: "",
      distinct: false,
      rowlimit: 0,
      childs: [],
      page: {},
      params: [],
      control: {},
      ..._option
    }
  };
  return await axios.post("/dw/ds", option);
}

const api = {
  ds,
  lyList,
  rzqy
};

export default api;
