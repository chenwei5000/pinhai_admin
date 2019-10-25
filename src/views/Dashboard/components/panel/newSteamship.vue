<template>

  <div class="card-panel">
    <router-link to="/m9/ExportAllocation_index?s=executing">
      <div class="card-header">
        待发货柜

        <div class="card-badge icon-green">
          <svg-icon icon-class="new" class-name="card-panel-icon"/>
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
        relations: [ "creator"],  
        filters: [
          {"field": "status", "op": "in", "data": "2, 3"}
        ], 
      }
    },

    props: {
      mine: {
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
        let countUrl = "/exportAllocations/count";
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
