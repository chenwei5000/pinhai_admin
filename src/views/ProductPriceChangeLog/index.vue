<template>
  <div class="app-container">

    <div class="ph-card">

      <!-- title -->
      <ph-card-header :title="title" type="table">

      </ph-card-header>

      <!-- 表格 -->
      <div class="ph-card-body">
        <!-- 说明  https://femessage.github.io/el-data-table/-->
        <ph-table
          v-bind="tableConfig"
        >
        </ph-table>

      </div>
    </div>


  </div>
</template>

<script>

  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'



  export default {
    data() {
      return {
        title: '产品价格历史',

        tableConfig: {
          url: '/productPriceChangeLogs',
          relations: ["operator", "product","action","procurementOrder","oldCurrency","newCurrency"],
          hasNew: false,
          hasEdit: false,
          hasView: false,
          hasDelete: false,
          hasOperation: false,
          tableAttrs: {},

          columns: [

            phColumns.id,
            {prop: 'actionId', label: '操作ID', hidden: 'false', "min-width": 120},
            {prop: 'productId', label: '产品ID', hidden: 'false', "min-width": 120},
            {prop: 'procurementOrderId', label: '采购单ID', hidden: 'false', "min-width": 120},
            {prop: 'operatorId', label: '操作者ID', hidden: 'false', "min-width": 120},
            {prop: 'newCurrencyId', label: '新的货币', hidden: 'false', "min-width": 120},
            {prop: 'oldCurrencyId', label: '旧的货币', hidden: 'false', "min-width": 120},
            {prop: 'actionName', label: '操作', "min-width": 60},
            {prop: 'product.skuCode', label: 'SKU编码', "min-width": 100},
            {prop: 'product.name', label: '产品名', "min-width": 120},
            {prop: 'procurementOrder.code', label: '采购单编码', sortable: 'custom', "min-width": 120},
            {prop: 'priceChange', label: '价格变化', "min-width": 80},
            {prop: 'operator.name', label: '操作者', "min-width": 40},

            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.skuCode,
            phSearchItems.status()
          ],
        }
      }
    },
    methods: {},
    watch: {},
    computed: {}
  }

</script>

<style scoped>


</style>
