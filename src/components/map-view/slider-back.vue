<template>
  <div class="slider-wrapper" :class="{'collapse':collapse1}">
    <el-slider
      @change="changeValue"
      :min="min"
      :max="max"
      :step="step"
      v-model="sliderValue"
    ></el-slider>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      min: 0,
      max: 1,
      step: 0.1,
      sliderValue: 0
    }
  },
  computed: {
    ...mapGetters('map', [
      'collapse1'
    ])
  },
  mounted() {
    this.sliderValue = this.$parent.sliderValue
  },
  methods: {
    changeValue(val) {
      this.$emit('change', val)
    }
  }
}
</script>

<style scoped lang="less">
  .slider-wrapper {
    position: absolute;
    bottom: 0.51rem;
    left: 7rem;
    width: 1rem;
    z-index: 99;
    transition: left 0.3s linear;
    &.collapse {
      left: 3rem;
    }
  }
</style>
