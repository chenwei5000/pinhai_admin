<template>

  <div class="card-panel">
    <router-link :to="'/phtpl/table?merchantId='+searchParam.merchantId">
      <div class="card-panel-icon-wrapper icon-blue">
        <svg-icon icon-class="chart" class-name="card-panel-icon"/>
      </div>

      <div class="card-panel-text">
        销量设置
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
