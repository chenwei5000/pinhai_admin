<template>

  <el-badge :value="count" type="primary">
    <div class="card-panel">
      <router-link :to="toUrl">
        <div class="card-panel-icon-wrapper icon-blue">
          <svg-icon icon-class="chart" class-name="card-panel-icon"/>
        </div>

        <div class="card-panel-text">
          销量设置
        </div>
      </router-link>
    </div>
  </el-badge>

</template>

<script>
  export default {
    props: {
      searchParam: {
        type: Object,
        default: {merchantId: null, categoryId: null, week: 20}
      }
    },
    data() {
      return {
        count: null,
        toUrl: '',
      }
    },
    components: {},
    mounted() {
      this.$nextTick(() => {
        this.initData();
      })
    },
    methods: {
      initData() {
        if (this.searchParam.merchantId) {
          this.toUrl = '/m5/MerchantManualSale_index';
          this.toUrl += `?q=merchantId~${this.searchParam.merchantId},categoryId~${this.searchParam.categoryId ? this.searchParam.categoryId : -1},weekNum~${this.searchParam.week},`
        }
        console.log(this.toUrl);
      },
    },
    watch: {
      searchParam: {
        handler(newValue, oldValue) {
          this.initData();
        },
        deep: true
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/css/operate.less";
</style>
