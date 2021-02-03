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
      v-show="forceTreeLabel != '城市总览' && forceTreeTopic.length"
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
              inline: datas.id.length<6
            }"
          >  
            <div class="fuhao"></div>
            <span @click="doForceTrueTopicLabels(item.children,datas.id)" class="ring">{{
              datas.id
            }}</span>
          </div>
        </div>
      </div>
      <!-- <div class="swiper-buttons swiper-button-left"></div>
      <swiper ref="mySwiper" class="layers" :options="swiperOptions">
        <swiper-slide
          v-for="(item, i) in forceTreeTopic"
          :key="i"
          :class="{
            item: true,
            active: ~forceTrueTopicLabels.indexOf(item.id),
          }"
        >
          <div>
            <img
              :src="`/static/images/hub-ico/${item.icon}@2x.png`"
              @click="doForceTrueTopicLabels(item.id)"
            />
            
            <div
              class="rings"
              v-if="~forceTrueTopicLabels.indexOf(item.id)"
              @click="doForceTrueTopicLabels(item.id)"
            />
            <p>{{ item.id }}</p>
          </div>
        </swiper-slide>
      </swiper>
      <div class="swiper-buttons swiper-button-right"></div> -->
    </div>
    <div class="bottom-topics-container">
      <div
        :class="{
          label: true,
          active: item.id == forceTreeLabel,
          disabled: item.disabled,
        }"
        v-for="(item, i) in CESIUM_TREE_OPTION"
        :key="i"
        @click="!item.disabled ? SetForceTreeLabel(item.id) : undefined"
      >
        <div class="imgs"></div>
        <span class="bt">{{ item.label }}</span>
      </div>
      <!-- <ul class="labels">
        <li
          v-for="(item, i) in CESIUM_TREE_OPTION"
          :key="i"
          :class="{
            item: true,
            active: item.id == forceTreeLabel,
            disabled: item.disabled,
          }"
          @click="!item.disabled ? SetForceTreeLabel(item.id) : undefined"
        >
          <i>{{ item.label }}</i>
        </li>
      </ul> -->
    </div>
    <!-- extra Components -->
    <transition name="fade">
      <KgLegend v-if="~forceTrueTopicLabels.indexOf('控规信息')" />
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import KgLegend from "./components/KgLegend";
import { treeDrawTool, fixTreeWithExtra } from "./TreeDrawTool";
import { getIserverFields } from "api/iServerAPI";
import { CESIUM_TREE_OPTION } from "config/server/sourceTreeOption";
const Cesium = window.Cesium;

export default {
  name: "layerHub",
  data() {
    return {
      //  底部树
      CESIUM_TREE_OPTION,
      forceTreeTopic: [],
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
    };
  },
  components: { KgLegend },
  computed: {
    ...mapGetters("map", ["forceTreeLabel", "forceTrueTopicLabels"]),
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
      ],
    ]),
    eventRegsiter() {
      /**
       * 事件传递打开对应专题图层
       */
      this.$bus.$off("check-hub");
      this.$bus.$on("check-hub", ({ key }) => {
        console.log("默认", key);
        this.SetForceTreeLabel(key);
      });
    },
    /**
     * 一级菜单点击切换
     * 默认选中二级菜单第一个点
     */
    initForceTreeTopic() {
      //  清除旧图层
      this.forceTreeTopic
        .filter((v) => ~this.forceTrueTopicLabels.indexOf(v.id))
        .map((v) => this.nodeCheckChange(v, false));
      //  处理新图层
      const Topics = this.CESIUM_TREE_OPTION.filter(
        (v) => v.label == this.forceTreeLabel
      );
      console.log("图层", Topics);
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
    doForceTrueTopicLabels(children,id) {
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
        this.nodeCheckChange(label, true, true);
      }
       console.log("数组",this.forceTrueTopicLabels);
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
    nodeCheckChange(node, checked, topicLoad) {
      if (checked) {
        if (node.type == "mvt" && node.id) {
          if (node.id && window.billboardMap[node.id]) {
            window.billboardMap[node.id]._billboards.map(
              (v) => (v.show = true)
            );
            window.labelMap[node.id].setAllLabelsVisible(true);
          } else {
            this.getPOIPickedFeature(node, () => {
              this.switchSearchBox(node, topicLoad);
            });
          }
        } else if (node.type == "model") {
          node.componentEvent &&
            node.componentKey &&
            this.$bus.$emit(node.componentEvent, { value: node.componentKey });
        } else if (node.type == "image") {
          console.log("面",node);
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
        this.switchSearchBox(node, topicLoad);
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
        }
        node.componentEvent &&
          this.$bus.$emit(node.componentEvent, { value: null });
      }
    },
    //  先只显示医疗
    switchSearchBox(node, topicLoad) {
      this.$bus.$emit("cesium-3d-switch-searchBox", {
        shall: node.type == "mvt" && node.id ? true : false,
        node,
      });
    },
  },
};
</script>

<style scoped lang="less">
@import url("./layerHub.less");
</style>
