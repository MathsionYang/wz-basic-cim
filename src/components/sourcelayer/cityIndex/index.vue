<!--
 * @Author: eds
 * @Date: 2020-09-15 09:07:19
 * @LastEditTime: 2021-03-22 10:52:55
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\cityIndex\index.vue
-->
<template>
  <div>
    <div class="tbjb">
      <img src="/static/images/mode-ico/icon.png" class="tb" />
      <img src="/static/images/mode-ico/温州市CIM基础平台.png" class="xmname" />
      <!-- <img src="/static/images/mode-ico/瓯海三维地图平台.png" class="xmname" /> -->
      <div class="middle">
        <div class="line"></div>
        <Switchlabel />
        <!-- <img src="/static/images/mode-ico/装饰.png" class="zs" /> -->
      </div>
      <img src="/static/images/mode-ico/大建大美logo.png" class="djdm"/>
      <img src="/static/images/mode-ico/温州设计集团logo.png" class="logo" />
      <div style="top: 5.5vh; position: absolute; z-index: 7; right: 2vh">
        <div class="sj">{{ nowTime }}</div>
        <div class="rq">{{ nowDate }}</div>
      </div>
    </div>
    <div class="cityIndex-source">
      <div style="margin-top: 5vh">
        <component :is="fixforceTrueTopicLabels" />
      </div>
    </div>

    <!-- <div class="cityIndex-source">
      <div v-if="false" style="margin-top: 5vh">
        <component :is="fixForceIndex" />
      </div>
      <div v-if="forceTime == 'pass'">
        <cityIndexPass />
      </div>
      <scene-switch />
    </div> -->
  </div>
</template>

<script>
const indexHash = {
  城市总览: "cityIndex",
  医疗专题: "medicalIndex",
  教育专题: "educationIndex",
  旅游专题: "tourIndex",
  文化专题: "cultureIndex",
  应急专题: "emergencyIndex",
  规划专题: "basicIndex",
  资源专题: "sourceIndex",
  交通专题: "trafficIndex",
  重点项目: "keyIndex",
  温州市: "wzsdata",
  老旧小区: "ljxq",
  交通三维模型:"s1"
};
import { mapGetters } from "vuex";
import Switchlabel from "../commonFrame/Switchlabels/Switchlabel";
import SceneSwitch from "../commonFrame/SceneSwitch/SceneSwitch";
//  now
import cityIndex from "./now/cityIndex";
import medicalIndex from "./now/medicalIndex";
import educationIndex from "./now/educationIndex";
import tourIndex from "./now/tourIndex";
import cultureIndex from "./now/cultureIndex";
import emergencyIndex from "./now/emergencyIndex";
import basicIndex from "./now/basicIndex";
import sourceIndex from "./now/sourceIndex";
import trafficIndex from "./now/trafficIndex";
import keyIndex from "./now/keyIndex";
//  pass
import cityIndexPass from "./pass/cityIndex";
//cim
import wzsdata from "./now/wzsdata";
import ljxq from "./now/ljxqdata";
import s1 from "./now/S1";

export default {
  data() {
    return {
      indexHash,
      nowDate: null, //存放年月日变量
      nowTime: null, //存放时分秒变量
      timer: "", //定义一个定时器的变量
      currentTime: new Date(),
      isljxqclick: ""
    };
  },
  created() {
    this.timer = setInterval(this.getTime, 1000);
  },
  computed: {
    ...mapGetters("map", ["forceTime", "forceIndex", "forceTrueTopicLabels"]),
    // fixForceIndex() {
    //   return indexHash[this.forceIndex] || "cityIndex";
    // },
    fixforceTrueTopicLabels() {
      if (~this.forceTrueTopicLabels.indexOf("老旧小区")) {
        return indexHash["老旧小区"];
      } else if (~this.forceTrueTopicLabels.indexOf("交通三维模型")) {
        return indexHash["交通三维模型"];
      } else {
        return indexHash["温州市"];
      }
    }
  },
  watch: {
    forceIndex(n) {
      console.log(n);
    }
  },
  methods: {
    getTime() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      const str = "";
      if (this.hour > 12) {
        this.hour -= 12;
        this.str = " AM";
      } else {
        this.str = " PM";
      }
      this.month = check(month);
      this.day = check(day);
      this.hour = check(hour);
      this.minute = check(minute);
      this.second = check(second);
      function check(i) {
        const num = i < 10 ? "0" + i : i;
        return num;
      }
      this.nowDate = year + "-" + this.month + "-" + this.day;
      this.nowTime = this.hour + ":" + this.minute + ":" + this.second;
    }
  },
  components: {
    SceneSwitch,
    cityIndex,
    medicalIndex,
    educationIndex,
    tourIndex,
    cultureIndex,
    emergencyIndex,
    basicIndex,
    sourceIndex,
    trafficIndex,
    keyIndex,
    cityIndexPass,
    Switchlabel,
    wzsdata,
    ljxq,
    s1,
  }
};
</script>

<style lang="less">
@import url(./index.less);
</style>
