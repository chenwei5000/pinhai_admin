<template>

  <el-badge :value="count" type="primary">
    <div class="card-panel">
      <router-link to="/m9/LinerShippingPlan_index">
        <div class="card-panel-icon-wrapper icon-blue">
          <svg-icon icon-class="steamship" class-name="card-panel-icon"/>
        </div>

        <div class="card-panel-text">
          发柜
        </div>
      </router-link>
    </div>
  </el-badge>

</template>

<script>
  export default {
    props: {
      mine: {
        type: Object,
      }
    },
    components: {},
    data() {
      return {
        count: null
      }
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/css/operate.less";
</style>
