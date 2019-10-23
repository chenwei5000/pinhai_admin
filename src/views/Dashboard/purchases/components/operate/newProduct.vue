<template>

  <div class="card-panel">
    <router-link to="/m2/WarehouseStock_safetyStocks">
      <div class="card-panel-icon-wrapper icon-orange">
        <svg-icon icon-class="steamship" class-name="card-panel-icon"/>
      </div>

      <div class="card-panel-text">
        成品安全库存
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
