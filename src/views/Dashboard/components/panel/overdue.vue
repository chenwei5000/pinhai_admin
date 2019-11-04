<template>

  <div class="card-panel">
    <router-link to="/m2/ProcurementOrder_index?s=executing&q=pageSize~20,currentPage~1,sort~id,dir~desc,status~8,status~8">
      <div class="card-header">
        即将逾期的采购单
        <div class="card-badge icon-yellow">
          <svg-icon icon-class="payment" class-name="card-panel-icon"/>
        </div>

      </div>
      <div class="card-body">
        <count-to :start-val="0" :end-val="number" :duration="2600" class="card-panel-num"/>
      </div>

    </router-link>
  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  import moment from 'moment'

  export default {
    data(){
      return {
        number: 0,
        relations: [],
        filters:[
          {"field": "status", "op": "in", "data": 8},
          {
            "field": "otdTime",
            "op": "timeRange",
            "data": `${moment(new Date()).format("YYYY-MM-DD")},${moment(new Date()).add(5, 'days').format("YYYY-MM-DD")}`
          }
        ],
      }
    },

    props: {
      mine: {
        type: Object,
      }
    },
    components: {
      CountTo
    },

    mounted(){
      this.$nextTick(() => {
        this.initData();
      })
    },

    methods: {
      initData(){
        let countUrl = "/procurementOrders/count";
        countUrl += "?relations=" + JSON.stringify(this.relations);
        countUrl += "&filters=" + JSON.stringify({"groupOp": "AND", "rules": this.filters});
        this.global.axios
          .get(countUrl)
          .then(resp => {
            this.number = resp.data;
          })
          .catch(err => {
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/css/panel.less";
</style>
