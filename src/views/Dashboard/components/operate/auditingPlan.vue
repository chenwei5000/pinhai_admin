<template>

  <div class="card-panel">
    <router-link :to="'/phtpl/table?merchantId='+mine.merchantId">
      <div class="card-panel-icon-wrapper icon-red">
        <svg-icon icon-class="auditing" class-name="card-panel-icon"/>
      </div>

      <div class="card-panel-text">
        审核采购计划
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
