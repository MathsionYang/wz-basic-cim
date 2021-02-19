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
            <div style="display:inline-block">{{ key }}:</div>
            <div style="display:inline-block">{{ item }}</div>
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
        <div class="tab-list">
          <div class="tab-item active">基本信息</div>
          <!-- <div class="tab-item">周边分析</div>
          <div class="tab-item">人口动态</div> -->
        </div>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      forceEntity: {},
      forcePosition: {},
      buffer: null,
      filterKey: ["永久固定码", "唯一码", "分类代码", "全景地址"],
      showSide: true,
      extraTabActive: "",
      isFrame: false,
    };
  },
  async mounted() {
    this.eventRegsiter();
  },
  methods: {
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
      this.showSide = true;
      this.forceEntity = forceEntity;
      this.buffer = null;
      this.$bus.$emit("cesium-3d-population-circle", { doDraw: false });
      this.$bus.$emit("cesium-3d-rtmpFetch-cb");
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
      const { geometry } = this.forceEntity;
      const { x, y } = geometry;
      this.$bus.$emit("cesium-3d-around-analyse-pick", { lng: x, lat: y });
    },
    closePopup() {
      this.forcePosition = {};
      this.forceEntity = {};
      this.buffer = null;
      this.$bus.$emit("cesium-3d-population-circle", { doDraw: false });
      this.$bus.$emit("cesium-3d-rtmpFetch-cb");
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./aroundPeople.less");
#forcePopUp {
  .leaflet-popup {
    top: 0;
    left: 0;
    position: absolute;
    text-align: center;
  }

  .leaflet-popup-close-button {
    position: absolute;
    top: 2vh;
    right: 3vh;
    text-align: center;
    width: 2vh;
    height: 2vh;
    font: 2.2vh/2vh Tahoma, Verdana, sans-serif;
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    background: transparent;
    cursor: pointer;
  }

  .leaflet-popup-content-wrapper {
    background-image: url("/static/images/common/框.png");
    background-size: 100% 100%;
    text-align: center;
    height: 27vh;
    width: 30vh;
    box-sizing: border-box;
    padding: 3vh;
    > .toubu {
      height: 2.6vh;
      line-height: 2.6vh;
      box-sizing: border-box;
      padding-right: 2vh;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 22px;
      font-family: YouSheBiaoTiHei;
      font-weight: 400;
      line-height: 29px;
      color: #ffffff;
      opacity: 1;
    }
    > .zhongbu {
      height: 70%;
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
    padding: 1vh 1vh;
    color: white;
    display: inline-block;
    cursor: pointer;
    float: left;
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
      height: 40vh;
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
