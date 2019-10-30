<template>

  <div class="card-panel">
    <router-link to="/m2/SettlementBill_index?s=inpayment">
      <div class="card-panel-icon-wrapper icon-red">
        <svg-icon icon-class="settlement" class-name="card-panel-icon"/>
      </div>

      <div class="card-panel-text">
        采购结算
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
