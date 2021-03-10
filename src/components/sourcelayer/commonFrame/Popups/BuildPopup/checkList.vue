<template>
  <div class="b_fc">
    <transition name="frame">
      <div v-if="isShow">
        <div class="mask"></div>
        <div class="checklist" v-show="Frameshow">
          <div class="list">
            <div>
              <header>
                楼层情况
                <span class="stateTipHeaderBar"></span>
                <span class="stateBtn" @click="buildInform">返回</span>
              </header>
              <ul class="floor unusedBuilding" v-if="shallFloor">
                <li
                  v-for="(item,key,index) in floorList"
                  :key="index"
                  class="unusedFloor"
                  :data-val="key"
                >
                  <span class="floor">{{key}}F</span>
                  <span class="room">入驻数: {{item.rent.length + item.own.length}}</span>
                  <span :class="item.aside.length ? 'ratio' : '_ratio'">闲置数: {{item.aside.length}}</span>
                </li>
              </ul>
              <div v-if="!shallFloor">无信息</div>
            </div>
          </div>
        </div>
        <FC
          :floorList="floorList"
          :forceBuildingId="forceBuilding.gdid"
          @fetchCompany="fetchCompany"
          @FCmoveMap="FCmoveMap"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import FC from "./fc/fc";
import { bJudge } from "./pointJudge";
export default {
  name: "",
  data() {
    return {
      floorList: {},
      isShow: false,
      floorIndex: 0,
      Frameshow: true
    };
  },
  props: {
    forceBuilding: Object,
    originData: Array
  },
  watch: {
    originData(obj) {
      this.fetchLcxx();
    }
  },
  components: { FC },
  created() {},
  mounted() {},
  computed: {
    shallFloor() {
      return Object.keys(this.floorList).length ? true : false;
    }
  },
  methods: {
    fetchLcxx() {
      const floor = {};
      const indexArr = ["rent", "own", "aside"];
      this.originData.map(item => {
        if (item.szlc && item.status) {
          if (!floor[item.szlc]) {
            floor[item.szlc] = {
              rent: [],
              own: [],
              aside: []
            };
          }
          floor[item.szlc][indexArr[item.status]].push(this.fixLocation(item));
        }
      });
      this.floorList = floor;
    },
    fixLocation(item) {
      let doLoop = true;
      let point = null;
      do {
        const _point = bJudge(this.forceBuilding.gdid);
        if (_point) {
          point = _point;
          doLoop = false;
        }
      } while (doLoop);
      return { ...item, point };
    },
    showCheckList() {
      this.isShow = true;
      this.$parent.BuildDetail = false;
    },
    hidden() {
      this.icon_show = !this.icon_show;
    },
    buildInform() {
      this.isShow = false;
      this.$parent.BuildDetail = true;
      this.$emit("moveMap");
    },
    fetchCompany(uuid) {
      this.$parent.fetchCompany(uuid);
    },
    FCmoveMap(){
      this.$emit("moveMap");
    }
  }
};
</script>


<style scoped lang="less">
.b_fc {
  position: absolute;
  top: 122px;
  left: 100px;
  right: 100px;
  z-index: 11;
  .mask {
    background: rgba(0,0,0,0.5);
    height: 100vh;
    width: 100vw;
    position: fixed;
    left: 0;
    top: 0;
  }
  .checkListBtn {
    width: 150px;
    height: 40px;
    line-height: 40px;
    background-color: rgba(48, 92, 188, 0.6);
    border-radius: 10px;
    cursor: pointer;
  }
  .checkListBtn:hover {
    background-color: rgba(48, 92, 188, 0.8);
  }
  .checklist {
    width: 300px;
    display: inline-block;
    position: absolute;
    left: 0px;
    top: 0px;
    background: linear-gradient(
      180deg,
      rgba(0, 63, 189, 0.6) 0%,
      rgba(5, 53, 129, 0.6) 100%
    );
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.4),
      0px 0px 44px 0px rgba(16, 146, 236, 0.3);
    .list {
      height: 500px;
      overflow: hidden;
      box-sizing: border-box;
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-radius: 4px;
      > div {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
      }
      header {
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        font-weight: 700;
        text-align: left;
        color: #fff;

        .stateTipHeaderBar:before {
          content: "";
          width: 4px;
          height: 20px;
          background: #15f9fd;
          display: inline-block;
          float: left;
          margin-top: -4px;
        }

        .stateTipHeaderBar {
          width: 120px;
          height: 12px;
          background: linear-gradient(
            90deg,
            rgba(47, 253, 255, 0.5) 0%,
            rgba(21, 249, 253, 0) 100%
          );
          display: inline-block;
        }

        .stateBtn {
          float: right;
          display: inline-block;
          font-weight: 300;
          font-size: 16px;
          cursor: pointer;
          background: rgba(216, 216, 216, 0.2);
          box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0 10px;
          margin-top: 8px;
          height: 30px;
          line-height: 30px;
          color: #fff;
        }
      }
      .floor::-webkit-scrollbar {
        display: none;
      }
      .floor {
        flex: 1;
        overflow-x: hidden;
        overflow-y: scroll;
        color: white;
        text-align: left;
        list-style: none;
        li {
          height: 40px;
          line-height: 30px;
          margin: auto;
          box-sizing: border-box;
          padding: 5px 6px;
          cursor: pointer;
          display: flex;
          > span {
            display: inline-block;
            height: 100%;
            vertical-align: middle;
            text-align: left;
            box-sizing: border-box;
            padding-left: 10px;
          }
          .ratio {
            font-family: PingFangSC-Medium, PingFangSC;
            font-weight: bold;
            color: rgba(254, 86, 86, 1);
            width: 100px;
          }
          ._ratio {
            font-family: PingFangSC-Medium, PingFangSC;
            font-weight: bold;
            color: rgb(184, 169, 169);
            width: 100px;
          }
          .floor {
            font-size: 16px;
            width: 60px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
            border-right: 1px rgba(255, 255, 255, 0.8) solid;
          }
          .room {
            font-family: PingFangSC-Medium, PingFangSC;
            font-weight: bold;
            color: rgba(29, 215, 144, 1);
            width: 100px;
          }
          div {
            width: 100%;
            height: 100%;
            display: vertical-align;
            text-align: center;
          }
        }
        li:hover {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }
      }
    }
  }
}
</style>