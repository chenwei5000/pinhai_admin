<template>

  <div class="card-panel">
    <router-link to="/m2/WarehouseStock_safetyMaterialStocks">
      <div class="card-panel-icon-wrapper icon-orange">
        <svg-icon icon-class="inventory-warning" class-name="card-panel-icon"/>
      </div>

      <div class="card-panel-text">
        原料安全库存
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
