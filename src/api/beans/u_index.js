import { getDefaultAxios } from "@/api/beans/index.js";
/**
 * [u_index]兴趣点
 * @param {*} _option
 */
async function ds(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 30,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "f",
          orm: "",
          name:
            "(select a.name as name,a.ssjd as ssjd,a.jj as jj,'1' as type,'专业市场' as param from u_zyscxxb as a union select b.name as name,b.ssjd as ssjd,b.jj as jj,'0' as type,'产业平台' as param from u_cypt as b union select c.name as name,c.duty as duty,c.buildtype as buildtype,'2' as type,'重大产业项目' as param  from u_zdcyxmb as c union select d.name as name,d.ssjd as ssjd,d.address as address,'3' as type,'优质楼宇' as param from u_lyxx as d union select e.name as name,e.ssjd as ssjd,e.address as address,'4' as type,'招商地块' as param from u_canvass as e)",
          updateflag: 1
        }
      ],
      cols: [
        { name: "name", raw: "f.name", keyflag: 1 },
        { name: "ssjd", raw: "f.ssjd" },
        { name: "jj", raw: "f.jj" },
        { name: "type", raw: "f.type" },
        { name: "param", raw: "f.param" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "type",
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
//专业市场
async function zysc(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 30,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name: "u_zyscxxb",
          updateflag: 1
        },
        {
          alias: "b",
          orm: "",
          name: "u_zyscjjb",
          updateflag: 1
        }
      ],
      cols: [
        { name: "name", raw: "a.name", keyflag: 1 },
        { name: "address", raw: "a.address" },
        { name: "dw", raw: "a.dw" },
        { name: "zdmj", raw: "a.zdmj" },
        { name: "yymj", raw: "a.yymj" },
        { name: "rzsh", raw: "a.rzsh" },
        { name: "jj", raw: "a.jj" },
        { name: "njye", raw: "b.njye" },
        { name: "ss", raw: "b.ss" },
        { name: "type", raw: "1" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "",
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
async function zdcyxmb(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 30,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name: "u_zdcyxmb",
          updateflag: 1
        }
      ],
      cols: [
        { name: "name", raw: "a.name", keyflag: 1 },
        { name: "buildtype", raw: "a.buildtype" },
        { name: "buildinfo", raw: "a.buildinfo" },
        { name: "invest", raw: "a.invest" },
        { name: "plan2019", raw: "a.plan2019" },
        { name: "invest2019", raw: "a.invest2019" },
        { name: "planhalf", raw: "a.planhalf" },
        { name: "investhalf", raw: "a.investhalf" },
        { name: "rate", raw: "a.rate" },
        { name: "duty", raw: "a.duty" },
        { name: "type", raw: "2" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "",
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
//楼宇信息
async function lyxx(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 30,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name: "(select b.* ,c.gzzz,c.xm,c.lxfs from u_lyxx as b left join (select * from u_lylxr where gzzz = '招商员') as c  on b.gdid = c.gdid )",
          updateflag: 1
        }
      ],
      cols: [
        { name: "name", raw: "a.name", keyflag: 1 },
        { name: "ssjd", raw: "a.ssjd" },
        { name: "address", raw: "a.address" },
        { name: "yzdw", raw: "a.yzdw" },
        { name: "wygs", raw: "a.wygs" },
        { name: "cydw", raw: "a.cydw" },
        { name: "area", raw: "a.area" },
        { name: "rzqys", raw: "a.rzqys" },
        { name: "rzrate", raw: "a.rzrate" },
        { name: "ygs", raw: "a.ygs" },
        { name: "rent", raw: "a.rent" },
        { name: "wyrent", raw: "a.wyrent" },
        { name: "bz", raw: "a.bz" },
        { name: "gdid", raw: "a.gdid" },
        { name: "type", raw: "3" },
        { name: "xm", raw: "a.xm" },
        { name: "lxfs", raw: "a.lxfs" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "",
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
//产业平台
async function cypt(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 30,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name: "u_cypt",
          updateflag: 1
        }
      ],
      cols: [
        { name: "name", raw: "a.name", keyflag: 1 },
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "",
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
//一带八区
async function Eight(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 30,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name: "u_cybjxq",
          updateflag: 1
        }
      ],
      cols: [
        { name: "xmmc", raw: "a.xmmc", keyflag: 1 },
        { name: "ml", raw: "a.ml", keyflag: 1 },
        { name: "nr", raw: "a.nr", keyflag: 1 }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "",
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
//楼层信息
async function lcxx(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: "",
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name: "(select f.*,e.* from (select b.* ,c.gzzz,c.xm,c.lxfs from u_lyxx as b left join (select * from u_lylxr where gzzz = '招商员') as c  on b.gdid = c.gdid) as f left join (select * from u_lcxx) as e on f.gdid = e.exid )",
          updateflag: 1
        }
      ],
      cols: [
        { name: "name", raw: "a.name", keyflag: 1 },
        { name: "ssjd", raw: "a.ssjd" },
        { name: "address", raw: "a.address" },
        { name: "yzdw", raw: "a.yzdw" },
        { name: "wygs", raw: "a.wygs" },
        { name: "cydw", raw: "a.cydw" },
        { name: "area", raw: "a.area" },
        { name: "rzqys", raw: "a.rzqys" },
        { name: "ygs", raw: "a.ygs" },
        { name: "rent", raw: "a.rent" },
        { name: "wyrent", raw: "a.wyrent" },
        { name: "gdid", raw: "a.gdid" },
        { name: "xm", raw: "a.xm" },
        { name: "lxfs", raw: "a.lxfs" },
        { name: "jzmj", raw: "a.jzmj" },
        { name: "rzqy", raw: "a.rzqy" },
        { name: "status", raw: "a.status" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "",
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
const api = {
  ds,
  zysc,
  zdcyxmb,
  lyxx,
  cypt,
  lcxx,
  Eight
};

export default api;
