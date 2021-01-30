<template>
  <div class="wrapper" :class="{collapse: collapse2}">
    <div class="search-body">
      <input
        v-model="query"
        @keyup.enter="search"
        ref="input"
        v-show="isShow"
        class="input"
        type="text"
        placeholder="经纬度用英文逗号隔开">
      <img @click="isShowSearch" src="../../common/images/loglat_search.png" alt="">
    </div>
  </div>
</template>
<script>

import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      isShow: false,
      query: ''
    }
  },
  computed: {
    ...mapGetters('map', [
      'collapse2'
    ])
  },
  watch: {},
  mounted() {
  },
  methods: {
    isShowSearch() {
      this.isShow = !this.isShow
      if (this.isShow) {
        setTimeout(() => {
          this.$refs.input.focus()
        }, 20)
      }
    },
    search() {
      this.$emit('search', this.query)
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    height: 0.3rem;
    position: absolute;
    right: 4.36rem;
    top: 0.58rem;
    z-index: 1;
    transition: all 0.3s linear;
    border: 1px solid #5ab0e5;
    color: #00192E;
    border-radius: 6px;
    background: #03315a;
    padding: 0 0.1rem;
    &.collapse {
      right: 0.5rem;
    }
    .search-body {
      height: 100%;
      display: flex;
      align-items: center;
      > img {
        cursor: pointer;
      }
      > input {
        outline: none;
        background: transparent;
        border: none;
        padding-right: 0.05rem;
        color: #ffff;
        &::placeholder {
          color: #43bafe;
        }
      }
    }
  }
</style>
