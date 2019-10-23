<template>

  <el-badge :value="count" type="primary">
    <div class="card-panel">
      <router-link to="/m2/Material_index">
        <div class="card-panel-icon-wrapper icon-red">
          <svg-icon icon-class="auditing" class-name="card-panel-icon"/>
        </div>

        <div class="card-panel-text">
          原料管理
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
        default: {merchantId: '', categoryId: '', week: '20'}
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
        let url = '/procurementPlans/count';
        let filters = [];
        filters.push({
          'field': "status",
          op: 'eq',
          data: '0'
        })
        url += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": filters});
        this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data;
            this.count = res || null;
          })
          .catch(err => {
          });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/css/operate.less";
</style>
