<template>

  <div class="card-panel">
    <router-link :to="'/phtpl/table?merchantId='+mine.merchantId">
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
