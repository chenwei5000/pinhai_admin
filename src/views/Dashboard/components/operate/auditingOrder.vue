<template>

  <div class="card-panel">
    <router-link :to="'/phtpl/table?merchantId='+mine.merchantId">
      <div class="card-panel-icon-wrapper icon-red">
        <svg-icon icon-class="auditing-order" class-name="card-panel-icon"/>
      </div>

      <div class="card-panel-text">
        审核采购单
      </div>
    </router-link>
  </div>

</template>

<script>
  export default {
    props: {
      searchParam: {
        type: Object,
        default: {merchantId: null, categoryId: null, week: 20}
      }
    },
    components: {},
    methods: {}
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/css/operate.less";
</style>
