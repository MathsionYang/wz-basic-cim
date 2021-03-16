<!--
 * @Author: eds
 * @Date: 2020-08-25 14:06:37
 * @LastEditTime: 2020-08-31 15:11:46
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\m-bottom\m-bottom.vue
-->
<template>
  <div class="bottom-wrapper">
    <div
      class="bottom-layers-container"
      v-show="
        forceTreeLabel != '城市总览' && forceTreeTopic.length && zk && erji
      "
    >
      <div v-for="(item, i) in forceTreeTopic" :key="i" class="erji">
        <span class="erjitoubu">{{ item.id }}</span>
        <div class="innerbox">
          <div
            v-for="(datas, j) in item.children"
            :key="j"
            class="inner-item"
            :class="{
              active: ~forceTrueTopicLabels.indexOf(datas.id),
              inline: item.children.length > 4,
            }"
          >
            <div :class="datas.url != '' ? 'fuhao' : 'notfuhao'"></div>
            <span
              @click="
                doForceTrueTopicLabels(forceTreeLabel, item.children, datas.id)
              "
              :style="datas.url != '' ? '' : 'color:#b5b5b5'"
              class="ring"
              >{{ datas.id }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-topics-container" v-show="zk">
      <div
        :class="{
          label: true,
          active: item.id == forceTreeLabel && erji,
          disabled: item.disabled,
        }"
        v-for="(item, i) in CESIUM_TREE_OPTION"
        :key="i"
        @click="yiji(item.id)"
      >
        <div class="imgs"></div>
        <span class="bt">{{ item.label }}</span>
      </div>
    </div>
    <!-- extra Components -->
    <transition name="fade">
      <SourceLegend />
    </transition>
    <div class="gj">
      <div>
        <img
          src="/static/images/mode-ico/装饰框.png"
          class="zsk"
          @click="gjlclick()"
        />
        <img
          src="/static/images/mode-ico/工具栏.png"
          class="gjls"
          @click="gjlclick()"
        />
      </div>
    </div>
    <div class="gjl" :class="showgjl == true ? 'active' : ''">
      <img src="/static/images/mode-ico/框@2x.png" class="gjlk" />
      <div class="gjla">
        <div class="gjlb">
          <img
            :src="checkgj == item.label ? item.imgs : item.img"
            v-for="(item, index) in gjldata"
            :key="index"
            class="gjltb"
            alt=""
            @click="gjl(item)"
          />
        </div>
      </div>
    </div>
    <div class="layer-btn event" @click="doForceEventTopicLabels('消防事件')">
      <img class="event" src="/static/images/layer-ico/eventFire.png" />
      <img
        class="mark"
        :class="{ breath: isEventLayerOpen }"
        src="/static/images/layer-ico/mark.png"
      />
    </div>
    <div class="dibu" @click="sousu()">
      <img src="/static/images/mode-ico/底部.png" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SourceLegend from "./components/SourceLegend";
import { treeDrawTool, treeDrawEventTool } from "./TreeDrawTool";
import { getIserverFields } from "api/iServerAPI";
import {
  CESIUM_TREE_OPTION,
  CESIUM_TREE_EVENT_OPTION,
} from "config/server/sourceTreeOption";
import { getEventData } from "api/cityBrainAPI";

const Cesium = window.Cesium;

