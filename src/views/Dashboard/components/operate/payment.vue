<template>

  <el-badge :value="count" type="primary">
    <div class="card-panel">
      <router-link to="/m8/FinanceBill_index?s=paymentBill">
        <div class="card-panel-icon-wrapper icon-yellow">
          <svg-icon icon-class="payment" class-name="card-panel-icon"/>
        </div>

        <div class="card-panel-text">
          采购付款
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
