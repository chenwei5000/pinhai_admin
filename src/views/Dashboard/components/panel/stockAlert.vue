<template>

  <div class="card-panel">
    <router-link :to="'/phtpl/table?merchantId='+searchParam.merchantId">
      <div class="card-header">
        库存预警

        <div class="card-badge icon-red">
          <svg-icon icon-class="inventory-warning" class-name="card-panel-icon"/>
        </div>

      </div>
      <div class="card-body">
          <count-to :start-val="0" :end-val="number"  :duration="2600" class="card-panel-num"/>
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
        relations: [ "creator"],
        filters: [
          {"field": "status", "op": "in", "data": "2, 3"}
        ],
      }
    },

    props: {
      searchParam: {
        type: Object,
        default: {merchantId: '', categoryId: '', week: '20'}
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
        let countUrl = "procurementPlans/count";
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
