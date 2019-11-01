<template>

  <div class="card-panel">
    <router-link to="/m2/ProcurementShippedOrder_index?s=completionDate">
      <div class="card-header">
        待确认日期
        <div class="card-badge icon-green">
          <svg-icon icon-class="clock" class-name="card-panel-icon"/>
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
  import { parse } from 'path';

  export default {
    data(){
      return {
        number: 0,
        relations: ["procurementPlan","creator","currency","supplier","warehouse"] ,
        filters:[
          {"field": "status", "op": "in", "data": "3,4,5"}
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
        let countUrl = "procurementOrders/count";
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
