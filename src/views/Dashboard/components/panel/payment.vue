<template>

  <div class="card-panel">
    <router-link to="/m8/FinanceBill_index?s=paymentBill">
      <div class="card-header">
        采购付款中
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

  export default {
    data(){
      return {
        number: 0,
        relations: ["supplier","currency","creator","settlementBill","settlementBill.procurementOrder"] ,
        filters:[
          {"field": "status", "op": "in", "data": 1}
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
        let countUrl = "procurementPaymentOrders/count";
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
