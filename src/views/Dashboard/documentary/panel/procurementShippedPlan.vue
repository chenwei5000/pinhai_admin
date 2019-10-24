<template>

  <div class="card-panel">
    <router-link to="/m2/ProcurementShippedOrder_index?s=orderExecuting">
      <div class="card-header">
          <svg t="1571803962202" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15649" width="40" height="40"><path d="M628.106388 427.773725H742.722606c-3.392513-9.733659-30.437502-92.136855-30.437502-92.136855-4.692448-12.77741-10.336068-23.050067-23.113478-23.050066H334.986903c-12.745704 0-18.960027 10.39948-23.113478 23.050066 0 0-29.48633 89.790631-30.691148 92.136855h114.838158v38.395641H281.118866v238.014924c0 12.713998 10.336068 23.050067 23.113478 23.050066h415.757253a23.081772 23.081772 0 0 0 23.113478-23.050066v-238.014924h-114.933276v-38.395641z m-89.663808 69.245317v166.264854h-60.970121v-166.264854H421.860606l86.112766-96.226894 86.112766 96.226894h-55.643558z m-26.44258-460.620863c-262.650277 0-475.585968 212.935691-475.585968 475.585968 0 262.650277 212.935691 475.585968 475.585968 475.585968 262.650277 0 475.585968-212.935691 475.585968-475.585968 0-262.650277-212.935691-475.585968-475.585968-475.585968z m269.562127 690.836177c0 21.211134-17.247918 38.39564-38.490758 38.395641H281.118866a38.427346 38.427346 0 0 1-38.490758-38.395641v-297.589993c0-0.22194 30.786265-117.05756 30.786265-117.057559 5.707032-21.116017 17.247918-38.39564 38.490758-38.395641h400.348267c21.274546 0 32.815432 18.547853 38.490758 38.395641 0 0 30.786265 116.835619 30.786265 114.90157l0.031706 299.745982z" fill="#8C6931" p-id="15650"></path></svg>
        </div>
        发货计划

      <div class="card-body">
        <count-to :start-val="0" :end-val="number" :duration="2600" class="card-panel-num"/>
      </div>

    </router-link>
  </div>

</template>

<script>
  import CountTo from 'vue-count-to'
  export default {
    data(){
      return {
        number: 0,
        relations: ["procurementPlan","creator","currency","supplier","warehouse"] ,
        filters:[
          {"field": "status", "op": "in", "data": "6,7"}
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
