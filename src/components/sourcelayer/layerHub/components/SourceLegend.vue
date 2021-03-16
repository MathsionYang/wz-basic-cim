<template>
  <div class="source-legend">
    <div class="legend-wrapper" v-if="~forceTrueTopicLabels.indexOf('总体规划')">
      <header class="title">总体规划</header>
      <div class="content">
        <img src="/static/images/common/zg-legend.png" />
      </div>
    </div>
    <div class="legend-wrapper" v-if="~forceTrueTopicLabels.indexOf('详细规划')">
      <header class="title">详细规划</header>
      <div class="content">
        <img src="/static/images/common/kg-legend.png" />
      </div>
    </div>
    <div class="legend-wrapper" v-if="~forceTrueTopicLabels.indexOf('国土调查')">
      <header class="title">国土调查</header>
      <div class="content">
        <img src="/static/images/common/gt-legend.png" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "SourceLegend",
  computed: {
    ...mapGetters("map", ["forceTrueTopicLabels"]),
  },
};
</script>

<style scoped lang="less">
.source-legend {
  position: fixed;
  right: 8vh;
  bottom: 0;
  .legend-wrapper {
    height: 30vh;
    width: 22vh;
    box-sizing: border-box;
    padding: 0 10px;
    background-image: url(/static/images/common/kg-legend-frame.png);
    background-size: 100% 100%;
  }
  .title {
    height: 4.8vh;
    line-height: 4.8vh;
    font-size: 1.8vh;
    color: #fff;
  }
  .content {
    height: 24vh;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 0;
    overflow-y: auto;
    > img {
      width: 100%;
    }
  }
}
</style>