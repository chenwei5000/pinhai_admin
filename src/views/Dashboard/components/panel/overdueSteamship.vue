<template>

  <div class="card-panel">
    <router-link :to="toUrl">
      <div class="card-header">
        逾期货柜
        <div class="card-badge icon-red">
          <svg-icon icon-class="overdue" class-name="card-panel-icon"/>
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
  import categoryModel from "../../../../api/category";
  import moment from 'moment';

  export default {
    data() {
      return {
        number: 0,
        relations: [],
        categoryName: '',
        toUrl: '',
        filters: [
          {"field": "status", "op": "in", "data": "1,2,3,4"}
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
      //获取逾期的过滤条件
      getOverduFilter() {
        // 90天-昨日 未发货的数量
        //console.log("昨天",);
        //console.log("90天前",moment(new Date()).add(-90, 'days').format("YYYY-MM-DD"));
        //{"field": "etdTime", "op": "bw", "data": this.categoryName}

        return {
          "field": "etdTime",
          "op": "timeRange",
          "data": `${moment(new Date()).add(-91, 'days').format("YYYY-MM-DD")},${moment(new Date()).add(-1, 'days').format("YYYY-MM-DD")}`
        }
      },
      initData() {
        this.getOverduFilter();

        let filters = JSON.parse(JSON.stringify(this.filters));
        filters.push(this.getOverduFilter());

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
