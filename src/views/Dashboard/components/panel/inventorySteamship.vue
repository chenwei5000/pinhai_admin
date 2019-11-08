<template>

  <div class="card-panel">
    <router-link :to="toUrl">
      <div class="card-header">
        途断货商品
        <div class="card-badge icon-red">
          <svg-icon icon-class="alert" class-name="card-panel-icon"/>
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
    data() {
      return {
        number: 0,
        toUrl: '',
        relations: []
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

    mounted() {
      this.$nextTick(() => {
        this.initData();
      })
    },

    watch: {
      searchParam: {
        handler(newValue, oldValue) {
          this.initData();
        },
        deep: true
      }
    },

    methods: {
      initData() {
        if (this.searchParam.merchantId) {
          let countUrl = "/amazonStocks/containerSoldOutDays";
          countUrl += `/${this.searchParam.merchantId}?cid=${this.searchParam.categoryId ? this.searchParam.categoryId : -1}&weekNum=${this.searchParam.week}`;

          this.global.axios
            .get(countUrl)
            .then(resp => {
              this.number = resp.data.length;
            })
            .catch(err => {
            })

          this.toUrl = '/m5/ContainerSoldOutDays_index';
          this.toUrl += `?q=merchantId~${this.searchParam.merchantId},categoryId~${this.searchParam.categoryId ? this.searchParam.categoryId : -1},weekNum~${this.searchParam.week},`
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/css/panel.less";
</style>
