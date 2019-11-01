<template>

  <el-badge :value="count" type="primary">
    <div class="card-panel">
      <router-link to="/m2/Material_index">
        <div class="card-panel-icon-wrapper icon-green">
          <svg-icon icon-class="material" class-name="card-panel-icon"/>
        </div>

        <div class="card-panel-text">
          原材料管理
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
