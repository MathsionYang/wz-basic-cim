<template>
  <div class="ThreeDContainerrz">
    <img
      src="/static/images/mode-ico/开始.png"
      @click="sunlight()"
      class="strats"
    />
    <img
      src="/static/images/mode-ico/日照清除.png"
      @click="clear()"
      class="clearns"
    />
    <vue-slider
      v-model="value"
      style="padding: 7px 10px; width: 42vw; height: 4px; display: inline-block"
      :adsorb="true"
      :marks="true"
      :data="data"
      :tooltip="'always'"
      :tooltip-placement="['top', 'top']"
    >
    </vue-slider>
    <img
      src="/static/images/mode-ico/关闭icon.png"
      @click="close()"
      class="close"
    />
  </div>
</template>
<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
export default {
  name: "RZFX",
  components: {
    VueSlider,
  },
  data: function () {
    return {
      //   data: [
      //     "0:00",
      //     "1:00",
      //     "2:00",
      //     "3:00",
      //     "4:00",
      //     "5:00",
      //     "6:00",
      //     "7:00",
      //     "8:00",
      //     "9:00",
      //     "10:00",
      //     "11:00",
      //     "12:00",
      //     "13:00",
      //     "14:00",
      //     "15:00",
      //     "16:00",
      //     "17:00",
      //     "18:00",
      //     "19:00",
      //     "20:00",
      //     "21:00",
      //     "22:00",
      //     "23:00",
      //     "24:00",
      //   ],
      data: [
        "0:00",
        "2:00",
        "4:00",
        "6:00",
        "8:00",
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
        "22:00",
        "24:00",
      ],
      value: ["8:00", "12:00"],
      datetimes: ["8:00", "12:00"],
      shadowQuery: "",
      process: (val) => [
        [val[0], val[1]],
        [val[1], val[2]],
      ],
    };
  },
  watch: {
    value: {
      handler(start) {
        this.datatime(start);
      },
    },
  },
  beforeDestroy() {
    this.clear();
  },
  methods: {
    sunlight() {
      window.earth.shadows =true;  
      this.shadowQuery = new Cesium.ShadowQueryPoints(window.earth.scene);
      var layers = window.earth.scene.layers;
      for (let i = 0; i < layers.layerQueue.length; i++) {
        layers.layerQueue[i].selectEnabled = false;
        layers.layerQueue[i].shadowType = 2;
      }
      this.shadowQuery.build();
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var shour = this.datetimes[0];
      var ehour = this.datetimes[1];
      var dateVal = year + "-" + month + "-" + day; //日照日期
      var startTime = new Date(dateVal);
      var endTime = new Date(dateVal);
      let shours = shour.lastIndexOf(":");
      shour = Number(shour.substring(0, shours));
      let ehours = ehour.lastIndexOf(":");
      ehour = Number(ehour.substring(0, ehours));
      if (shour > ehour) {
        return;
      }
      this.shadowQuery.qureyRegion({
        position: [0, 0],
        bottom: 0,
        extend: 0,
      });
      var points = [];
      var nTimer = 0.0;
      var nIntervId = setInterval(function () {
        if (shour < ehour) {
          startTime.setHours(shour);
          startTime.setMinutes(nTimer);
          window.earth.clock.currentTime = Cesium.JulianDate.fromDate(
            startTime
          );
          nTimer += 10.0;
          if (nTimer > 60.0) {
            shour += 1.0;
            nTimer = 0.0;
          }
        } else {
          clearInterval(nIntervId);
          this.shadowQuery.qureyRegion({
            position: points,
            bottom: 20,
            extend: 20,
          });
        }
      }, 20);
    },
    clear() {
      window.earth.shadows =false;  
    },
    close() {
      this.clear();
      this.$bus.$emit("cesium-3d-maptool", { value: null });
    },
    datatime(start) {
      this.datetimes = start;
    },
  },
};
</script>
<style>
.close {
  float: right;
  margin-top: -1.5vh;
  margin-right: -1vw;
}
.clearns {
  margin-top: 3vh;
  margin-left: 1vw;
  display: inline-block;
  margin-right: 1vw;
}
.strats {
  margin-top: 3vh;
  margin-left: 1vw;
}
.merge-tooltip {
  position: absolute;
  bottom: 100%;
  transform: translate(-50%, -15px);
}
.vue-slider-rail {
  background-image: url("/static/images/mode-ico/进度条.png");
  background-color: unset !important;
}
.vue-slider-ltr {
  height: 1vh !important;
  padding: 0.6vh 0 !important;
  cursor: pointer;
}
.vue-slider-process {
  background-image: url("/static/images/mode-ico/进度条运行.png");
  background-color: unset !important;
}
.vue-slider-dot-handle {
  background-image: url("/static/images/common/slider-point.png");
  background-size: 100% 100%;
  width: 3.4vh;
  height: 3.4vh;
  transform: translate(-10px, -8px);
  background-color: unset !important;
  box-shadow: unset !important;
}
.vue-slider-ltr .vue-slider-mark {
  margin-top: 3px;
  font-weight: 700;
  font-family: DIN !important;
  color: white;
}
.vue-slider-ltr .vue-slider-mark-label {
  margin-top: 0.6vh;
  font-size: 1.6vh;
  padding: 2px 4px;
}
.vue-slider-ltr .vue-slider-mark-label-image {
  border: 2px dashed gold;
}
.vue-slider-dot-tooltip-inner {
  padding: 6px 10px !important;
  font-family: DIN !important;
  font-weight: bold;
  font-size: 2.4vh !important;
}
.ThreeDContainerrz {
  position: absolute;
  z-index: 7;
  top: 16vh;
  width: 49vw;
  height: 7.5vh;
  left: 22vw;
  background-size: 100% 100%;
  background-image: url("/static/images/mode-ico/日照分析背景.png");
}
</style>

