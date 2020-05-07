<template>

  <el-badge :value="count" type="primary">
    <div class="card-panel">
      <router-link to="/m2/ProcurementPlan_index?s=create">
        <div class="card-panel-icon-wrapper icon-green">
          <svg-icon icon-class="prepare" class-name="card-panel-icon"/>
        </div>

        <div class="card-panel-text">
          备货
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
