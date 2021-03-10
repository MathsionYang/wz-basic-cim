<template>
  <div class="buildForm" v-show="forceBuilding.name">
    <checklist
      ref="checklist"
      :forceBuilding="forceBuilding"
      :originData="originData"
      @moveMap="moveMap"
    />
    <transition name="frame">
      <div class="buildInform" v-show="BuildDetail">
        <div class="middle">
          <div>
            <p class="smalltitle">
              楼宇画像
              <span class="stateTipHeaderBar"></span>
              <button class="backbutton" @click="reback">关闭</button>
            </p>
            <div class="middle_wrap">
              <div class="info_content">
                <div class="xq_text">
                  <img :src="imgURL" />
                  <ul>
                    <li>{{forceBuilding.name}}</li>
                    <li v-for="(item,index) in info" :key="index">
                      <span class="xq_span">{{item.name}}</span>
                      <span>{{item.value}}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="chart" v-if="Object.keys(asideList.kindHash).length">
          <div>
            <p class="smalltitle">
              业态分布
              <span class="stateTipHeaderBar"></span>
            </p>
            <div id="_chart" class="_chart"></div>
          </div>
        </div>
        <div class="top">
          <div>
            <p class="smalltitle">
              {{toptitle}}
              <span class="stateTipHeaderBar"></span>
              <button class="backbutton" @click="showMore(true)" v-if="isAroundBtn">楼层情况</button>
              <button class="backbutton" @click="showCheckList" v-if="isAroundBtn">分层展示</button>
            </p>
            <div class="zsInfo">
              <table>
                <tbody>
                  <tr v-for="(item,index) in eco_tab" :key="index">
                    <td>{{item.title1}}</td>
                    <td>{{item.value1}}</td>
                    <td>{{item.title2}}</td>
                    <td>{{item.value2}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="frame">
      <div class="more" v-if="isMore">
        <div class="moreBackground">
          <img src="/static/images/common/closeBtn-white.png" class="iconRectangleCopy" @click="showMore(false)" />
          <button class="goCheckBtn" @click="showCheckList" v-if="isAroundBtn">分层展示</button>
          <div>
            <header>闲置状况信息</header>
            <div class="aside">
              <div class="thead">
                <span>所在楼层</span>
                <span>房间号</span>
                <span>闲置面积</span>
                <span>每平方米月租金</span>
                <span>每平方米物业费</span>
              </div>
              <div class="tbody">
                <div v-for="(item,index) in asideList.asideFliter" :key="index">
                  <span>{{item.szlc}} 楼</span>
                  <span>{{item.fjh || `-`}}</span>
                  <span>{{item.jzmj || `-`}} m²</span>
                  <span>{{item.mpfmzj || `-`}} 元</span>
                  <span>{{item.mpfmwy || `-`}} 元</span>
                </div>
                <div class="noRecord" v-if="!asideList.asideChildren.length">- 无闲置信息 -</div>
              </div>
            </div>
          </div>
          <div>
            <header>已入驻企业信息</header>
            <div class="rent">
              <div class="thead">
                <span>所在楼层</span>
                <span>房间号</span>
                <span>商住面积</span>
                <span>每平米月租金</span>
                <span>每平米物业费</span>
                <span>出租/自用</span>
                <span>联系电话</span>
                <span>企业名称</span>
              </div>
              <div class="tbody">
                <div v-for="(item,index) in asideList.rentChildren" :key="index">
                  <span>{{item.szlc}} 楼</span>
                  <span>{{item.fjh || `-`}}</span>
                  <span>{{item.jzmj || `-`}} m²</span>
                  <span>{{item.mpfmzj || `-`}} 元</span>
                  <span>{{item.mpfmwy || `-`}} 元</span>
                  <span>{{item.status == '0' ? '出租' : '自用'}}</span>
                  <span>{{item.lxdh1 || `-`}}</span>
                  <span>{{item.rzqy || `-`}}</span>
                </div>
                <div class="noRecord" v-if="!asideList.rentChildren.length">- 无入驻信息 -</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import checklist from "./checkList.vue";
import echarts from "echarts";
import indexApi from "@/api/beans/u_index";
import lcxxApi from "@/api/beans/u_lcxx";
import { auth_token } from "@/api/beans/auth";
import { WRT_config, JJTS } from "@/api/beans/Tmap";
const { server } = WRT_config;
import { buildCharOption } from "./buildInformChart";
import { clone } from "common/js/util";
const hykinds = [
  "房地产业",
  "国内外贸易",
  "建筑业",
  "交通运输、仓储和邮政业",
  "教育、卫生和社会工作",
  "金融业",
  "居民服务、修理和其他服务业",
  "科学研究和技术服务业",
  "农、林、牧、渔业",
  "其他服务业",
  "其他工业",
  "文化、体育和娱乐业",
  "鞋材、鞋业",
  "信息传输、软件和信息技术服务业",
  "住宿和餐饮业",
  "装备制造业",
  "租赁和商务服务业"
];
export default {
  name: "checkTypeBox",
  data() {
    return {
      server,
      imgURL: null,
      info: [],
      BuildDetail: true,
      toptitle: "楼宇经济分析",
      buildName: null,
      isMore: false,
      originData: [],
      asideList: {
        asideLength: 0,
        asideChildren: [],
        rentChildren: [],
        kindHash: {}
      },
      eco_tab: [],
      // searchbox_display,
      // buidinform_dispaly,
      buildid: '',
      forceBuilding: {},
      showAsideList: false,
      isAroundBtn: true,
      // _asideList,
      checklistShow: false
    };
  },
  components: { checklist },
  watch: {
    forceBuilding: {
      deep: true,
      handler(newVal, val) {
        console.log('newVal', newVal)
        this.imgURL = `${server}/icon/buildingImg/${newVal.name}.png`;

        this.info = [
          {
            name: "属地街道：",
            value: newVal.ssjd
          },
          {
            name: "联系人:",
            value: newVal.xm ? `${newVal.xm.substring(0, 1)}**` : "-"
          },
          {
            name: "联系电话:",
            value: newVal.lxfs || "-"
          },
          {
            name: "楼宇地址：",
            value: newVal.address
          },
          {
            name: "物业公司名称：",
            value: newVal.wygs
          }
        ];
        this.eco_tab = [
          {
            title1: "总面积",
            value1:
              (newVal._mj ? (newVal._mj / 10000).toFixed(2) : "-") + " 万m²",
            title2: "员工数",
            value2: newVal.ygs || "-"
          },
          {
            title1: "租金",
            value1: (newVal.rent || "-") + " 元/m²",
            title2: "物业费",
            value2: (newVal.wyrent || "-") + " 元/m²"
          },
          {
            title1: "入驻企业数",
            value1: newVal._rzqy || "-",
            title2: "入驻率",
            value2:
              (newVal._rzl ? ((1 - newVal._rzl) * 100).toFixed(2) : "-") + " %"
          }
        ];
        this.fetchLcxx();
      }
    },
    checklistShow: {
      handler(newVal, val) {
        this.$refs.checklist.Frameshow = newVal;
      }
    }
  },
  created() {
    console.log('created', this.showAsideList)
    this.login()
    // this.showMore(this.showAsideList);
  },
  mounted() {
    console.log('mounted')
    console.log('forceBuilding', this.forceBuilding)
  },
  computed: {},
  methods: {
    async login() {
      await auth_token("kcadmin");
    },
    fetchBuild({ name, val, url = JJTS + "/2" }, fn) {
      if (!val) return;
      console.log("entry-fetchBuild");
      const that = this;
      const arr = [0, 0, 0];
      let lyhx = {};

      that.buildid = val;
      indexApi.lcxx({ where: `gdid='${that.buildid}'` }).then(({ data }) => {
        if (!data.length) return;
        data.map(item => {
          if (item.status == "0") {
            //入驻企业数
            arr[0]++;
          } else if (item.status == "2") {
            //闲置面积
            arr[2] += item.jzmj ? parseFloat(item.jzmj) : 0;
          }
          //总面积
          arr[1] += item.jzmj ? parseFloat(item.jzmj) : 0;
        });
        lyhx = data.map(item => {
          return {
            ...item,
            _mj: arr[1],
            _rzqy: arr[0],
            _rzl: arr[1] && arr[2] ? arr[2] / arr[1] : ""
          };
        });
        // that.$parent.forceBuilding = lyhx[0];
        console.log('lyhx', lyhx)
        this.forceBuilding = lyhx[0];
      });
      // that.changeBuildingDisplay(() => {
      //   that.$parent.isAside = +new Date();
      // });
    },
    fetchLcxx() {
      const { gdid } = this.forceBuilding;
      const asideList = {
        gdid,
        asideLength: 0,
        asideChildren: [],
        asideFliter: [],
        rentChildren: [],
        kindHash: {}
      };
      const kindHash = {};
      let sum = 0;
      lcxxApi.ds({ where: `gdid = '${gdid}'` }).then(({ data }) => {
        this.originData = data;
        data.map(item => {
          if (item.status) {
            if (item.status == "2") {
              asideList.asideChildren.push(item);
              asideList.asideLength++;
            } else {
              asideList.rentChildren.push(item);
            }
          }
          if (item.status != "2" && item.hy && ~hykinds.indexOf(item.hy)) {
            if (!kindHash[item.hy]) {
              kindHash[item.hy] = 0;
            }
            sum++;
            kindHash[item.hy]++;
          }
        });
        asideList.kindHash = kindHash;
        //  如果外部有闲置搜索的结果，则在内部列表展示符合要求的闲置结果
        // asideList.asideFliter =
        //   this._asideList.asideChildren && this._asideList.asideChildren.length
        //     ? [...this._asideList.asideChildren]
        //     : [...asideList.asideChildren];
        asideList.asideFliter =[...asideList.asideChildren];
        this.asideList = asideList;
        this.$nextTick(() => {
          if (Object.keys(asideList.kindHash).length) {
            this.doChart(sum);
          }
        });
      });
    },
    doChart(sum) {
      const chart = echarts.init(document.getElementById("_chart"));
      // const option = this.$util.clone(buildCharOption);
      const option = clone(buildCharOption);
      const chartData = [];
      const chartLegend = [];
      for (let v in this.asideList.kindHash) {
        chartLegend.push(v);
        chartData.push({
          name: v,
          value: ((this.asideList.kindHash[v] / sum) * 100).toFixed(2)
        });
      }
      //option.legend.data = chartLegend;
      option.series[0].data = chartData;
      chart.setOption(option);
    },
    showCheckList() {
      this.isMore = false;
      this.$refs.checklist.showCheckList();
      this.$parent.fcClick = true;
      // this.changeMapLoc(true);
    },
    reback() {
      // this.$parent.searchbox_display = true;
      // this.$parent.buidinform_dispaly = false;
      this.forceBuilding = {}
    },
    showMore(TAG) {
      this.isMore = TAG;
      // this.changeMapLoc(false);
    },
    fetchCompany(uuid) {
      this.$parent.fetchCompany(uuid);
    },
    moveMap() {
      this.$parent.fcClick = false;
    },
    // changeMapLoc(isOffset) {
    //   this.$parent.changeMapLoc(isOffset);
    // }
  }
};
</script>

<style scoped lang="less">
@import url("./buildInform.less");
</style>