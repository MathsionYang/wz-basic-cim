<!--
 * @Author: eds
 * @Date: 2020-08-06 15:51:22
 * @LastEditTime: 2020-08-06 17:04:17
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\commonFrame\rtmpVideo.vue
-->
<template>
  <div>
    <div class="rtmpVideo">
      <i class="close" @click="closeRtmpVideo"></i>
      <div class="toubuju">
        周边500米范围内共有{{ this.forceVideo.length }}个视频监控
      </div>
      <div
        v-for="(d, i) in SP"
        :key="i"
        v-infinite-scroll="SP"
        class="listone"
        @click="Zoom(d.properties)"
      >
        <div>{{ d.properties.NAME }}</div>
      </div>
    </div>
    <RtmpVideo />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getExtraVideo } from "api/cityBrainAPI";
//import {getExtraVideoaa} from "api/cimApi"
import RtmpVideo from "./rtmpVideo";
export default {
  data() {
    return {
      isRtmpVideoOpen: "",
      dataBind :'',
      datamapid:''
    };
  },
  computed: {
    ...mapGetters("map", ["forceVideo"]),
    SP() {
      console.log("视频监控videolist", this.forceVideo);
      return this.forceVideo;
    },
  },
  components: { RtmpVideo },
  methods: {
    ...mapActions("map", ["SetForceBimSP"]),
    async Zoom(data) {
      var datas = "";
      console.log("点击视频监控", data);
      if (data.NAME == "GS黎明路－惠民路1(交警)") {
        this.datamapid = {
          FCode: "9",
          MpID: "122213000100000397000005",
        };
      }
      if (data.NAME == "DS6黎明中路-航标路口") {
        this.datamapid = {
          FCode: "9",
          MpID: "122225000100001509001877",
        };
      }
      if (data.NAME == "DS6黎明路-洪殿路口信号灯杆(元弼道观)(民宗)") {
        this.datamapid = {
          FCode: "9",
          MpID: "122213000100000397000003",
        };
      }
      //const { datas } = await getExtraVideo({"FCode":"9","MpID":"122213000100000561003896"});

      $.ajax({
        type: "post",
        url: "http://10.36.198.161:3000/forward/getExtraVideo",
        data: this.datamapid,
        success: (result) => {
          datas = result;
          console.log("查询成功", datas.data.Flv);
          var longitude = Cesium.Math.toDegrees(cartographic.longitude);
          var latitude = Cesium.Math.toDegrees(cartographic.latitude);
          var height = cartographic.height;
          this.$bus.$emit("cesium-3d-Video", {
            mp_id: data.SMID,
            mp_name: data.NAME,
            mp_url: datas.data.Flv,
          });
        },
        error: (msg) => {
          console.log("失败", msg);
        },
      });
      var cartographic = Cesium.Cartographic.fromCartesian(
        window.earth.camera.position
      );

      //this.SetForceBimSP(data);
      //this.isRtmpVideoOpen = true;
    },
    closeRtmpVideo() {
      console.log("widows", window.entitiesID);
      window.entitiesID.forEach((item) => {
        window.earth.entities.removeById(item);
      });
      window.entitiesID = [];
      this.$parent.isRtmpVideoOpen = false;
    },
  },
};
</script>

<style lang="less" scoped>
.listone {
  width: 300px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  line-height: 24px;
  color: #ffffff;
  opacity: 0.8;
  margin: auto;
}
.toubuju {
  width: 300px;
  height: 35px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 600;
  line-height: 35px;
  color: #00ffe2;
  opacity: 1;
  margin: auto;
}
.rtmpVideo {
  position: fixed;
  top: 100px;
  right: 400px;
  width: 400px;
  overflow: scroll;
  height: 354px;
  background: rgba(0, 3, 20, 0.7);
  border: 1px solid #56a3e7;
  opacity: 1;
  border-radius: 10px;
  > iframe {
    width: 100%;
    height: 100%;
  }
  .close {
    position: absolute;
    right: 4px;
    top: 0;
    width: 0.2rem;
    height: 0.2rem;
    display: block;
    .bg-image("../../../page/map/images/zoom-in");
    transform: rotate(-45deg);
    transition: all 0.1s linear;
    cursor: pointer;
    z-index: 10;

    &:hover {
      transform: rotate(45deg);
    }
  }
}
</style>
