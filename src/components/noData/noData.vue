<template>
  <div class="kong">
    <div class="text">{{text}}</div>
  </div>
</template>

<script>
export default {
  name: 'NoData',
  props: {
    text: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>

<style scoped lang="less">
  .kong {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(40, 68, 106, 0.7);
    .text {
      color: #64BFEE;
      font-size: 30px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 0.02rem solid #64BFEE;
      padding: 0.1rem;
    }
  }
</style>
