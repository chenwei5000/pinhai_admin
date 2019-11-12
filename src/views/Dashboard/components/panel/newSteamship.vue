<template>

  <div class="card-panel">
    <router-link :to="toUrl">
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
  import categoryModel from '@/api/category';

  export default {
    data() {
      return {
        number: 0,
        relations: [],
        categoryName: '',
        toUrl : '',
        filters: [
          {"field": "status", "op": "in", "data": "2,3,4"}
        ],
      }
    },

    computed: {
      categoryId: function () {
        return this.searchParam.categoryId
      }
    },

    watch: {
      categoryId: {
        handler(newValue, oldValue) {
          this.initData();
        }
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

    methods: {
      initData() {
        let filters = JSON.parse(JSON.stringify(this.filters));
        this.toUrl = '/m9/LinerShippingPlan_index';
        if (this.searchParam.categoryId != null) {
          let categories = categoryModel.getMineSelectOptions();
          categories.forEach(r => {
            if (this.searchParam.categoryId + '' == r.value) {
              this.categoryName = r.label;
              this.toUrl += `?q=categoryName~${this.categoryName},`
              filters.push({"field": "categoryName", "op": "bw", "data": this.categoryName});
            }
          })
        }

        let countUrl = "/linerShippingPlans/count";
        countUrl += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": filters});
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
