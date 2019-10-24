<template>

  <div class="card-panel">
    <router-link to="/m2/ProcurementOrder_index?s=create">
      <div class="card-panel-icon-wrapper icon-green">
        <svg-icon icon-class="new" class-name="card-panel-icon"/>
      </div>

      <div class="card-panel-text">
        下采购单
      </div>
    </router-link>
  </div>

</template>

<script>
  export default {
    props: {
      mine: {
        type: Object,
        default: {merchantId: '', categoryId: '', week: '20'}
      }
    },
    components: {},
    methods: {}
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/css/operate.less";
</style>
