<!--
 * @Author: eds
 * @Date: 2020-08-12 14:32:09
 * @LastEditTime: 2020-09-04 16:33:01
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\commonFrame\DetailPopup\DetailPopup.vue
-->
<template>
  <div id="forcePopUp" v-show="forcePosition.x && forcePosition.y">
    <div
      id="forcePopUpContent"
      class="leaflet-popup"
      :style="{
        transform: `translate3d(${forcePosition.x}px,${forcePosition.y}px, 0)`,
      }"
    >
      <a class="leaflet-popup-close-button" href="#" @click="closePopup">×</a>
      <div class="leaflet-popup-content-wrapper">
        <div class="toubu">
          {{ forceEntity.name }}
        </div>
        <div class="zhongbu">
          <div
            v-for="(item, key, index) in forceEntity.fix_data"
            class="liebiao"
            :key="index"
            v-show="item && !~filterKey.indexOf(key) && index < 6"
          >
            <div style="display: inline-block">{{ key }}:</div>
            <div style="display: inline-block">{{ item }}</div>
          </div>
          <!-- <ul class="content-body">
            <li
              v-for="(item, key, index) in forceEntity.fix_data"
              :key="index"
              v-show="item && !~filterKey.indexOf(key) && index < 6"
            >
              <span>{{ key }}</span>
              <span>{{ item }}</span>
            </li>
          </ul> -->
        </div>

        <!-- <div id="forcePopUpLink" class="leaflet-popup-content">

        </div> -->
        <div
          class="extra-tab extra-tab_SP"
          :class="{ active: extraTabActive == 'sp' }"
          @click="doVideoRtmp"
        ></div>
        <div
          class="extra-tab extra-tab_FX"
          :class="{ active: extraTabActive == 'fx' }"
          @click="doAroundSourceAnalyse"
        ></div>
        <div
          class="extra-tab extra-tab_RKDT"
          :class="{ active: extraTabActive == 'rkdt' }"
          @click="doCircleBuffer"
        ></div>
        <div
          class="overview"
          v-if="forceEntity.fix_data && forceEntity.fix_data['全景地址']"
          @click="isFrame = forceEntity.fix_data['全景地址']"
        >
          查看全景>>
        </div>
        <div
          class="overview"
          v-if="forceEntity.fix_data && forceEntity.fix_data['项目代码']"
          @click="
            isFrame =
              'https://wzdjdm.wzcitybrain.com:8888/html/oneMap/projectInfo.html?project_code=' +
              forceEntity.fix_data['项目代码'] +
              '&id=' +
              forceEntity.fix_data['项目编号']
          "
        >
          查看全过程信息>>
        </div>
        <div class="around-people" v-if="buffer && buffer.success">
          <!-- <img src="/static/images/common/frameline@2x.png" /> -->
          <div>
            <header>周边实时人口</header>
            <div>
              <p>范围：500米</p>
              <strong>{{ `人数：${buffer.data || "-"}人` }}</strong>
              <p>{{ buffer.task_time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="side-info" v-show="showSide">
      <div class="info-header">
        <div class="title">信息详情</div>
        <div class="decorate"></div>
        <div class="close" @click="showSide = false"></div>
        <!-- <div class="tab-list">
          <div class="tab-item active">基本信息</div>
        </div> -->
      </div>
      <ul class="info-content">
        <li
          class="info-item"
          v-for="(item, key, index) in forceEntity.fix_data"
          :key="index"
          v-show="item && !~filterKey.indexOf(key)"
        >
          <span class="key" :title="key">{{ key }}</span>
          <span class="value" :title="item">{{ item }}</span>
        </li>
      </ul>
    </div>
    <div class="extra-frame" v-if="isFrame">
      <span @click="isFrame = false">X</span><iframe :src="isFrame" />
    </div>
    <div class="container" v-show="isLJ">
      <ul id="nav">
        <li><a href="javascript:;" class="snf-nav active">page1</a></li>
        <li><a href="javascript:;" class="snf-nav">page2</a></li>
        <li><a href="javascript:;" class="snf-nav">page3</a></li>
        <li><a href="javascript:;" class="snf-nav">page4</a></li>
      </ul>
      <span @click="isFrame = false">X</span>
      <div class="ljxqlabel">
        <div id="main">
          <div class="snf-page">
            <table class="hovertable">
              <tr>
                <td class="table1">项目名称</td>
                <td class="table2" colspan="3">
                  温州市兴元建筑施工图审查咨询有限公司
                </td>
              </tr>
              <tr>
                <td class="table1">项目编号</td>
                <td class="table3">温州市兴元建筑施工图审查咨询有限公司</td>
                <td class="table1">施工许可证号</td>
                <td class="table3">项目 1C</td>
              </tr>

              <tr>
                <td class="table1">项目所在地</td>
                <td class="table3">1783485486</td>
                <td class="table1">工程类型</td>
                <td class="table3">工程类型</td>
              </tr>

              <tr>
                <td class="table1">工程用途</td>
                <td class="table3">项目 1C</td>
                <td class="table1">工程状态</td>
                <td class="table3">1783485486</td>
              </tr>

              <tr>
                <td class="table1">项目经理</td>
                <td class="table3">项目经理</td>
                <td class="table1">设计经理</td>
                <td class="table3">项目 1C</td>
              </tr>
              <tr>
                <td class="table1">施工经理</td>
                <td class="table3">1783485486</td>
                <td class="table1">发包形式</td>
                <td class="table3">发包形式</td>
              </tr>
              <tr>
                <td class="table1">投资额</td>
                <td class="table3">项目 1C</td>
                <td class="table1">投资性质</td>
                <td class="table3">1783485486</td>
              </tr>
            </table>
          </div>
          <div class="snf-page">
            <table class="hovertable">
              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  项目名称
                </td>
                <td
                  class="table2"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                  colspan="3"
                >
                  温州市兴元建筑施工图审查咨询有限公司
                </td>
              </tr>
              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  项目编号
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  温州市兴元建筑施工图审查咨询有限公司
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  施工许可证号
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  项目 1C
                </td>
              </tr>

              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  项目所在地
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  1783485486
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  工程类型
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  工程类型
                </td>
              </tr>

              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  工程用途
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  项目 1C
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  工程状态
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  1783485486
                </td>
              </tr>

              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  项目经理
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  项目经理
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  设计经理
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  项目 1C
                </td>
              </tr>
              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  施工经理
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  1783485486
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  发包形式
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  发包形式
                </td>
              </tr>
              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  投资额
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  项目 1C
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  投资性质
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  1783485486
                </td>
              </tr>
            </table>
          </div>
          <div class="snf-page">
            <table class="hovertable">
              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  项目名称
                </td>
                <td
                  class="table2"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                  colspan="3"
                >
                  温州市兴元建筑施工图审查咨询有限公司
                </td>
              </tr>
              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  项目编号
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  温州市兴元建筑施工图审查咨询有限公司
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  施工许可证号
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  项目 1C
                </td>
              </tr>

              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  项目所在地
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  1783485486
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  工程类型
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  工程类型
                </td>
              </tr>

              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  工程用途
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  项目 1C
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  工程状态
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  1783485486
                </td>
              </tr>

              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  项目经理
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  项目经理
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  设计经理
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  项目 1C
                </td>
              </tr>
              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  施工经理
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  1783485486
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  发包形式
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  发包形式
                </td>
              </tr>
              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  投资额
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  项目 1C
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  投资性质
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  1783485486
                </td>
              </tr>
            </table>
          </div>
          <div class="snf-page">
            <table class="hovertable">
              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  项目名称
                </td>
                <td
                  class="table2"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                  colspan="3"
                >
                  温州市兴元建筑施工图审查咨询有限公司
                </td>
              </tr>
              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  项目编号
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  温州市兴元建筑施工图审查咨询有限公司
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  施工许可证号
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  项目 1C
                </td>
              </tr>

              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  项目所在地
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  1783485486
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  工程类型
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  工程类型
                </td>
              </tr>

              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  工程用途
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  项目 1C
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  工程状态
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  1783485486
                </td>
              </tr>

              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  项目经理
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  项目经理
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  设计经理
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  项目 1C
                </td>
              </tr>
              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  施工经理
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  1783485486
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  发包形式
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  发包形式
                </td>
              </tr>
              <tr>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  投资额
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  项目 1C
                </td>
                <td
                  class="table1"
                  onmouseout="this.style.backgroundColor='#a2c4fa';"
                >
                  投资性质
                </td>
                <td
                  class="table3"
                  onmouseover="this.style.backgroundColor='#4085f4';"
                  onmouseout="this.style.backgroundColor='#bdd5fc';"
                >
                  1783485486
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { simpleNavFollow } from "./simpleNavFollowing";

export default {
  data() {
    return {
      forceEntity: {},
      forcePosition: {},
      buffer: null,
      filterKey: ["永久固定码", "唯一码", "分类代码", "全景地址"],
      showSide: false,
      extraTabActive: "",
      isFrame: false,
      isSelected: "",
      isLJ: false,
    };
  },
  async mounted() {
    this.eventRegsiter();
  },
  methods: {
    // 防抖
    // debounce(func, wait, immediate) {
    //   var timeout, args, context, timestamp, result;
    //   var later = function () {
    //     // 据上一次触发时间间隔
    //     var last = new Date() - timestamp;
    //     // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    //     if (last < wait && last > 0) {
    //       timeout = setTimeout(later, wait - last);
    //     } else {
    //       timeout = null;
    //       // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
    //       if (!immediate) {
    //         result = func.apply(context, args);
    //         if (!timeout) context = args = null;
    //       }
    //     }
    //   };

    //   return function () {
    //     context = this;
    //     args = arguments;
    //     timestamp = new Date();
    //     var callNow = immediate && !timeout;
    //     // 如果延时不存在，重新设定延时
    //     if (!timeout) timeout = setTimeout(later, wait);
    //     if (callNow) {
    //       result = func.apply(context, args);
    //       context = args = null;
    //     }

    //     return result;
    //   };
    // },
    // navClick(e) {
    //   console.log("lieb", e);
    //   var scrollBox1 = document.querySelector(".container");
    //   scrollBox1.scrollTo(0, [...e.target.id].pop() * 500);
    //   this.isSelected = e.target.id + "-selected";
    // },
    bindHandler() {
      var snf = simpleNavFollow({
        parentElement: "#main", //内容类的父元素
        nav: ".snf-nav", //导航类
        page: ".snf-page", //内容类
        leaveTop: 0, //离父类距离
        initTo: 0, //初始跳转
        animation: 400, //动画时间
      });
    },
    eventRegsiter() {
      this.$bus.$on("cesium-3d-around-people", ({ id, result }) => {
        this.buffer = result;
      });
      this.$bus.$on("cesium-3d-detail-pop-clear", () => {
        this.closePopup();
      });
    },
    /**
     *  详情点赋值
     *  @param {object} forceEntity 详情点信息
     */
    getForceEntity(forceEntity) {
      console.log("forceEntity", forceEntity);
      this.forceEntity = forceEntity;
      if (
        !forceEntity._NODEID_.includes("事件") &&
        !forceEntity._NODEID_.includes("老旧小区")
      ) {
        this.showSide = true;
        this.buffer = null;
        this.$bus.$emit("cesium-3d-population-circle", { doDraw: false });
        this.$bus.$emit("cesium-3d-rtmpFetch-cb");
      } else if (forceEntity._NODEID_.includes("老旧小区")) {
        this.isLJ = true;
      } else {
        this.showSide = false;
      }
    },
    /**
     *  框体移动
     *  @param {object} position
     */
    renderForceEntity() {
      const forceEntity = this.forceEntity;
      if (forceEntity.fix_data) {
        const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          window.earth.scene,
          forceEntity.position
        );
        if (
          this.forcePosition.x !== pointToWindow.x ||
          this.forcePosition.y !== pointToWindow.y
        ) {
          this.forcePosition = {
            x:
              pointToWindow.x -
              (($(".leaflet-popup-content-wrapper").width() || 0) * 1.2) / 2,
            y:
              pointToWindow.y -
              ($(".leaflet-popup-content-wrapper").height() || 0) -
              90,
          };
        }
      }
    },
    /**
     * 人口缓冲区（直接pop组件里画）
     * 开专门的缓冲区collection
     */
    doCircleBuffer() {
      //this.extraTabActive = 'rkdt'
      this.buffer = this.buffer ? null : {};
      const { name, geometry } = this.forceEntity;
      this.$bus.$emit("cesium-3d-population-circle", {
        doDraw: this.buffer,
        id: name,
        geometry: {
          lng: geometry.x,
          lat: geometry.y,
        },
      });
    },
    /**
     * 仅传参数给RtmpVideo组件,不参与后续功能
     * @param {object} param0 该医疗点的对象信息
     */
    doVideoRtmp() {
      //this.extraTabActive = 'sp'
      const { geometry, name } = this.forceEntity;
      const { x, y } = geometry;
      this.$bus.$emit("cesium-3d-rtmpFetch", {
        shortname: name,
        geometry: { lng: x, lat: y },
      });
    },
    /**
     * 周边分析跳转
     */
    doAroundSourceAnalyse() {
      // this.showSide = false
      const { geometry } = this.forceEntity;
      let type = this.forceEntity._NODEID_.includes("事件")
        ? "event"
        : "source";
      this.$bus.$emit("cesium-3d-around-analyse-pick", { geometry, type });
    },
    closePopup() {
      this.forcePosition = {};
      this.forceEntity = {};
      this.buffer = null;
      this.$bus.$emit("cesium-3d-population-circle", { doDraw: false });
      this.$bus.$emit("cesium-3d-rtmpFetch-cb");
      // this.$parent.$refs.aroundSourceAnalyse.closeAroundSourceAnalyse()
    },
  },
  watch: {
    isLJ(val) {
      if (val) {
        setTimeout(() => {
          this.bindHandler()
        }, 200)
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./aroundPeople.less");

.table1 {
  width: 14%;
  text-align: center;
  vertical-align: middle;
  line-height: 0.2rem;
  background-image: url(/static/images/mode-ico/tb.png);
  background-size: 100% 100%;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 20px;
  color: #ffffff;
  opacity: 1;
}
.table2 {
  width: 42%;
  text-align: center;
  vertical-align: middle;
  line-height: 0.2rem;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #ffffff;
  opacity: 1;
}
.table3 {
  width: 42%;
  text-align: center;
  vertical-align: middle;
  line-height: 0.2rem;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #ffffff;
  opacity: 1;
}
table.hovertable {
  font-family: verdana, arial, sans-serif;
  font-size: 11px;
  color: #333333;
  // border-width: 1px;
  // border-color: #999999;
  // border-collapse: collapse;
  background-size: 100% 100%;
  background-image: url(/static/images/mode-ico/bg@2x.png);
}
table.hovertable th {
  // border-width: 1px;
  // padding: 8px;
  // border-style: solid;
  // border-color: #a9c6c9;
}
table.hovertable tr {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #4eda8e;
  height: 4vh;
}
table.hovertable td {
  // border-width: 1px;
  // padding: 8px;
  // border-style: solid;
  // border-color: #a9c6c9;
}
.table-boxs {
  margin-bottom: 0.3rem;
  border-top: 0.01rem solid #0d5978;
  border-left: 0.01rem solid #0d5978;
  overflow: hidden;
  &.no-line {
    border-top: none;
  }
  .item1 {
    position: relative;
    float: left;
    width: 50%;
    .key1 {
      color: #000000;
      background: #f5f7fa;
      width: 1.2rem;
      height: 0.32rem;
      line-height: 0.32rem;
      text-align: center;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      border-right: 0.01rem solid #024364;
      border-bottom: 0.01rem solid #2c5a73;
      font-size: 0.16rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 0 0.05rem;
    }
    .value1 {
      color: #000000;
      width: 100%;
      height: 0.32rem;
      line-height: 0.32rem;
      border-right: 0.01rem solid #024364;
      border-bottom: 0.01rem solid #024364;
      padding: 0 0.1rem 0 1.3rem;
      display: block;
      font-size: 0.16rem;
      font-weight: 400;
      .no-wrap();
    }
  }
  .item2 {
    position: relative;
    float: left;
    width: 28%;
    .key2 {
      color: #000000;
      background: #f5f7fa;
      width: 1.2rem;
      height: 0.32rem;
      line-height: 0.32rem;
      text-align: center;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      border-right: 0.01rem solid #024364;
      border-bottom: 0.01rem solid #2c5a73;
      font-size: 0.16rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 0 0.05rem;
    }
    .value2 {
      color: rgb(0, 0, 0);
      width: 2.1rem;
      height: 0.32rem;
      line-height: 0.32rem;
      border-right: 0.01rem solid #024364;
      border-bottom: 0.01rem solid #024364;
      padding: 0 0.1rem 0 1.3rem;
      display: block;
      font-size: 0.16rem;
      font-weight: 400;
      .no-wrap();
    }
  }
  .item3 {
    position: relative;
    float: left;
    width: 22%;
    .key3 {
      color: #000000;
      background: #f5f7fa;
      width: 1.2rem;
      height: 0.32rem;
      line-height: 0.32rem;
      text-align: center;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      border-right: 0.01rem solid #024364;
      border-bottom: 0.01rem solid #2c5a73;
      font-size: 0.16rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 0 0.05rem;
    }
    .value3 {
      color: rgb(0, 0, 0);
      width: 1.48rem;
      height: 0.32rem;
      line-height: 0.32rem;
      border-right: 0.01rem solid #024364;
      border-bottom: 0.01rem solid #024364;
      padding: 0 0.1rem 0 0.3rem;
      display: block;
      font-size: 0.16rem;
      font-weight: 400;
      .no-wrap();
    }
  }
  .item4 {
    position: relative;
    float: left;
    width: 100%;
    .key4 {
      color: #000000;
      background: #f5f7fa;
      width: 1.2rem;
      height: 0.32rem;
      line-height: 0.32rem;
      text-align: center;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      border-right: 0.01rem solid #024364;
      border-bottom: 0.01rem solid #2c5a73;
      font-size: 0.16rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 0 0.05rem;
    }
    .value4 {
      color: rgb(0, 0, 0);
      width: 6.73rem;
      height: 0.32rem;
      line-height: 0.32rem;
      border-right: 0.01rem solid #024364;
      border-bottom: 0.01rem solid #024364;
      padding: 0 0.1rem 0 1.3rem;
      display: block;
      font-size: 0.16rem;
      font-weight: 400;
      .no-wrap();
    }
  }
  .item5 {
    position: relative;
    float: left;
    width: 66%;
    .key5 {
      color: #000000;
      background: #f5f7fa;
      width: 1.2rem;
      height: 0.32rem;
      line-height: 0.32rem;
      text-align: center;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      border-right: 0.01rem solid #024364;
      border-bottom: 0.01rem solid #2c5a73;
      font-size: 0.16rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 0 0.05rem;
    }
    .value5 {
      color: #000000;
      width: 100%;
      height: 0.32rem;
      line-height: 0.32rem;
      border-right: 0.01rem solid #024364;
      border-bottom: 0.01rem solid #024364;
      padding: 0 0.1rem 0 1.3rem;
      display: block;
      font-size: 0.16rem;
      font-weight: 400;
      .no-wrap();
    }
  }
  .item6 {
    position: relative;
    float: left;
    width: 33%;
    .key6 {
      color: #000000;
      background: #f5f7fa;
      width: 1.2rem;
      height: 0.32rem;
      line-height: 0.32rem;
      text-align: center;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      border-right: 0.01rem solid #024364;
      border-bottom: 0.01rem solid #2c5a73;
      font-size: 0.16rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 0 0.05rem;
    }
    .value6 {
      color: #000000;
      width: 100%;
      height: 0.32rem;
      line-height: 0.32rem;
      border-right: 0.01rem solid #024364;
      border-bottom: 0.01rem solid #024364;
      padding: 0 0.1rem 0 1.3rem;
      display: block;
      font-size: 0.16rem;
      font-weight: 400;
      .no-wrap();
    }
  }
}
.ljxqlabel {
  background-image: url(/static/images/mode-ico/大框@2x.png);
  background-size: 100% 100%;
  height: 67vh;
  position: fixed;
  z-index: 99;
  right: 10px;
  top: 10vh;
  width: 25vw;
}

ul li {
  list-style: none;
}

#main {
  height: 58vh;
  overflow: auto;
  margin-top: 3vh;
  margin-left: 1vw;
  position: relative;
  margin-right: 1vw;
}

.snf-page {
  height: 500px;
  margin-bottom: 1vh;
}

.snf-page:nth-child(2n) {
  background: #e1e1e1;
}

.btns {
  position: fixed;
  width: 1000px;
  top: 0;
  left: 50%;
  margin-left: -500px;
  text-align: center;
  z-index: 10;
}

.btns a {
  display: inline-block;
}

li {
  list-style-type: none;
}
a {
  text-decoration: none;
  outline: 0;
}
#nav {
  top: 20vh;
  left: 20px;
  margin-top: -140px;
  display: inline-block;
  vertical-align: middle;
  z-index: 99;
  position: fixed;
}

ul li {
  list-style: none;
}

#nav a {
  display: block;
  position: relative;
  width: 98px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background-color: #eee;
  color: #333;
  border-left: 2px solid transparent;
  cursor: pointer;
}

#nav a:hover {
  width: 98px;
  border-left: 2px solid #4b59ff;
}

#nav a p {
  position: relative;
  z-index: 3;
}

