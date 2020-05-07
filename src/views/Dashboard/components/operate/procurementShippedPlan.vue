<template>

  <el-badge :value="count" type="primary">
    <div class="card-panel">
      <router-link to="/m2/ProcurementShippedOrder_index?s=orderExecuting">
        <div class="card-panel-icon-wrapper icon-yellow">
          <svg-icon icon-class="outStock" class-name="card-panel-icon"/>
        </div>

        <div class="card-panel-text">
          发货计划
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

    mounted() {
      this.$nextTick(() => {
        this.initData();
      });
    },

    methods: {
      initData() {

      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/css/operate.less";
</style>
