<template>

  <div class="card-panel">
    <router-link :to="'/phtpl/table?merchantId='+mine.merchantId">
      <div class="card-header">
        库存预警

        <div class="card-badge icon-red">
          <svg-icon icon-class="inventory-warning" class-name="card-panel-icon"/>
        </div>

      </div>
      <div class="card-body">
          <count-to :start-val="0" :end-val="32" :duration="2600" class="card-panel-num"/>
      </div>

    </router-link>
  </div>

</template>

<script>
  import CountTo from 'vue-count-to'

  export default {
    props: {
      mine: {
        type: Object,
        default: {merchantId: '', categoryId: '', week: '20'}
      }
    },
    components: {
      CountTo
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/css/panel.less";
</style>
