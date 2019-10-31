<template>

  <el-badge :value="count" type="primary">
    <div class="card-panel">
      <router-link to="/m2/ProcurementShippedOrder_index?s=completionDate">
        <div class="card-panel-icon-wrapper icon-blue">
          <svg-icon icon-class="date" class-name="card-panel-icon"/>
        </div>

        <div class="card-panel-text">
          确认日期
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
