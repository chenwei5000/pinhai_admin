<template>

  <el-badge :value="count" type="primary">
    <div class="card-panel">
      <router-link to="/m2/ProcurementShippedOrder_index?s=executing">
        <div class="card-panel-icon-wrapper icon-orange">
          <svg-icon icon-class="deliver" class-name="card-panel-icon"/>
        </div>

        <div class="card-panel-text">
          发货中
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
