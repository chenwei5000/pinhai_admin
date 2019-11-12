<template>

  <el-badge :value="count" type="primary">
    <div class="card-panel">
      <router-link to="/m3/ProcurementReceivedOrder_index">
        <div class="card-panel-icon-wrapper icon-blue">
          <svg-icon icon-class="inStock" class-name="card-panel-icon"/>
        </div>

        <div class="card-panel-text">
          采购入库
        </div>
      </router-link>
    </div>
  </el-badge>

</template>

<script>
  export default {
    props: {
      mine: {
        type: Object,
      }
    },
    components: {},
    data() {
      return {
        count: null
      }
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/css/operate.less";
</style>
