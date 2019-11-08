<template>

  <div class="card-panel">
    <router-link to="/m2/WarehouseStock_safetyStocks">
      <div class="card-panel-icon-wrapper icon-red">
        <svg-icon icon-class="inventory-warning" class-name="card-panel-icon"/>
      </div>

      <div class="card-panel-text">
        成品安全库存
      </div>
    </router-link>
  </div>

</template>

<script>
  export default {
    props: {},
    components: {},
    methods: {}
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/css/operate.less";
</style>