#nav a.active {
  background-color: #4b59ff;
  color: #fff;
}

#forcePopUp {
  .leaflet-popup {
    top: -8vh;
    left: 0;
    position: absolute;
    background-image: url(/static/images/common/框.png);
    background-size: 100% 100%;
  }

  .leaflet-popup-close-button {
    position: absolute;
    top: 0.5vh;
    right: 1vw;
    text-align: center;
    width: 1vw;
    height: 2vh;
    font: 2.2vh/2vh Tahoma, Verdana, sans-serif;
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    background: transparent;
    cursor: pointer;
  }

  .leaflet-popup-content-wrapper {
    //text-align: center;
    //height: 19vh;
    width: 16vw;
    //box-sizing: border-box;
    //padding: 3vh;
    padding-bottom: 4vh;
    padding-left: 1vw;
    > .toubu {
      height: 4vh;
      line-height: 5vh;
      box-sizing: border-box;
      padding-right: 1vw;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 22px;
      font-family: YouSheBiaoTiHei;
      font-weight: 400;
      //line-height: 29px;
      color: #ffffff;
      opacity: 1;
    }
    > .zhongbu {
      //height: 70%;
      > .liebiao {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 20px;
        color: #67c9fb;
        display: inline-block;
        opacity: 1;
        float: left;
        margin-right: 1vh;
      }
    }
  }
  .extra-tab {
    width: 50px;
    height: 50px;
    font-size: 1.6vh;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 1vh 0.5vw;
    color: white;
    display: inline-block;
    cursor: pointer;
    float: left;
    margin: 1vh 0;
    background-size: 100% 100%;
  }
  .extra-tab_SP {
    background-size: 100% 100%;
    background-image: url("/static/images/mode-ico/现场直达.png");
    &.active {
      background-size: 100% 100%;
      background-image: url("/static/images/mode-ico/现场直达选中.png");
    }
  }
  .extra-tab_FX {
    background-image: url("/static/images/mode-ico/周边分析.png");
    &.active {
      background-size: 100% 100%;
      background-image: url("/static/images/mode-ico/周边分析选中.png");
    }
  }
  .extra-tab_RKDT {
    background-image: url("/static/images/mode-ico/人口动态.png");
    &.active {
      background-size: 100% 100%;
      background-image: url("/static/images/mode-ico/人口动态选中.png");
    }
  }
  .overview {
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
  }
  // .extra-tab {
  //   width: 6vh;
  //   font-size: 1.6vh;
  //   /* position: absolute; */
  //   /* right: -1.4vh; */
  //   /* line-height: 1.8vh; */
  //   -webkit-box-sizing: border-box;
  //   box-sizing: border-box;
  //   padding: 1vh 1vh;
  //   color: white;
  //   display: inline-block;
  //   cursor: pointer;
  //   float: left;
  // }

  .to-rtmp-video {
    //top: 4vh;
    background-image: linear-gradient(
      to right,
      #4c97e3 0%,
      rgba(23, 83, 145, 0.75) 50%,
      rgba(5, 45, 88, 0.29) 100%
    );
  }

  .to-around-people {
    background-image: linear-gradient(
      to right,
      #cc2626 0%,
      rgba(202, 43, 43, 0.75) 50%,
      rgba(5, 45, 88, 0.29) 100%
    );
    bottom: 5vh;
  }

  .leaflet-popup-content {
    color: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 80%;

    > .content-body {
      flex: 1;
      overflow-y: auto;
      > li {
        font-size: 1.4vh;
        height: 2.4vh;
        line-height: 2.4vh;
        font-weight: 300;
        float: left;
        width: 100%;
        // border-bottom: 1px rgba(255,255,255,0.6) solid;
        > span {
          display: inline-block;
          vertical-align: top;
          height: 100%;
          float: left;
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 13vh;
        }
        > span:first-child {
          width: 9vh;
        }
      }
    }
  }

  .side-info {
    position: fixed;
    right: 10px;
    top: 10vh;
    width: 34vh;
    z-index: 99;
    color: #fff;
    .info-header {
      .title {
        font-family: YouSheBiaoTiHei;
        color: #fff;
        font-size: 2vh;
      }
      .decorate {
        margin: 4px 0;
        width: 100%;
        height: 0.4vh;
        .bg-image("/static/images/mode-ico/装饰_1");
      }
      .close {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 0;
        right: 0;
        .bg-image("/static/images/mode-ico/叉2");
        cursor: pointer;
      }
      .tab-list {
        padding-right: 2vh;
        display: flex;
        align-items: center;
        justify-content: center;
        .tab-item {
          // flex: 1;
          width: 30%;
          margin-right: 1vh;
          padding: 5px 0 10px 0;
          .bg-image("/static/images/mode-ico/side-tab");
          font-family: YouSheBiaoTiHei;
          font-size: 2vh;
          text-align: center;
          &:last-child {
            margin: 0;
          }
          &.active {
            .bg-image("/static/images/mode-ico/side-tab-sel");
            color: #ffff08;
          }
        }
      }
    }
    .info-content {
      margin-top: 1vh;
      width: 100%;
      max-height: 30vh;
      overflow-y: auto;
      .bg-image("/static/images/mode-ico/side-bg");
      .info-item {
        display: flex;
        align-items: center;
        text-align: center;
        padding: 1vh 0;
        .key {
          flex: 2;
          padding: 0 5px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          border-right: 2px solid #fff;
        }
        .value {
          flex: 4;
          padding: 0 5px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        &:nth-child(even) {
          background-color: rgba(42, 203, 264, 0.15);
        }
      }
    }
  }
  .extra-frame {
    z-index: 999999;
    width: 1100px;
    height: 800px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    iframe {
      height: 100%;
      width: 100%;
    }
    > span {
      display: block;
      height: 20px;
      width: 20px;
      cursor: pointer;
      background: black;
      color: #fff;
      font-weight: bold;
      position: absolute;
      top: 10px;
      right: 30px;
      line-height: 20px;
      border-radius: 10px;
      text-align: center;
    }
  }
}
</style>
