<template>

  <el-badge :value="count" type="primary">
    <div class="card-panel">
      <router-link to="/m2/Product_index">
        <div class="card-panel-icon-wrapper icon-red">
          <svg-icon icon-class="product" class-name="card-panel-icon"/>
        </div>

        <div class="card-panel-text">
          产品管理
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
