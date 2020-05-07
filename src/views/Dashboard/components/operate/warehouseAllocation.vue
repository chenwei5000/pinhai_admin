<template>
  <el-badge :value="count" type="primary">
    <div class="card-panel">
      <router-link to="/m3/WarehouseAllocation_index?s=create">
        <div class="card-panel-icon-wrapper icon-orange">
          <svg-icon icon-class="outStock" class-name="card-panel-icon"/>
        </div>

        <div class="card-panel-text">
          国内调拨
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
