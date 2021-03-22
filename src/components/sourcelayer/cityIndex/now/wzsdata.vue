<template>
  <div class="target-wrapper">
    <div class="titles">温州市</div>
    <div class="zhuangshi"></div>
    <!-- <div class="wzsqq"></div> -->
    <img class="wzsqq" src="/static/images/mode-ico/区域icon.png" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DynamicNum from "../dynamicNum";

export default {
  name: "trafficIndex",
  components: { DynamicNum },
  computed: {
    ...mapGetters("map", ["WzTourData"]),
  },
  async created() {
    await this.fetchTourData();
  },
  methods: {
    ...mapActions("map", ["SetWzTourData"]),
    /**
     * 概览数据
     */
    async fetchTourData() {
      await this.SetWzTourData();
    },
  },
};
</script>
