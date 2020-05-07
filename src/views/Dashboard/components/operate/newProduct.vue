<template>

  <el-badge :value="count" type="primary">
    <div class="card-panel">
      <router-link to="/m2/Product_index?s=create">
        <div class="card-panel-icon-wrapper icon-orange">
          <svg-icon icon-class="product" class-name="card-panel-icon"/>
        </div>

        <div class="card-panel-text">
          上新品
        </div>
      </router-link>
    </div>
  </el-badge>

</template>

<script>
  export default {
    props: {},
    data() {
      return {
        count: null
      }
    },
    components: {},
    methods: {}
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/css/operate.less";
</style>
