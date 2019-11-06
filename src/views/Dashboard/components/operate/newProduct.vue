<template>

  <div class="card-panel">
    <router-link to="/m2/Product_index?s=create">
      <div class="card-panel-icon-wrapper icon-orange">
        <svg-icon icon-class="steamship" class-name="card-panel-icon"/>
      </div>

      <div class="card-panel-text">
        上新品
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
