<template>

  <div class="card-panel">
    <router-link to="/m3/ProcurementReceivedOrder_index">
      <div class="card-header">
        <svg t="1571908892598" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16849" width="41" height="41"><path d="M235 390.9v495c0 34.4-48.6 34.3-48.6 0V421.8l-46 32.9c-37.3 25-57.8-15.1-28.3-40.6l378.6-268.5c25.3-18.9 41-19.1 68 1.1L934 414.2c24.1 17.1-0.3 58.2-25.1 40.6l-45.7-32.5v82.4c0 35.9-50.8 34.9-50.8 0V388L528.5 186.2c-3.3-2.5-6.4-2.5-9.7-0.2L235 390.9z" fill="#F3861F" p-id="16850"></path><path d="M308.7 490.6h66.8c6.7 0 12.1 5.4 12.1 12.1v66.9c0 6.7-5.4 12.1-12.1 12.1h-66.8c-6.7 0-12.1-5.4-12.1-12.1v-66.9c0-6.7 5.4-12.1 12.1-12.1z m158.6 0h66.8c6.6 0 12.1 5.4 12.1 12.1v66.9c0 6.7-5.4 12.1-12.1 12.1h-66.8c-6.7 0-12.1-5.4-12.1-12.1v-66.9c0.1-6.7 5.5-12.1 12.1-12.1zM308.7 651.8h66.8c6.7 0 12.1 5.4 12.1 12.1v66.6c0 6.9-5.4 12.3-12.1 12.3h-66.8c-3.2 0-6.3-1.3-8.6-3.6s-3.5-5.4-3.5-8.7v-66.6c0-3.2 1.2-6.3 3.5-8.6 2.3-2.2 5.4-3.5 8.6-3.5z m0 160.9h66.8c6.7 0 12.1 5.6 12.1 12.2v66.8c0 3.2-1.2 6.3-3.5 8.6s-5.4 3.6-8.6 3.6h-66.8c-3.2 0-6.3-1.3-8.6-3.6s-3.5-5.4-3.5-8.6V825c0-3.2 1.2-6.4 3.5-8.7 2.3-2.3 5.4-3.6 8.6-3.6z m160.9-160.9h66.8c6.6 0 12.1 5.4 12.1 12.1v66.6c0 6.9-5.4 12.3-12.1 12.3h-66.8c-3.2 0-6.3-1.3-8.6-3.6s-3.5-5.4-3.5-8.7v-66.6c0-3.2 1.2-6.3 3.5-8.6 2.3-2.2 5.4-3.5 8.6-3.5z m0 160.9h66.8c6.6 0 12.1 5.6 12.1 12.2v66.8c0 3.2-1.2 6.3-3.5 8.6s-5.4 3.6-8.6 3.6h-66.8c-3.2 0-6.3-1.3-8.6-3.6s-3.5-5.4-3.5-8.6V825c0-3.2 1.2-6.4 3.5-8.7 2.3-2.3 5.4-3.6 8.6-3.6z m278.5-167.4v-66.2c0-12.3-12.5-24.8-24.8-24.8-8.3 0-12.5 4.2-16.6 8.3L591.9 687.5c-8.1 7.4-12.6 18-12.3 29 0 12.3 8.2 20.7 16.6 28.9l114.6 127.2c4.3 4.2 8.4 8.3 16.7 8.3 12.4 0 20.7-8.3 20.7-20.7v-78.6c78.5-4.2 131.2 31.6 172.6 97.7 4.2 8.2 8.2 12.3 16.5 12.3s20.7-8.1 20.7-20.7c-4.2-37 0.8-213.2-209.9-225.6z m175.6 183.6c-43.6-51.6-104.2-82.3-171.7-82.3h-34.5V833L623 724.8l-7.8-7.9s0-3.8 3.8-7.8L716.3 603v72.2h12.1c142.7-0.2 183.3 90.3 195.3 153.7z" fill="#F3861F" p-id="16851"></path></svg>
      </div>
      待采购入库
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
        relations: ["procurementOrder","supplier","warehouse"] ,
        filters:[
          {"field": "status", "op": "in", "data": 4}
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
        let countUrl = "procurementReceivedOrders/count";
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
