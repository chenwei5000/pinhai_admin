<template>

  <div class="card-panel">
    <router-link :to="toUrl">
      <div class="card-header">
        原料信息不全
        <div class="card-badge icon-red">
          <svg-icon icon-class="material" class-name="card-panel-icon"/>
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
        toUrl: '/m2/Material_index?s=unfinished',
        relations: [],
        filters: [],
      }
    },

    props: {
      mine: {
        type: Object,
        default: {merchantId: '', categoryId: null, week: '20'}
      }
    },
    components: {
      CountTo
    },

    computed: {
      categoryId: function () {
        return this.mine.categoryId
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
      })
    },

    watch: {
      categoryId: {
        handler(newValue, oldValue) {
          this.initData();
        }
      }
    },

    methods: {
      initData() {
        let countUrl = "/products/countUnfinishedMaterials";
        this.toUrl = '/m2/Material_index?s=unfinished';
        let filters = [];
        if (this.categoryId) {
          filters.push({"field": "categoryId", "op": "eq", "data": this.categoryId});
          this.toUrl += `&q=pageSize~20,currentPage~1,sort~skuCode,dir~asc,categoryId~${this.categoryId},`
        }

        if (filters && filters.length > 0) {
          countUrl += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": filters});
        }
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