export default {
  name: "layerHub",
  data() {
    return {
      //  底部树
      CESIUM_TREE_OPTION,
      CESIUM_TREE_EVENT_OPTION,
      forceTreeTopic: [],
      forceTreeEventTopic: [],
      //  资源选中层
      swiperOptions: {
        slidesPerView: 8,
        navigation: {
          nextEl: ".swiper-button-right",
          prevEl: ".swiper-button-left",
        },
      },
      //  tile layers
      tileLayers: {},
      zk: true,
      erji: false,
      showgjl: false,
      checkgj: [],
      gjldata: [
        {
          imgs: "/static/images/mode-ico/地表开挖选中框.png",
          img: "/static/images/mode-ico/地表开挖.png",
          label: "地表开挖",
        },
        {
          imgs: "/static/images/mode-ico/剖切选中框.png",
          img: "/static/images/mode-ico/剖切.png",
          label: "剖切",
        },
        {
          imgs: "/static/images/mode-ico/长度测量选中框.png",
          img: "/static/images/mode-ico/长度测量.png",
          label: "长度测量",
        },
        {
          imgs: "/static/images/mode-ico/面积测量选中框.png",
          img: "/static/images/mode-ico/面积测量.png",
          label: "面积测量",
        },
        {
          imgs: "/static/images/mode-ico/分屏选中框.png",
          img: "/static/images/mode-ico/分屏.png",
          label: "分屏",
        },
        {
          imgs: "/static/images/mode-ico/日照分析选中框.png",
          img: "/static/images/mode-ico/日照分析.png",
          label: "日照分析",
        },
        {
          imgs: "/static/images/mode-ico/天际线选中框.png",
          img: "/static/images/mode-ico/天际线分析.png",
          label: "天际线分析",
        },
        {
          imgs: "/static/images/mode-ico/通视分析选中框.png",
          img: "/static/images/mode-ico/通视分析.png",
          label: "通视分析",
        },
        {
          imgs: "/static/images/mode-ico/视野分析选中框.png",
          img: "/static/images/mode-ico/视野分析.png",
          label: "视野分析",
        },
        {
          imgs: "/static/images/mode-ico/清除.png",
          img: "/static/images/mode-ico/清除.png",
          label: "清除",
        },
      ],
      isEventLayerOpen: false,
      layerdatas: "",
    };
  },
  components: { SourceLegend },
  computed: {
    ...mapGetters("map", [
      "forceTreeLabel",
      "forceTrueTopicLabels" /*"isSourceLayer"*/,
      ,
      "forceTreeEventLabel",
    ]),
  },
  watch: {
    forceTreeLabel(n) {
      this.SetForceTime("now");
      this.initForceTreeTopic();
      this.SetForceIndex(n);
      this.$bus.$emit("cesium-3d-detail-pop-clear", {});
      this.$bus.$emit("cesium-3d-detail-info-clear", {});
    },
  },
  created() {
    this.initForceTreeTopic();
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", [
      ...[
        "SetForceIndex",
        "SetForceTime",
        "SetForceTreeLabel",
        "SetForceTrueTopicLabels",
        "SetForceTrueTopicLabelId",
        // "SetIsSourceLayer"
      ],
    ]),
    yiji(data) {
      if (window.labels != undefined) {
        if (window.labels == data) {
          window.labels = data;
          this.erji = !this.erji;
        } else {
          window.labels = data;
          this.erji = true;
        }
      } else {
        window.labels = data;
        this.erji = true;
      }
      this.SetForceTreeLabel(data);
    },
    gjlclick() {
      this.showgjl = !this.showgjl;
    },
    gjl(data) {
      this.checkgj = data.label;
      console.log("this.checkgj", this.checkgj);
      window.gjlclickdata = data.label;
      this.$bus.$emit("cesium-3d-maptool", data);
      this.$bus.$off("cesium-3d-imgs");
      this.$bus.$on("cesium-3d-imgs", ({ value }) => {
        this.checkgj = value;
      });
    },
    sousu() {
      this.zk = !this.zk;
    },
    eventRegsiter() {
      /**
       * 事件传递打开对应专题图层
       */
      this.$bus.$off("check-hub");
      this.$bus.$on("check-hub", ({ key }) => {
        this.SetForceTreeLabel(key);
      });
    },
    /**
     * 一级菜单点击切换
     * 默认选中二级菜单第一个点
     */
    initForceTreeTopic() {
      console.log("initForceTreeTopic", this.forceTreeTopic);
      //  清除旧图层
      // this.forceTreeTopic.forEach((item) => {
      //   item.children
      //     .filter((v) => ~this.forceTrueTopicLabels.indexOf(v.id))
      //     .forEach((v) => {
      //       this.nodeCheckChange(v, false);
      //       this.doForceTrueTopicLabels(
      //         this.forceTreeLabel,
      //         item.children,
      //         v.id
      //       );
      //     });
      // });
      //  处理新图层
      const Topics = this.CESIUM_TREE_OPTION.filter(
        (v) => v.label == this.forceTreeLabel
      );
      this.forceTreeTopic = Topics.length ? Topics[0].children : [];
      if (this.forceTreeTopic.length) {
        // const forceNode = this.forceTreeTopic[0];
        // this.SetForceTrueTopicLabelId(forceNode.id);
        // this.SetForceTrueTopicLabels([forceNode.id]);
        // this.nodeCheckChange(forceNode, true, true);
      } else {
        this.SetForceTrueTopicLabels([]);
      }
    },
    /**
     * 选中状态
     * @param {string} id
     */
    doForceTrueTopicLabels(item, children, id) {
      console.log("组别", id);
      const label = children.filter((v) => v.id == id)[0];
      if (~this.forceTrueTopicLabels.indexOf(label.id)) {
        let _fttl_ = [...this.forceTrueTopicLabels];
        _fttl_.splice(_fttl_.indexOf(label.id), 1);
        this.SetForceTrueTopicLabels(_fttl_);
        this.nodeCheckChange(label, false);
      } else {
        this.SetForceTrueTopicLabels([
          ...new Set(this.forceTrueTopicLabels.concat([label.id])),
        ]);
        this.SetForceTrueTopicLabelId(label.id);
        this.nodeCheckChange(label, true);
      }
      console.log("数组", this.forceTrueTopicLabels);
    },
    /**
     * POI fetch
     * @param {object} node
     * @param {function} fn callback hook
     */
    getPOIPickedFeature(node, fn) {
      const { newdataset, url } = node;
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        // attributeFilter: `SMID <= 1000`,
        attributeFilter: `SMID >= 0`,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: [newdataset],
      });
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: async (res) => {
            const fields = await getIserverFields(url, newdataset);
            treeDrawTool(this, res, node, fields, fn);
          },
          processFailed: (msg) => console.log(msg),
        },
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },
    async getAPIFeature(node, fn) {
      let res = await getEventData(node.event);
      res.push({
        areaCode: "330300000000",
        content: "超高层消防事件",
        contryAddr: "温州市",
        eventCoordinate: "120.723778,28.009498",
        eventCreator: null,
        eventCreatorTel: null,
        eventPlaceName: "温州市商务路61号",
        eventTime: "2021-03-06 10:23:21",
        eventUrl:
          "https://wzxf.wzcitybrain.com:1180/wenzhoucity/#/inteligentControl/c1f49eaa-ef11-4074-8ccd-ecc5ed08f300/11d9a28d7c1d4d5ca926abb6abfe45ad",
        innerEventId: "147952",
        msgType: 9,
        origin: "温州市消防救援支队",
        scence: "wzxfsj",
        streetAddr: "温州市",
        streetCode: "330300000000",
        superviseStatus: 1,
        title: "智慧消防-超高层消防事件",
      });
      console.log("res", res);
      let features = [];
      res.forEach((item) => {
        features.push({
          attributes: {
            ...item,
            ...{ NAME: item.title, SMID: item.innerEventId },
          },
          geometry: {
            x: +item.eventCoordinate.split(",")[0],
            y: +item.eventCoordinate.split(",")[1],
          },
        });
      });
      treeDrawEventTool(this, { result: { features } }, node);
      fn && fn();
    },
    nodeCheckChange(node, checked, type = "source") {
      if (checked) {
        console.log("点击内容", node);
        if (node.type == "mvt" && node.id) {
          console.log("点");
          if (node.id && window.billboardMap[node.id]) {
            window.billboardMap[node.id]._billboards.map(
              (v) => (v.show = true)
            );
            window.labelMap[node.id].setAllLabelsVisible(true);
          } else {
            if (type == "source") {
              this.getPOIPickedFeature(node, () => {
                this.switchSearchBox(node);
              });
            } else {
              this.getAPIFeature(node, () => {
                this.switchSearchBox(node);
              });
            }
          }
          //用地红线展示
          if (node.withImage) {
            node.withImage.forEach((item) => {
              const LAYER = this.tileLayers[item.name];
              if (LAYER) {
                LAYER.show = true;
              } else {
                this.tileLayers[
                  item.name
                ] = window.earth.imageryLayers.addImageryProvider(
                  new Cesium.SuperMapImageryProvider({
                    url: item.url,
                  })
                );
                item.alpha && (this.tileLayers[item.name].alpha = item.alpha);
                // window.earth.imageryLayers.lower(this.tileLayers[item.name]);
              }
            });
          }
          //多图层展示
          if (node.moreurl) {
            for (let i = 0; i < node.moreurl.length; i++) {
              this.getPOIPickedFeature(node.moreurl[i], () => {
                this.switchSearchBox(node.moreurl[i]);
              });
              window.checkedkey.push(node.moreurl[i].id);
            }
            this.layerdatas = {
              label: node.label,
              id: node.id,
              children: node.moreurl,
            };
          } else {
            window.checkedkey.push(node.id); //单图层数据存储到已选择数组中
            this.layerdatas = { label: node.label, id: node.id };
          }
          window.layersdata.push(this.layerdatas);
        } else if (node.type == "model") {
          node.componentEvent &&
            node.componentKey &&
            this.$bus.$emit(node.componentEvent, { value: node.componentKey });
        } else if (node.type == "image") {
          console.log("面", node);
          const LAYER = this.tileLayers[node.id];
          this.tileLayers[
            node.id
          ] = window.earth.imageryLayers.addImageryProvider(
            new Cesium.SuperMapImageryProvider({
              url: node.url,
              name: node.id,
            })
          );
        }
        // this.switchSearchBox(node);
        //  有相机视角配置 -> 跳视角
        node.camera && window.earth.scene.camera.setView(node.camera);
      } else {
        const LAYER =
          node.type == "model"
            ? window.earth.scene.layers.find(node.id)
            : this.tileLayers[node.id];
        LAYER && (LAYER.show = false);
        if (node.icon && window.billboardMap[node.id]) {
          window.billboardMap[node.id]._billboards.map((v) => (v.show = false));
          window.labelMap[node.id].setAllLabelsVisible(false);
          //清除已选择图层内容
          for (var i = 0; i < window.layersdata.length; i++) {
            if (window.layersdata[i].id == node.id) {
              window.layersdata.splice(i, 1);
            }
          }
          //清除图例
          for (let a = 0; a < window.checkedkey.length; a++) {
            if (window.checkedkey[a] == node.id) {
              window.checkedkey.splice(a, 1);
            }
          }
          this.switchSearchBox(node, false)
        }
        if (node.moreurl) {
          //隐藏图层
          for (let i = 0; i < node.moreurl.length; i++) {
            window.billboardMap[node.moreurl[i].id]._billboards.map(
              (v) => (v.show = false)
            );
            window.labelMap[node.moreurl[i].id].setAllLabelsVisible(false);
          }
          //清除已选择图层内容
          for (var i = 0; i < window.layersdata.length; i++) {
            if (window.layersdata[i].id == node.id) {
              window.layersdata.splice(i, 1);
            }
          }
          //清除图例
          for (let a = 0; a < window.checkedkey.length; a++) {
            for (let b = 0; b < node.moreurl.length; b++) {
              if (window.checkedkey[a] == node.moreurl[b].id) {
                window.checkedkey.splice(a, 1);
              }
            }
          }
          this.switchSearchBox(node, false)
        }
        if (node.withImage) {
          node.withImage.forEach((item) => {
            const LAYER = this.tileLayers[item.name];
            LAYER.show = false;
          });
        }
        node.componentEvent &&
          this.$bus.$emit(node.componentEvent, { value: null });
      }
    },
    //  先只显示医疗
    switchSearchBox(node, shall=true) {
      this.$bus.$emit("cesium-3d-switch-searchBox", {
        shall: shall && node.type == "mvt" && node.id ? true : false,
        node,
      });
    },
    //  开启消防图层
    doForceEventTopicLabels(id) {
      this.isEventLayerOpen = !this.isEventLayerOpen;
      // this.SetIsSourceLayer(!this.isEventLayerOpen);
      const Topics = this.CESIUM_TREE_EVENT_OPTION.filter(
        (v) => v.label == this.forceTreeEventLabel
      );
      this.forceTreeEventTopic = Topics.length ? Topics[0].children : [];
      const label = this.forceTreeEventTopic.filter((v) => v.id == id)[0];
      if (this.isEventLayerOpen) {
        this.nodeCheckChange(label, true, "event");
      } else {
        this.nodeCheckChange(label, false, "event");
      }
    },
  },
};
</script>

<style scoped lang="less">
@import url("./layerHub.less");
</style>
