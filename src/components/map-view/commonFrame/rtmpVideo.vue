<!--
 * @Author: eds
 * @Date: 2020-08-06 15:51:22
 * @LastEditTime: 2020-08-06 17:04:17
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\commonFrame\rtmpVideo.vue
-->
<template>
  <div class="rtmpVideos" v-if="doRtmpListFrame">
    <i class="close" @click="closeRtmpVideo"></i>
    <iframe :src="SP" v-if="SPS"></iframe>
    <div style="width: 100%; height: 100%">
      <flv v-if="RtmpVideoURL" :url="RtmpVideoURL" :mode="RtmpVideoMode" />
      <p v-if="!RtmpVideoURL">无视频内容</p>
    </div>
    <!-- <iframe :src="URL" v-if="URL"></iframe> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import flv from "../extraModel/RtmpVideo/Flv";
export default {
  data() {
    return {
      URL: undefined,
      doRtmpListFrame: false,
      SPS: undefined,
      doRtmpListFrame: false,
      RtmpVideoURL: undefined, //  视频地址
      RtmpVideoMode: "flash", // 视频模式
      forceRtmpVideo: undefined, //  正在看的视频名
      RtmpForcePoint: {}, //  保存点击的entity属性
    };
  },
  components: {
    flv,
  },
  computed: {
    ...mapGetters("map", ["forceBimSP"]),
    SP() {
      this.doRtmpListFrame = true;
      //console.log("视频监控", this.forceBimSP);
      return this.forceBimSP;
    },
  },
  async mounted() {
    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {
      this.$bus.$off("cesium-3d-Video");
      this.$bus.$on("cesium-3d-Video", async (item) => {
        //  code fetch rtmpURLs
        this.doRtmpListFrame = true;
        console.log("调用视频监控", item);
        this.URL = item.mp_url;
        this.forceRtmpVideo = "ces";
        this.RtmpVideoURL = undefined;
        this.RtmpVideoMode = "flash";
        this.$nextTick(() => {
          this.RtmpVideoURL = this.URL;
          this.RtmpVideoMode = this.RtmpVideoMode;
        });
        if (item.mp_name == "DS6惠民路-鹿城文化中心对面指路牌") {
          window.earth.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
              120.68760226133791,
              28.00926458260658,
              11.246214155214933
            ), //经度、纬度、高度
            orientation: {
              heading: 0.07116265591926219,
              pitch: -0.22134039068387357,
              roll: 6.283185307179572,
            },
            duration: 3,
          });
        }
      });
    },
    closeRtmpVideo() {
      this.doRtmpListFrame = false;
      this.$parent.isRtmpVideoOpen = false;
    },
  },
};
</script>

<style lang="less" scoped>
.rtmpVideos {
  position: fixed;
  top: 29%;
  right: 40%;
  width: 600px;
  height: 336px;
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
